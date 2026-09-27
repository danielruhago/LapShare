'use server'

import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { listings, rentalRequests } from '@/lib/db/schema'
import { PLAN_META, isPlan, quote } from '@/lib/pricing'

export type RentalFormState = { error?: string }

const DAY_MS = 24 * 60 * 60 * 1000

function todayUtc() {
  const now = new Date()
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
}

export async function createRentalRequest(
  _prev: RentalFormState,
  formData: FormData,
): Promise<RentalFormState> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    const listingId = Number(formData.get('listingId'))
    redirect(`/sign-in?next=/listings/${Number.isInteger(listingId) ? listingId : ''}`)
  }
  const userId = session.user.id

  const listingId = Number(formData.get('listingId'))
  const plan = formData.get('plan')
  const duration = Number(formData.get('duration'))
  const startDate = String(formData.get('startDate') ?? '')
  const message = String(formData.get('message') ?? '').trim()

  if (!Number.isInteger(listingId) || listingId <= 0) return { error: 'Invalid listing.' }
  if (!isPlan(plan)) return { error: 'Choose a rental plan.' }
  if (!Number.isInteger(duration) || duration < 1 || duration > PLAN_META[plan].maxDuration) {
    return { error: `Choose between 1 and ${PLAN_META[plan].maxDuration} ${PLAN_META[plan].unitPlural}.` }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return { error: 'Choose a start date.' }
  const start = Date.parse(`${startDate}T00:00:00Z`)
  if (Number.isNaN(start) || start < todayUtc() || start > todayUtc() + 90 * DAY_MS) {
    return { error: 'Start date must be within the next 90 days.' }
  }
  if (message.length > 500) return { error: 'Keep your note under 500 characters.' }

  const [listing] = await db.select().from(listings).where(eq(listings.id, listingId)).limit(1)
  if (!listing || !listing.available) return { error: 'This laptop is no longer available.' }
  if (listing.ownerId === userId) return { error: 'You can’t rent your own laptop.' }

  const [existing] = await db
    .select({ id: rentalRequests.id })
    .from(rentalRequests)
    .where(
      and(
        eq(rentalRequests.listingId, listingId),
        eq(rentalRequests.renterId, userId),
        eq(rentalRequests.status, 'pending'),
      ),
    )
    .limit(1)
  if (existing) redirect(`/rentals/${existing.id}`)

  const price = quote(listing, plan, duration)
  const [created] = await db
    .insert(rentalRequests)
    .values({
      listingId,
      renterId: userId,
      ownerId: listing.ownerId,
      plan,
      duration,
      startDate,
      ...price,
      message: message || null,
    })
    .returning({ id: rentalRequests.id })

  revalidatePath('/rentals')
  redirect(`/rentals/${created.id}?new=1`)
}

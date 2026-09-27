import 'server-only'
import { and, asc, desc, eq, ilike, or } from 'drizzle-orm'
import { db } from '@/lib/db'
import { listings, rentalRequests, user } from '@/lib/db/schema'

const ownerFields = {
  ownerName: user.name,
  ownerUniversity: user.university,
  ownerVerified: user.emailVerified,
  ownerSince: user.createdAt,
}

export async function getListings(brand?: string) {
  const filters = [eq(listings.available, true)]
  if (brand) filters.push(eq(listings.brand, brand))
  return db
    .select({ listing: listings, ...ownerFields })
    .from(listings)
    .leftJoin(user, eq(user.id, listings.ownerId))
    .where(and(...filters))
    .orderBy(asc(listings.dailyPrice))
}

export async function getBrands() {
  const rows = await db
    .selectDistinct({ brand: listings.brand })
    .from(listings)
    .where(eq(listings.available, true))
    .orderBy(asc(listings.brand))
  return rows.map((r) => r.brand)
}

export async function getListing(id: number) {
  const [row] = await db
    .select({ listing: listings, ...ownerFields })
    .from(listings)
    .leftJoin(user, eq(user.id, listings.ownerId))
    .where(eq(listings.id, id))
    .limit(1)
  return row ?? null
}

export async function getRentalForUser(id: number, userId: string) {
  const [row] = await db
    .select({ request: rentalRequests, listing: listings, ownerName: user.name })
    .from(rentalRequests)
    .innerJoin(listings, eq(listings.id, rentalRequests.listingId))
    .leftJoin(user, eq(user.id, rentalRequests.ownerId))
    .where(
      and(
        eq(rentalRequests.id, id),
        or(eq(rentalRequests.renterId, userId), eq(rentalRequests.ownerId, userId)),
      ),
    )
    .limit(1)
  return row ?? null
}

export async function getRentalsForRenter(userId: string) {
  return db
    .select({ request: rentalRequests, listing: listings })
    .from(rentalRequests)
    .innerJoin(listings, eq(listings.id, rentalRequests.listingId))
    .where(eq(rentalRequests.renterId, userId))
    .orderBy(desc(rentalRequests.createdAt))
}

export function parseBrand(value: string | string[] | undefined) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 && trimmed.length < 40 ? trimmed : undefined
}

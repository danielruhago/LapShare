'use server'

import { db } from '@/lib/db'
import { rentalRequests } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function cancelRequest(id: number, renterId: string) {
  await db
    .update(rentalRequests)
    .set({ status: 'cancelled' })
    .where(and(eq(rentalRequests.id, id), eq(rentalRequests.renterId, renterId)))
  revalidatePath(`/rentals/${id}`)
}
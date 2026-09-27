'use server'

import { db } from '@/lib/db'
import { listings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateStatus(id: number, status: string) {
  await db.update(listings).set({ status }).where(eq(listings.id, id))
  revalidatePath('/admin')
}

export async function deleteListing(id: number) {
  await db.delete(listings).where(eq(listings.id, id))
  revalidatePath('/admin')
}

export async function addListing(formData: FormData) {
  await db.insert(listings).values({
    ownerId: 'LapShare Fleet',
    title: String(formData.get('title')),
    brand: String(formData.get('brand')),
    cpu: String(formData.get('cpu')),
    ram: String(formData.get('ram')),
    storage: String(formData.get('storage')),
    screen: String(formData.get('screen')),
    gpu: formData.get('gpu') ? String(formData.get('gpu')) : null,
    os: String(formData.get('os')),
    condition: String(formData.get('condition')),
    description: String(formData.get('description')),
    pickupLocation: String(formData.get('pickupLocation')),
    university: 'University of Saskatchewan',
    dailyPrice: Number(formData.get('dailyPrice')),
    weeklyPrice: Number(formData.get('weeklyPrice')),
    monthlyPrice: Number(formData.get('monthlyPrice')),
    imageUrl: formData.get('imageUrl') ? String(formData.get('imageUrl')) : null,
    available: true,
    status: 'Available',
  })
  revalidatePath('/admin')
}
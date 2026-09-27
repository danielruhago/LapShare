import { db } from '@/lib/db'
import { listings } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { deleteListing, addListing } from '@/lib/admin-actions'
import { StatusSelect } from '@/components/status-select'

export default async function AdminPage() {
  const allListings = await db.select().from(listings).orderBy(desc(listings.createdAt))

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 md:px-8">
      <h1 className="font-serif text-4xl">Admin Panel</h1>
      <p className="mt-2 text-muted-foreground">Manage every device LapShare has in circulation.</p>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Add a new laptop</h2>
        <form action={addListing} className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          <input name="title" placeholder="Title" required className="border border-border rounded p-2" />
          <input name="brand" placeholder="Brand" required className="border border-border rounded p-2" />
          <input name="cpu" placeholder="CPU" required className="border border-border rounded p-2" />
          <input name="ram" placeholder="RAM (e.g. 16GB)" required className="border border-border rounded p-2" />
          <input name="storage" placeholder="Storage (e.g. 512GB SSD)" required className="border border-border rounded p-2" />
          <input name="screen" placeholder="Screen (e.g. 14&quot;)" required className="border border-border rounded p-2" />
          <input name="gpu" placeholder="GPU (optional)" className="border border-border rounded p-2" />
          <input name="os" placeholder="OS" required className="border border-border rounded p-2" />
          <input name="condition" placeholder="Condition" required className="border border-border rounded p-2" />
          <input name="pickupLocation" placeholder="Pickup location" required className="border border-border rounded p-2" />
          <input name="dailyPrice" type="number" placeholder="Daily price" required className="border border-border rounded p-2" />
          <input name="weeklyPrice" type="number" placeholder="Weekly price" required className="border border-border rounded p-2" />
          <input name="monthlyPrice" type="number" placeholder="Monthly price" required className="border border-border rounded p-2" />
          <input name="imageUrl" placeholder="Image URL (optional)" className="border border-border rounded p-2 col-span-2" />
          <textarea name="description" placeholder="Description" required className="border border-border rounded p-2 col-span-2 md:col-span-3" />
          <button type="submit" className="bg-primary text-primary-foreground rounded p-2 col-span-2 md:col-span-3">
            Add laptop
          </button>
        </form>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl">All devices ({allListings.length})</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2">Title</th>
                <th className="p-2">Brand</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {allListings.map((l) => (
                <tr key={l.id} className="border-b border-border">
                  <td className="p-2">{l.title}</td>
                  <td className="p-2">{l.brand}</td>
                  <td className="p-2">
                    <StatusSelect id={l.id} currentStatus={l.status} />
                  </td>
                  <td className="p-2">
                    <form action={deleteListing.bind(null, l.id)}>
                      <button type="submit" className="text-red-600 underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

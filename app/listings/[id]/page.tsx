import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getListing } from '@/lib/queries'
import { RentalPanel } from '@/components/rental-panel'
import { TrustSection } from '@/components/trust-section'
import { VerifiedBadge } from '@/components/verified-badge'

type Params = { params: Promise<{ id: string }> }

async function load(idParam: string) {
  const id = Number(idParam)
  if (!Number.isInteger(id) || id <= 0) return null
  return getListing(id)
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const row = await load((await params).id)
  return { title: row ? `${row.listing.title} — LapShare` : 'Listing — LapShare' }
}

export default async function ListingPage({ params }: Params) {
  const row = await load((await params).id)
  if (!row) notFound()
  const { listing } = row
  const session = await auth.api.getSession({ headers: await headers() })
  const isOwner = session?.user.id === listing.ownerId

  const specs = [
    ['Processor', listing.cpu],
    ['Memory', listing.ram],
    ['Storage', listing.storage],
    ['Display', listing.screen],
    ['Graphics', listing.gpu ?? 'Integrated'],
    ['Operating system', listing.os],
    ['Condition', listing.condition],
  ] as const

  const ownerSince = row.ownerSince
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(row.ownerSince)
    : null

  return (
    <main className="mx-auto max-w-6xl px-5 pb-10 md:px-8">
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All laptops
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <header>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {listing.brand} · {listing.condition}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-balance md:text-6xl">
              {listing.title}
            </h1>
            <p className="mt-4 flex items-start gap-1.5 text-foreground">
              <MapPin className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                Pickup at {listing.pickupLocation}, {listing.university}
              </span>
            </p>
          </header>

          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-md bg-muted">
            <Image
              src={listing.imageUrl ?? '/placeholder.svg'}
              alt={listing.title}
              fill
              priority
              sizes="(min-width: 1024px) 700px, 100vw"
              className="object-cover"
            />
          </div>

          <section aria-labelledby="about-heading" className="mt-12">
            <h2 id="about-heading" className="font-serif text-2xl">
              About this laptop
            </h2>
            <p className="mt-3 max-w-prose leading-relaxed text-pretty text-muted-foreground">
              {listing.description}
            </p>
          </section>

          <section aria-labelledby="specs-heading" className="mt-12">
            <h2 id="specs-heading" className="font-serif text-2xl">
              Specifications
            </h2>
            <dl className="mt-4 divide-y divide-border border-y border-border">
              {specs.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[140px_1fr] gap-4 py-3 text-sm sm:grid-cols-[200px_1fr]">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="owner-heading" className="mt-12 flex items-center gap-4">
          <div
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent font-serif text-xl text-accent-foreground"
            >
              {(row.ownerName ?? 'LapShare Fleet').charAt(0)}
            </div>
            <div>
            <h2 id="owner-heading" className="font-medium">
                {row.ownerName ?? 'LapShare Fleet'}
              </h2>
              <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                <span>{row.ownerUniversity ?? listing.university}</span>
                {ownerSince ? <span>Member since {ownerSince}</span> : null}
                {row.ownerVerified ? <VerifiedBadge /> : null}
              </p>
            </div>
          </section>

          <TrustSection />
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <RentalPanel
            listingId={listing.id}
            prices={{
              dailyPrice: listing.dailyPrice,
              weeklyPrice: listing.weeklyPrice,
              monthlyPrice: listing.monthlyPrice,
            }}
            signedIn={Boolean(session?.user)}
            isOwner={isOwner}
            available={listing.available}
          />
        </aside>
      </div>
    </main>
  )
}

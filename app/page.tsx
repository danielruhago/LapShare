import Link from 'next/link'
import { getBrands, getListings, parseBrand } from '@/lib/queries'
import { ListingCard } from '@/components/listing-card'
import { cn } from '@/lib/utils'
import { HowItWorks } from '@/components/how-it-works'

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string | string[] }>
}) {
  const brand = parseBrand((await searchParams).brand)
  const [rows, brands] = await Promise.all([getListings(brand), getBrands()])

  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8">
      <section className="grid gap-8 border-b border-border py-14 md:grid-cols-[1.4fr_1fr] md:items-end md:py-20">
        <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">
            Verified laptop rentals for students
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight text-balance md:text-7xl">
            A spare laptop, <em className="text-primary">right on </em> campus.
          </h1>
        </div>
        <p className="max-w-sm text-pretty leading-relaxed text-muted-foreground">
          Exams, a capstone render, or a cracked screen the week before finals. Borrow a verified
          student’s spare laptop by the day, week or month — and hand it back here on campus.
        </p>
      </section>
      <HowItWorks />

      <section aria-labelledby="listings-heading" className="py-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-baseline md:justify-between">
          <h2 id="listings-heading" className="font-serif text-3xl">
            Available now{' '}
            <span className="font-sans text-base text-muted-foreground">({rows.length})</span>
          </h2>
          <nav aria-label="Filter by brand" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <FilterLink href="/" active={!brand} label="All" />
            {brands.map((b) => (
              <FilterLink
                key={b}
                href={`/?brand=${encodeURIComponent(b)}`}
                active={brand === b}
                label={b}
              />
            ))}
          </nav>
        </div>

        {rows.length === 0 ? (
          <p className="mt-12 text-muted-foreground">
            Nothing listed for this filter yet.{' '}
            <Link href="/" className="text-primary underline underline-offset-4">
              See all laptops
            </Link>
          </p>
        ) : (
          <div className="mt-10 space-y-16">
            {(['STEM', 'Humanities', 'Other'] as const).map((cat) => {
              const group = rows.filter((row) => row.listing.category === cat)
              if (group.length === 0) return null
              const heading =
                cat === 'STEM'
                  ? 'Recommended for STEM students'
                  : cat === 'Humanities'
                    ? 'Recommended for Humanities students'
                    : 'Other laptops'
              return (
                <div key={cat}>
                  <h3 className="mb-6 font-serif text-2xl">{heading}</h3>
                  <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                    {group.map((row) => (
                      <ListingCard
                        key={row.listing.id}
                        listing={row.listing}
                        ownerName={row.ownerName}
                        ownerVerified={row.ownerVerified}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'border-b pb-0.5 transition-colors',
        active
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </Link>
  )
}

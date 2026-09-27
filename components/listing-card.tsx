import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Listing } from '@/lib/db/schema'
import { currency } from '@/lib/pricing'
import { VerifiedBadge } from '@/components/verified-badge'

type Props = {
  listing: Listing
  ownerName: string | null
  ownerVerified: boolean | null
}

export function ListingCard({ listing, ownerName, ownerVerified }: Props) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
        <Image
          src={listing.imageUrl ?? '/placeholder.svg'}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {listing.brand}
          </p>
          {ownerVerified ? <VerifiedBadge /> : null}
        </div>

        <h3 className="mt-1.5 font-serif text-2xl leading-tight text-foreground text-balance">
          <Link href={`/listings/${listing.id}`} className="after:absolute after:inset-0">
            {listing.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {listing.cpu} · {listing.ram} · {listing.storage}
        </p>

        <p className="mt-3 flex items-start gap-1.5 text-sm text-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span>{listing.pickupLocation}</span>
        </p>

        <dl className="mt-4 grid grid-cols-3 border-t border-border pt-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Day</dt>
            <dd className="font-medium">{currency.format(listing.dailyPrice)}</dd>
          </div>
          <div className="border-l border-border pl-3">
            <dt className="text-xs text-muted-foreground">Week</dt>
            <dd className="font-medium">{currency.format(listing.weeklyPrice)}</dd>
          </div>
          <div className="border-l border-border pl-3">
            <dt className="text-xs text-muted-foreground">Month</dt>
            <dd className="font-medium">{currency.format(listing.monthlyPrice)}</dd>
          </div>
        </dl>

        {ownerName ? (
          <p className="mt-3 text-xs text-muted-foreground">Listed by {ownerName}</p>
        ) : null}
      </div>
    </article>
  )
}

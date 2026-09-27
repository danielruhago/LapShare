import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getRentalForUser } from '@/lib/queries'
import { currency, formatDuration, isPlan, PLAN_META } from '@/lib/pricing'
import { StatusPill } from '@/components/status-pill'
import { cancelRequest } from '@/lib/rental-actions'

export const metadata = { title: 'Rental request — LapShare' }

export default async function RentalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ new?: string }>
}) {
  const { id: idParam } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect(`/sign-in?next=/rentals/${encodeURIComponent(idParam)}`)

  const id = Number(idParam)
  if (!Number.isInteger(id) || id <= 0) notFound()
  const row = await getRentalForUser(id, session.user.id)
  if (!row) notFound()

  const { request, listing } = row
  const isNew = (await searchParams).new === '1'
  const plan = isPlan(request.plan) ? request.plan : 'daily'
  const start = new Date(`${request.startDate}T00:00:00`)
  const dateFmt = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const steps = [
    { label: 'Request sent', done: true },
    { label: 'Owner confirms', done: request.status === 'confirmed' },
    { label: 'Campus pickup', done: false },
  ]

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <StatusPill status={request.status} />
      <h1 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-balance md:text-5xl">
        {isNew ? 'Your request is on its way.' : `Request #${request.id}`}
      </h1>
      <p className="mt-4 max-w-prose leading-relaxed text-pretty text-muted-foreground">
        {request.status === 'pending'
          ? `${row.ownerName ?? 'The owner'} will review your request and confirm the handoff. You won’t pay anything until they accept.`
          : request.status === 'confirmed'
            ? 'The owner has confirmed. Meet at the pickup spot on your start date.'
            : 'This request is no longer active.'}
      </p>

      <ol className="mt-10 grid grid-cols-3 border-t border-border" aria-label="Request progress">
        {steps.map((step, i) => (
          <li
            key={step.label}
            className={
              step.done
                ? 'border-t-2 border-primary pt-3 text-sm text-foreground -mt-px'
                : 'pt-3 text-sm text-muted-foreground'
            }
          >
            <span className="block text-xs tabular-nums">0{i + 1}</span>
            {step.label}
          </li>
        ))}
      </ol>

      <section
        aria-labelledby="details-heading"
        className="mt-12 grid gap-8 border-t border-border pt-10 sm:grid-cols-[200px_1fr]"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
          <Image
            src={listing.imageUrl ?? '/placeholder.svg'}
            alt={listing.title}
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
        <div>
          <h2 id="details-heading" className="font-serif text-2xl">
            <Link href={`/listings/${listing.id}`} className="hover:underline underline-offset-4">
              {listing.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            From {row.ownerName ?? 'a LapShare student'}
          </p>
          <p className="mt-3 flex items-start gap-1.5 text-sm">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
            {listing.pickupLocation}, {listing.university}
          </p>
        </div>
      </section>

      <dl className="mt-10 divide-y divide-border border-y border-border text-sm">
        <Detail label="Plan" value={`${PLAN_META[plan].label} · ${formatDuration(plan, request.duration)}`} />
        <Detail label="Starts" value={dateFmt.format(start)} />
        <Detail label="Rental" value={currency.format(request.rentalPrice)} />
        <Detail label="Service fee (12%)" value={currency.format(request.serviceFee)} />
        <Detail label="Refundable deposit" value={currency.format(request.deposit)} />
        <div className="flex items-baseline justify-between py-4">
          <dt className="font-medium">Due at pickup</dt>
          <dd className="font-serif text-2xl">{currency.format(request.total)}</dd>
        </div>
      </dl>

      {request.message ? (
        <blockquote className="mt-8 border-l-2 border-primary pl-4 font-serif text-lg italic text-muted-foreground">
          “{request.message}”
        </blockquote>
      ) : null}

<div className="mt-10 flex flex-wrap items-center gap-4">
        {request.status === 'pending' ? (
          <form action={cancelRequest.bind(null, request.id, session.user.id)}>
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Cancel request
            </button>
          </form>
        ) : (
          <Link
            href="/rentals"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View all requests
          </Link>
        )}
        <Link
          href="/"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
        >
          Keep browsing
        </Link>
        <Link href="/rentals" className="text-sm text-muted-foreground underline underline-offset-4">
          View all requests
        </Link>
      </div>
    </main>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right tabular-nums">{value}</dd>
    </div>
  )
}

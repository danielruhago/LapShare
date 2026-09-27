import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getRentalsForRenter } from '@/lib/queries'
import { currency, formatDuration, isPlan } from '@/lib/pricing'
import { StatusPill } from '@/components/status-pill'

export const metadata = { title: 'My requests — LapShare' }

export default async function RentalsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in?next=/rentals')

  const rows = await getRentalsForRenter(session.user.id)

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <h1 className="font-serif text-4xl tracking-tight md:text-5xl">My requests</h1>
      {rows.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          You haven’t requested a laptop yet.{' '}
          <Link href="/" className="text-primary underline underline-offset-4">
            Browse what’s available
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {rows.map(({ request, listing }) => (
            <li key={request.id}>
              <Link
                href={`/rentals/${request.id}`}
                className="flex flex-col gap-2 py-5 transition-colors hover:bg-muted/60 sm:flex-row sm:items-center sm:justify-between sm:px-2"
              >
                <div>
                  <p className="font-serif text-xl">{listing.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {isPlan(request.plan) ? formatDuration(request.plan, request.duration) : request.plan}{' '}
                    from {request.startDate} · {currency.format(request.total)}
                  </p>
                </div>
                <StatusPill status={request.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

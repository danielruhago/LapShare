'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { createRentalRequest, type RentalFormState } from '@/app/actions/rentals'
import {
  DEPOSIT_RATE,
  PLANS,
  PLAN_META,
  SERVICE_FEE_RATE,
  currency,
  formatDuration,
  quote,
  unitPrice,
  type Plan,
} from '@/lib/pricing'
import { cn } from '@/lib/utils'

type Props = {
  listingId: number
  prices: { dailyPrice: number; weeklyPrice: number; monthlyPrice: number }
  signedIn: boolean
  isOwner: boolean
  available: boolean
}

function isoDate(offsetDays: number) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function RentalPanel({ listingId, prices, signedIn, isOwner, available }: Props) {
  const [plan, setPlan] = useState<Plan>('weekly')
  const [duration, setDuration] = useState(1)
  const [showCheckout, setShowCheckout] = useState(false)
  const [state, formAction, pending] = useActionState<RentalFormState, FormData>(
    createRentalRequest,
    {},
  )

  const meta = PLAN_META[plan]
  const price = quote(prices, plan, duration)

  function choosePlan(next: Plan) {
    setPlan(next)
    setDuration((d) => Math.min(d, PLAN_META[next].maxDuration))
  }

  return (
    <div className="rounded-md border border-border bg-card p-6">
      <p className="flex items-baseline gap-1.5">
        <span className="font-serif text-4xl">{currency.format(unitPrice(prices, plan))}</span>
        <span className="text-sm text-muted-foreground">/ {meta.unit}</span>
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-6">
        <input type="hidden" name="listingId" value={listingId} />
        <input type="hidden" name="plan" value={plan} />
        <input type="hidden" name="duration" value={duration} />

        <fieldset>
          <legend className="text-sm font-medium">Rental plan</legend>
          <div
            role="radiogroup"
            aria-label="Rental plan"
            className="mt-2 grid grid-cols-3 rounded-full border border-border p-1"
          >
            {PLANS.map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={plan === p}
                onClick={() => choosePlan(p)}
                className={cn(
                  'rounded-full py-1.5 text-sm transition-colors',
                  plan === p
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {PLAN_META[p].label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span id="duration-label" className="text-sm font-medium">
              Length
            </span>
            <div
              role="group"
              aria-labelledby="duration-label"
              className="mt-2 flex h-10 items-center justify-between rounded-md border border-input px-1"
            >
              <button
                type="button"
                aria-label={`Fewer ${meta.unitPlural}`}
                disabled={duration <= 1}
                onClick={() => setDuration((d) => Math.max(1, d - 1))}
                className="flex size-8 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <span className="text-sm tabular-nums" aria-live="polite">
                {formatDuration(plan, duration)}
              </span>
              <button
                type="button"
                aria-label={`More ${meta.unitPlural}`}
                disabled={duration >= meta.maxDuration}
                onClick={() => setDuration((d) => Math.min(meta.maxDuration, d + 1))}
                className="flex size-8 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="startDate" className="text-sm font-medium">
              Start date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              defaultValue={isoDate(1)}
              min={isoDate(0)}
              max={isoDate(90)}
              className="mt-2 h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
        </div>

        <div>
        <label htmlFor="message" className="text-sm font-medium">
            Note to LapShare <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={2}
            maxLength={500}
            placeholder="What you need it for, when you can pick up…"
            className="mt-2 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>

        <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <Row
            label={`${currency.format(unitPrice(prices, plan))} × ${formatDuration(plan, duration)}`}
            value={currency.format(price.rentalPrice)}
          />
          <Row
            label={`Service fee (${Math.round(SERVICE_FEE_RATE * 100)}%)`}
            value={currency.format(price.serviceFee)}
          />
          <Row
            label={`Refundable deposit (${Math.round(DEPOSIT_RATE * 100)}%)`}
            value={currency.format(price.deposit)}
          />
          <div className="mt-2 flex items-baseline justify-between border-t border-border pt-3">
            <dt className="font-medium">Due at pickup</dt>
            <dd className="font-serif text-2xl">{currency.format(price.total)}</dd>
          </div>
          <p className="text-xs text-muted-foreground">
            {currency.format(price.deposit)} is returned when the laptop is handed back undamaged.
          </p>
        </dl>

        {state.error ? (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        ) : null}

        {isOwner ? (
          <p className="rounded-md bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
            This is your listing.
          </p>
        ) : !available ? (
          <p className="rounded-md bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
            Currently unavailable.
          </p>
        ) : signedIn ? (
          showCheckout ? (
            <div className="rounded-md border border-border bg-muted/40 p-4">
              <div className="mb-3 flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight" style={{ color: '#635bff' }}>
                  stripe
                </span>
                <span className="text-xs text-muted-foreground">· Secured checkout</span>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Card number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="mt-1 h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      maxLength={7}
                      className="mt-1 h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      className="mt-1 h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={pending}
                className="mt-4 h-11 w-full rounded-full bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {pending ? 'Processing…' : `Pay ${currency.format(price.total)}`}
              </button>
              <p className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                🔒 Payments encrypted end-to-end
              </p>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                By paying, you agree to LapShare's{' '}
                <Link href="/terms" className="underline underline-offset-4">
                  Terms & Conditions
                </Link>
                .
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              className="h-11 rounded-full bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Request to rent
            </button>
          )
        ) : (
          <Link
            href={`/sign-in?next=/listings/${listingId}`}
            className="flex h-11 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Log in to request
          </Link>
        )}
                <p className="-mt-3 text-center text-xs text-muted-foreground">
          You won't be charged until LapShare confirms.
        </p>
      </form>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}
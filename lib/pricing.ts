export const SERVICE_FEE_RATE = 0.12
export const DEPOSIT_RATE = 0.4

export const PLANS = ['daily', 'weekly', 'monthly'] as const
export type Plan = (typeof PLANS)[number]

export const PLAN_META: Record<
  Plan,
  { label: string; unit: string; unitPlural: string; maxDuration: number }
> = {
  daily: { label: 'Daily', unit: 'day', unitPlural: 'days', maxDuration: 14 },
  weekly: { label: 'Weekly', unit: 'week', unitPlural: 'weeks', maxDuration: 8 },
  monthly: { label: 'Monthly', unit: 'month', unitPlural: 'months', maxDuration: 6 },
}

type PricedListing = {
  dailyPrice: number
  weeklyPrice: number
  monthlyPrice: number
}

export function unitPrice(listing: PricedListing, plan: Plan) {
  if (plan === 'daily') return listing.dailyPrice
  if (plan === 'weekly') return listing.weeklyPrice
  return listing.monthlyPrice
}

export function quote(listing: PricedListing, plan: Plan, duration: number) {
  const rentalPrice = unitPrice(listing, plan) * duration
  const serviceFee = Math.round(rentalPrice * SERVICE_FEE_RATE)
  const deposit = Math.round(rentalPrice * DEPOSIT_RATE)
  return {
    rentalPrice,
    serviceFee,
    deposit,
    total: rentalPrice + serviceFee + deposit,
  }
}

export function isPlan(value: unknown): value is Plan {
  return typeof value === 'string' && (PLANS as readonly string[]).includes(value)
}

export function formatDuration(plan: Plan, duration: number) {
  const meta = PLAN_META[plan]
  return `${duration} ${duration === 1 ? meta.unit : meta.unitPlural}`
}

export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

import { cn } from '@/lib/utils'

const LABELS: Record<string, string> = {
  pending: 'Pending confirmation',
  confirmed: 'Confirmed',
  declined: 'Declined',
  cancelled: 'Cancelled',
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
        status === 'confirmed' && 'bg-primary text-primary-foreground',
        status === 'pending' && 'bg-accent text-accent-foreground',
        status !== 'confirmed' && status !== 'pending' && 'bg-muted text-muted-foreground',
      )}
    >
      {status === 'pending' ? (
        <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
      ) : null}
      {LABELS[status] ?? status}
    </span>
  )
}

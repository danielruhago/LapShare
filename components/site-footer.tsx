import Link from 'next/link'
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
      <p>
          <span className="font-serif text-base text-foreground">LapShare</span> — laptops, ready
          when you need them.
        </p>
        <p>
          Refundable deposits · Campus handoffs ·{' '}
          <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  )
}

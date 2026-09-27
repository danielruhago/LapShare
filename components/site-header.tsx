import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { SignOutButton } from '@/components/sign-out-button'

export async function SiteHeader() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="font-serif text-2xl tracking-tight text-foreground">
          Lap<span className="italic text-primary">Share</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-5 text-sm">
          <Link href="/" className="hidden text-muted-foreground hover:text-foreground sm:inline">
            Browse
          </Link>
          {session?.user ? (
            <>
              <Link href="/rentals" className="text-muted-foreground hover:text-foreground">
                My requests
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Join with .edu
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

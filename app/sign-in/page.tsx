import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'
import { AuthShell } from '@/components/auth-shell'

export const metadata = { title: 'Log in — LapShare' }

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect(next?.startsWith('/') && !next.startsWith('//') ? next : '/')

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to LapShare."
      intro="Pick up where you left off — check on a pending request or find a laptop for this week’s deadline."
    >
      <AuthForm mode="sign-in" next={next} />
    </AuthShell>
  )
}

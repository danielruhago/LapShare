import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'
import { AuthShell } from '@/components/auth-shell'

export const metadata = { title: 'Sign up — LapShare' }

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect(next?.startsWith('/') && !next.startsWith('//') ? next : '/')

  return (
    <AuthShell
      eyebrow="Students only"
      title="Join with your university email."
      intro="LapShare is only open to enrolled students. Your university address is how owners and renters know they’re dealing with someone on the same campus."
    >
      <AuthForm mode="sign-up" next={next} />
    </AuthShell>
  )
}

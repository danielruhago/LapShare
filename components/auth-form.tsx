'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { isUniversityEmail } from '@/lib/university-email'

type Mode = 'sign-in' | 'sign-up'

function safeNext(next: string | undefined) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/'
}

export function AuthForm({ mode, next }: { mode: Mode; next?: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const isSignUp = mode === 'sign-up'
  const destination = safeNext(next)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    if (isSignUp && !isUniversityEmail(email)) {
      setError('Please use your @usask.ca or @mail.usask.ca email.')
      return
    }

    setPending(true)
    const result = isSignUp
      ? await authClient.signUp.email({
          email,
          password,
          name: String(form.get('name') ?? '').trim(),
          university: String(form.get('university') ?? '').trim(),
        })
      : await authClient.signIn.email({ email, password })
    setPending(false)

    if (result.error) {
      setError(
        isSignUp
          ? result.error.message && result.error.status === 400
            ? result.error.message
            : 'We couldn’t create your account. Try a different email or password.'
          : 'That email and password don’t match an account.',
      )
      return
    }
    router.push(destination)
    router.refresh()
  }

  const inputClass =
    'mt-2 h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40'

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate={false}>
      {isSignUp ? (
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Full name
          </label>
          <input id="name" name="name" required autoComplete="name" maxLength={80} className={inputClass} />
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="text-sm font-medium">
          University email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
               placeholder="NSID@usask.ca"
          className={inputClass}
        />
      </div>

      {isSignUp ? (
        <div>
          <label htmlFor="university" className="text-sm font-medium">
            University
          </label>
          <input
            id="university"
            name="university"
            type="hidden"
            value="University of Saskatchewan"
          />
          <div className={`${inputClass} flex items-center`}>
            University of Saskatchewan
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          className={inputClass}
        />
        {isSignUp ? (
          <p className="mt-1.5 text-xs text-muted-foreground">At least 8 characters.</p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

{isSignUp ? (
        <p className="-mt-2 text-xs text-muted-foreground">
          By continuing, you agree to LapShare's{' '}
          <Link href="/terms" className="underline underline-offset-4">
            Terms & Conditions
          </Link>
          .
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 h-11 rounded-full bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? 'One moment…' : isSignUp ? 'Create student account' : 'Log in'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? 'Already have an account? ' : 'New to LapShare? '}
        <Link
          href={`${isSignUp ? '/sign-in' : '/sign-up'}${destination !== '/' ? `?next=${encodeURIComponent(destination)}` : ''}`}
          className="text-primary underline underline-offset-4"
        >
          {isSignUp ? 'Log in' : 'Sign up with your .edu'}
        </Link>
      </p>
    </form>
  )
}

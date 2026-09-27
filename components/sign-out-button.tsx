'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await authClient.signOut()
          router.push('/')
          router.refresh()
        })
      }
      className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}

import { Handshake, MailCheck, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

type TrustItem = {
  icon: typeof MailCheck
  title: string
  body: ReactNode
}

const items: TrustItem[] = [
  {
    icon: MailCheck,
    title: 'Identity verified via university email',
    body: 'Every renter signs up with a university address, so you always know who you\'re dealing with.',
  },
  {
    icon: ShieldCheck,
    title: 'Refundable damage deposit',
    body: (
      <>
        Renters leave a deposit of 40% of the rental price. It's <strong className="font-semibold text-foreground">returned in full</strong> when the laptop comes back as it left.
      </>
    ),
  },
  {
    icon: Handshake,
    title: 'Campus-based handoff',
    body: 'Pickups and returns happen at public spots on campus.',
  },
]

export function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="mt-14 border-t border-border pt-10">
      <p className="text-xs uppercase tracking-[0.18em] text-primary">Trust & safety</p>
      <h2 id="trust-heading" className="mt-2 font-serif text-3xl">
        Every laptop, verified and protected.
      </h2>
      <ul className="mt-8 grid gap-8 md:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <li key={title}>
            <Icon className="size-5 text-primary" aria-hidden="true" />
            <h3 className="mt-3 font-medium leading-snug">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
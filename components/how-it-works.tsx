import { Search, Send, MapPin } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Browse',
    body: 'Find a laptop that fits your budget and what you need it for.',
  },
  {
    icon: Send,
    title: 'Request',
    body: 'Pick your plan, choose a start date, and send your request.',
  },
  {
    icon: MapPin,
    title: 'Pick up on campus',
    body: 'Meet at a public campus spot and you’re set for the day, week, or month.',
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="border-t border-border pt-10">
      <p className="text-xs uppercase tracking-[0.18em] text-primary">How it works</p>
      <h2 id="how-it-works-heading" className="mt-2 font-serif text-3xl">
        Three steps, start to finish.
      </h2>
      <ol className="mt-8 grid gap-8 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li key={title}>
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {i + 1}
            </span>
            <Icon className="mt-3 size-5 text-primary" aria-hidden="true" />
            <h3 className="mt-3 font-medium leading-snug">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
export const metadata = { title: 'Terms & Conditions — LapShare' }

const sections = [
  {
    title: 'Eligibility',
    body: 'LapShare is available to currently enrolled University of Saskatchewan students with a valid @usask.ca or @mail.usask.ca email address.',
  },
  {
    title: 'Ownership',
    body: 'Every laptop on LapShare is owned and maintained by LapShare. You are never renting from another student.',
  },
  {
    title: 'Pricing & payment',
    body: 'The rental price, service fee, and refundable deposit are shown in full before you confirm a request. You are not charged until your request is confirmed.',
  },
  {
    title: 'Refundable deposit',
    body: 'A deposit of 40% of the rental price is collected at pickup and returned in full when the laptop is handed back in the same condition.',
  },
  {
    title: 'Damage or non-return',
    body: 'If a laptop is returned damaged or not returned, LapShare may withhold part or all of the deposit, and may charge additional costs for significant damage or loss.',
  },
  {
    title: 'Pickup & return',
    body: 'All handoffs happen at designated public locations on campus.',
  },
  {
    title: 'Cancellations',
    body: 'You can cancel a request free of charge any time before it is confirmed by LapShare.',
  },
]

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-14 md:px-8">
      <p className="text-xs uppercase tracking-[0.18em] text-primary">Legal</p>
      <h1 className="mt-2 font-serif text-4xl">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated September 2026</p>

      <div className="mt-10 flex flex-col divide-y divide-border border-y border-border">
        {sections.map((s, i) => (
          <div key={s.title} className="grid gap-1 py-5 sm:grid-cols-[32px_1fr]">
            <span className="text-sm text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 className="font-medium">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
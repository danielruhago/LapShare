export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-2 md:px-8 md:py-20">
      <div className="md:border-r md:border-border md:pr-12">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-balance">
          {title}
        </h1>
        <p className="mt-5 max-w-sm leading-relaxed text-pretty text-muted-foreground">{intro}</p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </main>
  )
}

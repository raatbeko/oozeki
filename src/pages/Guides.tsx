import { useEffect, useState } from 'react'
import { Link, useTitle } from '../router'
import { guides, topics, type Guide as GuideT } from '../content/guides'
import { promptById } from '../content/prompts'
import { GuideCard } from '../components/GuideCard'
import { PromptCard } from '../components/Prompt'
import { ShotFigure } from '../components/Shot'
import { site } from '../content/site'
import { ChatGPTLogo, ClaudeLogo } from '../components/Logos'
import { PageHead } from '../components/Layout'
import { SoonSection } from '../components/Soon'

export function GuidesList() {
  useTitle('Гайддар')
  return (
    <main className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16">
      <PageHead kicker="Кадам-кадам" title="Гайддар">
        <p>Рилстеги гайддардын толук версиясы: ар бир шаг, скриншот жана көчүрүп ала турган промпт.</p>
      </PageHead>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {guides.map((g) => (
          <GuideCard key={g.slug} guide={g} />
        ))}
      </div>
      <section id="jakynda" className="mt-20 scroll-mt-28" aria-labelledby="soon">
        <p className="text-[13px] font-semibold tracking-[0.18em] text-accent uppercase">Даярдалып жатат</p>
        <h2 id="soon" className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Жакында
        </h2>
        <SoonSection />
      </section>
    </main>
  )
}

function useActiveStep(count: number) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const els = Array.from({ length: count }, (_, i) => document.getElementById(`shag-${i + 1}`)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.id.split('-')[1]) - 1)
      },
      { rootMargin: '-25% 0px -65% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [count])
  return active
}

function Compare({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="grid grid-cols-2 border-b border-line sm:grid-cols-[1fr_1.3fr_1.3fr]">
        <div className="hidden sm:block" />
        <div className="flex items-center gap-2.5 border-r border-line p-4">
          <ChatGPTLogo size={30} />
          <span className="font-serif text-lg font-bold">ChatGPT</span>
        </div>
        <div className="flex items-center gap-2.5 p-4">
          <ClaudeLogo size={30} />
          <span className="font-serif text-lg font-bold">Claude</span>
        </div>
      </div>
      {rows.map(([label, a, b]) => (
        <div key={label} className="grid grid-cols-2 border-b border-line last:border-0 sm:grid-cols-[1fr_1.3fr_1.3fr]">
          <div className="col-span-2 bg-bg-soft px-4 pt-3 pb-1 text-[12px] font-semibold tracking-[0.12em] text-ink-muted uppercase sm:col-span-1 sm:bg-transparent sm:py-4">
            {label}
          </div>
          <div className="border-r border-line px-4 py-3 text-[15px] leading-snug sm:py-4">{a}</div>
          <div className="px-4 py-3 text-[15px] leading-snug sm:py-4">{b}</div>
        </div>
      ))}
    </div>
  )
}

export function GuidePage({ guide }: { guide: GuideT }) {
  useTitle(guide.title)
  const active = useActiveStep(guide.steps.length)
  const t = topics[guide.topic]
  const idx = guides.indexOf(guide)
  const next = guides[(idx + 1) % guides.length]

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 md:pt-10">
      <nav aria-label="Жол" className="text-[14px] text-ink-muted">
        <Link href="/guides" className="inline-flex min-h-11 items-center hover:text-accent">
          ← Гайддар
        </Link>
      </nav>

      <PageHead kicker={t.label} title={guide.title}>
        <p>{guide.intro}</p>
      </PageHead>
      <div className="mt-6 flex flex-wrap gap-2 text-[14px]">
        <span className="rounded-full bg-accent-soft px-3.5 py-1.5 font-semibold text-accent">{guide.time}</span>
        {guide.need.map((n) => (
          <span key={n} className="rounded-full border border-line bg-surface px-3.5 py-1.5">
            {n}
          </span>
        ))}
      </div>

      {guide.compare && <Compare rows={guide.compare.rows} />}

      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <ol className="sticky top-24 grid gap-0.5 border-l border-line text-[14px]">
            {guide.steps.map((s, i) => (
              <li key={s.title}>
                <a
                  href={`#shag-${i + 1}`}
                  className={`-ml-px block border-l-2 py-1.5 pl-4 leading-snug transition-colors ${
                    active === i ? 'border-accent font-semibold text-ink' : 'border-transparent text-ink-muted hover:text-ink'
                  }`}
                >
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="grid min-w-0 gap-16">
          {guide.steps.map((s, i) => {
            const p = s.prompt ? promptById(s.prompt) : undefined
            return (
              <section key={s.title} id={`shag-${i + 1}`} className="scroll-mt-28">
                <div className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent font-serif text-xl font-bold text-white">
                    {i + 1}
                  </span>
                  <h2 className="font-serif text-[clamp(1.5rem,4vw,2.1rem)] leading-tight font-bold tracking-tight">{s.title}</h2>
                </div>
                <div className="mt-5 grid max-w-2xl gap-3 text-[17px] leading-relaxed">
                  {s.body.map((b) => (
                    <p key={b}>{b}</p>
                  ))}
                  {s.list && (
                    <ul className="grid gap-2">
                      {s.list.map((l) => (
                        <li key={l} className="flex gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.tip && (
                    <p className="rounded-xl border-l-4 border-gold bg-bg-soft px-4 py-3 text-[15px] leading-relaxed">
                      <span className="font-semibold">Кеңеш: </span>
                      {s.tip}
                    </p>
                  )}
                </div>
                {s.shots && (
                  <div className={`mt-8 grid gap-6 ${s.shots.length > 1 ? 'sm:grid-cols-2' : 'max-w-xl'}`}>
                    {s.shots.map((sh, j) => (
                      <ShotFigure key={sh.src + j} shot={sh} priority={i === 0} />
                    ))}
                  </div>
                )}
                {p && (
                  <div className="mt-8 max-w-3xl">
                    <PromptCard prompt={p} />
                  </div>
                )}
              </section>
            )
          })}

          {guide.outro && (
            <section className="grid items-center gap-8 rounded-3xl border border-line bg-bg-soft p-6 sm:p-10 md:grid-cols-[1fr_320px]">
              <div>
                <p className="text-[13px] font-semibold tracking-[0.18em] text-accent uppercase">Даяр</p>
                <p className="mt-2 font-serif text-2xl leading-snug font-bold">{guide.outro.text}</p>
              </div>
              {guide.outro.shot && <ShotFigure shot={guide.outro.shot} />}
            </section>
          )}

          <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <p className="text-[15px] text-ink-muted">Рилсте кыскача көрсөткөм — Instagram'да сактап кой:</p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener"
              className="mt-1 inline-flex min-h-11 items-center font-serif text-xl font-bold text-accent hover:underline"
            >
              @{site.handle} →
            </a>
            <hr className="my-5 border-line" />
            <p className="text-[12px] font-semibold tracking-[0.18em] text-ink-muted uppercase">Кийинки гайд</p>
            <Link href={`/guides/${next.slug}`} className="mt-1 block min-h-11 font-serif text-xl font-bold hover:text-accent">
              {next.title} →
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}

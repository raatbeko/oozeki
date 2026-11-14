import { useState } from 'react'
import { Link, useTitle } from '../router'
import { abilities, cautions, type Ability } from '../content/abilities'
import { promptById } from '../content/prompts'
import { guideBySlug } from '../content/guides'
import { PromptCard } from '../components/Prompt'
import { PageHead } from '../components/Layout'

export function AbilityCard({ a, compact = false }: { a: Ability; compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const p = a.prompt ? promptById(a.prompt) : undefined
  const g = a.guide ? guideBySlug(a.guide) : undefined
  return (
    <article id={a.id} className="flex h-full scroll-mt-28 flex-col rounded-2xl border border-line bg-surface p-5 shadow-[0_10px_30px_-22px_rgba(35,32,27,.5)]">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-bg-soft text-[22px]" aria-hidden="true">
          {a.icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-[20px] leading-snug font-bold">{a.title}</h3>
          <p className="mt-0.5 text-[13px] font-medium text-accent">{a.tools}</p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-muted">{a.text}</p>
      {!compact && (p || g) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {p && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="inline-flex min-h-10 items-center rounded-full bg-accent-soft px-4 text-[14px] font-semibold text-accent"
            >
              {open ? 'Промптту жашыруу' : 'Промпт менен сынап көр'}
            </button>
          )}
          {g && (
            <Link
              href={`/guides/${g.slug}`}
              className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-[14px] font-medium hover:border-accent/50"
            >
              Гайд →
            </Link>
          )}
        </div>
      )}
      {open && p && (
        <div className="mt-4">
          <PromptCard prompt={p} />
        </div>
      )}
    </article>
  )
}

export function Ji() {
  useTitle('ЖИ эмне кыла алат')
  return (
    <main className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-16">
      <PageHead kicker="Жасалма интеллект" title="ЖИ эмне кыла алат?">
        <p>
          ЖИ — бул жөн эле программа, бирок аны менен адам сыяктуу сүйлөшсө болот. Сен кадимки сөз менен жазасың — ал түшүнөт да,
          жасап берет. Төмөндө азыр чындап эле иштеген нерселер. Ар бирин даяр промпт менен ошол замат сынап көр.
        </p>
      </PageHead>

      <div className="mt-10 grid items-start gap-4 md:grid-cols-2">
        {abilities.map((a) => (
          <AbilityCard key={a.id} a={a} />
        ))}
      </div>

      <section className="mt-20" aria-labelledby="gen">
        <h2 id="gen" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Генерация жана код — айырмасы
        </h2>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
          Менин роликтеримдеги доска жана монтаж генерация эмес. ЖИ код жазып, ар бир кыймылды өзү тартат.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-[13px] font-semibold tracking-[0.18em] text-ink-muted uppercase">Генерация</p>
            <p className="mt-2 font-serif text-2xl font-bold">Ар бир жолу башка</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              Бир эле сурамга ар бир жолу башка сүрөт же видео чыгат. Аны башкаруу кыйын.
            </p>
          </div>
          <div className="rounded-2xl border border-accent/40 bg-accent-soft/50 p-6">
            <p className="text-[13px] font-semibold tracking-[0.18em] text-accent uppercase">Код</p>
            <p className="mt-2 font-serif text-2xl font-bold">Баары так</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              Шрифт, түс, кыймыл — сен эмне десең, ошол. Мультикти да ушинтип жасаса болот, сүрөт тартканды билбесең да.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="caution">
        <h2 id="caution" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Кайда этият болуш керек
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cautions.map((c) => {
            const p = c.prompt ? promptById(c.prompt) : undefined
            return (
              <div key={c.title} className="rounded-2xl border border-line bg-bg-soft p-5">
                <p className="font-serif text-xl font-bold">{c.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{c.text}</p>
                {p && (
                  <Link href={`/prompts#${p.id}`} className="mt-3 inline-flex min-h-10 items-center text-[14px] font-semibold text-accent hover:underline">
                    Промпт: {p.title} →
                  </Link>
                )}
              </div>
            )
          })}
        </div>
        <p className="mt-8 rounded-2xl bg-ink px-6 py-5 font-serif text-xl leading-relaxed text-bg">
          ЖИ сени алмаштырбайт. Бирок ЖИни колдонгон адам колдонбогон адамдын ордун ээлейт. Коркуш керек болгон нерсе — ЖИни
          үйрөнбөй калуу.
        </p>
      </section>
    </main>
  )
}

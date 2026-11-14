import { useState } from 'react'
import { BackButton } from '../components/BackButton'
import { Link, useTitle } from '../router'
import type { Ability } from '../content/abilities'
import { useContent } from '../content/useContent'
import { useTr } from '../i18n'
import { PromptCard } from '../components/Prompt'
import { PageHead } from '../components/Layout'

export function AbilityCard({ a, compact = false }: { a: Ability; compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const { promptById, guideBySlug } = useContent()
  const tr = useTr()
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
              {open ? tr('Промптту жашыруу', 'Скрыть промпт') : tr('Промпт менен сынап көр', 'Попробовать с промптом')}
            </button>
          )}
          {g && (
            <Link
              href={`/guides/${g.slug}`}
              className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-[14px] font-medium hover:border-accent/50"
            >
              {tr('Гайд', 'Гайд')} →
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
  const tr = useTr()
  const { abilities, cautions, promptById } = useContent()
  useTitle(tr('ЖИ эмне кыла алат', 'Что умеет ИИ'))
  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 md:pt-10">
      <BackButton fallback="/" />
      <PageHead kicker={tr('Жасалма интеллект', 'Искусственный интеллект')} title={tr('ЖИ эмне кыла алат?', 'Что умеет ИИ?')}>
        <p>
          {tr(
            'ЖИ — бул жөн эле программа, бирок аны менен адам сыяктуу сүйлөшсө болот. Сен кадимки сөз менен жазасың — ал түшүнөт да, жасап берет. Төмөндө азыр чындап эле иштеген нерселер. Ар бирин даяр промпт менен ошол замат сынап көр.',
            'ИИ — это просто программа, но с ней можно говорить, как с человеком. Пишешь обычными словами — он понимает и делает. Ниже — то, что реально работает уже сейчас. Каждую возможность можно сразу попробовать с готовым промптом.',
          )}
        </p>
      </PageHead>

      <div className="mt-10 grid items-start gap-4 md:grid-cols-2">
        {abilities.map((a) => (
          <AbilityCard key={a.id} a={a} />
        ))}
      </div>

      <section className="mt-20" aria-labelledby="gen">
        <h2 id="gen" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {tr('Генерация жана код — айырмасы', 'Генерация и код — в чём разница')}
        </h2>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
          {tr('Менин роликтеримдеги доска жана монтаж генерация эмес. ЖИ код жазып, ар бир кыймылды өзү тартат.', 'Доска и монтаж в моих роликах — не генерация. ИИ пишет код и сам рисует каждое движение.')}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-[13px] font-semibold tracking-[0.18em] text-ink-muted uppercase">{tr('Генерация', 'Генерация')}</p>
            <p className="mt-2 font-serif text-2xl font-bold">{tr('Ар бир жолу башка', 'Каждый раз по-разному')}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              {tr('Бир эле сурамга ар бир жолу башка сүрөт же видео чыгат. Аны башкаруу кыйын.', 'На один и тот же запрос каждый раз выходит другая картинка или видео. Управлять этим сложно.')}
            </p>
          </div>
          <div className="rounded-2xl border border-accent/40 bg-accent-soft/50 p-6">
            <p className="text-[13px] font-semibold tracking-[0.18em] text-accent uppercase">Код</p>
            <p className="mt-2 font-serif text-2xl font-bold">{tr('Баары так', 'Всё точно')}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              {tr('Шрифт, түс, кыймыл — сен эмне десең, ошол. Мультикти да ушинтип жасаса болот, сүрөт тартканды билбесең да.', 'Шрифт, цвет, движение — как скажешь. Так же можно делать мультики, даже если не умеешь рисовать.')}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="caution">
        <h2 id="caution" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {tr('Кайда этият болуш керек', 'Где нужно быть осторожным')}
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
                    {tr('Промпт', 'Промпт')}: {p.title} →
                  </Link>
                )}
              </div>
            )
          })}
        </div>
        <p className="mt-8 rounded-2xl bg-ink px-6 py-5 font-serif text-xl leading-relaxed text-bg">
          {tr(
            'ЖИ сени алмаштырбайт. Бирок ЖИни колдонгон адам колдонбогон адамдын ордун ээлейт. Коркуш керек болгон нерсе — ЖИни үйрөнбөй калуу.',
            'ИИ тебя не заменит. Но человек, который пользуется ИИ, займёт место того, кто не пользуется. Бояться стоит не ИИ, а того, чтобы его не освоить.',
          )}
        </p>
      </section>
    </main>
  )
}

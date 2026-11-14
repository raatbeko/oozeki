import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BackButton } from '../components/BackButton'
import { Link, useTitle } from '../router'
import type { Ability } from '../content/abilities'
import { useContent } from '../content/useContent'
import { useTr } from '../i18n'
import { PromptCard } from '../components/Prompt'
import { PageHead } from '../components/Layout'

export function AbilityCard({ a, compact = false, onOpen }: { a: Ability; compact?: boolean; onOpen?: () => void }) {
  const tr = useTr()
  const inner = (
    <>
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
      {!compact && <span className="oz-ability-more mt-4 self-start">{tr('Кантип жасайт', 'Как сделать')} →</span>}
    </>
  )
  const cls = 'flex h-full scroll-mt-28 flex-col rounded-2xl border border-line bg-surface p-5 text-left shadow-[0_10px_30px_-22px_rgba(35,32,27,.5)]'
  // Башкы бетте — жөн карточка (шилтеменин ичинде); бул бетте — басканда попап ачылат
  if (compact || !onOpen) {
    return (
      <article id={a.id} className={cls}>
        {inner}
      </article>
    )
  }
  return (
    <button type="button" id={a.id} onClick={onOpen} aria-haspopup="dialog" className={`oz-ability group ${cls}`}>
      {inner}
    </button>
  )
}

/**
 * Мүмкүнчүлүктүн попабы: кадам-кадам «кантип жасайт», даяр промпт жана гайдга шилтеме.
 * Компьютерде — экрандын ортосунда, телефондо — ылдыйдан чыгат. Esc, ✕ же фонду басса жабылат.
 */
function AbilityModal({ a, onClose }: { a: Ability; onClose: () => void }) {
  const tr = useTr()
  const { promptById, guideBySlug } = useContent()
  const p = a.prompt ? promptById(a.prompt) : undefined
  const g = a.guide ? guideBySlug(a.guide) : undefined
  const [closing, setClosing] = useState(false)
  const closeBtn = useRef<HTMLButtonElement>(null)

  const close = () => {
    if (closing) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return onClose()
    setClosing(true)
    window.setTimeout(onClose, 260)
  }

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = 'hidden' // арткы бет жылбасын
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      root.style.overflow = overflow
      prev?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // body'ге чыгарабыз: #content'тин өз катмары бар (беттердин өтүү анимациясы үчүн), ичинде калса шапка үстүндө калат
  return createPortal(
    <div className="oz-modal" data-closing={closing || undefined} role="presentation" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${a.id}-title`}
        className="oz-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="oz-modal-grip" aria-hidden="true" />
        <header className="flex items-start gap-3 pr-12">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-bg-soft text-[24px]" aria-hidden="true">
            {a.icon}
          </span>
          <div className="min-w-0">
            <h2 id={`${a.id}-title`} className="font-serif text-[24px] leading-tight font-bold">
              {a.title}
            </h2>
            <p className="mt-1 text-[13px] font-medium text-accent">{a.tools}</p>
          </div>
        </header>
        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          aria-label={tr('Жабуу', 'Закрыть')}
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-line text-ink-muted transition hover:border-accent/60 hover:text-accent"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{a.text}</p>

        {a.steps && a.steps.length > 0 && (
          <section className="mt-6" aria-label={tr('Кантип жасайт', 'Как сделать')}>
            <p className="text-[12px] font-semibold tracking-[0.16em] text-accent uppercase">{tr('Кантип жасайт', 'Как сделать')}</p>
            <ol className="oz-steps mt-3">
              {a.steps.map((s, i) => (
                <li key={i} style={{ animationDelay: `${0.08 + i * 0.05}s` }}>
                  <span className="oz-step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {p && (
          <section className="mt-6">
            <p className="mb-3 text-[12px] font-semibold tracking-[0.16em] text-accent uppercase">{tr('Даяр промпт', 'Готовый промпт')}</p>
            <PromptCard prompt={p} />
          </section>
        )}

        {g && (
          <Link
            href={`/guides/${g.slug}`}
            onClick={() => (document.documentElement.style.overflow = '')}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-[14px] font-semibold transition hover:border-accent/50 hover:text-accent"
          >
            {tr('Толук гайд', 'Полный гайд')}: {g.title} →
          </Link>
        )}
      </div>
    </div>,
    document.body,
  )
}

export function Ji() {
  const tr = useTr()
  const { abilities, cautions, promptById } = useContent()
  useTitle(tr('ЖИ эмне кыла алат', 'Что умеет ИИ'))
  // Башкы беттен /ji#tekst сыяктуу шилтеме менен келсе — ошол попап ачык турат
  const [openId, setOpenId] = useState<string | null>(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    return abilities.some((x) => x.id === id) ? id : null
  })
  const opened = abilities.find((x) => x.id === openId)
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

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {abilities.map((a) => (
          <AbilityCard key={a.id} a={a} onOpen={() => setOpenId(a.id)} />
        ))}
      </div>
      {opened && <AbilityModal key={opened.id} a={opened} onClose={() => setOpenId(null)} />}

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

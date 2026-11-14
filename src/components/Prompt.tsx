import { useEffect, useId, useRef, useState } from 'react'
import type { Prompt } from '../content/prompts'
import { Link, HASH_EVENT } from '../router'
import { useContent } from '../content/useContent'
import { useTr } from '../i18n'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}

export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const tr = useTr()
  const [done, setDone] = useState(false)
  const onClick = async () => {
    if (await copyText(text)) {
      setDone(true)
      window.setTimeout(() => setDone(false), 1800)
    }
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
        done ? 'bg-emerald-600 text-white' : 'bg-accent text-white hover:brightness-110 active:translate-y-px'
      } ${className}`}
    >
      {done ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {tr('Көчүрүлдү', 'Скопировано')}
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="8" y="8" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="2" />
          </svg>
          {tr('Көчүрүү', 'Копировать')}
        </>
      )}
    </button>
  )
}

const OPEN_EVENT = 'oz:prompt-open'
const OPEN_MS = 480
const CLOSE_MS = 420
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE_IO = 'cubic-bezier(0.65, 0, 0.35, 1)'

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * popup = true: карточка жыйналган турат (аталыш + «Көчүрүү» + жебе). Жебени басканда
 * ошол эле жеринде алдыга чыгып ачылат — кошуна карточкалар жылбайт. Чычкан кетсе,
 * сыртка басса же Esc — жабылат. Бир убакта бирөө гана ачык.
 */
export function PromptCard({ prompt, showGuide = false, popup = false }: { prompt: Prompt; showGuide?: boolean; popup?: boolean }) {
  const { guideBySlug, lang } = useContent()
  const tr = useTr()
  const guide = prompt.guide ? guideBySlug(prompt.guide) : undefined
  const long = prompt.text.length > 700
  const [open, setOpen] = useState(!long)

  // ── попап режими ──
  const uid = useId()
  const [pop, setPop] = useState(false)
  const [closing, setClosing] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLElement>(null)
  const anim = useRef<Animation | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const finishClose = () => {
    anim.current?.cancel()
    anim.current = null
    setPop(false)
    setClosing(false)
  }

  const closePop = (instant = false) => {
    if (!pop || closing) return
    window.clearTimeout(timer.current)
    if (instant || reduce() || !card.current?.animate || !wrap.current) return finishClose()
    const from = card.current.getBoundingClientRect().height / 1.02
    const to = wrap.current.offsetHeight
    setClosing(true)
    anim.current?.cancel()
    anim.current = card.current.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: CLOSE_MS, easing: EASE_IO, fill: 'forwards' })
    timer.current = window.setTimeout(finishClose, CLOSE_MS)
  }

  const openPop = () => {
    window.clearTimeout(timer.current)
    anim.current?.cancel()
    setClosing(false)
    setPop(true)
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: uid }))
  }

  // Ачылганда бийиктикти жылмакай өстүрөбүз (жыйналгандан толукка)
  useEffect(() => {
    if (!pop || closing || !card.current || !wrap.current || reduce() || !card.current.animate) return
    const el = card.current
    const from = wrap.current.offsetHeight
    const full = el.scrollHeight
    anim.current = el.animate([{ height: `${from}px` }, { height: `${full}px` }], { duration: OPEN_MS, easing: EASE })
    anim.current.onfinish = () => (anim.current = null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pop])

  // Бирөө ачылса — башкалары жабылат; сыртка басуу жана Esc
  useEffect(() => {
    if (!popup) return
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== uid) closePop(true)
    }
    const onDown = (e: PointerEvent) => {
      if (pop && card.current && !card.current.contains(e.target as Node)) closePop()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closePop()
    const onResize = () => closePop(true)
    window.addEventListener(OPEN_EVENT, onOther)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener(OPEN_EVENT, onOther)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  })

  // Шилтеме #id менен келсе — ошол промпт ачык турат (ошол эле беттеги шилтемеде да — HASH_EVENT)
  useEffect(() => {
    if (decodeURIComponent(location.hash.slice(1)) === prompt.id) {
      if (popup) openPop()
      else setOpen(true)
    }
    const onHash = (e: Event) => {
      if ((e as CustomEvent).detail !== prompt.id) return
      if (popup) openPop()
      else setOpen(true)
    }
    window.addEventListener(HASH_EVENT, onHash)
    return () => window.removeEventListener(HASH_EVENT, onHash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const body = (
    <>
      {prompt.note && <p className="px-4 pt-3 text-[15px] leading-relaxed text-ink-muted sm:px-5">{prompt.note}</p>}
      <div className="relative px-4 py-3 sm:px-5">
        <pre
          className={`overflow-x-auto rounded-lg bg-code p-4 font-mono text-[13.5px] leading-relaxed whitespace-pre-wrap text-[#f3ead8] ${
            open ? '' : 'max-h-56 overflow-hidden'
          }`}
        >
          {prompt.text}
        </pre>
        {!open && (
          <div className="pointer-events-none absolute inset-x-4 bottom-3 h-20 rounded-b-lg bg-gradient-to-t from-code to-transparent sm:inset-x-5" />
        )}
      </div>
      {(long || (showGuide && guide)) && (
        <footer className="flex flex-wrap items-center justify-between gap-2 px-4 pb-4 sm:px-5">
          {long ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="min-h-11 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              {open ? tr('Жыйноо', 'Свернуть') : tr('Толук көрүү', 'Показать полностью')}
            </button>
          ) : (
            <span />
          )}
          {showGuide && guide && (
            <Link href={`/guides/${guide.slug}`} className="min-h-11 content-center text-sm font-medium text-ink-muted hover:text-ink">
              {tr('Гайд', 'Гайд')}: {guide.title} →
            </Link>
          )}
        </footer>
      )}
    </>
  )

  const where = (
    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[13px] text-ink-muted">
      <span className="inline-flex items-center gap-1 rounded bg-bg-soft px-1.5 py-0.5 font-medium text-ink">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="2" />
        </svg>
        {prompt.where}
      </span>
      {prompt.lang === 'ru' && lang === 'ky' && <span className="rounded bg-accent-soft px-1.5 py-0.5 text-ink">орусча</span>}
    </p>
  )

  if (popup) {
    return (
      <div ref={wrap} id={prompt.id} className="oz-pop-wrap relative scroll-mt-28">
        <article
          ref={card}
          data-open={pop || undefined}
          data-closing={closing || undefined}
          onMouseLeave={(e) => {
            if (pop && (e.nativeEvent as PointerEvent).pointerType !== 'touch') closePop()
          }}
          className="oz-pop flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_10px_30px_-20px_rgba(35,32,27,.35)]"
        >
          {/* Аталыш өйдөдө, баскычтар дайыма карточканын түбүндө — бардык карточкаларда бир сызыкта */}
          <header className={`flex flex-1 flex-col gap-[18px] p-5 ${pop ? 'border-b border-line' : ''}`}>
            <div className="min-w-0">
              <h3 className="font-serif text-[19px] leading-snug font-bold">{prompt.title}</h3>
              {where}
            </div>
            <div className="mt-auto flex items-center gap-2.5">
              <CopyButton text={prompt.text} className="oz-pop-copy flex-1 justify-center" />
              <button
                type="button"
                aria-expanded={pop}
                aria-controls={`${prompt.id}-body`}
                aria-label={pop ? tr('Жабуу', 'Свернуть') : tr('Промптту ачуу', 'Открыть промпт')}
                onClick={() => (pop ? closePop() : openPop())}
                className="oz-pop-chev grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition hover:border-accent/60 hover:text-accent"
              >
                <Chevron />
              </button>
            </div>
          </header>
          {pop && (
            <div id={`${prompt.id}-body`} className="oz-pop-body">
              {body}
            </div>
          )}
        </article>
      </div>
    )
  }

  return (
    <article id={prompt.id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_10px_30px_-20px_rgba(35,32,27,.35)]">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h3 className="font-serif text-[19px] leading-snug font-bold">{prompt.title}</h3>
          {where}
        </div>
        <CopyButton text={prompt.text} />
      </header>
      {body}
    </article>
  )
}

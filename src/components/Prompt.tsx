import { useState } from 'react'
import type { Prompt } from '../content/prompts'
import { Link } from '../router'
import { guideBySlug } from '../content/guides'

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
          Көчүрүлдү
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="8" y="8" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="2" />
          </svg>
          Көчүрүү
        </>
      )}
    </button>
  )
}

export function PromptCard({ prompt, showGuide = false }: { prompt: Prompt; showGuide?: boolean }) {
  const guide = prompt.guide ? guideBySlug(prompt.guide) : undefined
  const long = prompt.text.length > 700
  const [open, setOpen] = useState(!long)
  return (
    <article id={prompt.id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_10px_30px_-20px_rgba(35,32,27,.35)]">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h3 className="font-serif text-[19px] leading-snug font-bold">{prompt.title}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[13px] text-ink-muted">
            <span className="inline-flex items-center gap-1 rounded bg-bg-soft px-1.5 py-0.5 font-medium text-ink">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="2" />
              </svg>
              {prompt.where}
            </span>
            {prompt.lang === 'ru' && <span className="rounded bg-accent-soft px-1.5 py-0.5 text-ink">орусча</span>}
          </p>
        </div>
        <CopyButton text={prompt.text} />
      </header>
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
              {open ? 'Жыйноо' : 'Толук көрүү'}
            </button>
          ) : (
            <span />
          )}
          {showGuide && guide && (
            <Link href={`/guides/${guide.slug}`} className="min-h-11 content-center text-sm font-medium text-ink-muted hover:text-ink">
              Гайд: {guide.title} →
            </Link>
          )}
        </footer>
      )}
    </article>
  )
}

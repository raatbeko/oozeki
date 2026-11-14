import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from '../router'
import { useLang, useTr } from '../i18n'
import { Tunduk } from './Tunduk'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

const STORE = 'oozeki:chat'
const MAX_CHARS = 600

function loadHistory(): Msg[] {
  try {
    const v = JSON.parse(sessionStorage.getItem(STORE) || '[]')
    return Array.isArray(v) ? v.slice(-20) : []
  } catch {
    return []
  }
}

/** Жооптогу [текст](/жол) шилтемелерин, **калың** текстти жана тизмелерди көрсөтөбүз */
function renderInline(text: string, key: string, onNavigate: () => void): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) {
      const href = m[2]
      if (href.startsWith('/')) {
        out.push(
          <Link key={`${key}-${i++}`} href={href} onClick={onNavigate} className="font-semibold text-accent underline underline-offset-2">
            {m[1]}
          </Link>,
        )
      } else if (/^https:\/\//.test(href)) {
        out.push(
          <a key={`${key}-${i++}`} href={href} target="_blank" rel="noopener" className="font-semibold text-accent underline underline-offset-2">
            {m[1]}
          </a>,
        )
      } else out.push(m[1])
    } else if (m[3]) {
      out.push(
        <strong key={`${key}-${i++}`} className="font-semibold text-ink">
          {m[3]}
        </strong>,
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function Answer({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        const bullet = /^\s*([-*•]|\d+[.)])\s+/.exec(line)
        if (!line.trim()) return <div key={i} className="h-2" />
        if (bullet)
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="shrink-0 text-accent">{/\d/.test(bullet[1]) ? bullet[1] : '•'}</span>
              <span>{renderInline(line.slice(bullet[0].length), `l${i}`, onNavigate)}</span>
            </div>
          )
        return <p key={i}>{renderInline(line.replace(/^#+\s*/, ''), `l${i}`, onNavigate)}</p>
      })}
    </>
  )
}

export function ChatWidget() {
  const tr = useTr()
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const unlockRef = useRef<((restore: boolean) => void) | null>(null)
  const [msgs, setMsgs] = useState<Msg[]>(loadHistory)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-20)))
    } catch {
      /* жок болсо — эч нерсе */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [msgs])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 150)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Телефондо чат ачык турганда арткы бет сыдырылбасын (iOS'ко да иштейт)
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 639px)').matches) return
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, left: b.left, right: b.right, width: b.width }
    Object.assign(b, { position: 'fixed', top: `-${y}px`, left: '0', right: '0', width: '100%' })
    let locked = true
    // restore=false — шилтеме басылганда: бетти бошотобуз, бирок эски жерге кайтарбайбыз
    const unlock = (restore: boolean) => {
      if (!locked) return
      locked = false
      Object.assign(b, prev)
      if (restore) window.scrollTo({ top: y, behavior: 'instant' })
    }
    unlockRef.current = unlock
    return () => {
      unlockRef.current = null
      unlock(true)
    }
  }, [open])

  const suggestions = [
    tr('Эмнеден баштасам болот?', 'С чего мне начать?'),
    tr('Монтаж үчүн промпт кайда?', 'Где промпт для монтажа?'),
    tr('Claude менен ChatGPT айырмасы эмнеде?', 'Чем Claude отличается от ChatGPT?'),
    tr('Коннекторду кантип подключить кылам?', 'Как подключить коннектор?'),
  ]

  const send = async (text: string) => {
    const q = text.trim().slice(0, MAX_CHARS)
    if (!q || busy) return
    const history: Msg[] = [...msgs, { role: 'user', content: q }]
    setMsgs([...history, { role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)
    const setLast = (content: string) =>
      setMsgs((prev) => [...prev.slice(0, -1), { role: 'assistant', content }])
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lang, messages: history.slice(-12) }),
      })
      if (!res.ok || !res.body) {
        const err = res.status === 429
          ? tr('Суроолор көп болуп кетти. Бир аздан кийин кайра жаз.', 'Слишком много вопросов. Попробуй чуть позже.')
          : tr('Жардамчы азыр иштебей турат. Бир аздан кийин кайра жазып көр.', 'Помощник сейчас недоступен. Попробуй чуть позже.')
        setLast(`⚠️ ${err}`)
        return
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let acc = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += dec.decode(value, { stream: true })
        setLast(acc)
      }
      if (!acc.trim()) setLast(tr('Жооп келген жок. Кайра жазып көр.', 'Ответа не пришло. Попробуй ещё раз.'))
    } catch {
      setLast(`⚠️ ${tr('Интернет байланышын текшер да, кайра жаз.', 'Проверь интернет и попробуй ещё раз.')}`)
    } finally {
      setBusy(false)
    }
  }

  // Шилтеме басылганда чат жыйналат — керектүү бөлүм көрүнүп калсын (жазышуу сакталат)
  const closeOnNavigate = () => {
    unlockRef.current?.(false)
    setOpen(false)
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={tr('Жардамчыга суроо берүү', 'Задать вопрос помощнику')}
          className="fixed right-4 bottom-4 z-[45] inline-flex min-h-13 items-center gap-2.5 rounded-full bg-accent py-3 pr-5 pl-4 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(194,69,47,.75)] transition hover:brightness-110 sm:right-6 sm:bottom-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5v-9Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M8.5 8.5h7M8.5 11.5h4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {tr('Суроо бер', 'Спросить')}
        </button>
      )}

      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[59] touch-none bg-black/40 sm:hidden"
        />
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={tr('Сайттын жардамчысы', 'Помощник сайта')}
          className="fixed inset-x-0 bottom-0 z-[60] flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-line bg-bg shadow-[0_-20px_60px_-20px_rgba(0,0,0,.6)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[min(620px,80dvh)] sm:w-[400px] sm:rounded-3xl"
        >
          <header className="flex items-center gap-3 border-b border-line px-4 py-3">
            <span className="grid size-10 place-items-center rounded-full bg-accent-soft">
              <Tunduk size={22} className="text-accent" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-[17px] leading-tight font-bold">{tr('Жардамчы', 'Помощник')}</p>
              <p className="text-[12px] text-ink-muted">{tr('Сайттан керектүүсүн табам', 'Помогу найти нужное на сайте')}</p>
            </div>
            {msgs.length > 0 && (
              <button
                type="button"
                onClick={() => setMsgs([])}
                className="min-h-9 rounded-full px-3 text-[12.5px] font-medium text-ink-muted hover:bg-bg-soft hover:text-ink"
              >
                {tr('Тазалоо', 'Очистить')}
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={tr('Жабуу', 'Закрыть')}
              className="grid size-10 place-items-center rounded-full text-ink-muted hover:bg-bg-soft hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
            {msgs.length === 0 && (
              <div>
                <div className="rounded-2xl rounded-tl-md bg-bg-soft px-4 py-3 text-[15px] leading-relaxed">
                  {tr(
                    'Салам! Мен oozeki.app сайтынын жардамчысымын. Эмнени үйрөнгүң келет — гайд, промпт же бөлүмдү табууга жардам берем.',
                    'Привет! Я помощник сайта oozeki.app. Скажи, что хочешь узнать, — помогу найти гайд, промпт или нужный раздел.',
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-line bg-surface px-3.5 py-2 text-left text-[13.5px] hover:border-accent/50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-accent px-4 py-2.5 text-[15px] leading-relaxed text-white">
                  {m.content}
                </div>
              ) : (
                <div key={i} className="max-w-[92%] space-y-1 rounded-2xl rounded-tl-md bg-bg-soft px-4 py-3 text-[15px] leading-relaxed">
                  {m.content ? (
                    <Answer text={m.content} onNavigate={closeOnNavigate} />
                  ) : (
                    <span className="inline-flex gap-1 py-1" aria-label={tr('Жазып жатат', 'Печатает')}>
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="size-1.5 rounded-full bg-ink-muted"
                          style={{ animation: `oz-dot 1s ease-in-out ${d * 0.15}s infinite` }}
                        />
                      ))}
                    </span>
                  )}
                </div>
              ),
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="border-t border-line p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-line bg-surface p-1.5 focus-within:border-accent/60">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(input)
                  }
                }}
                rows={1}
                placeholder={tr('Суроону жаз…', 'Напиши вопрос…')}
                aria-label={tr('Суроо', 'Вопрос')}
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2 text-[16px] outline-none placeholder:text-ink-muted/70"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={tr('Жөнөтүү', 'Отправить')}
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-white transition disabled:opacity-40"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="mt-2 px-1 text-center text-[11.5px] text-ink-muted/80">
              {tr('Жардамчы — ЖИ, ката кетириши мүмкүн.', 'Помощник — это ИИ, он может ошибаться.')}
            </p>
          </form>
        </div>
      )}
    </>
  )
}

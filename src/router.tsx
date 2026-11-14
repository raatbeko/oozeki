import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { useLang } from './i18n'

const EVENT = 'app:navigate'

/* ── Беттер арасындагы өтүү анимациясы (View Transitions) ──
   Тереңге (тизме → гайд) — жаңы бет оңдон бир аз кирет; артка — солдон;
   менюдагы капталдагы бөлүмдөр арасында — жөн гана жумшак пайда болот.
   Шапка ордунда турат. Браузер колдобосо же «азыраак кыймыл» күйгүзүлсө — анимациясыз. */
type NavDir = 'forward' | 'back' | 'lateral'
let lastPath = location.pathname
let pendingDir: NavDir | null = null

const clean = (p: string) => p.replace(/\/+$/, '') || '/'
const depth = (p: string) => (clean(p) === '/' ? 0 : clean(p).split('/').length - 1)
const dirFor = (from: string, to: string): NavDir => {
  const a = depth(from)
  const b = depth(to)
  return b > a ? 'forward' : b < a ? 'back' : 'lateral'
}

function withTransition(dir: NavDir, update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!doc.startViewTransition || reduce) {
    update()
    return
  }
  const root = document.documentElement
  root.dataset.navDir = dir
  const t = doc.startViewTransition(() => flushSync(update))
  t.finished.finally(() => {
    if (root.dataset.navDir === dir) delete root.dataset.navDir
  })
}

function commit() {
  window.dispatchEvent(new Event(EVENT))
}

export function navigate(to: string, dir?: NavDir) {
  if (to === location.pathname + location.hash) return
  const from = location.pathname
  history.pushState({ oz: 1 }, '', to) // сайттын ичиндеги өтүү — «Артка» ушуну колдонот
  const toPath = location.pathname
  const hash = to.split('#')[1]
  const apply = () => {
    lastPath = toPath
    commit()
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }))
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }
  if (clean(from) === clean(toPath)) apply() // ошол эле бетте якорь гана өзгөрдү
  else withTransition(dir ?? dirFor(from, toPath), apply)
}

/** «Артка» баскычы: сайттын ичинен келсе — браузердин артка кадамы (анимация «артка» багытта) */
export function goBack(fallback: string) {
  if ((history.state as { oz?: number } | null)?.oz) {
    pendingDir = 'back'
    history.back()
  } else {
    navigate(fallback, 'back')
  }
}

// Браузердин «артка/алдыга» баскычтары
window.addEventListener('popstate', () => {
  const from = lastPath
  const to = location.pathname
  lastPath = to
  const dir = pendingDir ?? dirFor(from, to)
  pendingDir = null
  if (clean(from) === clean(to)) commit()
  else withTransition(dir === 'lateral' ? 'back' : dir, commit)
})

export function usePath() {
  const [path, setPath] = useState(() => location.pathname)
  useEffect(() => {
    const update = () => setPath(location.pathname)
    window.addEventListener(EVENT, update)
    return () => window.removeEventListener(EVENT, update)
  }, [])
  return clean(path)
}

export function Link({ href = '/', onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (!href.startsWith('/')) return
    e.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={handle} {...rest} />
}

export function useTitle(title: string) {
  const { lang } = useLang()
  useEffect(() => {
    const brand = lang === 'ru' ? 'ИИ по-кыргызски' : 'ИИ кыргызча'
    const home = lang === 'ru' ? 'ИИ по-кыргызски — Claude, ChatGPT и монтаж с ИИ' : 'ИИ кыргызча — Claude, ChatGPT жана ИИ менен монтаж'
    document.title = title ? `${title} — ${brand}` : home
  }, [title, lang])
}

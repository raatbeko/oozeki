import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { useLang } from './i18n'

const EVENT = 'app:navigate'

export function navigate(to: string) {
  if (to === location.pathname + location.hash) return
  history.pushState({ oz: 1 }, '', to) // сайттын ичиндеги өтүү — «Артка» ушуну колдонот
  window.dispatchEvent(new Event(EVENT))
  const hash = to.split('#')[1]
  if (hash) {
    requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }))
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }
}

export function usePath() {
  const [path, setPath] = useState(() => location.pathname)
  useEffect(() => {
    const update = () => setPath(location.pathname)
    window.addEventListener('popstate', update)
    window.addEventListener(EVENT, update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(EVENT, update)
    }
  }, [])
  return path.replace(/\/+$/, '') || '/'
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

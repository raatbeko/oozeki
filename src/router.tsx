import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react'

const EVENT = 'app:navigate'

export function navigate(to: string) {
  if (to === location.pathname + location.hash) return
  history.pushState({}, '', to)
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
  useEffect(() => {
    document.title = title ? `${title} — ИИ кыргызча` : 'ИИ кыргызча — Claude, ChatGPT жана ИИ менен монтаж'
  }, [title])
}

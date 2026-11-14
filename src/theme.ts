import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'oozeki:theme'

function initial(): Theme {
  const t = document.documentElement.getAttribute('data-theme')
  return t === 'dark' ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initial)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* жеке терезеде localStorage жок болушу мүмкүн */
    }
  }, [theme])
  return [theme, setTheme] as const
}

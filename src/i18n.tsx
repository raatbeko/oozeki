import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'ky' | 'ru'
const KEY = 'oozeki:lang'

function initial(): Lang {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'ru' || v === 'ky') return v
  } catch {
    /* localStorage жок болушу мүмкүн */
  }
  return 'ky'
}

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'ky', setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial)
  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      /* жок болсо — эч нерсе */
    }
  }, [lang])
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}

export function useLang() {
  return useContext(Ctx)
}

/** Кыргызча жана орусча текст: tr('Баштоо', 'Начать') */
export function useTr() {
  const { lang } = useLang()
  return useCallback((ky: string, ru: string) => (lang === 'ru' ? ru : ky), [lang])
}

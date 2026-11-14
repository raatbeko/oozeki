import { useState } from 'react'
import { BackButton } from '../components/BackButton'
import { Link, useTitle } from '../router'
import { useContent } from '../content/useContent'
import { useTr } from '../i18n'
import { PageHead } from '../components/Layout'

export function Sozduk() {
  const tr = useTr()
  const { glossary } = useContent()
  useTitle(tr('Сөздүк', 'Словарь'))
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const list = needle
    ? glossary.filter((t) => [t.term, t.alt ?? '', t.text].join(' ').toLowerCase().includes(needle))
    : glossary

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 md:pt-10">
      <BackButton fallback="/" />
      <PageHead kicker={tr('Түшүнүксүз сөздөр', 'Непонятные слова')} title={tr('ЖИ сөздүгү', 'Словарь ИИ')}>
        <p>{tr('Промпт, токен, агент, артефакт… Ар бир сөз — жөнөкөй тил менен, бир-эки сүйлөм.', 'Промпт, токен, агент, артефакт… Каждое слово — простым языком, в одном-двух предложениях.')}</p>
      </PageHead>

      <label className="mt-8 flex min-h-12 items-center gap-3 rounded-full border border-line bg-surface px-5 focus-within:border-accent/60">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-ink-muted">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="sr-only">{tr('Сөз издөө', 'Поиск слова')}</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tr('Издөө: промпт, токен, нейросеть…', 'Поиск: промпт, токен, нейросеть…')}
          className="w-full bg-transparent text-[16px] outline-none placeholder:text-ink-muted/70"
        />
      </label>

      <dl className="mt-8 grid gap-3">
        {list.map((t) => (
          <div key={t.term} className="rounded-2xl border border-line bg-surface p-5">
            <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-serif text-[21px] font-bold">{t.term}</span>
              {t.alt && <span className="text-[13px] text-ink-muted">{t.alt}</span>}
            </dt>
            <dd className="mt-2 text-[16px] leading-relaxed text-ink-muted">
              {t.text}
              {t.link && (
                <>
                  {' '}
                  <Link href={t.link} className="font-semibold whitespace-nowrap text-accent hover:underline">
                    {tr('Толугу', 'Подробнее')} →
                  </Link>
                </>
              )}
            </dd>
          </div>
        ))}
        {list.length === 0 && <p className="py-10 text-center text-ink-muted">{tr('Табылган жок. Башкача жазып көр.', 'Ничего не найдено. Попробуй написать иначе.')}</p>}
      </dl>
    </main>
  )
}

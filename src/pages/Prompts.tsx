import { useEffect, useState } from 'react'
import { useTitle } from '../router'
import type { PromptCategory } from '../content/prompts'
import { useContent } from '../content/useContent'
import { useTr } from '../i18n'
import { PromptCard } from '../components/Prompt'
import { PageHead } from '../components/Layout'

export function Prompts() {
  const tr = useTr()
  const { prompts, promptCategories } = useContent()
  useTitle(tr('Промпттор', 'Промпты'))
  const [cat, setCat] = useState<PromptCategory | 'all'>('all')
  const list = cat === 'all' ? prompts : prompts.filter((p) => p.category === cat)
  const tabs: { id: PromptCategory | 'all'; label: string }[] = [{ id: 'all', label: tr('Баары', 'Все') }, ...promptCategories]

  // /prompts#id менен келсе — ошол промптко түшүрөбүз
  useEffect(() => {
    const id = location.hash.slice(1)
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }))
  }, [])

  return (
    <main className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 md:pt-16">
      <PageHead kicker={tr('Көчүр да, кой', 'Скопируй и вставь')} title={tr('Промпттор', 'Промпты')}>
        <p>{tr("Рилстерде айткан промпттордун баары ушул жерде. «Көчүрүү» бас, ChatGPT же Claude'га кой. Кашаанын ичин [мындай] өзүңө алмаштыр.", 'Все промпты из рилсов — здесь. Нажми «Копировать» и вставь в ChatGPT или Claude. Текст в скобках [вот такой] замени на свой.')}</p>
      </PageHead>

      <div role="tablist" aria-label={tr('Категориялар', 'Категории')} className="no-scrollbar -mx-4 mt-8 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 rounded-full bg-bg-soft p-1">
          {tabs.map((t) => {
            const n = t.id === 'all' ? prompts.length : prompts.filter((p) => p.category === t.id).length
            const on = cat === t.id
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => setCat(t.id)}
                className={`min-h-10 shrink-0 rounded-full px-4 text-[14px] font-medium transition-colors ${
                  on ? 'bg-surface text-ink shadow-sm ring-1 ring-line' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {t.label} <span className="opacity-50">{n}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        {list.map((p) => (
          <PromptCard key={p.id} prompt={p} showGuide />
        ))}
      </div>
    </main>
  )
}

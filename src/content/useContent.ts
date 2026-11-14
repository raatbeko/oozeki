import { useLang } from '../i18n'
import { guides, topics } from './guides'
import { guidesRu, topicsRu } from './guides.ru'
import { prompts, promptCategories } from './prompts'
import { promptsRu, promptCategoriesRu } from './prompts.ru'
import { abilities, cautions } from './abilities'
import { abilitiesRu, cautionsRu } from './abilities.ru'
import { glossary } from './glossary'
import { glossaryRu } from './glossary.ru'
import { soon } from './soon'
import { soonRu } from './soon.ru'

/** Тилге жараша контент: кыргызча же орусча */
export function useContent() {
  const { lang } = useLang()
  const ru = lang === 'ru'
  const g = ru ? guidesRu : guides
  const p = ru ? promptsRu : prompts
  return {
    lang,
    guides: g,
    topics: ru ? topicsRu : topics,
    guideBySlug: (slug: string) => g.find((x) => x.slug === slug),
    prompts: p,
    promptCategories: ru ? promptCategoriesRu : promptCategories,
    promptById: (id: string) => p.find((x) => x.id === id),
    abilities: ru ? abilitiesRu : abilities,
    cautions: ru ? cautionsRu : cautions,
    glossary: ru ? glossaryRu : glossary,
    soon: ru ? soonRu : soon,
  }
}

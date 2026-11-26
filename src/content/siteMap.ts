// Сайттын картасы — чат-жардамчы үчүн (сервердеги /api/chat колдонот).
// Контент ошол эле файлдардан алынат: жаңы гайд же промпт кошулса, жардамчы автомат билет.
import { guides, topics } from './guides'
import { guidesRu, topicsRu } from './guides.ru'
import { prompts, promptCategories } from './prompts'
import { promptsRu, promptCategoriesRu } from './prompts.ru'
import { abilities } from './abilities'
import { abilitiesRu } from './abilities.ru'
import { glossary } from './glossary'
import { glossaryRu } from './glossary.ru'
import { soon } from './soon'
import { soonRu } from './soon.ru'
import { site } from './site'

export type ChatLang = 'ky' | 'ru'

export function buildSiteMap(lang: ChatLang): string {
  const ru = lang === 'ru'
  const g = ru ? guidesRu : guides
  const t = ru ? topicsRu : topics
  const p = ru ? promptsRu : prompts
  const cats = ru ? promptCategoriesRu : promptCategories
  const ab = ru ? abilitiesRu : abilities
  const gl = ru ? glossaryRu : glossary
  const sn = ru ? soonRu : soon
  const L: string[] = []

  L.push(`# ${ru ? 'Карта сайта oozeki.app' : 'oozeki.app сайтынын картасы'}`)
  L.push('')
  L.push('## Разделы / Бөлүмдөр')
  L.push(`- ${ru ? 'Главная' : 'Башкы бет'} — /`)
  L.push(`- ${ru ? 'С чего начать (порядок + частые вопросы)' : 'Баштоо (ирет + көп берилген суроолор)'} — /start`)
  L.push(`- ${ru ? 'Что умеет ИИ (10 возможностей, у каждой «Как сделать» и промпт)' : 'ЖИ эмне кыла алат (10 мүмкүнчүлүк, ар биринде «Кантип жасайт» жана промпт)'} — /ji`)
  L.push(`- ${ru ? 'Гайды' : 'Гайддар'} — /guides`)
  L.push(`- ${ru ? 'Промпты (кнопка «Копировать»)' : 'Промпттор («Көчүрүү» баскычы)'} — /prompts`)
  L.push(`- ${ru ? 'Словарь ИИ (с поиском)' : 'Сөздүк (издөө менен)'} — /sozduk`)
  L.push(`- ${ru ? 'Консультация (показываю и объясняю на своём экране)' : 'Консультация (экранымда көрсөтүп, түшүндүрөм)'} — /konsultaciya`)
  L.push(`- ${ru ? 'Reels Template — бесплатный проект: Claude Code монтирует видео в выбранном стиле (49 шаблонов, архив 1,2 ГБ, /setup)' : 'Reels Template — бекер проект: Claude Code видеону тандалган стилде монтаждайт (49 шаблон, архив 1,2 ГБ, /setup)'} — /reels-template`)
  L.push('')

  L.push(`## ${ru ? 'Гайды' : 'Гайддар'}`)
  for (const guide of g) {
    L.push(`### ${guide.title} — /guides/${guide.slug}`)
    L.push(`${t[guide.topic].label}. ${guide.short} (${guide.time}). ${ru ? 'Нужно' : 'Керек'}: ${guide.need.join(', ') || '—'}`)
    guide.steps.forEach((s, i) => {
      const extra = [s.body.join(' '), s.list?.join('; '), s.tip ? `${ru ? 'Совет' : 'Кеңеш'}: ${s.tip}` : '']
        .filter(Boolean)
        .join(' ')
      L.push(`- ${i + 1}. ${s.title} — /guides/${guide.slug}#shag-${i + 1}${s.prompt ? ` (${ru ? 'промпт' : 'промпт'}: /prompts#${s.prompt})` : ''}: ${extra}`)
    })
    L.push('')
  }

  L.push(`## ${ru ? 'Промпты' : 'Промпттор'}`)
  for (const c of cats) {
    L.push(`### ${c.label}`)
    for (const pr of p.filter((x) => x.category === c.id)) {
      L.push(`- ${pr.title} — /prompts#${pr.id} (${pr.where})${pr.note ? `: ${pr.note}` : ''}`)
    }
  }
  L.push('')

  L.push(`## ${ru ? 'Что умеет ИИ' : 'ЖИ эмне кыла алат'}`)
  for (const a of ab) {
    L.push(`- ${a.title} — /ji#${a.id} (${a.tools}): ${a.text}${a.guide ? ` ${ru ? 'Гайд' : 'Гайд'}: /guides/${a.guide}` : ''}`)
  }
  L.push('')

  L.push(`## ${ru ? 'Словарь' : 'Сөздүк'} — /sozduk`)
  for (const term of gl) L.push(`- ${term.term}${term.alt ? ` (${term.alt})` : ''}: ${term.text}`)
  L.push('')

  L.push(`## ${ru ? 'Скоро (ещё не вышло)' : 'Жакында (азырынча чыга элек)'}`)
  for (const s of sn) L.push(`- ${s.title}: ${s.text}`)
  L.push('')

  L.push(`## ${ru ? 'Контакты автора (Раатбек)' : 'Автордун байланышы (Раатбек)'}`)
  L.push(`- Instagram: ${site.instagram}`)
  L.push(`- Telegram: ${site.telegram}`)
  L.push(`- WhatsApp: ${site.whatsapp}`)
  L.push(`- ${ru ? 'Телефон' : 'Телефон'}: ${site.phone}`)
  return L.join('\n')
}

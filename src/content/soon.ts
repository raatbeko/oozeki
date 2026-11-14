import type { Topic } from './guides'

export interface SoonItem {
  title: string
  text: string
  topic: Topic
  /** Мукаба (кагаз-оригами стилинде), жок болсо — бош фон */
  cover?: string
}

/** Жакында чыга турган гайддар (05 Идеи.md планынан) */
export const soon: SoonItem[] = [
  {
    title: 'Codex же Claude Code?',
    text: 'Экөө тең компьютерде өзү иштейт. Код жана монтаж үчүн кайсынысы ыңгайлуу — салыштырып көрсөтөм.',
    topic: 'vs',
    cover: '/covers/soon-1.webp',
  },
  {
    title: 'Өз каарманың менен мультик',
    text: 'Сүрөт тартканды билбесең да. Генерациясыз, код менен — каарман ар бир жолу бирдей чыгат.',
    topic: 'montaj',
    cover: '/covers/soon-2.webp',
  },
  {
    title: 'Claude менен узун видео',
    text: 'YouTube үчүн 10–20 мүнөттүк видео: сценарийден монтажга чейин.',
    topic: 'montaj',
    cover: '/covers/soon-3.webp',
  },
  {
    title: 'Скиллдер жана коннекторлор',
    text: 'Claude\'га жаңы көндүм үйрөтүү жана Google Drive, почта, таблицага подключить кылуу.',
    topic: 'claude',
  },
  {
    title: 'Claude сен үчүн кыла турган 5 иш',
    text: 'Күн сайын убакыт үнөмдөй турган беш жөнөкөй мисал.',
    topic: 'claude',
  },
  {
    title: 'Claude Code — программист эмес адамга',
    text: 'Чат код берет, Claude Code өзү жасайт. Турмуштан мисал жана кантип баштоо керек.',
    topic: 'claude',
  },
]

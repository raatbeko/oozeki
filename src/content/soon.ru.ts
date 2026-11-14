import type { SoonItem } from './soon'

/** Гайды, которые скоро выйдут */
export const soonRu: SoonItem[] = [
  {
    title: 'Codex или Claude Code?',
    text: 'Оба сами работают на компьютере. Сравню и покажу, какой удобнее для кода и монтажа.',
    topic: 'vs',
    cover: '/covers/soon-1.webp',
  },
  {
    title: 'Мультик со своим персонажем',
    text: 'Даже если не умеешь рисовать. Без генерации, кодом — персонаж каждый раз выходит одинаковым.',
    topic: 'montaj',
    cover: '/covers/soon-2.webp',
  },
  {
    title: 'Длинное видео с Claude',
    text: 'Видео на 10–20 минут для YouTube: от сценария до монтажа.',
    topic: 'montaj',
    cover: '/covers/soon-3.webp',
  },
  {
    title: 'Скиллы и коннекторы',
    text: 'Как научить Claude новому навыку и подключить его к Google Drive, почте, таблицам.',
    topic: 'claude',
  },
  {
    title: '5 дел, которые Claude сделает за тебя',
    text: 'Пять простых примеров, которые каждый день экономят время.',
    topic: 'claude',
  },
  {
    title: 'Claude Code — для тех, кто не программист',
    text: 'Чат даёт код, а Claude Code делает сам. Пример из жизни и как начать.',
    topic: 'claude',
  },
]

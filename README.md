# ИИ кыргызча (oozeki.app)

Образовательный сайт канала [@theratbeko](https://www.instagram.com/theratbeko/): что умеет ИИ, Claude,
Claude vs ChatGPT, монтаж видео через ИИ дома. Язык — кыргызский, разговорный. Дизайн — как у прежнего
«Оозеки»: палитра «кийиз», PT Serif, терракота, түндүк, орнамент, светлая и тёмная тема.

Раньше здесь был тренажёр речи «Оозеки» — он остался в истории git (коммит `3b18661` и раньше).

## Страницы

| Путь | Что |
|---|---|
| `/` | Главная: что умеет ИИ, гайды, промпты, об авторе |
| `/start` | «Эмнеден баштайм»: порядок прохождения и FAQ |
| `/ji` | «ЖИ эмне кыла алат»: возможности ИИ с промптами, генерация vs код, где быть осторожным |
| `/guides`, `/guides/<slug>` | Гайды по шагам со скриншотами и промптами |
| `/prompts` | Все промпты с кнопкой «Көчүрүү», фильтр по категориям |

## Где менять контент

- Возможности ИИ — `src/content/abilities.ts`.
- Гайды — `src/content/guides.ts` (шаги, скриншоты, привязка промпта по `id`).
- Промпты — `src/content/prompts.ts`.
- Ссылки (Instagram, Telegram) — `src/content/site.ts`.
- Скриншоты — `public/shots/*.webp` (кадры доски из рендеров 013/014, 1080×1050).

## Стек

React 19 + TypeScript + Vite, Tailwind CSS v4. Свой маленький роутер (`src/router.tsx`),
SPA-фолбэк для Vercel — `vercel.json`. Шрифты: PT Serif + Inter (кыргызские ң ө ү есть).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Если после `npm install` dev/build падает «Cannot find native binding»:
`npm install --no-save @rolldown/binding-win32-x64-msvc @oxlint/binding-win32-x64-msvc`.

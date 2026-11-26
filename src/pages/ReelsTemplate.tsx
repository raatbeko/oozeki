import { Link, useTitle } from '../router'
import { BackButton } from '../components/BackButton'
import { PageHead } from '../components/Layout'
import { useLang, useTr } from '../i18n'

export const REELS_TEMPLATE_URL = 'https://drive.google.com/file/d/1B9qBM4mlJBYkguNXQGwlNW9JadogOxHc/view?usp=drive_link'
const v = (name: string) => `/reels-template/${name}`

const demos = [
  ['warm-yellow', 'Warm Yellow'],
  ['neon-halftone', 'Neon Halftone'],
  ['cinema-serif', 'Cinema Serif'],
  ['before-after', 'Before / After'],
  ['keyword-pop', 'Keyword Pop'],
  ['typewriter', 'Typewriter'],
  ['glitch', 'Glitch'],
  ['camcorder', 'Camcorder REC'],
] as const

const inside = [
  { icon: '🎞️', title: '49 шаблон', text: 'Ар бир стилдин менин видеомдо жасалган демосу бар. Көрүп, жаккандын тандайсың.' },
  { icon: '🧰', title: 'Node, Python, FFmpeg', text: 'Баары папканын ичинде. Системага эч нерсе орнотулбайт.' },
  { icon: '🗣️', title: 'Кыргызча сөз', text: 'Кыргызча сөздү текстке айлантуучу модель — субтитрлер өзү чыгат.' },
  { icon: '✂️', title: 'Артындагы текст', text: 'Адамды бөлүп алуучу модель: жазуу адамдын артында тургандай көрүнөт.' },
]
const insideRu = [
  { icon: '🎞️', title: '49 шаблонов', text: 'У каждого стиля есть демо на моём видео. Смотришь и выбираешь, что нравится.' },
  { icon: '🧰', title: 'Node, Python, FFmpeg', text: 'Всё внутри папки. В систему ничего не ставится.' },
  { icon: '🗣️', title: 'Кыргызская речь', text: 'Модель, которая переводит кыргызскую речь в текст, — субтитры появляются сами.' },
  { icon: '✂️', title: 'Текст за спиной', text: 'Модель, которая отделяет человека: надпись выглядит так, будто стоит за ним.' },
]

type Step = { title: string; text: string; shot?: { src: string; alt: string } }
const steps: Step[] = [
  { title: 'Жүктөп ал', text: 'Архивди жүктөп, чыгарып ал. Көлөмү 1,2 ГБ.' },
  { title: "Claude Code'до ач", text: 'Claude Desktop программасында Code бөлүмүнө өтүп, ReelsTemplate-full папкасын ач.' },
  { title: '/setup деп жаз', text: 'Чатка /setup деп жаз. Claude баарын өзү орнотот, 2–5 мүнөт алат.' },
  {
    title: 'Стилди танда',
    text: 'Студия барагында жаккан стилди танда, «Копировать для Claude» баскычын басып, чатка кой.',
    shot: { src: v('studio.webp'), alt: 'Студия барагы: 49 шаблон' },
  },
  {
    title: 'Видеоңду жөнөт',
    text: 'Керек болсо разбор барагында стилди өзүңө ылайыкта. Анан видеолоруңду жөнөт — Claude ошол стилде монтаждап берет.',
    shot: { src: v('review.webp'), alt: 'Стилдин разбор барагы' },
  },
]
const stepsRu: Step[] = [
  { title: 'Скачай', text: 'Скачай архив и распакуй. Вес — 1,2 ГБ.' },
  { title: 'Открой в Claude Code', text: 'В программе Claude Desktop перейди на вкладку Code и открой папку ReelsTemplate-full.' },
  { title: 'Напиши /setup', text: 'Напиши в чат /setup. Claude сам всё установит, это займёт 2–5 минут.' },
  {
    title: 'Выбери стиль',
    text: 'На странице студии выбери стиль, нажми «Копировать для Claude» и вставь в чат.',
    shot: { src: v('studio.webp'), alt: 'Страница студии: 49 шаблонов' },
  },
  {
    title: 'Отправь видео',
    text: 'Если нужно, подстрой стиль на странице разбора. Потом отправь свои видео — Claude смонтирует их в этом стиле.',
    shot: { src: v('review.webp'), alt: 'Страница разбора стиля' },
  },
]

function DownloadButton() {
  const tr = useTr()
  return (
    <a
      href={REELS_TEMPLATE_URL}
      target="_blank"
      rel="noopener"
      className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-7 text-[16px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(194,69,47,.6)] transition hover:brightness-110"
    >
      {tr('Бекер жүктөп алуу', 'Скачать бесплатно')}
      <span className="text-[14px] font-normal opacity-85">· 1,2 ГБ</span>
    </a>
  )
}

export function ReelsTemplate() {
  const tr = useTr()
  const { lang } = useLang()
  const items = lang === 'ru' ? insideRu : inside
  const flow = lang === 'ru' ? stepsRu : steps
  useTitle('Reels Template')
  return (
    <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 md:pt-10">
      <BackButton fallback="/" />
      <div className="grid items-center gap-10 md:grid-cols-[1fr_300px]">
        <div>
          <PageHead kicker={tr('Бекер проект', 'Бесплатный проект')} title="Reels Template">
            <p>
              {tr(
                'Claude Code видеоңду сен тандаган стилде монтаждап берет. Бул — өзүм колдонгон проект, бекер бөлүшөм.',
                'Claude Code монтирует твоё видео в выбранном стиле. Это проект, которым пользуюсь сам, — делюсь бесплатно.',
              )}
            </p>
          </PageHead>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <DownloadButton />
            <a href="#kantip" className="inline-flex min-h-12 items-center rounded-full border border-line bg-surface px-6 font-semibold hover:border-accent/50">
              {tr('Кантип колдонуу', 'Как пользоваться')}
            </a>
          </div>
          <p className="mt-4 text-[15px] text-ink-muted">
            {tr('Керек: ноутбук жана Claude подпискасы.', 'Нужно: ноутбук и подписка Claude.')}
          </p>
        </div>
        <video
          src={v('promo.mp4')}
          poster={v('promo.webp')}
          controls
          playsInline
          preload="none"
          className="mx-auto aspect-[9/16] w-full max-w-[300px] rounded-3xl border border-line bg-black object-cover shadow-lg"
          aria-label={tr('Reels Template жөнүндө кыска видео', 'Короткое видео о Reels Template')}
        />
      </div>

      <section className="mt-20" aria-labelledby="ichinde">
        <h2 id="ichinde" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {tr('Ичинде эмне бар', 'Что внутри')}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((s) => (
            <article key={s.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-bg-soft text-2xl" aria-hidden="true">
                {s.icon}
              </span>
              <div>
                <h3 className="font-serif text-[20px] leading-snug font-bold">{s.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-muted">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20" aria-labelledby="misal">
        <h2 id="misal" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {tr('Шаблондордон мисал', 'Примеры шаблонов')}
        </h2>
        <p className="mt-3 text-[16px] text-ink-muted">{tr('49дун 8и. Калганы архивдин ичинде.', '8 из 49. Остальные — в архиве.')}</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {demos.map(([id, name]) => (
            <figure key={id}>
              <video
                src={v(`${id}.mp4`)}
                poster={v(`${id}.webp`)}
                autoPlay
                muted
                loop
                playsInline
                className="aspect-[9/16] w-full rounded-2xl border border-line bg-black object-cover"
                aria-label={name}
              />
              <figcaption className="mt-2 text-[14px] font-semibold">{name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="kantip" className="mt-20 scroll-mt-24" aria-labelledby="kantip-h">
        <h2 id="kantip-h" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {tr('Кантип колдонуу', 'Как пользоваться')}
        </h2>
        <ol className="mt-8 grid gap-4">
          {flow.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <div className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent font-serif text-lg font-bold text-white">{i + 1}</span>
                <div>
                  <p className="font-serif text-[20px] font-bold">{s.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-muted">{s.text}</p>
                </div>
              </div>
              {s.shot && (
                <img
                  src={s.shot.src}
                  alt={s.shot.alt}
                  loading="lazy"
                  decoding="async"
                  className="mt-5 max-h-[560px] w-full rounded-xl border border-line object-cover object-top"
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 rounded-3xl border border-line bg-surface p-6 text-center sm:p-12" aria-labelledby="baslap">
        <h2 id="baslap" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {tr('Байкап көр', 'Попробуй')}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-ink-muted">
          {tr(
            'Суроо болсо жаз. Claude менен монтаж тууралуу толугураак — гайдда.',
            'Если есть вопросы — пиши. Подробнее про монтаж с Claude — в гайде.',
          )}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <DownloadButton />
          <Link href="/guides/claude-montaj" className="inline-flex min-h-12 items-center rounded-full border border-line bg-surface px-6 font-semibold hover:border-accent/50">
            {tr('Монтаж гайды', 'Гайд по монтажу')}
          </Link>
        </div>
      </section>
    </main>
  )
}

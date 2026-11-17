import { Link, useTitle } from '../router'
import { BackButton } from '../components/BackButton'
import { PageHead } from '../components/Layout'
import { useLang, useTr } from '../i18n'

const path = [
  {
    title: 'ЖИ эмне кыла алат',
    text: 'Текст, котормо, документ, сүрөт, сайт, монтаж — азыр чындап иштеген нерселер жана даяр промпттор.',
    href: '/ji',
  },
  {
    title: 'ChatGPT же Claude?',
    text: 'Экөөнүн айырмасы. Кайсынысы сага керек — 3 мүнөттө түшүнөсүң.',
    href: '/guides/chatgpt-vs-claude',
  },
  {
    title: "Claude'ду жаңы баштасаң — 8 шаг",
    text: 'Регистрация, Chat жана Code, модель, настройка, проект, стиль, коннектор, артефакт.',
    href: '/guides/claude-8-shag',
  },
  {
    title: 'Күнүмдүк промпттор',
    text: 'Пост, котормо, документ, план. Көчүрүп, ошол замат колдон.',
    href: '/prompts',
  },
  {
    title: 'Claude менен монтаж',
    text: 'Кааласаң — кийинки кадам. Бир промпт менен баары орнотулат, анан Claude видеоңду монтаждайт.',
    href: '/guides/claude-montaj',
  },
]

const faq = [
  {
    q: 'Бекер колдонсо болобу?',
    a: 'ChatGPT менен Claude\'дун бекер версиясы бар — баштоого жетет. Claude Code жана монтаж үчүн Claude Pro керек: айына 20$, болжол менен 1 700 сом (14.11.2026 текшерилди).',
  },
  {
    q: 'Программист болуш керекпи?',
    a: 'Жок. Сен жөн эле сөз менен айтасың, ЖИ өзү жазат, өзү жасайт. Бир гана шарт: эмне каалаганыңды так айта билиш керек.',
  },
  {
    q: 'Кыргызча түшүнөбү?',
    a: 'ChatGPT да, Claude да кыргызча түшүнөт жана жазат, бирок кээде ката кетирет. Маанилүү текстти өзүң окуп чык.',
  },
  {
    q: 'Кандай компьютер керек?',
    a: 'Чат үчүн телефон же каалаган браузер жетет. Claude Desktop программасы Windows жана Mac\'та иштейт.',
  },
  {
    q: 'ЖИ жумушумду тартып алабы?',
    a: 'ЖИ өзү эч кимдин ордун ээлебейт, ал болгону курал. Бирок ЖИни колдонгон адам колдонбогон адамдын ордун ээлейт. Коркуш керек болгон нерсе — ЖИни үйрөнбөй калуу.',
  },
]

const pathRu = [
  { title: 'Что умеет ИИ', text: 'Тексты, перевод, документы, картинки, сайты, монтаж — что реально работает уже сейчас, и готовые промпты.', href: '/ji' },
  { title: 'ChatGPT или Claude?', text: 'В чём разница и что нужно именно тебе — поймёшь за 3 минуты.', href: '/guides/chatgpt-vs-claude' },
  { title: 'Если только начинаешь с Claude — 8 шагов', text: 'Регистрация, Chat и Code, модель, настройки, проекты, стиль, коннекторы, артефакты.', href: '/guides/claude-8-shag' },
  { title: 'Повседневные промпты', text: 'Пост, перевод, документ, план. Копируй и сразу пользуйся.', href: '/prompts' },
  { title: 'Монтаж с Claude', text: 'Следующий шаг, если хочешь. Один промпт — всё установится, а дальше Claude монтирует твоё видео.', href: '/guides/claude-montaj' },
]

const faqRu = [
  { q: 'Можно пользоваться бесплатно?', a: 'У ChatGPT и Claude есть бесплатные версии — для начала хватит. Для Claude Code и монтажа нужен Claude Pro: 20$ в месяц, примерно 1 700 сом (проверено 14.11.2026).' },
  { q: 'Нужно быть программистом?', a: 'Нет. Ты просто говоришь словами, ИИ сам пишет и делает. Одно условие: нужно уметь точно сказать, чего ты хочешь.' },
  { q: 'ИИ понимает кыргызский?', a: 'И ChatGPT, и Claude понимают и пишут по-кыргызски, но иногда ошибаются. Важные тексты перечитывай сам.' },
  { q: 'Какой нужен компьютер?', a: 'Для чата хватит телефона или любого браузера. Программа Claude Desktop работает на Windows и Mac.' },
  { q: 'ИИ заберёт мою работу?', a: 'ИИ сам по себе никого не заменит — это просто инструмент. Но человек, который пользуется ИИ, займёт место того, кто не пользуется. Бояться стоит другого — не освоить ИИ.' },
]

export function Start() {
  const tr = useTr()
  const { lang } = useLang()
  const steps = lang === 'ru' ? pathRu : path
  const questions = lang === 'ru' ? faqRu : faq
  useTitle(tr('Эмнеден баштайм', 'С чего начать'))
  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 md:pt-10">
      <BackButton fallback="/" />
      <PageHead kicker={tr('Жаңы баштасаң', 'Если только начинаешь')} title={tr('Эмнеден баштайм?', 'С чего начать?')}>
        <p>{tr('Ушул ирет менен өт. Ар бир шаг бир кечте бүтөт.', 'Проходи по порядку. Каждый шаг — на один вечер.')}</p>
      </PageHead>

      <ol className="relative mt-10 grid gap-3 before:absolute before:top-8 before:bottom-8 before:left-[27px] before:w-px before:bg-line">
        {steps.map((p, i) => (
          <li key={p.title} className="relative">
            <Link
              href={p.href}
              className="group flex gap-4 rounded-2xl border border-line bg-surface p-4 pr-5 transition-colors hover:border-accent/40 sm:p-5"
            >
              <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-accent font-serif text-lg font-bold text-white sm:size-11">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-[20px] leading-snug font-bold">{p.title}</span>
                <span className="mt-1 block text-[15px] leading-relaxed text-ink-muted">{p.text}</span>
              </span>
              <span className="self-center text-xl text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <section className="mt-20" aria-labelledby="faq">
        <h2 id="faq" className="font-serif text-3xl font-bold tracking-tight">
          {tr('Көп берилген суроолор', 'Частые вопросы')}
        </h2>
        <div className="mt-6 grid gap-3">
          {questions.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-surface">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-serif text-[18px] font-bold">
                {f.q}
                <span className="text-2xl leading-none text-accent transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-[16px] leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}

import { Link, useTitle } from '../router'
import { PageHead } from '../components/Layout'

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

export function Start() {
  useTitle('Эмнеден баштайм')
  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 md:pt-16">
      <PageHead kicker="Жаңы баштасаң" title="Эмнеден баштайм?">
        <p>Ушул ирет менен өт. Ар бир шаг бир кечте бүтөт.</p>
      </PageHead>

      <ol className="relative mt-10 grid gap-3 before:absolute before:top-8 before:bottom-8 before:left-[27px] before:w-px before:bg-line">
        {path.map((p, i) => (
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
          Көп берилген суроолор
        </h2>
        <div className="mt-6 grid gap-3">
          {faq.map((f) => (
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

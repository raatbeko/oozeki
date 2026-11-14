import { Link, useTitle } from '../router'
import { PageHead } from '../components/Layout'
import { InstagramIcon, TelegramIcon } from '../components/Logos'
import { site } from '../content/site'

const services = [
  {
    icon: '🎬',
    title: 'ИИ менен монтажды орнотуп берем',
    text: 'Сенин компьютериңде Claude Code, Remotion, FFmpeg жана Whisper\'ди орнотобуз, стилиңди жазабыз. Биринчи видеоңду чогуу монтаждайбыз.',
    link: { href: '/guides/claude-montaj', label: 'Гайд менен өзүң да кылсаң болот' },
  },
  {
    icon: '🧭',
    title: 'Claude\'ду сенин ишиңе ылайыктайм',
    text: 'Проект, инструкция, стиль, коннекторлор — сенин ишиңе жараша. Кайсы жерде ЖИ чындап убакыт үнөмдөй турганын табабыз.',
    link: { href: '/guides/claude-8-shag', label: '8 шаг гайды' },
  },
  {
    icon: '📊',
    title: 'Бизнес үчүн «ИИ-отдел»',
    text: 'Маркетплейс же дүкөн үчүн: күнүмдүк отчёт, товардын калдыгы, реклама, Telegram\'га билдирүү. Адегенде эмне керек экенин тактайбыз, анан гана курабыз.',
    link: { href: '/prompts#biznes-wb', label: 'Промптту көрүү' },
  },
  {
    icon: '💬',
    title: 'Дүкөнгө WhatsApp-бот',
    text: 'Кардарлардын суроосуна жооп берет, бааны сенин таблицаңдан алат. Билбеген нерсени ойлоп таппайт — сага өткөрүп берет.',
  },
]

const steps = [
  { title: 'Жазасың', text: 'Эмне кылгың келет, азыр эмнеге көп убакыт кетет — эки-үч сүйлөм жетет.' },
  { title: 'Тактайбыз', text: 'Чогуу эмне кылаарыбызды, канча убакыт кетерин жана баасын айтам.' },
  { title: 'Кылабыз', text: 'Сенин компьютериңде, сенин маалыматың менен. Ар бир кадамды түшүндүрөм.' },
  { title: 'Текшеребиз', text: 'Иштеп калганын көрөбүз. Андан кийин өзүң колдоно аласың.' },
]

export function Konsultaciya() {
  useTitle('Консультация')
  const dm = `https://ig.me/m/${site.handle}`
  return (
    <main className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 md:pt-16">
      <PageHead kicker="Жеке жардам" title="Консультация">
        <p>
          Гайддар жетпесе — чогуу кылабыз. ЖИни мен «кеңседеги жаңы кызматкер» катары карайм: ага туура тапшырма берип, керектүү папка
          жана куралдарды берсең, ал сен үчүн иштейт. Ошону сенин ишиңе курабыз.
        </p>
      </PageHead>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <article key={s.title} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
            <span className="grid size-12 place-items-center rounded-xl bg-bg-soft text-2xl" aria-hidden="true">
              {s.icon}
            </span>
            <h2 className="mt-4 font-serif text-[22px] leading-snug font-bold">{s.title}</h2>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">{s.text}</p>
            {s.link && (
              <Link href={s.link.href} className="mt-4 inline-flex min-h-10 items-center text-[14px] font-semibold text-accent hover:underline">
                {s.link.label} →
              </Link>
            )}
          </article>
        ))}
      </div>

      <section className="mt-20" aria-labelledby="how">
        <h2 id="how" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Кантип өтөт
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line bg-bg-soft p-5">
              <span className="grid size-10 place-items-center rounded-full bg-accent font-serif text-lg font-bold text-white">{i + 1}</span>
              <p className="mt-4 font-serif text-xl font-bold">{s.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 rounded-3xl border border-line bg-surface p-6 text-center sm:p-12" aria-labelledby="write">
        <h2 id="write" className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Жаз — сүйлөшөбүз
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-ink-muted">
          Эмне керек экенин кыскача жаз. Баасын жана убактысын жазышканда айтам.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={dm}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-accent px-6 font-semibold text-white transition hover:brightness-110"
          >
            <InstagramIcon /> Директке жазуу
          </a>
          {site.telegram && (
            <a
              href={site.telegram}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-line bg-surface px-6 font-semibold hover:border-accent/50"
            >
              <TelegramIcon /> Telegram
            </a>
          )}
        </div>
      </section>
    </main>
  )
}

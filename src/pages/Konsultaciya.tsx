import { Link, useTitle } from '../router'
import { BackButton } from '../components/BackButton'
import { PageHead } from '../components/Layout'
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from '../components/Logos'
import { site } from '../content/site'
import { useLang, useTr } from '../i18n'

const services = [
  {
    icon: '🖥️',
    title: 'Экранымда көрсөтөм',
    text: 'Claude, ChatGPT жана Claude Code кантип иштээрин жандуу көрсөтөм: кайда эмне басылат, эмне кыла алат, эмне кыла албайт.',
    link: { href: '/guides/claude-8-shag', label: '8 шаг гайды' },
  },
  {
    icon: '💬',
    title: 'Суроолоруңа жооп берем',
    text: 'Сенин ишиң, сенин суроолоруң. ЖИ сага кайда жардам бере алат, кайда жок — мисалдар менен чогуу карайбыз.',
  },
  {
    icon: '🎬',
    title: 'Монтажымды кантип кылам — көрсөтөм',
    text: 'ИИ менен монтаж процессимди башынан аягына көрсөтүп, түшүндүрөм. Кийин гайд менен өзүң кайталасаң болот.',
    link: { href: '/guides/claude-montaj', label: 'Монтаж гайды' },
  },
  {
    icon: '🗺️',
    title: 'Эмнеден баштоону тактайбыз',
    text: 'Сен эмне каалаганыңды түшүнүп, кийинки кадамдарды айтам: кайсы курал, кайсы гайд, кайсы промпт.',
    link: { href: '/start', label: 'Баштоо' },
  },
]

const steps = [
  { title: 'Жазасың', text: 'ЖИден эмне күтөсүң, эмнени түшүнгүң келет — эки-үч сүйлөм жетет.' },
  { title: 'Убакыт белгилейбиз', text: 'Ыңгайлуу убакытты жана баасын айтам.' },
  { title: 'Көрсөтөм', text: 'Экранымды көрсөтүп, мисалдар менен түшүндүрөм. Суроо бериш үчүн убакыт бар.' },
  { title: 'Кийинки кадам', text: 'Эмнеден баштоо керек экенин, кайсы гайд жана промпт жардам берерин айтам.' },
]

const servicesRu = [
  { icon: '🖥️', title: 'Показываю на своём экране', text: 'Вживую показываю, как работают Claude, ChatGPT и Claude Code: куда нажимать, что они умеют и чего не умеют.', link: { href: '/guides/claude-8-shag', label: 'Гайд «8 шагов»' } },
  { icon: '💬', title: 'Отвечаю на твои вопросы', text: 'Твоя работа, твои вопросы. Вместе на примерах разбираем, где ИИ тебе поможет, а где нет.' },
  { icon: '🎬', title: 'Показываю, как монтирую', text: 'Показываю и объясняю свой процесс монтажа с ИИ от начала до конца. Потом сможешь повторить сам по гайду.', link: { href: '/guides/claude-montaj', label: 'Гайд по монтажу' } },
  { icon: '🗺️', title: 'Решаем, с чего начать', text: 'Разбираюсь, что тебе нужно, и подсказываю следующие шаги: какой инструмент, какой гайд, какой промпт.', link: { href: '/start', label: 'С чего начать' } },
]

const stepsRu = [
  { title: 'Пишешь', text: 'Что ждёшь от ИИ, что хочешь понять — хватит двух-трёх предложений.' },
  { title: 'Назначаем время', text: 'Скажу удобное время и стоимость.' },
  { title: 'Показываю', text: 'Показываю свой экран и объясняю на примерах. Есть время на вопросы.' },
  { title: 'Следующий шаг', text: 'Подскажу, с чего начать и какие гайды и промпты помогут.' },
]

export function Konsultaciya() {
  const tr = useTr()
  const { lang } = useLang()
  const list = lang === 'ru' ? servicesRu : services
  const flow = lang === 'ru' ? stepsRu : steps
  useTitle('Консультация')
  const dm = `https://ig.me/m/${site.handle}`
  return (
    <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 md:pt-10">
      <BackButton fallback="/" />
      <PageHead kicker={tr('Жеке жардам', 'Личная помощь')} title="Консультация">
        <p>
          {tr(
            'Бул — көрсөтүп, түшүндүрүү. Claude деген эмне, ал кантип иштейт жана сенин ишиңе эмнеси жарашат — ошону чогуу карап, түшүнүп алабыз.',
            'Это показ и объяснение. Что такое Claude, как он работает и чем полезен именно тебе — разбираем вместе.',
          )}
        </p>
      </PageHead>

      <p className="mt-6 max-w-3xl rounded-2xl border-l-4 border-gold bg-bg-soft px-5 py-4 text-[15px] leading-relaxed">
        <span className="font-semibold">{tr('Ачык айтам', 'Честно')}: </span>
        {tr('бир консультацияда даяр бот, сайт же автоматташтыруу жасалбайт. Максат — ЖИни түшүнүү жана туура багытты табуу.', 'за одну консультацию не получится готовый бот, сайт или автоматизация. Цель — понять ИИ и найти правильное направление.')}
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {list.map((s) => (
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
          {tr('Кантип өтөт', 'Как это проходит')}
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flow.map((s, i) => (
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
          {tr('Жаз — сүйлөшөбүз', 'Напиши — поговорим')}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-ink-muted">
          {tr('Эмнени түшүнгүң келерин кыскача жаз. Баасын жана убактысын жазышканда айтам.', 'Коротко напиши, что хочешь понять. Стоимость и время скажу в переписке.')}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-accent px-6 font-semibold text-white transition hover:brightness-110"
          >
            <WhatsAppIcon /> WhatsApp
          </a>
          <a
            href={site.telegram}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-line bg-surface px-6 font-semibold hover:border-accent/50"
          >
            <TelegramIcon /> Telegram
          </a>
          <a
            href={dm}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-line bg-surface px-6 font-semibold hover:border-accent/50"
          >
            <InstagramIcon /> {tr('Директ', 'Директ')}
          </a>
        </div>
        <p className="mt-5 text-[15px] text-ink-muted">
          {tr('Же түз чал', 'Или просто позвони')}: <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="font-semibold text-ink hover:text-accent">{site.phone}</a>
        </p>
      </section>
    </main>
  )
}

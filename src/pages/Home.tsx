import { Link, useTitle } from '../router'
import { useContent } from '../content/useContent'
import { useTr } from '../i18n'
import { GuideCard } from '../components/GuideCard'
import { PromptCard } from '../components/Prompt'
import { ClaudeLogo, ChatGPTLogo } from '../components/Logos'
import { SocialButtons } from '../components/Layout'
import { Tunduk } from '../components/Tunduk'
import { HoloTunduk } from '../components/HoloTunduk'
import { AbilityCard } from './Ji'
import { SoonSection } from '../components/Soon'

function SectionHead({ kicker, title, href, more }: { kicker: string; title: string; href?: string; more?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-[13px] font-semibold tracking-[0.18em] text-accent uppercase">{kicker}</p>
        <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="min-h-11 content-center text-[15px] font-semibold text-accent hover:underline">
          {more} →
        </Link>
      )}
    </div>
  )
}

export function Home() {
  useTitle('')
  const tr = useTr()
  const { guides, abilities, promptById } = useContent()
  const featured = ['ji-post', 'claude-about', 'montaj-setup'].map((id) => promptById(id)!)
  const shown = abilities.filter((a) => ['tekst', 'dokument', 'suroot', 'sait', 'kompyuter', 'montaj'].includes(a.id))
  return (
    <>
      <section className="relative mx-auto max-w-4xl px-4 pt-14 pb-10 text-center sm:px-6 md:pt-24">
        <HoloTunduk className="absolute top-[-15px] left-1/2 -z-10 h-[80vw] w-[88vw] -translate-x-1/2 md:top-[-120px] md:h-[min(820px,105vw)] md:w-[min(1100px,140vw)]" />
        <Tunduk size={56} className="mx-auto text-accent" />
        <p className="mt-6 text-[13px] font-semibold tracking-[0.2em] text-ink-muted uppercase">{tr('кыргызча, жөнөкөй сөз менен', 'просто и понятно')}</p>
        <h1 className="mt-3 font-serif text-[clamp(2.6rem,8vw,5rem)] leading-[1.02] font-bold tracking-tight text-balance">
          {tr('Жасалма интеллект', 'Искусственный интеллект')} — <span className="text-accent italic">{tr('кыргызча', 'простыми словами')}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-ink-muted">
          {tr(
            'Жасалма интеллектти кантип колдонууну жөнөкөй тил менен түшүндүрөм. Кадам-кадам гайддар жана даяр промпттор — баары бекер.',
            'Объясняю простым языком, как пользоваться искусственным интеллектом. Пошаговые гайды и готовые промпты — всё бесплатно.',
          )}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/start"
            className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 text-[16px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(194,69,47,.6)] transition hover:brightness-110"
          >
            {tr('Баштоо', 'Начать')}
          </Link>
          <Link
            href="/ji"
            className="inline-flex min-h-12 items-center rounded-full border border-line bg-surface px-7 text-[16px] font-semibold transition-colors hover:border-accent/50"
          >
            {tr('ЖИ эмне кыла алат?', 'Что умеет ИИ?')}
          </Link>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3 text-[13px] text-ink-muted">
          <ChatGPTLogo size={26} />
          <ClaudeLogo size={26} />
          <span>ChatGPT · Claude · Claude Code · {tr('монтаж', 'монтаж')}</span>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <section className="pt-12 md:pt-20" aria-label={tr('ЖИ эмне кыла алат', 'Что умеет ИИ')}>
          <SectionHead kicker={tr('Мүмкүнчүлүктөр', 'Возможности')} title={tr('ЖИ азыр эмне кыла алат', 'Что ИИ умеет уже сейчас')} href="/ji" more={tr('Баары', 'Все')} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((a) => (
              <Link key={a.id} href={`/ji#${a.id}`} className="block transition-transform hover:-translate-y-0.5">
                <AbilityCard a={a} compact />
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-20 md:pt-28" aria-label={tr('Гайддар', 'Гайды')}>
          <SectionHead kicker={tr('Кадам-кадам', 'Шаг за шагом')} title={tr('Гайддар', 'Гайды')} href="/guides" more={tr('Бардык гайддар', 'Все гайды')} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {guides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </section>

        <section className="pt-20 md:pt-28" aria-label={tr('Жакында', 'Скоро')}>
          <SectionHead kicker={tr('Даярдалып жатат', 'В работе')} title={tr('Жакында', 'Скоро')} href="/guides#jakynda" more={tr('Баары', 'Все')} />
          <SoonSection limit={3} />
        </section>

        <section className="pt-20 md:pt-28" aria-label={tr('Промпттор', 'Промпты')}>
          <SectionHead kicker={tr('Көчүр да, кой', 'Скопируй и вставь')} title={tr('Даяр промпттор', 'Готовые промпты')} href="/prompts" more={tr('Бардык промпттор', 'Все промпты')} />
          <div className="mt-8 grid items-start gap-5 lg:grid-cols-2">
            <div className="grid gap-5">
              <PromptCard prompt={featured[0]} showGuide />
              <PromptCard prompt={featured[1]} showGuide />
            </div>
            <PromptCard prompt={featured[2]} showGuide />
          </div>
        </section>

        <section className="pt-20 md:pt-28" aria-label="Автор">
          <div className="grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[13px] font-semibold tracking-[0.18em] text-accent uppercase">Автор</p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight">{tr('Салам, мен Раатбек', 'Привет, я Раатбек')}</h2>
              <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
                {tr(
                  'Мен программистмин. Жасалма интеллектке кызыгам жана аны күн сайын жашоомдо колдоном. Максатым — муну кыргыз элине жеткирүү: кыргызча, жөнөкөй тил менен. Рилстерде кыскача, бул жерде толугу менен.',
                  'Я программист. Увлекаюсь искусственным интеллектом и использую его каждый день. Моя цель — донести это до кыргызстанцев простым языком. В рилсах коротко, здесь — подробно.',
                )}
              </p>
            </div>
            <div className="grid gap-3">
              <SocialButtons />
              <Link href="/konsultaciya" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-accent hover:underline">
                {tr('Жеке консультация', 'Личная консультация')} →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

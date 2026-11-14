import { Link, useTitle } from '../router'
import { guides } from '../content/guides'
import { abilities } from '../content/abilities'
import { promptById } from '../content/prompts'
import { GuideCard } from '../components/GuideCard'
import { PromptCard } from '../components/Prompt'
import { ClaudeLogo, ChatGPTLogo } from '../components/Logos'
import { SocialButtons } from '../components/Layout'
import { Tunduk } from '../components/Tunduk'
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
  const featured = ['ji-post', 'claude-about', 'montaj-setup'].map((id) => promptById(id)!)
  const shown = abilities.filter((a) => ['tekst', 'dokument', 'suroot', 'sait', 'kompyuter', 'montaj'].includes(a.id))
  return (
    <>
      <section className="relative mx-auto max-w-4xl px-4 pt-14 pb-10 text-center sm:px-6 md:pt-24">
        <Tunduk size={56} className="mx-auto text-accent" />
        <p className="mt-6 text-[13px] font-semibold tracking-[0.2em] text-ink-muted uppercase">кыргызча, жөнөкөй сөз менен</p>
        <h1 className="mt-3 font-serif text-[clamp(2.6rem,8vw,5rem)] leading-[1.02] font-bold tracking-tight text-balance">
          Жасалма интеллект — <span className="text-accent italic">кыргызча</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-ink-muted">
          ЖИ эмне кыла алат, Claude менен ChatGPT'тин айырмасы, үйдөн эле видео монтаж. Гайддар кадам-кадам, даяр промпттор жана
          скриншоттор — рилстерде көрсөткөндүн баары бир жерде.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/start"
            className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 text-[16px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(194,69,47,.6)] transition hover:brightness-110"
          >
            Баштоо
          </Link>
          <Link
            href="/ji"
            className="inline-flex min-h-12 items-center rounded-full border border-line bg-surface px-7 text-[16px] font-semibold transition-colors hover:border-accent/50"
          >
            ЖИ эмне кыла алат?
          </Link>
        </div>
        <div className="mt-8 flex items-center justify-center gap-3 text-[13px] text-ink-muted">
          <ChatGPTLogo size={26} />
          <ClaudeLogo size={26} />
          <span>ChatGPT · Claude · Claude Code · монтаж</span>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <section className="pt-12 md:pt-20" aria-label="ЖИ эмне кыла алат">
          <SectionHead kicker="Мүмкүнчүлүктөр" title="ЖИ азыр эмне кыла алат" href="/ji" more="Баары" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((a) => (
              <Link key={a.id} href={`/ji#${a.id}`} className="block transition-transform hover:-translate-y-0.5">
                <AbilityCard a={a} compact />
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-20 md:pt-28" aria-label="Гайддар">
          <SectionHead kicker="Кадам-кадам" title="Гайддар" href="/guides" more="Бардык гайддар" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {guides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </section>

        <section className="pt-20 md:pt-28" aria-label="Жакында">
          <SectionHead kicker="Даярдалып жатат" title="Жакында" href="/guides#jakynda" more="Баары" />
          <SoonSection limit={3} />
        </section>

        <section className="pt-20 md:pt-28" aria-label="Промпттор">
          <SectionHead kicker="Көчүр да, кой" title="Даяр промпттор" href="/prompts" more="Бардык промпттор" />
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
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight">Салам, мен Раатбек</h2>
              <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
                4 жыл программист болуп иштегем. Азыр ЖИ менен иштейм, видеолорумду да ЖИ менен монтаждайм — жана муну кыргызча,
                жөнөкөй сөз менен көрсөтөм. Рилстерде кыскача, бул жерде толугу менен.
              </p>
            </div>
            <div className="grid gap-3">
              <SocialButtons />
              <Link href="/konsultaciya" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-accent hover:underline">
                Жеке консультация →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

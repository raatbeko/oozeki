import type { ReactNode } from 'react'
import { Link } from '../router'
import { site } from '../content/site'
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from './Logos'
import { Tunduk } from './Tunduk'
import { useTheme } from '../theme'
import { useLang, useTr } from '../i18n'
import { MusicButton } from './Music'

export function useNav() {
  const tr = useTr()
  return [
    { href: '/start', label: tr('Баштоо', 'Начать') },
    { href: '/ji', label: tr('ЖИ эмне кылат', 'Что умеет ИИ') },
    { href: '/guides', label: tr('Гайддар', 'Гайды') },
    { href: '/prompts', label: tr('Промпттор', 'Промпты') },
    { href: '/sozduk', label: tr('Сөздүк', 'Словарь') },
  ]
}

function LangSwitch() {
  const { lang, setLang } = useLang()
  const btn = (l: 'ky' | 'ru', label: string) => (
    <button
      type="button"
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      className={`min-h-8 rounded-full px-2.5 text-[12.5px] font-semibold transition-colors ${
        lang === l ? 'bg-surface text-ink shadow-sm ring-1 ring-line' : 'text-ink-muted hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
  return (
    <div className="flex items-center rounded-full border border-line bg-bg-soft p-0.5" role="group" aria-label="Тил / Язык">
      {btn('ky', 'КР')}
      {btn('ru', 'РУ')}
    </div>
  )
}

const pill = (active: boolean) =>
  `inline-flex min-h-10 shrink-0 items-center rounded-full px-3.5 text-[14px] font-medium transition-colors ${
    active ? 'bg-surface text-ink shadow-sm ring-1 ring-line' : 'text-ink-muted hover:text-ink'
  }`

function ThemeButton() {
  const [theme, setTheme] = useTheme()
  const tr = useTr()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      aria-label={dark ? tr('Жарык тема', 'Светлая тема') : tr('Караңгы тема', 'Тёмная тема')}
      aria-pressed={dark}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="grid size-10 place-items-center rounded-full border border-line bg-bg-soft text-ink-muted transition-colors hover:text-ink"
    >
      {dark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2.5v2.4M12 19.1v2.4M4.4 4.4l1.7 1.7M17.9 17.9l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.4 19.6l1.7-1.7M17.9 6.1l1.7-1.7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 14.2A8 8 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

export function Header({ path }: { path: string }) {
  const tr = useTr()
  const nav = useNav()
  const konsult = { href: '/konsultaciya', label: tr('Консультация', 'Консультация') }
  const isActive = (href: string) => path === href || path.startsWith(href + '/')
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2.5" aria-label={tr('Башкы бет', 'Главная')}>
          <Tunduk size={30} className="text-accent" />
          <span className="hidden font-serif text-[22px] font-bold tracking-tight sm:inline">{tr('ИИ кыргызча', 'ИИ по-кыргызски')}</span>
        </Link>
        <nav aria-label={tr('Негизги меню', 'Главное меню')} className="ml-auto hidden items-center gap-1 rounded-full bg-bg-soft p-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? 'page' : undefined} className={pill(isActive(n.href))}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 lg:ml-2">
          <Link
            href="/konsultaciya"
            aria-current={isActive('/konsultaciya') ? 'page' : undefined}
            className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-accent px-3 text-[13px] font-semibold text-white transition hover:brightness-110 sm:px-4 sm:text-[14px]"
          >
            {konsult.label}
          </Link>
          <LangSwitch />
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            className="hidden size-10 place-items-center rounded-full border border-line bg-bg-soft text-ink-muted transition-colors hover:text-accent sm:grid"
          >
            <InstagramIcon size={17} />
          </a>
          <MusicButton />
          <ThemeButton />
        </div>
      </div>
      <nav aria-label={tr('Негизги меню', 'Главное меню')} className="no-scrollbar flex gap-0.5 overflow-x-auto px-2 pb-2 lg:hidden">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={isActive(n.href) ? 'page' : undefined}
            className={`${pill(isActive(n.href))} px-2! text-[13.5px]!`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export function SocialButtons() {
  const base = 'inline-flex min-h-12 items-center gap-2.5 rounded-full px-5 font-semibold transition-colors'
  const ghost = `${base} border border-line bg-surface hover:border-accent/50`
  return (
    <div className="flex flex-wrap gap-3">
      <a href={site.instagram} target="_blank" rel="noopener" className={`${base} bg-accent text-white hover:brightness-110`}>
        <InstagramIcon /> @{site.handle}
      </a>
      <a href={site.telegram} target="_blank" rel="noopener" className={ghost}>
        <TelegramIcon /> Telegram
      </a>
      <a href={site.whatsapp} target="_blank" rel="noopener" className={ghost}>
        <WhatsAppIcon /> WhatsApp
      </a>
    </div>
  )
}

export function Footer() {
  const tr = useTr()
  const nav = useNav()
  return (
    <footer className="relative mt-28 border-t border-line bg-bg-soft/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Tunduk size={34} className="text-accent" />
            <p className="font-serif text-3xl font-bold tracking-tight">{tr('ИИ кыргызча', 'ИИ по-кыргызски')}</p>
          </div>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-muted">
            {tr(
              "Жасалма интеллект эмне кыла алат жана аны кантип колдонуш керек — кыргызча, жөнөкөй сөз менен. Жаңы гайддар адегенде Instagram'да чыгат.",
              'Что умеет искусственный интеллект и как им пользоваться — простыми словами. Новые гайды сначала выходят в Instagram.',
            )}
          </p>
          <div className="mt-6">
            <SocialButtons />
          </div>
        </div>
        <div className="grid content-start gap-1 text-[15px]">
          {[{ href: '/', label: tr('Башкы бет', 'Главная') }, ...nav, { href: '/konsultaciya', label: 'Консультация' }].map((n) => (
            <Link key={n.href} href={n.href} className="min-h-10 content-center text-ink-muted hover:text-accent">
              {n.label}
            </Link>
          ))}
          <p className="mt-4 text-[13px] leading-relaxed text-ink-muted/80">
            {tr(
              `Баалар жана интерфейс ${site.checked} текшерилди. Claude жана ChatGPT тез жаңыланат — бир аз башкача болушу мүмкүн. Скриншоттор — орусча интерфейстин макети.`,
              `Цены и интерфейс проверены ${site.checked}. Claude и ChatGPT быстро обновляются — что-то может немного отличаться. Скриншоты — макет русского интерфейса.`,
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}

export function PageHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <header className="max-w-3xl">
      <p className="text-[13px] font-semibold tracking-[0.18em] text-accent uppercase">{kicker}</p>
      <h1 className="mt-3 font-serif text-[clamp(2.4rem,6vw,3.75rem)] leading-[1.05] font-bold tracking-tight text-balance">{title}</h1>
      {children && <div className="mt-4 text-[17px] leading-relaxed text-ink-muted">{children}</div>}
    </header>
  )
}

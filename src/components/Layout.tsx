import type { ReactNode } from 'react'
import { Link } from '../router'
import { site } from '../content/site'
import { InstagramIcon, TelegramIcon } from './Logos'
import { Tunduk } from './Tunduk'
import { useTheme } from '../theme'

export const nav = [
  { href: '/start', label: 'Баштоо' },
  { href: '/ji', label: 'ЖИ эмне кылат' },
  { href: '/guides', label: 'Гайддар' },
  { href: '/prompts', label: 'Промпттор' },
  { href: '/sozduk', label: 'Сөздүк' },
]

const pill = (active: boolean) =>
  `inline-flex min-h-10 shrink-0 items-center rounded-full px-3.5 text-[14px] font-medium transition-colors ${
    active ? 'bg-surface text-ink shadow-sm ring-1 ring-line' : 'text-ink-muted hover:text-ink'
  }`

function ThemeButton() {
  const [theme, setTheme] = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      aria-label={dark ? 'Жарык тема' : 'Караңгы тема'}
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
  const isActive = (href: string) => path === href || path.startsWith(href + '/')
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2.5" aria-label="Башкы бет">
          <Tunduk size={30} className="text-accent" />
          <span className="font-serif text-[22px] font-bold tracking-tight">ИИ кыргызча</span>
        </Link>
        <nav aria-label="Негизги меню" className="ml-auto hidden items-center gap-1 rounded-full bg-bg-soft p-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? 'page' : undefined} className={pill(isActive(n.href))}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <Link
            href="/konsultaciya"
            aria-current={isActive('/konsultaciya') ? 'page' : undefined}
            className="hidden min-h-10 items-center rounded-full bg-accent px-4 text-[14px] font-semibold text-white transition hover:brightness-110 sm:inline-flex"
          >
            Консультация
          </Link>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            className="grid size-10 place-items-center rounded-full border border-line bg-bg-soft text-ink-muted transition-colors hover:text-accent"
          >
            <InstagramIcon size={17} />
          </a>
          <ThemeButton />
        </div>
      </div>
      <nav aria-label="Негизги меню" className="no-scrollbar flex gap-0.5 overflow-x-auto px-2 pb-2 lg:hidden">
        {[...nav, { href: '/konsultaciya', label: 'Консультация' }].map((n) => (
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
  return (
    <div className="flex flex-wrap gap-3">
      <a href={site.instagram} target="_blank" rel="noopener" className={`${base} bg-accent text-white hover:brightness-110`}>
        <InstagramIcon /> @{site.handle}
      </a>
      {site.telegram ? (
        <a href={site.telegram} target="_blank" rel="noopener" className={`${base} border border-line bg-surface hover:border-accent/50`}>
          <TelegramIcon /> Telegram
        </a>
      ) : (
        <span className={`${base} cursor-default border border-dashed border-line text-ink-muted`} title="Шилтеме жакында">
          <TelegramIcon /> Telegram — жакында
        </span>
      )}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-28 border-t border-line bg-bg-soft/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Tunduk size={34} className="text-accent" />
            <p className="font-serif text-3xl font-bold tracking-tight">ИИ кыргызча</p>
          </div>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-muted">
            Жасалма интеллект эмне кыла алат жана аны кантип колдонуш керек — кыргызча, жөнөкөй сөз менен. Жаңы гайддар адегенде
            Instagram'да чыгат.
          </p>
          <div className="mt-6">
            <SocialButtons />
          </div>
        </div>
        <div className="grid content-start gap-1 text-[15px]">
          {[{ href: '/', label: 'Башкы бет' }, ...nav, { href: '/konsultaciya', label: 'Консультация' }].map((n) => (
            <Link key={n.href} href={n.href} className="min-h-10 content-center text-ink-muted hover:text-accent">
              {n.label}
            </Link>
          ))}
          <p className="mt-4 text-[13px] leading-relaxed text-ink-muted/80">
            Баалар жана интерфейс {site.checked} текшерилди. Claude жана ChatGPT тез жаңыланат — бир аз башкача болушу мүмкүн.
            Скриншоттор — орусча интерфейстин макети.
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

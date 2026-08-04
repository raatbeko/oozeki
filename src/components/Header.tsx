import { useT } from '../i18n';
import { Tunduk } from './Tunduk';

type HeaderProps = {
  onOpenAbout: () => void;
};

const chip =
  'border-line text-ink-muted hover:text-accent hover:border-accent/40 inline-flex items-center gap-1.5 rounded-full border bg-white/50 px-2.5 py-1 font-medium transition-colors hover:bg-white/80';

export function Header({ onOpenAbout }: HeaderProps) {
  const t = useT();
  return (
    <header className="flex flex-col items-center gap-1.5 px-6 pt-8 text-center sm:pt-12 lg:gap-2.5 lg:pt-16">
      <div className="flex items-center gap-3">
        <Tunduk size={30} className="text-accent lg:hidden" />
        <Tunduk size={40} className="text-accent hidden lg:block" />
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {t.app.title}
        </h1>
      </div>
      <p className="text-ink-muted text-xs sm:text-sm lg:text-base">{t.app.tagline}</p>
      <p className="text-ink-muted/70 mt-1 flex flex-wrap items-center justify-center gap-2 text-[11px] lg:text-xs">
        {t.app.madeBy}
        <a
          href="https://www.instagram.com/theratbeko/"
          target="_blank"
          rel="noopener noreferrer"
          className={chip}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.3" cy="6.7" r="1.3" fill="currentColor" />
          </svg>
          @theratbeko
        </a>
        <button type="button" onClick={onOpenAbout} className={chip}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" />
            <path d="M12 11v5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="7.5" r="1.3" fill="currentColor" />
          </svg>
          {t.about.link}
        </button>
      </p>
    </header>
  );
}

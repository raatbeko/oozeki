import type { Theme } from '../hooks/useSettings';
import { useT } from '../i18n';

type ThemeSwitchProps = {
  theme: Theme;
  onChange: (theme: Theme) => void;
};

/** Күн/ай баскычы: караңгы менен жарык теманы алмаштырат. */
export function ThemeSwitch({ theme, onChange }: ThemeSwitchProps) {
  const t = useT();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      aria-label={t.a11y.toggleTheme}
      aria-pressed={dark}
      onClick={() => onChange(dark ? 'light' : 'dark')}
      className="border-line bg-bg-soft text-ink-muted hover:text-ink flex h-8 w-8 items-center justify-center rounded-full border transition-colors lg:h-9 lg:w-9"
    >
      {dark ? (
        // күн — жарыкка өтүү
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
        // ай — караңгыга өтүү
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 14.2A8 8 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

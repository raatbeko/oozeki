import { useT } from '../i18n';

type AccountButtonProps = {
  email: string | null;
  onClick: () => void;
};

/** Оң жактагы аккаунт баскычы (тил алмаштыргычтын жанында). */
export function AccountButton({ email, onClick }: AccountButtonProps) {
  const t = useT();
  const initial = email ? email.trim()[0]?.toUpperCase() : null;
  return (
    <button
      type="button"
      aria-label={t.a11y.openAccount}
      onClick={onClick}
      className="border-line bg-bg-soft text-ink-muted hover:text-ink absolute top-3 right-14 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-colors sm:top-5 sm:right-16 lg:h-9 lg:w-9"
    >
      {initial ? (
        <span className="text-accent text-[13px] font-bold">{initial}</span>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
          <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

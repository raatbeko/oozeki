import { useT } from '../i18n';

type ProgressButtonProps = {
  onClick: () => void;
};

/** Толук экран жарык/караңгы алмаштыргычтын жанындагы «Илгерилөө» баскычы. */
export function ProgressButton({ onClick }: ProgressButtonProps) {
  const t = useT();
  return (
    <button
      type="button"
      aria-label={t.a11y.openProgress}
      onClick={onClick}
      className="border-line bg-bg-soft text-ink-muted hover:text-ink flex h-8 w-8 items-center justify-center rounded-full border transition-colors lg:h-9 lg:w-9"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20V10M12 20V4M20 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

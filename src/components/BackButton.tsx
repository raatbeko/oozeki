import { navigate } from '../router'
import { useTr } from '../i18n'

/**
 * «← Артка»: башкы беттен башка бардык беттердин эң өйдөсүндө (кадалбайт, жөн гана өйдөдө).
 * Сайттын ичинен келсе — мурунку бетке кайтат; шилтеме менен түз келсе — `fallback` бетке.
 */
export function BackButton({ fallback = '/', label }: { fallback?: string; label?: string }) {
  const tr = useTr()
  const onClick = () => {
    if ((history.state as { oz?: number } | null)?.oz) history.back()
    else navigate(fallback)
  }
  return (
    <div className="mb-6 md:mb-8">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface/70 pr-4 pl-3 text-[14px] font-medium text-ink-muted backdrop-blur transition hover:border-accent/50 hover:text-ink"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {label ?? tr('Артка', 'Назад')}
      </button>
    </div>
  )
}

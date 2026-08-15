import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { useT } from '../i18n';
import type { Settings } from '../hooks/useSettings';

type SettingsModalProps = {
  open: boolean;
  settings: Settings;
  onUpdate: (patch: Partial<Settings>) => void;
  onClose: () => void;
};

/** Оюу-борбордук ажыраткыч сызык (кичине толкун-оюу, өтө күңүрт). */
const ornamentDivider = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='8' viewBox='0 0 28 8'%3E%3Cpath d='M1 7C6 7 6 1 11 1s5 6 10 6 5-6 6-6' fill='none' stroke='%2323201B' stroke-opacity='0.18' stroke-linecap='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'repeat-x',
} as const;

export function SettingsModal({ open, settings, onUpdate, onClose }: SettingsModalProps) {
  const t = useT();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      // Жөнөкөй focus-trap: Tab панелдин ичинде айланат
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const firstInput = panelRef.current?.querySelector<HTMLElement>('input');
    firstInput?.focus();
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      previouslyFocused.current?.focus();
    };
  }, [open, onKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#23201b]/25 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="border-line bg-bg-soft w-full max-w-md rounded-t-3xl border p-6 shadow-[0_24px_60px_rgb(35_32_27/0.25)] sm:rounded-3xl sm:p-7"
          >
            <h2 id="settings-title" className="font-serif text-2xl font-bold">
              {t.settings.title}
            </h2>
            <p className="text-ink-muted mt-1 text-sm">{t.settings.subtitle}</p>

            <div aria-hidden="true" className="my-5 h-2 w-full" style={ornamentDivider} />

            <div className="flex flex-col gap-6">
              <label className="flex flex-col gap-2.5">
                <span className="flex items-baseline justify-between">
                  <span className="text-ink text-[11px] font-semibold tracking-[0.2em] uppercase">
                    {t.settings.speech}
                  </span>
                  <span className="text-accent text-sm font-semibold tabular-nums">
                    {settings.speechMin} {t.settings.minutesShort}
                  </span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={settings.speechMin}
                  aria-label={t.settings.speech}
                  onChange={(e) => onUpdate({ speechMin: Number(e.target.value) })}
                />
              </label>

              <label className="flex flex-col gap-2.5">
                <span className="flex items-baseline justify-between">
                  <span className="text-ink text-[11px] font-semibold tracking-[0.2em] uppercase">
                    {t.settings.prep}
                  </span>
                  <span className="text-blue text-sm font-semibold tabular-nums">
                    {settings.prepMin} {t.settings.minutesShort}
                  </span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={60}
                  step={1}
                  value={settings.prepMin}
                  aria-label={t.settings.prep}
                  onChange={(e) => onUpdate({ prepMin: Number(e.target.value) })}
                />
                <span className="text-ink-muted text-xs">{t.settings.prepNote}</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.muted}
                  onChange={(e) => onUpdate({ muted: e.target.checked })}
                  className="accent-accent h-4.5 w-4.5"
                />
                <span className="text-sm font-medium">{t.settings.muteSounds}</span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={settings.recordEnabled}
                  onChange={(e) => onUpdate({ recordEnabled: e.target.checked })}
                  className="accent-accent mt-0.5 h-4.5 w-4.5"
                />
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{t.settings.record}</span>
                  <span className="text-ink-muted text-xs">{t.settings.recordNote}</span>
                </span>
              </label>
            </div>

            <div aria-hidden="true" className="my-5 h-2 w-full" style={ornamentDivider} />

            <p className="text-ink-muted mb-4 text-xs">{t.settings.savedNote}</p>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.a11y.closeSettings}
              className="bg-accent w-full rounded-full py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgb(194_69_47/0.32)] transition-colors hover:bg-[#ad3e2a]"
            >
              {t.settings.close}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

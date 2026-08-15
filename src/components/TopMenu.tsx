import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '../data/ui-strings';
import type { Theme } from '../hooks/useSettings';
import { useT } from '../i18n';
import { LangSwitch } from './LangSwitch';
import { ThemeSwitch } from './ThemeSwitch';

type TopMenuProps = {
  theme: Theme;
  locale: Locale;
  onThemeChange: (t: Theme) => void;
  onLocaleChange: (l: Locale) => void;
  onOpenProgress: () => void;
};

/** «Служебное» меню: тема, тил жана «Илгерилөө» бир поповерде. */
export function TopMenu({
  theme,
  locale,
  onThemeChange,
  onLocaleChange,
  onOpenProgress,
}: TopMenuProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={t.a11y.openMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="border-line bg-bg-soft text-ink-muted hover:text-ink flex h-8 w-8 items-center justify-center rounded-full border transition-colors lg:h-9 lg:w-9"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="border-line bg-bg-soft absolute left-0 top-full z-20 mt-2 w-56 rounded-2xl border p-1.5 shadow-[0_12px_32px_rgb(35_32_27/0.16)]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                onOpenProgress();
              }}
              className="text-ink hover:bg-surface/60 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-ink-muted">
                <path d="M4 20V10M12 20V4M20 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {t.progress.link}
            </button>

            <div className="bg-line mx-2 my-1.5 h-px" />

            <div className="flex items-center justify-between px-3 py-1.5">
              <span className="text-ink text-sm">{t.menu.theme}</span>
              <ThemeSwitch theme={theme} onChange={onThemeChange} />
            </div>

            <div className="flex items-center justify-between px-3 py-1.5">
              <span className="text-ink text-sm">{t.menu.language}</span>
              <LangSwitch locale={locale} onChange={onLocaleChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

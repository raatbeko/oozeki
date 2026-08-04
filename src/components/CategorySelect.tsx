import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category } from '../data/categories';
import { t } from '../data/ui-strings';

type CategorySelectProps = {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
};

export function CategorySelect({ categories, value, onChange }: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected = categories.find((c) => c.id === value) ?? categories[0];

  const close = useCallback((focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close(true);
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const buttons = optionRefs.current.filter(Boolean) as HTMLButtonElement[];
        const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next =
          e.key === 'ArrowDown'
            ? buttons[Math.min(idx + 1, buttons.length - 1)] ?? buttons[0]
            : buttons[Math.max(idx - 1, 0)] ?? buttons[buttons.length - 1];
        next?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  useEffect(() => {
    if (open) {
      const idx = categories.findIndex((c) => c.id === value);
      optionRefs.current[Math.max(0, idx)]?.focus();
    }
  }, [open, categories, value]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.category.label}
        onClick={() => setOpen((v) => !v)}
        className="border-line text-ink hover:bg-bg-soft flex h-11 items-center gap-2 rounded-full border bg-white/40 px-5 text-sm font-medium transition-colors"
      >
        <span aria-hidden="true">{selected.emoji}</span>
        <span>{selected.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={`text-ink-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t.category.listLabel}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="border-line bg-bg-soft absolute left-1/2 z-40 mt-2 max-h-72 w-64 -translate-x-1/2 overflow-y-auto rounded-2xl border p-1.5 shadow-[0_12px_32px_rgb(35_32_27/0.14)]"
          >
            {categories.map((cat, i) => {
              const isSelected = cat.id === value;
              return (
                <li key={cat.id} role="presentation">
                  <button
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(cat.id);
                      close(true);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? 'text-ink bg-white font-semibold shadow-[0_1px_6px_rgb(35_32_27/0.08)]'
                        : 'text-ink hover:bg-white/60'
                    }`}
                  >
                    <span aria-hidden="true" className="w-6 text-center">
                      {cat.emoji}
                    </span>
                    <span className="flex-1">{cat.label}</span>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="text-accent">
                        <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

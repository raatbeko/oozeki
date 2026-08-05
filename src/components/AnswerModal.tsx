import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import {
  topicExplainKg,
  topicExplainRu,
  topicKg,
  topicTerm,
  type Topic,
} from '../data/categories';
import { useT } from '../i18n';

type AnswerModalProps = {
  open: boolean;
  topic: Topic | null;
  onClose: () => void;
};

const ornamentDivider = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='8' viewBox='0 0 28 8'%3E%3Cpath d='M1 7C6 7 6 1 11 1s5 6 10 6 5-6 6-6' fill='none' stroke='%2323201B' stroke-opacity='0.18' stroke-linecap='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'repeat-x',
} as const;

/** «Түшүндүрмө» модалкасы: теманын толук маанисин ачат (О проекте сыяктуу). */
export function AnswerModal({ open, topic, onClose }: AnswerModalProps) {
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
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"])',
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
    panelRef.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      previouslyFocused.current?.focus();
    };
  }, [open, onKeyDown]);

  const kg = topic ? topicKg(topic) : '';
  const term = topic ? topicTerm(topic) : undefined;
  const explainKg = topic ? topicExplainKg(topic) : undefined;
  const explainRu = topic ? topicExplainRu(topic) : undefined;

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
            aria-labelledby="answer-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="border-line bg-bg-soft flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-3xl border p-6 shadow-[0_24px_60px_rgb(35_32_27/0.25)] sm:rounded-3xl sm:p-7"
          >
            <div className="shrink-0">
              <h2 id="answer-title" className="font-serif text-2xl leading-tight font-bold text-balance">
                {kg}
              </h2>
              {term && <p className="text-ink-muted mt-1.5 text-sm">{term}</p>}
            </div>

            <div aria-hidden="true" className="my-5 h-2 w-full shrink-0" style={ornamentDivider} />

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
              {explainKg && (
                <p className="text-ink text-[15px] leading-relaxed sm:text-base">{explainKg}</p>
              )}
              {explainRu && (
                <p className="text-ink-muted text-sm leading-relaxed">{explainRu}</p>
              )}
            </div>

            <div aria-hidden="true" className="my-5 h-2 w-full shrink-0" style={ornamentDivider} />

            <button
              type="button"
              onClick={onClose}
              className="bg-accent w-full shrink-0 rounded-full py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgb(194_69_47/0.32)] transition-colors hover:bg-[#ad3e2a]"
            >
              {t.about.close}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

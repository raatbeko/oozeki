import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { topicKg, topicTerm, type Topic } from '../data/categories';
import { useT } from '../i18n';

export type Status = 'ready' | 'spinning' | 'prep' | 'prepDone' | 'speaking' | 'done';

type TopicDisplayProps = {
  topic: Topic | null;
  status: Status;
  spinning: boolean;
  leftMs: number;
  timerVisible: boolean;
  researchMode: boolean;
  /** Тема астына чегилүүчү элементтер (прогресс-сызык). */
  children?: ReactNode;
};

/** Теманын узундугуна жараша адаптивдүү өлчөм. */
function sizeClass(text: string): string {
  const len = text.length;
  if (len <= 12) return 'text-[clamp(3rem,13vw,6rem)]';
  if (len <= 24) return 'text-[clamp(2.4rem,9.5vw,4.8rem)]';
  if (len <= 42) return 'text-[clamp(1.9rem,7vw,3.6rem)]';
  return 'text-[clamp(1.5rem,5.5vw,2.7rem)]';
}

function formatLeft(leftMs: number): string {
  const totalS = Math.ceil(leftMs / 1000);
  const mm = Math.floor(totalS / 60);
  const ss = totalS % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export function TopicDisplay({
  topic,
  status,
  spinning,
  leftMs,
  timerVisible,
  researchMode,
  children,
}: TopicDisplayProps) {
  const t = useT();
  const statusLabel: Record<Status, string> = {
    ready: t.status.ready,
    spinning: t.status.spinning,
    prep: t.status.prep,
    prepDone: t.status.prepDone,
    speaking: t.status.speaking,
    done: t.status.done,
  };
  const kg = topic ? topicKg(topic) : null;
  const term = topic ? topicTerm(topic) : undefined;

  return (
    <div className="flex w-full max-w-4xl flex-1 flex-col items-center text-center">
      <p
        aria-live="polite"
        className={`mt-2 text-[11px] font-semibold tracking-[0.24em] uppercase sm:text-xs ${
          researchMode ? 'text-blue' : 'text-accent'
        }`}
      >
        {statusLabel[status]}
      </p>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 pb-10 sm:pb-44">
        {kg === null ? (
          <p className="text-ink-muted font-serif text-xl italic sm:text-2xl">
            {t.topic.placeholder}
          </p>
        ) : spinning ? (
          <h2
            aria-label={t.a11y.topic}
            className={`font-serif leading-[1.05] font-bold tracking-tight text-balance opacity-50 ${sizeClass(kg)}`}
          >
            {kg}
          </h2>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={kg}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="flex flex-col items-center gap-2"
            >
              <h2
                aria-label={t.a11y.topic}
                className={`font-serif leading-[1.05] font-bold tracking-tight text-balance ${sizeClass(kg)}`}
              >
                {kg}
              </h2>
              {term && <p className="text-ink-muted text-sm sm:text-base">{term}</p>}
            </motion.div>
          </AnimatePresence>
        )}

        {timerVisible && (
          <p
            aria-label={t.a11y.timeLeft}
            className="text-ink-muted text-3xl font-medium tabular-nums sm:text-4xl"
          >
            {formatLeft(leftMs)}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}

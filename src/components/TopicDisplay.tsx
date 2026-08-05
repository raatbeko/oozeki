import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  topicExplainKg,
  topicExplainRu,
  topicKg,
  topicTerm,
  type Topic,
} from '../data/categories';
import { useT } from '../i18n';
import { TimerCircle } from './TimerCircle';

/** «Түшүндүрмө» — теманын мааниси. Демейде жашырылган, басканда ачылат. */
function TopicAnswer({ explainKg, explainRu }: { explainKg?: string; explainRu?: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  if (!explainKg) return null;
  return (
    <div className="mt-3 flex flex-col items-center gap-2 lg:mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="border-line text-ink-muted hover:text-ink bg-surface/40 hover:bg-surface/70 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors lg:text-sm"
      >
        {open ? t.topic.hideAnswer : t.topic.showAnswer}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-line bg-surface/50 max-w-md rounded-2xl border px-4 py-3 text-left"
        >
          <p className="text-ink text-sm leading-relaxed lg:text-base">{explainKg}</p>
          {explainRu && (
            <p className="text-ink-muted mt-1.5 text-xs leading-relaxed lg:text-sm">{explainRu}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export type Status =
  | 'ready'
  | 'spinning'
  | 'prep'
  | 'prepDone'
  | 'speaking'
  | 'done'
  | 'paused';

type TopicDisplayProps = {
  topic: Topic | null;
  status: Status;
  spinning: boolean;
  leftMs: number;
  totalMs: number;
  timerVisible: boolean;
  /** Акыркы 10 секунд — шакек кызылга өтөт. */
  warning: boolean;
  researchMode: boolean;
};

/** Теманын узундугуна жараша адаптивдүү өлчөм. */
function sizeClass(text: string): string {
  const len = text.length;
  if (len <= 12) return 'text-[clamp(3rem,13vw,7rem)]';
  if (len <= 24) return 'text-[clamp(2.4rem,9.5vw,5.6rem)]';
  if (len <= 42) return 'text-[clamp(1.9rem,7vw,4.2rem)]';
  return 'text-[clamp(1.5rem,5.5vw,3.1rem)]';
}

export function TopicDisplay({
  topic,
  status,
  spinning,
  leftMs,
  totalMs,
  timerVisible,
  warning,
  researchMode,
}: TopicDisplayProps) {
  const t = useT();
  const statusLabel: Record<Status, string> = {
    ready: t.status.ready,
    spinning: t.status.spinning,
    prep: t.status.prep,
    prepDone: t.status.prepDone,
    speaking: t.status.speaking,
    done: t.status.done,
    paused: t.status.paused,
  };
  const kg = topic ? topicKg(topic) : null;
  const term = topic ? topicTerm(topic) : undefined;
  const explainKg = topic ? topicExplainKg(topic) : undefined;
  const explainRu = topic ? topicExplainRu(topic) : undefined;
  const ringColor = warning ? 'accent' : status === 'prep' ? 'blue' : 'gold';

  return (
    <div className="flex w-full max-w-4xl min-h-0 flex-1 flex-col items-center text-center">
      <p
        aria-live="polite"
        className={`mt-2 text-[11px] font-semibold tracking-[0.24em] uppercase sm:text-xs lg:mt-4 lg:text-sm ${
          researchMode ? 'text-blue' : 'text-accent'
        }`}
      >
        {statusLabel[status]}
      </p>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5">
        {kg === null ? (
          <p className="text-ink-muted font-serif text-xl italic sm:text-2xl lg:text-3xl">
            {t.topic.placeholder}
          </p>
        ) : timerVisible ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 sm:gap-6"
          >
            <h2
              aria-label={t.a11y.topic}
              className="font-serif text-xl leading-snug font-bold tracking-tight text-balance sm:text-2xl lg:text-3xl"
            >
              {kg}
            </h2>
            <TimerCircle
              leftMs={leftMs}
              totalMs={totalMs}
              color={ringColor}
              ariaLabel={t.a11y.timeLeft}
            />
          </motion.div>
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
              {term && <p className="text-ink-muted text-sm sm:text-base lg:text-lg">{term}</p>}
              <TopicAnswer explainKg={explainKg} explainRu={explainRu} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

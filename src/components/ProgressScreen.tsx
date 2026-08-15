import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { categories, categoryLabel } from '../data/categories';
import type { Locale } from '../data/ui-strings';
import { useT } from '../i18n';
import {
  activityCells,
  currentStreak,
  formatDuration,
  practicedByCategory,
  totalSeconds,
  uniqueTopicCount,
  type Session,
} from '../lib/progress';

type ProgressScreenProps = {
  open: boolean;
  sessions: Session[];
  locale: Locale;
  onClose: () => void;
};

const ACTIVITY_DAYS = 84; // 12 жума

export function ProgressScreen({ open, sessions, locale, onClose }: ProgressScreenProps) {
  const t = useT();
  const closeRef = useRef<HTMLButtonElement>(null);

  const stats = useMemo(() => {
    const practiced = practicedByCategory(sessions);
    const coverage = categories
      .map((c) => ({
        id: c.id,
        emoji: c.emoji,
        label: categoryLabel(c, locale),
        done: practiced.get(c.id)?.size ?? 0,
        total: c.topics.length,
      }))
      .filter((c) => c.done > 0)
      .sort((a, b) => b.done / b.total - a.done / a.total || b.done - a.done);

    return {
      streak: currentStreak(sessions),
      topics: uniqueTopicCount(sessions),
      seconds: totalSeconds(sessions),
      coverage,
      cells: activityCells(sessions, ACTIVITY_DAYS),
      history: [...sessions].sort((a, b) => b.at - a.at).slice(0, 25),
    };
  }, [sessions, locale]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  const totalTime = formatTotalTime(stats.seconds, t.progress.unitHour, t.progress.unitMin);
  const isEmpty = sessions.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="bg-bg fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="mx-auto w-full max-w-xl px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
            <div className="sticky top-0 z-10 -mx-5 mb-2 flex items-center justify-between bg-bg/80 px-5 py-3 backdrop-blur">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t.progress.title}</h2>
              <button
                ref={closeRef}
                type="button"
                aria-label={t.a11y.closeProgress}
                onClick={onClose}
                className="border-line bg-bg-soft text-ink-muted hover:text-ink flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {isEmpty ? (
              <p className="text-ink-muted mt-16 text-center text-base text-balance">
                {t.progress.empty}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  <StatCard value={`🔥 ${stats.streak}`} label={`${t.progress.lblStreak} · ${t.progress.dayShort}`} />
                  <StatCard value={String(stats.topics)} label={t.progress.lblTopics} />
                  <StatCard value={totalTime} label={t.progress.lblTime} />
                </div>

                <Section title={t.progress.coverage}>
                  <div className="flex flex-col gap-3">
                    {stats.coverage.map((c) => (
                      <div key={c.id}>
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <span aria-hidden="true">{c.emoji}</span>
                          <span className="text-ink flex-1 truncate">{c.label}</span>
                          <span className="text-ink-muted tabular-nums">
                            {c.done}/{c.total}
                          </span>
                        </div>
                        <div className="bg-line h-1.5 overflow-hidden rounded-full">
                          <div
                            className="bg-accent h-full rounded-full"
                            style={{ width: `${Math.round((c.done / c.total) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title={t.progress.activity}>
                  <div className="overflow-x-auto pb-1">
                    <div
                      className="grid grid-flow-col grid-rows-7 gap-[3px]"
                      style={{ width: 'max-content' }}
                    >
                      {stats.cells.map((cell) => (
                        <span
                          key={cell.key}
                          title={`${cell.key}: ${cell.count}`}
                          className={`h-2.5 w-2.5 rounded-[3px] ${activityColor(cell.count)}`}
                        />
                      ))}
                    </div>
                  </div>
                </Section>

                <Section title={t.progress.history}>
                  <ul className="flex flex-col divide-y divide-[var(--color-line)]">
                    {stats.history.map((s) => (
                      <li key={s.id} className="flex items-center gap-3 py-2.5 text-sm">
                        <span className="text-ink flex-1 truncate">{s.topic}</span>
                        <span className="text-ink-muted tabular-nums">{formatDuration(s.seconds)}</span>
                        <span className="text-ink-muted/70 w-10 text-right tabular-nums">
                          {shortDate(s.at)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <p className="text-ink-muted/70 mt-8 text-center text-xs text-balance">
                  {t.progress.localNote}
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-line bg-surface/60 flex flex-col items-center gap-1 rounded-2xl border px-2 py-4">
      <span className="font-serif text-2xl font-bold sm:text-3xl">{value}</span>
      <span className="text-ink-muted text-center text-[10px] font-semibold tracking-[0.12em] uppercase sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h3 className="text-ink-muted mb-3 text-[11px] font-semibold tracking-[0.18em] uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

function activityColor(count: number): string {
  if (count <= 0) return 'bg-line/60';
  if (count === 1) return 'bg-accent/40';
  if (count === 2) return 'bg-accent/70';
  return 'bg-accent';
}

function formatTotalTime(sec: number, unitHour: string, unitMin: string): string {
  if (sec <= 0) return '0';
  const min = sec < 60 ? 1 : Math.round(sec / 60);
  if (min < 60) return `${min} ${unitMin}`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}${unitHour} ${m}${unitMin}` : `${h} ${unitHour}`;
}

function shortDate(at: number): string {
  const d = new Date(at);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

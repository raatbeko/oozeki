import { useEffect, useState, type CSSProperties } from 'react';
import { topicKg, type Topic } from '../data/categories';
import { useT } from '../i18n';
import type { Status } from './TopicDisplay';

type FullscreenTimerProps = {
  topic: Topic | null;
  status: Status;
  leftMs: number;
  totalMs: number;
  warning: boolean;
  running: boolean;
  onTogglePause: () => void;
  onExit: () => void;
};

function formatLeft(leftMs: number): string {
  const totalS = Math.ceil(leftMs / 1000);
  const mm = Math.floor(totalS / 60);
  const ss = totalS % 60;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}

/**
 * Толук экран таймери: чоң цифралар менен. Телефондо (тик форматта) 90°
 * бурулуп, ландшафт (16:9) катары көрсөтүлөт — цифралар максималдуу чоң болот.
 * Браузердин Fullscreen API'си да чакырылат (адрес сабы жашырылат).
 */
export function FullscreenTimer({
  topic,
  status,
  leftMs,
  totalMs,
  warning,
  running,
  onTogglePause,
  onExit,
}: FullscreenTimerProps) {
  const t = useT();
  const [portrait, setPortrait] = useState(false);

  const statusLabel: Record<Status, string> = {
    ready: t.status.ready,
    spinning: t.status.spinning,
    prep: t.status.prep,
    prepDone: t.status.prepDone,
    speaking: t.status.speaking,
    done: t.status.done,
    paused: t.status.paused,
  };

  // Экрандын багыты (тик/жаткан)
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)');
    const sync = () => setPortrait(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Esc — чыгуу, Space/Enter — тыныгуу/улантуу
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onTogglePause();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit, onTogglePause]);

  const barColor = warning
    ? 'var(--color-accent)'
    : status === 'prep'
      ? 'var(--color-blue)'
      : 'var(--color-gold)';
  const remaining = Math.max(0, Math.min(1, leftMs / Math.max(totalMs, 1)));
  const kg = topic ? topicKg(topic) : null;

  const boxStyle: CSSProperties = portrait
    ? { width: '100vh', height: '100vw', transform: 'rotate(90deg)' }
    : { width: '100vw', height: '100vh' };

  return (
    <div className="bg-bg fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      <div
        style={boxStyle}
        className="relative flex shrink-0 flex-col items-center justify-center [container-type:size]"
      >
        <button
          type="button"
          onClick={onExit}
          aria-label={t.controls.exitFullscreen}
          className="border-line text-ink-muted hover:text-ink absolute top-[4cqh] right-[4cqh] z-10 flex h-[7cqh] max-h-12 min-h-9 w-[7cqh] max-w-12 min-w-9 items-center justify-center rounded-full border bg-transparent transition-colors"
        >
          <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {kg && (
          <p
            className="text-ink-muted max-w-[86cqw] px-[4cqw] text-center leading-tight font-medium text-balance"
            style={{ fontSize: 'min(4.5cqw, 7cqh)' }}
          >
            {kg}
          </p>
        )}

        <button
          type="button"
          onClick={onTogglePause}
          aria-label={t.a11y.timeLeft}
          className="font-serif font-bold tabular-nums transition-colors"
          style={{
            fontSize: 'min(30cqw, 54cqh)',
            lineHeight: 1,
            color: warning ? 'var(--color-accent)' : 'var(--color-ink)',
          }}
        >
          {formatLeft(leftMs)}
        </button>

        <p
          className="text-ink-muted font-semibold tracking-[0.2em] uppercase"
          style={{ fontSize: 'min(3cqw, 4.5cqh)' }}
        >
          {statusLabel[status]}
        </p>

        {(running || status === 'paused') && (
          <p
            className="text-ink-muted/60 absolute bottom-[7cqh]"
            style={{ fontSize: 'min(2.6cqw, 3.6cqh)' }}
          >
            {running ? t.controls.tapToPause : t.controls.tapToResume}
          </p>
        )}

        {/* прогресс: калган убакыт — азайып барат */}
        <div
          className="bg-line/50 absolute right-0 bottom-0 left-0 overflow-hidden"
          style={{ height: 'min(1.6cqh, 10px)' }}
        >
          <div
            className="h-full transition-[width] duration-300 ease-linear"
            style={{ width: `${remaining * 100}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
    </div>
  );
}

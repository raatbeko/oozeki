import { useT } from '../i18n';
import type { Mode } from '../hooks/useSettings';
import type { Status } from './TopicDisplay';
import { Tunduk } from './Tunduk';

type TimerControlsProps = {
  mode: Mode;
  status: Status;
  spinning: boolean;
  hasTopic: boolean;
  speechMin: number;
  prepMin: number;
  onSpin: () => void;
  onStartSpeech: () => void;
  onStartPrep: () => void;
  onReady: () => void;
  onStop: () => void;
  onOpenSettings: () => void;
};

const pill =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold whitespace-nowrap transition-colors select-none disabled:cursor-not-allowed disabled:opacity-45 sm:h-12 sm:px-6 sm:text-sm';
const primary = `${pill} bg-accent text-white shadow-[0_6px_18px_rgb(194_69_47/0.32)] hover:bg-[#ad3e2a]`;
/* «Тарт» — башкы баскыч, башкалардан чоңураак */
const primaryBig =
  'inline-flex h-13 items-center justify-center gap-2 rounded-full px-9 text-base font-bold whitespace-nowrap transition-colors select-none disabled:cursor-not-allowed disabled:opacity-45 sm:h-14 sm:px-11 sm:text-lg bg-accent text-white shadow-[0_8px_22px_rgb(194_69_47/0.38)] hover:bg-[#ad3e2a]';
const secondary = `${pill} border border-line bg-white/40 text-ink hover:bg-white/70`;

function StopwatchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="13.5" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M12 9.5v4l2.8 2M9.5 2.5h5M12 2.5v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MagnifierIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function TimerControls({
  mode,
  status,
  spinning,
  hasTopic,
  speechMin,
  prepMin,
  onSpin,
  onStartSpeech,
  onStartPrep,
  onReady,
  onStop,
  onOpenSettings,
}: TimerControlsProps) {
  const t = useT();
  const timerRunning = status === 'prep' || status === 'speaking';

  return (
    <div className="flex flex-nowrap items-center justify-center gap-2 px-3 sm:gap-3 sm:px-6">
      {status === 'prep' ? (
        <>
          <button type="button" className={primary} onClick={onReady} aria-label={t.controls.imReady}>
            {t.controls.imReady}
          </button>
          <button type="button" className={secondary} onClick={onStop} aria-label={t.controls.stop}>
            {t.controls.stop}
          </button>
        </>
      ) : status === 'speaking' ? (
        <button type="button" className={secondary} onClick={onStop} aria-label={t.controls.stop}>
          {t.controls.stop}
        </button>
      ) : (
        <>
          <button
            type="button"
            className={primaryBig}
            onClick={onSpin}
            disabled={spinning}
            aria-label={t.controls.spin}
          >
            {spinning && <Tunduk size={19} spinning className="text-white/90" />}
            {spinning ? t.controls.spinning : t.controls.spin}
          </button>
          {mode === 'quick' || status === 'prepDone' ? (
            <button
              type="button"
              className={secondary}
              onClick={onStartSpeech}
              disabled={!hasTopic || spinning}
              aria-label={t.controls.startSpeechAria(speechMin)}
            >
              <StopwatchIcon />
              {t.controls.startSpeech(speechMin)}
            </button>
          ) : (
            <button
              type="button"
              className={secondary}
              onClick={onStartPrep}
              disabled={!hasTopic || spinning}
              aria-label={t.controls.startPrepAria(prepMin)}
            >
              <MagnifierIcon />
              {t.controls.startPrep(prepMin)}
            </button>
          )}
        </>
      )}

      {!timerRunning && (
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t.a11y.openSettings}
          className="border-line text-ink-muted hover:text-ink flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white/40 transition-colors hover:bg-white/70 sm:h-12 sm:w-12"
        >
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 12.75a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M16.6 12.4a1.35 1.35 0 0 0 .27 1.49l.05.05a1.64 1.64 0 1 1-2.32 2.32l-.05-.05a1.35 1.35 0 0 0-1.49-.27 1.35 1.35 0 0 0-.82 1.24v.14a1.64 1.64 0 1 1-3.28 0v-.07a1.35 1.35 0 0 0-.88-1.24 1.35 1.35 0 0 0-1.49.27l-.05.05a1.64 1.64 0 1 1-2.32-2.32l.05-.05a1.35 1.35 0 0 0 .27-1.49 1.35 1.35 0 0 0-1.24-.82h-.14a1.64 1.64 0 1 1 0-3.28h.07a1.35 1.35 0 0 0 1.24-.88 1.35 1.35 0 0 0-.27-1.49l-.05-.05a1.64 1.64 0 1 1 2.32-2.32l.05.05a1.35 1.35 0 0 0 1.49.27h.06a1.35 1.35 0 0 0 .82-1.24v-.14a1.64 1.64 0 1 1 3.28 0v.07a1.35 1.35 0 0 0 .82 1.24 1.35 1.35 0 0 0 1.49-.27l.05-.05a1.64 1.64 0 1 1 2.32 2.32l-.05.05a1.35 1.35 0 0 0-.27 1.49v.06a1.35 1.35 0 0 0 1.24.82h.14a1.64 1.64 0 1 1 0 3.28h-.07a1.35 1.35 0 0 0-1.24.82Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

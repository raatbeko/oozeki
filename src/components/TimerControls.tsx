import { useT } from '../i18n';
import type { Mode } from '../hooks/useSettings';
import type { Status } from './TopicDisplay';
import { Tunduk } from './Tunduk';

type TimerControlsProps = {
  mode: Mode;
  status: Status;
  spinning: boolean;
  hasTopic: boolean;
  /** Учурдагы (тыныгууда да) таймер сүйлөө таймериби — «Бүттүм» баскычы үчүн. */
  speaking: boolean;
  speechMin: number;
  prepMin: number;
  onSpin: () => void;
  onStartSpeech: () => void;
  onStartPrep: () => void;
  onReady: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onRestart: () => void;
  onFullscreen: () => void;
  onOpenSettings: () => void;
};

const pill =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold whitespace-nowrap transition-colors select-none disabled:cursor-not-allowed disabled:opacity-45 sm:h-12 sm:px-6 sm:text-sm lg:h-13 lg:px-7 lg:text-base';
const primary = `${pill} bg-accent text-white shadow-[0_6px_18px_rgb(194_69_47/0.32)] hover:bg-[#ad3e2a]`;
/* «Тарт» — башкы баскыч, башкалардан чоңураак */
const primaryBig =
  'inline-flex h-13 items-center justify-center gap-2 rounded-full px-9 text-base font-bold whitespace-nowrap transition-colors select-none disabled:cursor-not-allowed disabled:opacity-45 sm:h-14 sm:px-11 sm:text-lg lg:h-16 lg:px-14 lg:text-xl bg-accent text-white shadow-[0_8px_22px_rgb(194_69_47/0.38)] hover:bg-[#ad3e2a]';
const secondary = `${pill} border border-line bg-surface/40 text-ink hover:bg-surface/70`;

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
  speaking,
  speechMin,
  prepMin,
  onSpin,
  onStartSpeech,
  onStartPrep,
  onReady,
  onPause,
  onResume,
  onFinish,
  onRestart,
  onFullscreen,
  onOpenSettings,
}: TimerControlsProps) {
  const t = useT();
  const timerRunning = status === 'prep' || status === 'speaking';
  // таймер иштеп жатат же тыныгууда — толук экран баскычы көрүнөт
  const timerActive = timerRunning || status === 'paused';

  const iconButton =
    'border-line text-ink-muted hover:text-ink flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-surface/40 transition-colors hover:bg-surface/70 sm:h-12 sm:w-12 lg:h-13 lg:w-13';

  // JSX-элемент, атайын компонент ЭМЕС — таймер иштеп жатканда ар 200мс
  // сайын кайра куралып, DOM'дон өчүп-жанбаш үчүн (болбосо клик «жоголот»)
  const restartButton = (
    <button
      type="button"
      onClick={onRestart}
      aria-label={t.controls.restart}
      className={iconButton}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 3v5h5" />
        <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      </svg>
    </button>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-3 sm:gap-3 sm:px-6">
      {status === 'prep' ? (
        <>
          <button type="button" className={primary} onClick={onReady} aria-label={t.controls.imReady}>
            {t.controls.imReady}
          </button>
          <button type="button" className={secondary} onClick={onPause} aria-label={t.controls.pause}>
            {t.controls.pause}
          </button>
          {restartButton}
        </>
      ) : status === 'speaking' ? (
        <>
          <button type="button" className={primary} onClick={onFinish} aria-label={t.controls.finish}>
            {t.controls.finish}
          </button>
          <button type="button" className={secondary} onClick={onPause} aria-label={t.controls.pause}>
            {t.controls.pause}
          </button>
          {restartButton}
        </>
      ) : status === 'paused' ? (
        <>
          <button type="button" className={primary} onClick={onResume} aria-label={t.controls.resume}>
            {t.controls.resume}
          </button>
          {speaking && (
            <button type="button" className={secondary} onClick={onFinish} aria-label={t.controls.finish}>
              {t.controls.finish}
            </button>
          )}
          <button type="button" className={secondary} onClick={onSpin} disabled={spinning} aria-label={t.controls.spin}>
            {t.controls.spin}
          </button>
        </>
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

      {timerActive && (
        <button
          type="button"
          onClick={onFullscreen}
          aria-label={t.controls.fullscreen}
          className={iconButton}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {!timerActive && (
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t.a11y.openSettings}
          className={iconButton}
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

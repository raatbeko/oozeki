import { useT } from '../i18n';

type RecordingPlayerProps = {
  url: string;
  fileName: string;
  onDiscard: () => void;
};

/** Жаздырылган сүйлөөнү угуу + жүктөө (local-only, компакт бир катар). */
export function RecordingPlayer({ url, fileName, onDiscard }: RecordingPlayerProps) {
  const t = useT();
  const iconBtn =
    'border-line text-ink-muted hover:text-ink bg-surface/40 hover:bg-surface/70 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors';
  return (
    <div className="border-line bg-surface/50 mx-auto mb-3 flex max-w-md items-center gap-2 rounded-2xl border px-3 py-2">
      <span className="text-ink-muted shrink-0" title={t.record.yourSpeech}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio src={url} controls preload="metadata" className="h-8 min-w-0 flex-1" />
      <a href={url} download={fileName} aria-label={t.record.download} title={t.record.download} className={iconBtn}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <button type="button" onClick={onDiscard} aria-label={t.record.discard} title={t.record.discard} className={iconBtn}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

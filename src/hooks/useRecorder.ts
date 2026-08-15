import { useCallback, useEffect, useRef, useState } from 'react';

export type RecorderState = 'idle' | 'recording' | 'paused' | 'denied' | 'unsupported';

/** mime → колдонмо үчүн ыңгайлуу файл кеңейтмеси. */
function extFor(mime: string): string {
  if (mime.includes('mp4') || mime.includes('m4a')) return 'm4a';
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('mpeg')) return 'mp3';
  return 'webm';
}

const isSupported =
  typeof navigator !== 'undefined' &&
  !!navigator.mediaDevices?.getUserMedia &&
  typeof MediaRecorder !== 'undefined';

/**
 * Микрофондон үн жаздыруу (local-only). start → speech таймери менен,
 * stop → жазууну blob URL кылып берет. pause/resume таймердин тыныгуусу менен
 * шайкеш. Жазуу эч жерге жүктөлбөйт — object URL жана localда гана.
 */
export function useRecorder(): {
  state: RecorderState;
  supported: boolean;
  recordingUrl: string | null;
  recordingName: string;
  start: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  discard: () => void;
} {
  const [state, setState] = useState<RecorderState>(isSupported ? 'idle' : 'unsupported');
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingName, setRecordingName] = useState('oozeki-soz.webm');

  const mrRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const revoke = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    if (!isSupported) {
      setState('unsupported');
      return;
    }
    revoke();
    setRecordingUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        stopTracks();
        setState('idle');
        if (chunksRef.current.length > 0) {
          const type = mr.mimeType || 'audio/webm';
          const blob = new Blob(chunksRef.current, { type });
          const url = URL.createObjectURL(blob);
          urlRef.current = url;
          setRecordingName(`oozeki-soz.${extFor(type)}`);
          setRecordingUrl(url);
        }
      };
      mrRef.current = mr;
      mr.start();
      setState('recording');
    } catch {
      stopTracks();
      setState('denied');
    }
  }, [revoke, stopTracks]);

  const stop = useCallback(() => {
    const mr = mrRef.current;
    if (mr && mr.state !== 'inactive') mr.stop();
    mrRef.current = null;
  }, []);

  const pause = useCallback(() => {
    const mr = mrRef.current;
    if (mr && mr.state === 'recording') {
      mr.pause();
      setState('paused');
    }
  }, []);

  const resume = useCallback(() => {
    const mr = mrRef.current;
    if (mr && mr.state === 'paused') {
      mr.resume();
      setState('recording');
    }
  }, []);

  /** Жазууну сактабай токтотуу жана тазалоо (жаңы тема, кайра баштоо ж.б.). */
  const discard = useCallback(() => {
    const mr = mrRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.onstop = null;
      mr.stop();
    }
    mrRef.current = null;
    stopTracks();
    revoke();
    setRecordingUrl(null);
    setState(isSupported ? 'idle' : 'unsupported');
  }, [revoke, stopTracks]);

  useEffect(
    () => () => {
      revoke();
      stopTracks();
    },
    [revoke, stopTracks],
  );

  return {
    state,
    supported: isSupported,
    recordingUrl,
    recordingName,
    start,
    stop,
    pause,
    resume,
    discard,
  };
}

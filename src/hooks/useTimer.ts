import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerHandle = {
  running: boolean;
  leftMs: number;
  totalMs: number;
  start: (ms: number) => void;
  stop: () => void;
};

/**
 * Так эсептелген кайтарым саноо: setInterval'га эмес, timestamp'ка таянат,
 * ошондуктан фондо да «сүзүп» кетпейт.
 * onWarn — аякташка 10 секунд калганда бир жолу чакырылат.
 */
export function useTimer(onFinish: () => void, onWarn?: () => void): TimerHandle {
  const [running, setRunning] = useState(false);
  const [leftMs, setLeftMs] = useState(0);
  const [totalMs, setTotalMs] = useState(0);

  const endAtRef = useRef(0);
  const warnedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const onFinishRef = useRef(onFinish);
  const onWarnRef = useRef(onWarn);
  onFinishRef.current = onFinish;
  onWarnRef.current = onWarn;

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clear();
    setRunning(false);
    setLeftMs(0);
    setTotalMs(0);
  }, [clear]);

  const start = useCallback(
    (ms: number) => {
      clear();
      endAtRef.current = Date.now() + ms;
      warnedRef.current = ms <= 10_000;
      setTotalMs(ms);
      setLeftMs(ms);
      setRunning(true);
      intervalRef.current = window.setInterval(() => {
        const left = Math.max(0, endAtRef.current - Date.now());
        setLeftMs(left);
        if (!warnedRef.current && left <= 10_000 && left > 0) {
          warnedRef.current = true;
          onWarnRef.current?.();
        }
        if (left <= 0) {
          clear();
          setRunning(false);
          onFinishRef.current();
        }
      }, 200);
    },
    [clear],
  );

  useEffect(() => clear, [clear]);

  return { running, leftMs, totalMs, start, stop };
}

import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerHandle = {
  running: boolean;
  leftMs: number;
  totalMs: number;
  start: (ms: number) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
};

/**
 * Так эсептелген кайтарым саноо: setInterval'га эмес, timestamp'ка таянат,
 * ошондуктан фондо да «сүзүп» кетпейт.
 * onWarn — аякташка 10 секунд калганда бир жолу чакырылат.
 * pause — калган убакытты эстеп калат, resume ошол жерден улантат.
 */
export function useTimer(onFinish: () => void, onWarn?: () => void): TimerHandle {
  const [running, setRunning] = useState(false);
  const [leftMs, setLeftMs] = useState(0);
  const [totalMs, setTotalMs] = useState(0);

  const endAtRef = useRef(0);
  const leftRef = useRef(0); // акыркы калган убакыт — pause/resume үчүн
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

  /** Берилген убакыттан тартып саноону баштайт (start жана resume үчүн жалпы). */
  const run = useCallback(
    (ms: number) => {
      clear();
      endAtRef.current = Date.now() + ms;
      warnedRef.current = ms <= 10_000;
      leftRef.current = ms;
      setLeftMs(ms);
      setRunning(true);
      intervalRef.current = window.setInterval(() => {
        const left = Math.max(0, endAtRef.current - Date.now());
        leftRef.current = left;
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

  const start = useCallback(
    (ms: number) => {
      setTotalMs(ms);
      run(ms);
    },
    [run],
  );

  const stop = useCallback(() => {
    clear();
    setRunning(false);
    setLeftMs(0);
    setTotalMs(0);
    leftRef.current = 0;
  }, [clear]);

  /** Саноону токтотуп, калган убакытты эстеп калат. */
  const pause = useCallback(() => {
    clear();
    const left = Math.max(0, endAtRef.current - Date.now());
    leftRef.current = left;
    setLeftMs(left);
    setRunning(false);
  }, [clear]);

  /** Эстелген калган убакыттан улантат. */
  const resume = useCallback(() => {
    if (leftRef.current <= 0) return;
    run(leftRef.current);
  }, [run]);

  useEffect(() => clear, [clear]);

  return { running, leftMs, totalMs, start, stop, pause, resume };
}

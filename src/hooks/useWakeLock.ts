import { useEffect } from 'react';

/**
 * Таймер иштеп турганда экран өчпөсүн (Screen Wake Lock API).
 * Колдоо жок браузерлерде унчукпай өткөрүп жиберет.
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async (): Promise<void> => {
      try {
        sentinel = await navigator.wakeLock.request('screen');
      } catch {
        /* уруксат жок же батарея режими — маанилүү эмес */
      }
    };
    void acquire();

    const onVisibility = (): void => {
      if (!cancelled && document.visibilityState === 'visible') void acquire();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      void sentinel?.release().catch(() => undefined);
    };
  }, [active]);
}

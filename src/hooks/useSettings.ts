import { useCallback, useEffect, useState } from 'react';
import type { Locale } from '../data/ui-strings';

export type Mode = 'quick' | 'research';

export type Settings = {
  speechMin: number;
  prepMin: number;
  muted: boolean;
  mode: Mode;
  categoryId: string;
  locale: Locale;
};

const STORAGE_KEY = 'oozeki:settings:v1';

const defaults: Settings = {
  speechMin: 1,
  prepMin: 10,
  muted: false,
  mode: 'quick',
  categoryId: 'general',
  locale: 'ky',
};

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const p = JSON.parse(raw) as Partial<Settings>;
    return {
      speechMin: clampInt(p.speechMin, 1, 10, defaults.speechMin),
      prepMin: clampInt(p.prepMin, 1, 60, defaults.prepMin),
      muted: typeof p.muted === 'boolean' ? p.muted : defaults.muted,
      mode: p.mode === 'research' ? 'research' : 'quick',
      categoryId: typeof p.categoryId === 'string' ? p.categoryId : defaults.categoryId,
      locale: p.locale === 'ru' ? 'ru' : 'ky',
    };
  } catch {
    return defaults;
  }
}

export function useSettings(): {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
} {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* приватный режим — жөн эле сактабайбыз */
    }
  }, [settings]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  return { settings, update };
}

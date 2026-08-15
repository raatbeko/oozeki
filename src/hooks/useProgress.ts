import { useCallback, useState } from 'react';
import type { Session } from '../lib/progress';

const STORAGE_KEY = 'oozeki:sessions:v1';

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function load(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s): s is Session =>
        !!s &&
        typeof s === 'object' &&
        typeof (s as Session).id === 'string' &&
        typeof (s as Session).topic === 'string' &&
        typeof (s as Session).seconds === 'number' &&
        typeof (s as Session).at === 'number',
    );
  } catch {
    return [];
  }
}

function save(sessions: Session[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    /* приватный режим — жөн эле сактабайбыз */
  }
}

export type NewSession = Omit<Session, 'id' | 'at'>;

/**
 * Сүйлөө сессияларынын журналы (local-first). Кийин синхрондоштуруу катмары
 * ушул журналдын үстүнө коюлат — жаңы жазууларды серверге жүктөйт.
 */
export function useProgress(): {
  sessions: Session[];
  logSession: (s: NewSession) => void;
  /** Серверден келген сессияларды id боюнча бириктирет (синхрондоштуруу). */
  mergeSessions: (incoming: Session[]) => void;
  clear: () => void;
} {
  const [sessions, setSessions] = useState<Session[]>(load);

  const logSession = useCallback((s: NewSession) => {
    setSessions((prev) => {
      const next = [...prev, { ...s, id: makeId(), at: Date.now() }];
      save(next);
      return next;
    });
  }, []);

  const mergeSessions = useCallback((incoming: Session[]) => {
    setSessions((prev) => {
      const byId = new Map(prev.map((s) => [s.id, s]));
      for (const s of incoming) if (!byId.has(s.id)) byId.set(s.id, s);
      if (byId.size === prev.length) return prev; // жаңы жазуу жок
      const next = [...byId.values()].sort((a, b) => a.at - b.at);
      save(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    save([]);
    setSessions([]);
  }, []);

  return { sessions, logSession, mergeSessions, clear };
}

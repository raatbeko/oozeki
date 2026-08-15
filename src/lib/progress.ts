/**
 * Прогресс練 — журнал сессий (append-only) жана андан чыгарылган статистика.
 * Ар бир сүйлөө сессиясы — өзгөрүлбөс жазуу, UUID менен. Бардык көрсөткүчтөр
 * (катар, камтуу, убакыт) ушул журналдан эсептелет. Бул синхрондоштурууда
 * конфликттерди жоёт: жазуулар уникалдуу жана өзгөрбөйт.
 */

export type Session = {
  id: string;
  topic: string;
  categoryId: string;
  mode: 'quick' | 'research';
  seconds: number;
  at: number; // epoch ms
};

/** Жергиликтүү күндүн ачкычы: YYYY-MM-DD. */
export function dateKey(at: number): string {
  const d = new Date(at);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function activeDateSet(sessions: Session[]): Set<string> {
  return new Set(sessions.map((s) => dateKey(s.at)));
}

/** Катар менен машыккан күндөрдүн саны (бүгүн же кечээден баштап артка). */
export function currentStreak(sessions: Session[]): number {
  const days = activeDateSet(sessions);
  if (days.size === 0) return 0;

  const today = new Date();
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // Бүгүн машыкпаса, катар кечээде бүткөн болушу мүмкүн
  if (!days.has(dateKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dateKey(cursor.getTime()))) return 0;
  }
  let streak = 0;
  while (days.has(dateKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function uniqueTopicCount(sessions: Session[]): number {
  return new Set(sessions.map((s) => s.topic)).size;
}

export function totalSeconds(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + s.seconds, 0);
}

/** Категория id → машыккан уникалдуу темалардын жыйындысы. */
export function practicedByCategory(sessions: Session[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const s of sessions) {
    let set = map.get(s.categoryId);
    if (!set) {
      set = new Set<string>();
      map.set(s.categoryId, set);
    }
    set.add(s.topic);
  }
  return map;
}

export type DayCell = { key: string; count: number };

/** Акыркы `days` күндүн активдүүлүгү (эскиден жаңыга). */
export function activityCells(sessions: Session[], days: number): DayCell[] {
  const counts = new Map<string, number>();
  for (const s of sessions) {
    const k = dateKey(s.at);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const cells: DayCell[] = [];
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  start.setDate(start.getDate() - (days - 1));
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const k = dateKey(d.getTime());
    cells.push({ key: k, count: counts.get(k) ?? 0 });
  }
  return cells;
}

/** MM:SS форматы. */
export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}

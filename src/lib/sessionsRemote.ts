import type { Session } from './progress';
import { supabase } from './supabase';

type Row = {
  id: string;
  user_id: string;
  topic: string;
  category_id: string;
  mode: 'quick' | 'research';
  seconds: number;
  created_at: string;
};

function rowToSession(r: Row): Session {
  return {
    id: r.id,
    topic: r.topic,
    categoryId: r.category_id,
    mode: r.mode,
    seconds: r.seconds,
    at: new Date(r.created_at).getTime(),
  };
}

function sessionToRow(s: Session, userId: string): Row {
  return {
    id: s.id,
    user_id: userId,
    topic: s.topic,
    category_id: s.categoryId,
    mode: s.mode,
    seconds: s.seconds,
    created_at: new Date(s.at).toISOString(),
  };
}

/**
 * Append-only журналды синхрондоштурат: серверде жок локалдык жазууларды
 * жүктөйт, серверден бардык жазууларды кайтарат (локалга бириктирүү үчүн).
 * Жазуулар өзгөрбөс жана уникалдуу болгондуктан конфликт болбойт.
 */
export async function syncSessions(userId: string, local: Session[]): Promise<Session[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;

  const remote = (data ?? []) as Row[];
  const remoteIds = new Set(remote.map((r) => r.id));
  const toPush = local.filter((s) => !remoteIds.has(s.id)).map((s) => sessionToRow(s, userId));
  if (toPush.length > 0) {
    const { error: insErr } = await supabase.from('sessions').insert(toPush);
    if (insErr) throw insErr;
  }
  return remote.map(rowToSession);
}

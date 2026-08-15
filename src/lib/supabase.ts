import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Supabase жөндөлгөнбү (env бар болсо). Жок болсо — толук локалдык режим. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Жалгыз Supabase кардары. env жок болсо null — тиркеме мурункудай локалдык
 * режимде иштей берет, кирүү баскычы көрүнбөйт.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

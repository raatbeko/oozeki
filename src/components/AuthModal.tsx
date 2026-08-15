import { AnimatePresence, motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { supabase } from '../lib/supabase';

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error';

type AuthModalProps = {
  open: boolean;
  user: User | null;
  syncState: SyncState;
  sessionCount: number;
  onClose: () => void;
};

const primaryBtn =
  'bg-accent w-full rounded-full py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgb(194_69_47/0.32)] transition-colors hover:bg-[#ad3e2a] disabled:opacity-50';
const field =
  'border-line bg-surface/60 text-ink w-full rounded-full border px-4 py-3 text-sm outline-none placeholder:text-ink-muted focus:border-accent/50';

export function AuthModal({ open, user, syncState, sessionCount, onClose }: AuthModalProps) {
  const t = useT();
  const [step, setStep] = useState<'menu' | 'sent'>('menu');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setStep('menu');
      setError(null);
      setBusy(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  const signInGoogle = async () => {
    if (!supabase) return;
    setError(null);
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (err) {
      setError(err.message);
      setBusy(false);
    }
    // ийгиликтүү болсо — Google'га багытталат
  };

  const sendLink = async () => {
    if (!supabase || !email.trim()) return;
    setError(null);
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin, shouldCreateUser: true },
    });
    setBusy(false);
    if (err) setError(err.message);
    else setStep('sent');
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    onClose();
  };

  const syncLabel =
    syncState === 'syncing'
      ? t.auth.syncing
      : syncState === 'error'
        ? t.auth.syncError
        : t.auth.synced;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#23201b]/25 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="border-line bg-bg-soft w-full max-w-sm rounded-t-3xl border p-6 shadow-[0_24px_60px_rgb(35_32_27/0.25)] sm:rounded-3xl sm:p-7 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            {user ? (
              <>
                <h2 className="font-serif text-2xl font-bold">{t.auth.accountTitle}</h2>
                <p className="text-ink-muted mt-3 text-sm">
                  {t.auth.signedInAs}: <span className="text-ink font-medium">{user.email}</span>
                </p>
                <div className="border-line bg-surface/50 mt-4 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      syncState === 'error'
                        ? 'bg-accent'
                        : syncState === 'syncing'
                          ? 'bg-gold'
                          : 'bg-green'
                    }`}
                  />
                  <span className="text-ink flex-1">{syncLabel}</span>
                  <span className="text-ink-muted tabular-nums">{sessionCount}</span>
                </div>
                <p className="text-ink-muted/70 mt-3 text-xs">{t.auth.syncNote}</p>
                <button type="button" onClick={signOut} className={`${primaryBtn} mt-5`}>
                  {t.auth.signOut}
                </button>
              </>
            ) : step === 'menu' ? (
              <>
                <h2 className="font-serif text-2xl font-bold">{t.auth.title}</h2>
                <p className="text-ink-muted mt-2 text-sm">{t.auth.intro}</p>
                <div className="mt-5 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={signInGoogle}
                    disabled={busy}
                    className="border-line bg-surface text-ink hover:bg-surface/70 flex w-full items-center justify-center gap-2.5 rounded-full border py-3 text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    <GoogleIcon />
                    {t.auth.google}
                  </button>
                  <div className="text-ink-muted my-1 flex items-center gap-3 text-xs">
                    <span className="bg-line h-px flex-1" />
                    {t.auth.or}
                    <span className="bg-line h-px flex-1" />
                  </div>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={t.auth.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendLink()}
                    className={field}
                  />
                  <button
                    type="button"
                    onClick={sendLink}
                    disabled={busy || !email.trim()}
                    className={primaryBtn}
                  >
                    {busy ? t.auth.working : t.auth.sendLink}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-bold">{t.auth.title}</h2>
                <p className="text-ink-muted mt-4 text-sm">{t.auth.linkSent}</p>
                <p className="text-ink mt-1 font-medium break-all">{email.trim()}</p>
                <p className="text-ink-muted/80 mt-3 text-xs">{t.auth.linkHint}</p>
                <button
                  type="button"
                  onClick={() => {
                    setStep('menu');
                    setError(null);
                  }}
                  className="text-ink-muted hover:text-ink mt-5 text-xs"
                >
                  {t.auth.back}
                </button>
              </>
            )}

            {error && <p className="text-accent mt-3 text-xs">{error}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.1z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9h-7.3v5.7C8.1 41.1 15.5 46 24 46z" />
      <path fill="#FBBC05" d="M11.8 27.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5C3 16 2.1 19.9 2.1 23s.9 7 2.4 10l7.3-5.7z" />
      <path fill="#EA4335" d="M24 9.9c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 3.5 29.9 1.5 24 1.5 15.5 1.5 8.1 6.4 4.5 13.3l7.3 5.7c1.7-5.2 6.5-9.1 12.2-9.1z" />
    </svg>
  );
}

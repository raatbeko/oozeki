import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AboutModal } from './components/AboutModal';
import { AccountButton } from './components/AccountButton';
import { AnswerModal } from './components/AnswerModal';
import { AuthModal, type SyncState } from './components/AuthModal';
import { CategorySelect } from './components/CategorySelect';
import { FullscreenTimer } from './components/FullscreenTimer';
import { Header } from './components/Header';
import { ModeSwitch } from './components/ModeSwitch';
import { OrnamentBackground } from './components/OrnamentBackground';
import { ProgressScreen } from './components/ProgressScreen';
import { SettingsModal } from './components/SettingsModal';
import { TimerControls } from './components/TimerControls';
import { TopMenu } from './components/TopMenu';
import { TopicDisplay, type Status } from './components/TopicDisplay';
import { categoriesFor, topicKg, topicsFor } from './data/categories';
import { strings } from './data/ui-strings';
import { LocaleContext } from './i18n';
import { isSupabaseConfigured } from './lib/supabase';
import { syncSessions } from './lib/sessionsRemote';
import { useAuth } from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';
import { useSettings, type Mode } from './hooks/useSettings';
import { useTimer } from './hooks/useTimer';
import { useTopicSpinner } from './hooks/useTopicSpinner';
import { useWakeLock } from './hooks/useWakeLock';
import { playFinal, playPrepDone, playWarn } from './lib/sounds';

/** Барабандан тышкаркы фазалар: тартылып жаткан учур spinner'ден келет. */
type Phase = 'idle' | 'prep' | 'prepDone' | 'speaking' | 'done';

export default function App() {
  const { settings, update } = useSettings();
  const [phase, setPhase] = useState<Phase>('idle');
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>('idle');

  const t = strings[settings.locale];

  useEffect(() => {
    document.documentElement.lang = settings.locale;
  }, [settings.locale]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', settings.theme === 'dark' ? '#171410' : '#faf8f3');
  }, [settings.theme]);

  const visibleCategories = useMemo(() => categoriesFor(settings.mode), [settings.mode]);

  const category = useMemo(
    () =>
      visibleCategories.find((c) => c.id === settings.categoryId) ?? visibleCategories[0],
    [visibleCategories, settings.categoryId],
  );

  const topics = useMemo(
    () => topicsFor(category, settings.mode),
    [category, settings.mode],
  );

  const spinner = useTopicSpinner(topics, settings.muted, `${category.id}:${settings.mode}`);
  const { topic, spinning, spin: spinTopic, reset: resetSpinner } = spinner;

  const { sessions, logSession, mergeSessions } = useProgress();
  const { user } = useAuth();
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;
  const syncingRef = useRef(false);

  const timer = useTimer(
    () => {
      if (phase === 'prep') {
        playPrepDone(settings.muted);
        setPhase('prepDone');
        return;
      }
      playFinal(settings.muted);
      if (topic) {
        logSession({
          topic: topicKg(topic),
          categoryId: category.id,
          mode: settings.mode,
          seconds: settings.speechMin * 60,
        });
      }
      setPhase('done');
    },
    () => {
      if (phase === 'speaking') playWarn(settings.muted);
    },
  );

  const {
    start: startTimer,
    stop: stopTimer,
    pause: pauseTimer,
    resume: resumeTimer,
    running: timerRunning,
  } = timer;

  // Режим/категория алмашканда — баарын нөлдөн баштайбыз
  const resetAll = useCallback(() => {
    stopTimer();
    resetSpinner();
    setPaused(false);
    setPhase('idle');
  }, [stopTimer, resetSpinner]);

  const changeMode = useCallback(
    (mode: Mode) => {
      if (mode === settings.mode) return;
      // Режим алмашканда тема сакталат: «Даярдыксыз» режиминде тартылган
      // теманы билбесең, «Терең изилдөө»гө өтүп даярдануу таймерин коё аласың.
      stopTimer();
      setPhase('idle');
      update({ mode });
    },
    [settings.mode, stopTimer, update],
  );

  const changeCategory = useCallback(
    (categoryId: string) => {
      if (categoryId === settings.categoryId) return;
      resetAll();
      update({ categoryId });
    },
    [settings.categoryId, resetAll, update],
  );

  // Жаңы тема тартканда — эстелген убакыт да, тыныгуу да таштап салынат
  const spin = useCallback(() => {
    stopTimer();
    setPaused(false);
    setPhase('idle');
    spinTopic();
  }, [stopTimer, spinTopic]);

  const startSpeech = useCallback(() => {
    if (!topic) return;
    startTimer(settings.speechMin * 60_000);
    setPaused(false);
    setPhase('speaking');
  }, [topic, startTimer, settings.speechMin]);

  const startPrep = useCallback(() => {
    if (!topic) return;
    startTimer(settings.prepMin * 60_000);
    setPaused(false);
    setPhase('prep');
  }, [topic, startTimer, settings.prepMin]);

  const finishPrepEarly = useCallback(() => {
    stopTimer();
    setPaused(false);
    playPrepDone(settings.muted);
    setPhase('prepDone');
  }, [stopTimer, settings.muted]);

  // Тыныгуу: таймер токтойт, бирок калган убакыт эстелип калат
  const pauseAll = useCallback(() => {
    pauseTimer();
    setPaused(true);
  }, [pauseTimer]);

  // Эстелген убакыттан улантуу
  const resumeAll = useCallback(() => {
    resumeTimer();
    setPaused(false);
  }, [resumeTimer]);

  // Толук экранда таймерди басканда — тыныгуу/улантуу
  const togglePauseFs = useCallback(() => {
    if (timerRunning) pauseAll();
    else if (paused) resumeAll();
  }, [timerRunning, paused, pauseAll, resumeAll]);

  // Сүйлөөнү мөөнөтүнөн мурда бүтүрүү: таймер токтойт, тема + жооп көрүнөт
  const finishSpeech = useCallback(() => {
    // Чын эле сүйлөгөн убакытты журналга жазабыз (толук эмес сессия)
    const spoken = Math.max(0, Math.round((timer.totalMs - timer.leftMs) / 1000));
    if (topic && spoken >= 3) {
      logSession({
        topic: topicKg(topic),
        categoryId: category.id,
        mode: settings.mode,
        seconds: spoken,
      });
    }
    stopTimer();
    setPaused(false);
    setPhase('done');
  }, [topic, category.id, settings.mode, timer.totalMs, timer.leftMs, logSession, stopTimer]);

  // Таймерди кайра баштоо (факап болсо): учурдагы фазанын толук убактысынан
  const restartTimer = useCallback(() => {
    if (phase === 'prep') startTimer(settings.prepMin * 60_000);
    else if (phase === 'speaking') startTimer(settings.speechMin * 60_000);
    else return;
    setPaused(false);
  }, [phase, startTimer, settings.prepMin, settings.speechMin]);

  // Enter: таймерди коё/тыныктыр/уланткыла (учурдагы фазага жараша)
  const toggleTimer = useCallback(() => {
    if (timerRunning) {
      pauseAll();
    } else if (paused) {
      resumeAll();
    } else if (settings.mode === 'quick' || phase === 'prepDone' || phase === 'done') {
      startSpeech();
    } else {
      startPrep();
    }
  }, [timerRunning, paused, settings.mode, phase, pauseAll, resumeAll, startSpeech, startPrep]);

  // Ыкчам баскычтар: Space — тартуу, Enter — таймер. Модалка ачыкта иштебейт.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (settingsOpen || aboutOpen || answerOpen || progressOpen || accountOpen || fullscreen) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, input, select, textarea, a, [role="listbox"]')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!timerRunning) spin();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        toggleTimer();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [settingsOpen, aboutOpen, answerOpen, progressOpen, accountOpen, fullscreen, timerRunning, spin, toggleTimer]);

  useWakeLock(timerRunning);

  // Кирген соң жана жаңы сессия жазылганда — журналды синхрондоштуруу
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;
    let cancelled = false;
    const run = async () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      setSyncState('syncing');
      try {
        const remote = await syncSessions(user.id, sessionsRef.current);
        if (!cancelled) {
          mergeSessions(remote);
          setSyncState('synced');
        }
      } catch {
        if (!cancelled) setSyncState('error');
      } finally {
        syncingRef.current = false;
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [user, sessions.length, mergeSessions]);

  const status: Status = spinning
    ? 'spinning'
    : paused
      ? 'paused'
      : phase === 'idle'
        ? 'ready'
        : phase;
  const warning = phase === 'speaking' && !paused && timer.leftMs <= 10_000;

  return (
    <LocaleContext.Provider value={t}>
      <div className="flex h-dvh flex-col overflow-hidden">
        <OrnamentBackground />

        <div className="pointer-events-none fixed inset-x-0 top-3 z-10 flex items-start justify-between px-3 sm:top-5 sm:px-5">
          <div className="pointer-events-auto">
            <TopMenu
              theme={settings.theme}
              locale={settings.locale}
              onThemeChange={(theme) => update({ theme })}
              onLocaleChange={(locale) => update({ locale })}
              onOpenProgress={() => setProgressOpen(true)}
            />
          </div>
          {isSupabaseConfigured && (
            <div className="pointer-events-auto">
              <AccountButton email={user?.email ?? null} onClick={() => setAccountOpen(true)} />
            </div>
          )}
        </div>

        <Header onOpenAbout={() => setAboutOpen(true)} />

      <div className="mt-4 flex flex-col items-center gap-3 sm:mt-6 sm:gap-4 lg:mt-6 lg:gap-5 [@media(max-height:720px)]:mt-2! [@media(max-height:720px)]:gap-2!">
        <ModeSwitch mode={settings.mode} onChange={changeMode} />
        <CategorySelect
          categories={visibleCategories}
          value={category.id}
          locale={settings.locale}
          onChange={changeCategory}
        />
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center px-5 py-4">
        <TopicDisplay
          topic={topic}
          status={status}
          spinning={spinning}
          leftMs={timer.leftMs}
          totalMs={timer.totalMs}
          timerVisible={timerRunning || paused}
          warning={warning}
          researchMode={settings.mode === 'research'}
          onShowAnswer={() => setAnswerOpen(true)}
        />
      </main>

      <div className="pb-8 sm:pb-12 lg:pb-16 [@media(max-height:720px)]:pb-3!">
        <p className="text-ink-muted mx-auto mb-4 max-w-sm px-6 text-center text-xs leading-relaxed text-balance lg:mb-5 lg:max-w-md lg:text-sm [@media(max-height:680px)]:hidden">
          {settings.mode === 'quick' ? t.modes.quickHint : t.modes.researchHint}
        </p>
        <TimerControls
          mode={settings.mode}
          status={status}
          spinning={spinning}
          speaking={phase === 'speaking'}
          hasTopic={topic !== null}
          speechMin={settings.speechMin}
          prepMin={settings.prepMin}
          onSpin={spin}
          onStartSpeech={startSpeech}
          onStartPrep={startPrep}
          onReady={finishPrepEarly}
          onPause={pauseAll}
          onResume={resumeAll}
          onFinish={finishSpeech}
          onRestart={restartTimer}
          onFullscreen={() => setFullscreen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onUpdate={update}
        onClose={() => setSettingsOpen(false)}
      />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <AnswerModal open={answerOpen} topic={topic} onClose={() => setAnswerOpen(false)} />
      <ProgressScreen
        open={progressOpen}
        sessions={sessions}
        locale={settings.locale}
        onClose={() => setProgressOpen(false)}
      />
      <AuthModal
        open={accountOpen}
        user={user}
        syncState={syncState}
        sessionCount={sessions.length}
        onClose={() => setAccountOpen(false)}
      />

      {fullscreen && (
        <FullscreenTimer
          status={status}
          leftMs={timer.leftMs}
          totalMs={timer.totalMs}
          warning={warning}
          running={timerRunning}
          canRestart={phase === 'prep' || phase === 'speaking'}
          onTogglePause={togglePauseFs}
          onRestart={restartTimer}
          onExit={() => setFullscreen(false)}
        />
      )}
      </div>
    </LocaleContext.Provider>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AboutModal } from './components/AboutModal';
import { CategorySelect } from './components/CategorySelect';
import { Header } from './components/Header';
import { LangSwitch } from './components/LangSwitch';
import { ModeSwitch } from './components/ModeSwitch';
import { OrnamentBackground } from './components/OrnamentBackground';
import { SettingsModal } from './components/SettingsModal';
import { TimerControls } from './components/TimerControls';
import { TopicDisplay, type Status } from './components/TopicDisplay';
import { categoriesFor, topicsFor } from './data/categories';
import { strings } from './data/ui-strings';
import { LocaleContext } from './i18n';
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const t = strings[settings.locale];

  useEffect(() => {
    document.documentElement.lang = settings.locale;
  }, [settings.locale]);

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

  const timer = useTimer(
    () => {
      setPhase((p) => {
        if (p === 'prep') {
          playPrepDone(settings.muted);
          return 'prepDone';
        }
        playFinal(settings.muted);
        return 'done';
      });
    },
    () => {
      if (phase === 'speaking') playWarn(settings.muted);
    },
  );

  const spinner = useTopicSpinner(topics, settings.muted, `${category.id}:${settings.mode}`);

  const {
    start: startTimer,
    stop: stopTimer,
    pause: pauseTimer,
    resume: resumeTimer,
    running: timerRunning,
  } = timer;
  const { topic, spinning, spin: spinTopic, reset: resetSpinner } = spinner;

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
      if (settingsOpen || aboutOpen) return;
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
  }, [settingsOpen, aboutOpen, timerRunning, spin, toggleTimer]);

  useWakeLock(timerRunning);

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
        <LangSwitch locale={settings.locale} onChange={(locale) => update({ locale })} />

        <Header onOpenAbout={() => setAboutOpen(true)} />

      <div className="mt-4 flex flex-col items-center gap-3 sm:mt-6 sm:gap-4 lg:mt-6 lg:gap-5">
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
        />
      </main>

      <div className="pb-8 sm:pb-12 lg:pb-16">
        <p className="text-ink-muted mx-auto mb-4 max-w-sm px-6 text-center text-xs leading-relaxed text-balance lg:mb-5 lg:max-w-md lg:text-sm">
          {settings.mode === 'quick' ? t.modes.quickHint : t.modes.researchHint}
        </p>
        <TimerControls
          mode={settings.mode}
          status={status}
          spinning={spinning}
          hasTopic={topic !== null}
          speechMin={settings.speechMin}
          prepMin={settings.prepMin}
          onSpin={spin}
          onStartSpeech={startSpeech}
          onStartPrep={startPrep}
          onReady={finishPrepEarly}
          onPause={pauseAll}
          onResume={resumeAll}
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
      </div>
    </LocaleContext.Provider>
  );
}

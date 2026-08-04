import { useCallback, useEffect, useMemo, useState } from 'react';
import { AboutModal } from './components/AboutModal';
import { CategorySelect } from './components/CategorySelect';
import { Header } from './components/Header';
import { ModeSwitch } from './components/ModeSwitch';
import { OrnamentBackground } from './components/OrnamentBackground';
import { ProgressLine } from './components/ProgressLine';
import { SettingsModal } from './components/SettingsModal';
import { TimerControls } from './components/TimerControls';
import { TopicDisplay, type Status } from './components/TopicDisplay';
import { categoriesFor, topicsFor } from './data/categories';
import { t } from './data/ui-strings';
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

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

  const { start: startTimer, stop: stopTimer, running: timerRunning } = timer;
  const { topic, spinning, spin: spinTopic, reset: resetSpinner } = spinner;

  // Режим/категория алмашканда — баарын нөлдөн баштайбыз
  const resetAll = useCallback(() => {
    stopTimer();
    resetSpinner();
    setPhase('idle');
  }, [stopTimer, resetSpinner]);

  const changeMode = useCallback(
    (mode: Mode) => {
      if (mode === settings.mode) return;
      resetAll();
      update({ mode });
    },
    [settings.mode, resetAll, update],
  );

  const changeCategory = useCallback(
    (categoryId: string) => {
      if (categoryId === settings.categoryId) return;
      resetAll();
      update({ categoryId });
    },
    [settings.categoryId, resetAll, update],
  );

  const spin = useCallback(() => {
    stopTimer();
    setPhase('idle');
    spinTopic();
  }, [stopTimer, spinTopic]);

  const startSpeech = useCallback(() => {
    if (!topic) return;
    startTimer(settings.speechMin * 60_000);
    setPhase('speaking');
  }, [topic, startTimer, settings.speechMin]);

  const startPrep = useCallback(() => {
    if (!topic) return;
    startTimer(settings.prepMin * 60_000);
    setPhase('prep');
  }, [topic, startTimer, settings.prepMin]);

  const finishPrepEarly = useCallback(() => {
    stopTimer();
    playPrepDone(settings.muted);
    setPhase('prepDone');
  }, [stopTimer, settings.muted]);

  const stopAll = useCallback(() => {
    stopTimer();
    setPhase('idle');
  }, [stopTimer]);

  // Enter: таймерди баштоо/токтотуу (учурдагы фазага жараша)
  const toggleTimer = useCallback(() => {
    if (timerRunning) {
      stopAll();
    } else if (settings.mode === 'quick' || phase === 'prepDone' || phase === 'done') {
      startSpeech();
    } else {
      startPrep();
    }
  }, [timerRunning, settings.mode, phase, stopAll, startSpeech, startPrep]);

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

  const status: Status = spinning ? 'spinning' : phase === 'idle' ? 'ready' : phase;
  const progressFraction = timer.totalMs > 0 ? timer.leftMs / timer.totalMs : 0;
  const warning = phase === 'speaking' && timer.leftMs <= 10_000;

  return (
    <div className="flex min-h-dvh flex-col">
      <OrnamentBackground />

      <Header onOpenAbout={() => setAboutOpen(true)} />

      <div className="mt-6 flex flex-col items-center gap-4 sm:mt-8">
        <ModeSwitch mode={settings.mode} onChange={changeMode} />
        <CategorySelect
          categories={visibleCategories}
          value={category.id}
          onChange={changeCategory}
        />
      </div>

      <main className="flex flex-1 flex-col items-center px-5 py-6">
        <TopicDisplay
          topic={topic}
          status={status}
          spinning={spinning}
          leftMs={timer.leftMs}
          timerVisible={timerRunning}
          researchMode={settings.mode === 'research'}
        >
          <ProgressLine fraction={progressFraction} warning={warning} visible={timerRunning} />
        </TopicDisplay>
      </main>

      <div className="pb-8 sm:pb-12">
        <p className="text-ink-muted mx-auto mb-4 max-w-sm px-6 text-center text-xs leading-relaxed text-balance">
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
          onStop={stopAll}
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
  );
}

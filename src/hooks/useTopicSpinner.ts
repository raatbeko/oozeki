import { useCallback, useEffect, useRef, useState } from 'react';
import { topicKg, type Topic } from '../data/categories';
import { playChord, playTick } from '../lib/sounds';

/** Барабандын жалпы узактыгы (~3 сек) жана басаңдоо параметрлери. */
const SPIN_MS = 3000;
const FIRST_STEP_MS = 65;
const SLOWDOWN = 1.12;

export type SpinnerHandle = {
  topic: Topic | null;
  spinning: boolean;
  spin: () => void;
  reset: () => void;
};

/** Колоданын абалы: калган темалар жана акыркы чыккан тема. */
/**
 * Колоданын абалы: калган темалар, акыркы чыккан тема жана аралаштыруу
 * учурундагы толук пул (all) — жаңы кошулган темаларды таанып, учурдагы
 * колодага дароо аралаштыруу үчүн.
 */
type BagState = { bag: string[]; last: string | null; all: string[] };

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadBag(storageKey: string): BagState | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<BagState>;
    if (!Array.isArray(p.bag) || !p.bag.every((k) => typeof k === 'string')) return null;
    const all =
      Array.isArray(p.all) && p.all.every((k) => typeof k === 'string') ? p.all : null;
    return {
      bag: p.bag,
      last: typeof p.last === 'string' ? p.last : null,
      // эски форматта all жок — учурдагы пул деп эсептейбиз (кайра киргизбөө үчүн)
      all: all ?? [],
    };
  } catch {
    return null;
  }
}

function saveBag(storageKey: string, state: BagState): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    /* приватный режим — колода жөн эле эстелбейт */
  }
}

/**
 * «Барабан»: 600–900 мс бою темаларды тез алмаштырып, анан акыркысын бекитет.
 * Акыркы тема shuffle bag («колода») аркылуу тандалат: бүт пул аралаштырылып,
 * темалар кезеги менен чыгат — пул түгөнмөйүнчө бир да тема кайталанбайт.
 * Колода localStorage'до сакталат, барак жаңыланса да улана берет.
 * prefers-reduced-motion болсо — анимациясыз дароо тандайт.
 */
export function useTopicSpinner(
  topics: Topic[],
  muted: boolean,
  bagKey: string,
): SpinnerHandle {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [spinning, setSpinning] = useState(false);

  const timersRef = useRef<number[]>([]);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setSpinning(false);
    setTopic(null);
  }, [clearTimers]);

  // v2: колодада пулдун снапшоту (all) сакталат — эски v1 колодалар жарабайт
  const storageKey = `oozeki:bag:v2:${bagKey}`;

  /** Колодадан кийинки теманы алат; колода түгөнсө кайра аралаштырат. */
  const drawNext = useCallback((): Topic => {
    const keys = topics.map(topicKg);
    const stored = loadBag(storageKey);
    // темалар жаңыланган болсо, эскилерин колододон чыгарып салабыз
    let bag = stored ? stored.bag.filter((k) => keys.includes(k)) : [];
    let all = stored
      ? (stored.all.length > 0 ? stored.all : keys).filter((k) => keys.includes(k))
      : [];

    // жаңы кошулган темалар кезекти күтпөй эле учурдагы колодага аралашат
    const fresh = keys.filter((k) => !all.includes(k) && !bag.includes(k));
    if (bag.length > 0 && fresh.length > 0) {
      for (const key of fresh) {
        const pos = Math.floor(Math.random() * (bag.length + 1));
        bag.splice(pos, 0, key);
      }
      all = [...all, ...fresh];
    }

    if (bag.length === 0) {
      bag = shuffle(keys);
      all = keys;
      // жаңы колоданын биринчиси мурунку акыркы тема болбосун
      if (bag.length > 1 && bag[0] === stored?.last) {
        const j = 1 + Math.floor(Math.random() * (bag.length - 1));
        [bag[0], bag[j]] = [bag[j], bag[0]];
      }
    }
    const [nextKey, ...rest] = bag;
    saveBag(storageKey, { bag: rest, last: nextKey, all });
    return topics.find((item) => topicKg(item) === nextKey) ?? topics[0];
  }, [topics, storageKey]);

  const spin = useCallback(() => {
    if (spinning || topics.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setTopic(drawNext());
      playChord(mutedRef.current);
      return;
    }

    setSpinning(true);
    // Слот-машина сыяктуу: адегенде тез, аягына жакын барган сайын жайыраак
    const durationMs = SPIN_MS + Math.random() * 400;
    let elapsedMs = 0;
    let delayMs = FIRST_STEP_MS;

    const step = (): void => {
      setTopic(topics[Math.floor(Math.random() * topics.length)]);
      playTick(mutedRef.current);
      elapsedMs += delayMs;
      delayMs *= SLOWDOWN;
      if (elapsedMs + delayMs < durationMs) {
        timersRef.current.push(window.setTimeout(step, delayMs));
      } else {
        timersRef.current.push(
          window.setTimeout(() => {
            setTopic(drawNext());
            setSpinning(false);
            playChord(mutedRef.current);
          }, delayMs),
        );
      }
    };
    step();
  }, [spinning, topics, drawNext]);

  useEffect(() => clearTimers, [clearTimers]);

  return { topic, spinning, spin, reset };
}

/**
 * Үн эффекттери — Web Audio API (OscillatorNode) аркылуу, тышкы файлсыз.
 * AudioContext биринчи колдонуучу аракетинде түзүлөт (iOS талабы).
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function blip(
  freq: number,
  durationS: number,
  peakGain: number,
  type: OscillatorType = 'sine',
  delayS = 0,
): void {
  const audio = getCtx();
  if (!audio) return;
  const t0 = audio.currentTime + delayS;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peakGain, t0 + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durationS);
  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + durationS + 0.05);
}

/** Барабандын ар бир кадамындагы кыска «тик». */
export function playTick(muted: boolean): void {
  if (muted) return;
  blip(1400, 0.04, 0.035, 'square');
}

/** Тема аныкталгандагы жыйынтыктоочу аккорд (C5–E5–G5). */
export function playChord(muted: boolean): void {
  if (muted) return;
  [523.25, 659.25, 783.99].forEach((f, i) => blip(f, 0.7, 0.07, 'sine', i * 0.05));
}

/** Аякташка 10 секунд калганда — акырын эскертүү. */
export function playWarn(muted: boolean): void {
  if (muted) return;
  blip(880, 0.1, 0.045, 'sine');
}

/** Сүйлөө таймери бүткөндөгү финалдык сигнал (G4–C5–E5, узунураак). */
export function playFinal(muted: boolean): void {
  if (muted) return;
  [392, 523.25, 659.25].forEach((f, i) => blip(f, 1.1, 0.09, 'sine', i * 0.08));
}

/** Изилдөө бүткөндө — эки жумшак сигнал. */
export function playPrepDone(muted: boolean): void {
  if (muted) return;
  blip(660, 0.15, 0.06, 'sine');
  blip(880, 0.25, 0.06, 'sine', 0.18);
}

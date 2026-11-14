import { useEffect, useRef, useState } from 'react'
import { useTr } from '../i18n'

const KEY = 'oozeki:music'
const VOLUME = 0.12

function savedOn() {
  try {
    return localStorage.getItem(KEY) !== 'off'
  } catch {
    return true
  }
}

/** Фондогу акырын музыка. Браузер үн менен өзү баштоого уруксат бербейт — биринчи басылганда башталат. */
export function MusicButton() {
  const tr = useTr()
  const audio = useRef<HTMLAudioElement | null>(null)
  const [on, setOn] = useState(savedOn)
  const [playing, setPlaying] = useState(false)

  // Үндү Web Audio аркылуу башкарабыз: iPhone'до audio.volume иштебейт, а gain иштейт
  const graph = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null)
  const stopTimer = useRef<number | undefined>(undefined)

  const get = () => {
    if (!audio.current) {
      const a = new Audio('/music/bg.mp3')
      a.loop = true
      a.preload = 'none'
      a.addEventListener('play', () => setPlaying(true))
      a.addEventListener('pause', () => setPlaying(false))
      audio.current = a
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (Ctx) {
          const ctx = new Ctx()
          const gain = ctx.createGain()
          gain.gain.value = 0
          ctx.createMediaElementSource(a).connect(gain).connect(ctx.destination)
          graph.current = { ctx, gain }
        } else {
          a.volume = VOLUME
        }
      } catch {
        a.volume = VOLUME
      }
    }
    return audio.current
  }

  const ramp = (to: number, seconds: number) => {
    const g = graph.current
    if (!g) return
    const now = g.ctx.currentTime
    g.gain.gain.cancelScheduledValues(now)
    g.gain.gain.setValueAtTime(g.gain.gain.value, now)
    g.gain.gain.linearRampToValueAtTime(to, now + seconds)
  }

  const start = () => {
    window.clearTimeout(stopTimer.current)
    const a = get()
    graph.current?.ctx.resume().catch(() => {})
    a.play()
      .then(() => ramp(VOLUME, 1.2))
      .catch(() => {
        /* браузер бөгөттөдү — кийинки басууну күтөбүз */
      })
  }

  const stop = () => {
    const a = audio.current
    if (!a) return
    window.clearTimeout(stopTimer.current)
    if (graph.current) {
      ramp(0, 0.25)
      stopTimer.current = window.setTimeout(() => a.pause(), 280)
    } else {
      a.pause()
    }
    setPlaying(false)
  }

  // Күйүк болсо — биринчи басууда баштайбыз
  useEffect(() => {
    if (!on) return
    start()
    const kick = (e: Event) => {
      // Музыка баскычынын өзүн баскан болсо — аны toggle чечет
      if ((e.target as Element | null)?.closest?.('[data-music]')) return cleanup()
      if (audio.current && !audio.current.paused) return cleanup()
      start()
    }
    const events = ['pointerdown', 'keydown', 'touchstart'] as const
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, kick))
    events.forEach((e) => window.addEventListener(e, kick, { passive: true }))
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on])

  // Башка вкладкага өткөндө тыным
  useEffect(() => {
    const onVis = () => {
      const a = audio.current
      if (!a || !on) return
      if (document.hidden) a.pause()
      else start()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on])

  useEffect(() => () => audio.current?.pause(), [])

  const toggle = () => {
    const next = !(on && playing)
    setOn(next)
    try {
      localStorage.setItem(KEY, next ? 'on' : 'off')
    } catch {
      /* жок болсо — эч нерсе */
    }
    if (next) start()
    else stop()
  }

  const active = on && playing
  return (
    <button
      type="button"
      onClick={toggle}
      data-music
      aria-pressed={active}
      aria-label={active ? tr('Музыканы өчүрүү', 'Выключить музыку') : tr('Музыканы күйгүзүү', 'Включить музыку')}
      title={active ? tr('Музыканы өчүрүү', 'Выключить музыку') : tr('Музыканы күйгүзүү', 'Включить музыку')}
      className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors ${
        active ? 'border-accent/50 bg-accent-soft text-accent' : 'border-line bg-bg-soft text-ink-muted hover:text-ink'
      }`}
    >
      {active ? (
        <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[3px] origin-bottom rounded-full bg-current"
              style={{ height: '100%', animation: `oz-bar .9s ease-in-out ${i * 0.18}s infinite` }}
            />
          ))}
        </span>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="16.5" cy="16" r="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
    </button>
  )
}

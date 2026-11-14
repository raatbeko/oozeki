import { useEffect, useRef } from 'react'

type P = [number, number, number]

const DUST = 110

/**
 * Боз үйдүн 3D-модели чекиттерден (у — жогору):
 * - кереге: торчо дубал, y −0.42…0;
 * - уук: кереге шакегинен түндүккө чейин түз (бир аз ийилген) таяктар — конус;
 * - түндүк: калың алкак + эки тараптан үчтөн ийилген күлдүрүш (желектегидей).
 */
const ROOF_Y = 0.5 // түндүктүн бийиктиги
const T_R = 0.27 // түндүктүн радиусу

function buildPoints(): P[] {
  const pts: P[] = []
  const TAU = Math.PI * 2
  const ring = (y: number, r: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU
      pts.push([Math.cos(a) * r, y, Math.sin(a) * r])
    }
  }
  const line = (a: P, b: P, n: number, bow = 0) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const lift = bow * Math.sin(Math.PI * t)
      pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + lift, a[2] + (b[2] - a[2]) * t])
    }
  }

  // Кереге: жогорку жана төмөнкү шакек
  ring(0, 1, 260)
  ring(-0.42, 1, 200)
  // Кереге торчосу — эки тарапка кыйгач тилкелер
  const K = 44
  for (let k = 0; k < K; k++) {
    const a0 = (k / K) * TAU
    const da = (TAU / K) * 2.2
    for (const dir of [1, -1]) {
      for (let i = 0; i <= 12; i++) {
        const t = i / 12
        const a = a0 + dir * da * t
        pts.push([Math.cos(a), -0.42 + 0.42 * t, Math.sin(a)])
      }
    }
  }

  // Уук: 48 таяк, кереге шакегинен түндүктүн алкагына — бир аз дого тартылган
  const U = 48
  for (let k = 0; k < U; k++) {
    const a = (k / U) * TAU
    line([Math.cos(a), 0, Math.sin(a)], [Math.cos(a) * T_R, ROOF_Y, Math.sin(a) * T_R], 20, 0.06)
  }

  // Түндүктүн алкагы — калың (үч шакек)
  ring(ROOF_Y, T_R, 110)
  ring(ROOF_Y + 0.02, T_R, 110)
  ring(ROOF_Y, T_R - 0.025, 100)

  // Күлдүрүш: эки тараптан үчтөн ийилген тилке, алкактан жогору дого
  for (const off of [-0.11, 0, 0.11]) {
    const half = Math.sqrt(T_R * T_R - off * off)
    const n = 30
    for (let i = 0; i <= n; i++) {
      const s = -half + (2 * half * i) / n
      const y = ROOF_Y + 0.02 + 0.13 * (1 - (s / half) ** 2)
      pts.push([s, y, off], [off, y, s])
    }
  }

  // Айланадагы чаң — голограмманын «абасы»
  for (let i = 0; i < DUST; i++) {
    const a = Math.random() * TAU
    const r = 1.15 + Math.random() * 0.5
    pts.push([Math.cos(a) * r, -0.5 + Math.random() * 1.2, Math.sin(a) * r])
  }
  return pts
}

function readAccent(): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#c2452f'
  const h = v.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export function HoloTunduk({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pts = buildPoints()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let rotY = 0.6
    const tiltX = 0.32
    let start = performance.now()

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number) => {
      const t = (now - start) / 1000
      const dark = document.documentElement.getAttribute('data-theme') === 'dark'
      const [r, g, b] = readAccent()
      const gold = dark ? [224, 180, 90] : [176, 128, 40]

      // жай айлануу
      rotY += reduce ? 0 : 0.0012

      ctx.clearRect(0, 0, w, h)
      const scale = Math.min(w * 0.46, h * 0.62)
      const cx = w / 2
      const cy = h * 0.6
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(tiltX)
      const sinX = Math.sin(tiltX)
      const base = dark ? 0.85 : 0.55

      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        // айлануу Y, анан X
        let x = p[0] * cosY - p[2] * sinY
        let z = p[0] * sinY + p[2] * cosY
        let y = p[1]
        const y2 = y * cosX - z * sinX
        z = y * sinX + z * cosX
        y = y2
        const persp = 2.6 / (2.6 + z)
        const sx = cx + x * scale * persp
        const sy = cy - y * scale * persp
        const depth = (1 - z) / 2 // 0 — арткы, 1 — алдыңкы
        const dust = i >= pts.length - DUST
        // голограмманын «жымылдоосу»
        const flick = dust ? 0.5 + 0.5 * Math.sin(t * 1.3 + i) : 0.85 + 0.15 * Math.sin(t * 2 + p[1] * 9)
        const a = (dust ? 0.22 : 0.14 + depth * 0.58) * flick * base
        const size = (dust ? 0.9 : 0.6 + depth * 1.0) * persp
        const c = dust ? gold : [r, g, b]
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`
        const d = size * 1.7
        ctx.fillRect(sx - d / 2, sy - d / 2, d, d)
      }
      ctx.globalCompositeOperation = 'source-over'

      if (!reduce && visible) raf = requestAnimationFrame(draw)
    }

    const loop = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    }


    resize()
    loop()
    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) loop()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) {
        start = performance.now() - 1000
        loop()
      }
    })
    io.observe(canvas)
    // тема алмашканда кайра тарт
    const mo = new MutationObserver(() => reduce && loop())
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <canvas ref={ref} className="holo-canvas size-full" />
      {/* голограмманын сызыктары */}
      <div className="holo-lines absolute inset-0" />
      <div className="holo-glow absolute inset-[18%] -z-10 rounded-full" />
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { usePath } from '../router'
import { ornaments } from '../content/ornaments'

interface Placed {
  key: string
  orn: number
  left: number
  top: number
  w: number
  h: number
  delay: number
}

/**
 * Фондогу кыргыз оюулары: үч орнамент жука боз сызык менен, беттин бою боюнча
 * кезек-кезек сол жана оң четте, контенттин артында. Ар 5 секундда контурун кайра
 * тартып чыгат. Компьютерде — ири, четте; телефондо — ири, бирок өтө өчүңкү,
 * экрандын четинен чыгып турат, окууга тоскоол болбойт.
 */
export function OrnamentBackground() {
  const path = usePath()
  const box = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<Placed[]>([])
  const [height, setHeight] = useState(0)

  useEffect(() => {
    let raf = 0
    const layout = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const root = document.getElementById('root')
        const docH = root ? root.offsetHeight : document.body.scrollHeight
        const W = document.documentElement.clientWidth
        const wide = W >= 900
        const start = wide ? 820 : 760 // биринчи экранды (голограмманы) таза калтырабыз
        const step = wide ? 900 : 820
        const out: Placed[] = []
        for (let i = 0, y = start; y < docH - 200 && i < 12; i++, y += step) {
          const n = i % ornaments.length
          const [, , vw, vh] = ornaments[n].vb
          const ar = vh / vw
          let w = wide ? Math.min(W * 0.42, 640) : W * 1.05
          let h = w * ar
          const maxH = wide ? 620 : 520
          if (h > maxH) {
            h = maxH
            w = h / ar
          }
          const left = i % 2 === 0 ? -w * 0.28 : W - w * 0.72
          out.push({ key: `${path}-${i}`, orn: n, left, top: y - h / 2, w, h, delay: -(i * 1.7) })
        }
        setHeight(docH)
        setItems(out)
      })
    }
    layout()
    const ro = new ResizeObserver(layout)
    const root = document.getElementById('root')
    if (root) ro.observe(root)
    window.addEventListener('resize', layout)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', layout)
    }
  }, [path])

  return (
    <div ref={box} aria-hidden="true" className="oz-orns" style={{ height }}>
      {items.map((it) => {
        const [x, y, vw, vh] = ornaments[it.orn].vb
        return (
          <svg
            key={it.key}
            className="oz-orn"
            viewBox={`${x - 10} ${y - 10} ${vw + 20} ${vh + 20}`}
            style={{ left: it.left, top: it.top, width: it.w, height: it.h }}
          >
            <path d={ornaments[it.orn].d} pathLength={1} style={{ animationDelay: `${it.delay}s` }} />
          </svg>
        )
      })}
    </div>
  )
}

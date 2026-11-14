import { useEffect, useState } from 'react'
import type { Shot } from '../content/guides'

export function ShotFigure({ shot, priority = false }: { shot: Shot; priority?: boolean }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <figure className="relative rounded-2xl border border-line bg-surface p-2 shadow-[0_12px_32px_-20px_rgba(35,32,27,.45)]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in overflow-hidden rounded-lg"
        aria-label={`Чоңойтуу: ${shot.caption}`}
      >
        <img
          src={shot.src}
          alt={shot.caption}
          width={1080}
          height={1050}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="aspect-[1080/1050] w-full object-cover"
        />
      </button>
      <figcaption className="px-1 pt-2 pb-0.5 text-[13px] leading-snug text-ink-muted">{shot.caption}</figcaption>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={shot.caption}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-[#0f0d0b]/85 p-4 backdrop-blur-sm"
        >
          <img src={shot.src} alt={shot.caption} className="max-h-[88dvh] w-auto max-w-full rounded-lg shadow-2xl" />
          <button
            type="button"
            className="absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-surface text-xl font-bold text-ink"
            aria-label="Жабуу"
          >
            ×
          </button>
        </div>
      )}
    </figure>
  )
}

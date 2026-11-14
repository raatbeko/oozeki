import type { Guide } from '../content/guides'
import { useContent } from '../content/useContent'
import { useTr } from '../i18n'
import { Link } from '../router'

export function GuideCard({ guide }: { guide: Guide }) {
  const { topics } = useContent()
  const tr = useTr()
  const t = topics[guide.topic]
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_10px_30px_-18px_rgba(29,26,22,.4)] transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg-soft">
        <img
          src={guide.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1.5 text-[12px] font-semibold tracking-[0.14em] uppercase" style={{ color: t.color }}>
          {t.label}
        </p>
        <h3 className="font-serif text-[22px] leading-snug font-bold text-balance">{guide.title}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">{guide.short}</p>
        <p className="mt-4 flex items-center justify-between text-[13px] font-medium">
          <span className="text-ink-muted">
            {guide.steps.length} {tr('шаг', 'шагов')} · {guide.time}
          </span>
          <span className="text-accent group-hover:underline">{tr('Окуу', 'Читать')} →</span>
        </p>
      </div>
    </Link>
  )
}

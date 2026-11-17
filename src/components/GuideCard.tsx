import type { Guide } from '../content/guides'
import { useContent } from '../content/useContent'
import { useTr } from '../i18n'
import { Link } from '../router'

/**
 * Гайддын карточкасы: теманын белгиси мукабанын бурчунда, сыпаттама — мукабанын
 * үстүнө чычкан алып келгенде калкып чыгат (телефондо — аталыштын астында).
 */
export function GuideCard({ guide }: { guide: Guide }) {
  const { topics } = useContent()
  const tr = useTr()
  const t = topics[guide.topic]
  const n = guide.steps.length
  const ruSteps = n % 10 === 1 && n % 100 !== 11 ? 'шаг' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'шага' : 'шагов'
  const meta = `${n} ${tr('шаг', ruSteps)} · ${guide.time}`
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="oz-guide group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_10px_30px_-18px_rgba(29,26,22,.4)] transition-transform duration-500 hover:-translate-y-0.5"
    >
      <div className="oz-guide-cover relative aspect-[16/10] overflow-hidden bg-bg-soft">
        <img
          src={guide.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
        />
        <p className="oz-guide-tag" style={{ color: t.color }}>
          {t.label}
        </p>
        <div className="oz-guide-hover" aria-hidden="true">
          <p className="oz-guide-hover-desc">{guide.short}</p>
          <p className="oz-guide-hover-meta">{meta}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 pt-[18px] pb-5">
        <h3 className="min-w-0 flex-1 font-serif text-[22px] leading-snug font-bold text-balance">{guide.title}</h3>
        <span className="oz-guide-read">{tr('Окуу', 'Читать')} →</span>
        {/* Телефондо (hover жок) сыпаттама жөнөкөй текст болуп турат */}
        <p className="oz-guide-touch basis-full text-[14px] leading-relaxed text-ink-muted">
          {guide.short}
          <span className="mt-1 block text-[13px]">{meta}</span>
        </p>
      </div>
    </Link>
  )
}

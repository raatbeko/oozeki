import { useContent } from '../content/useContent'
import { useTr } from '../i18n'
import { site } from '../content/site'
import { InstagramIcon } from './Logos'

/** «Кабарла» — Instagram'га: жаңы гайддар адегенде рилс болуп чыгат */
export function NotifyButton({ className = '' }: { className?: string }) {
  const tr = useTr()
  return (
    <a
      href={site.instagram}
      target="_blank"
      rel="noopener"
      className={`inline-flex min-h-12 items-center gap-2.5 rounded-full bg-accent px-6 font-semibold text-white transition hover:brightness-110 ${className}`}
    >
      <InstagramIcon />
      {tr("Instagram'га катталып кой", 'Подпишись в Instagram')}
    </a>
  )
}

export function SoonSection({ limit }: { limit?: number }) {
  const { soon, topics } = useContent()
  const tr = useTr()
  const items = limit ? soon.slice(0, limit) : soon
  return (
    <div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => {
          const t = topics[s.topic]
          return (
            <article key={s.title} className="relative flex flex-col rounded-2xl border border-dashed border-line bg-surface/60 p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold text-white" style={{ background: t.color }}>
                  {t.label}
                </span>
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">{tr('жакында', 'скоро')}</span>
              </div>
              <h3 className="mt-4 font-serif text-[20px] leading-snug font-bold">{s.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">{s.text}</p>
            </article>
          )
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <NotifyButton />
        <p className="text-[14px] text-ink-muted">{tr('Адегенде рилс чыгат, анан толугу ушул жерде.', 'Сначала выходит рилс, потом полная версия — здесь.')}</p>
      </div>
    </div>
  )
}

import type { Locale } from '../data/ui-strings';
import { useT } from '../i18n';

type LangSwitchProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
};

const items: Array<{ id: Locale; label: string }> = [
  { id: 'ky', label: 'KG' },
  { id: 'ru', label: 'RU' },
];

/** Интерфейстин тили гана которулат — темалар ар дайым кыргызча. */
export function LangSwitch({ locale, onChange }: LangSwitchProps) {
  const t = useT();
  return (
    <div
      role="radiogroup"
      aria-label={t.a11y.langSwitch}
      className="border-line bg-bg-soft absolute top-3 right-3 z-10 flex rounded-full border p-0.5 sm:top-5 sm:right-5"
    >
      {items.map((item) => {
        const active = item.id === locale;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(item.id)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors ${
              active
                ? 'text-ink bg-white shadow-[0_1px_6px_rgb(35_32_27/0.12)]'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

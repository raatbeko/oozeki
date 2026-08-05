import { motion } from 'framer-motion';
import { useT } from '../i18n';
import type { Mode } from '../hooks/useSettings';

type ModeSwitchProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  const t = useT();
  const items: Array<{ id: Mode; label: string }> = [
    { id: 'quick', label: t.modes.quick },
    { id: 'research', label: t.modes.research },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={t.a11y.modeSwitch}
      className="border-line bg-bg-soft flex rounded-full border p-1"
    >
      {items.map((item) => {
        const active = item.id === mode;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(item.id)}
            className={`relative rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-colors sm:px-6 lg:px-8 lg:py-2.5 lg:text-base ${
              active ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full bg-surface shadow-[0_2px_10px_rgb(35_32_27/0.1)]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

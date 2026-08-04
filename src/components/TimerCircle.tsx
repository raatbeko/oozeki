type TimerCircleProps = {
  leftMs: number;
  totalMs: number;
  /** Шакектин түсү: изилдөө — көк, сүйлөө — алтын, акыркы 10 сек — кызыл. */
  color: 'gold' | 'blue' | 'accent';
  ariaLabel: string;
};

const strokeByColor: Record<TimerCircleProps['color'], string> = {
  gold: 'var(--color-gold)',
  blue: 'var(--color-blue)',
  accent: 'var(--color-accent)',
};

function formatLeft(leftMs: number): string {
  const totalS = Math.ceil(leftMs / 1000);
  const mm = Math.floor(totalS / 60);
  const ss = totalS % 60;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}

const R = 90;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Тегерек таймер: өткөн убакыт шакек болуп толуп барат. */
export function TimerCircle({ leftMs, totalMs, color, ariaLabel }: TimerCircleProps) {
  const elapsed = Math.min(1, Math.max(0, 1 - leftMs / Math.max(totalMs, 1)));

  return (
    <div className="relative flex h-52 w-52 items-center justify-center sm:h-64 sm:w-64 lg:h-80 lg:w-80">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="5"
        />
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke={strokeByColor[color]}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - elapsed)}
          className="transition-[stroke-dashoffset,stroke] duration-300 ease-linear"
        />
      </svg>
      <p
        aria-label={ariaLabel}
        className="text-ink font-serif text-6xl font-bold tabular-nums sm:text-7xl lg:text-8xl"
      >
        {formatLeft(leftMs)}
      </p>
    </div>
  );
}

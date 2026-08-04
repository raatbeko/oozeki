type ProgressLineProps = {
  /** 1 → толук, 0 → бүттү. */
  fraction: number;
  /** Акыркы 10 секунд — түс gold'дон accent'ке өтөт. */
  warning: boolean;
  visible: boolean;
};

export function ProgressLine({ fraction, warning, visible }: ProgressLineProps) {
  return (
    <div
      aria-hidden="true"
      className={`h-[3px] w-56 overflow-hidden rounded-full transition-opacity duration-300 sm:w-72 ${
        visible ? 'bg-line opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`h-full origin-left rounded-full transition-[transform,background-color] duration-300 ease-linear ${
          warning ? 'bg-accent' : 'bg-gold'
        }`}
        style={{ transform: `scaleX(${Math.max(0, Math.min(1, fraction))})` }}
      />
    </div>
  );
}

type TundukProps = {
  size?: number;
  className?: string;
  spinning?: boolean;
};

/** Түндүк — боз үйдүн төбөсү: айлана, кайчылаш уук, ийилген кереге сызыктары. */
export function Tunduk({ size = 28, className = '', spinning = false }: TundukProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`${className} ${spinning ? 'animate-spin [animation-duration:1.4s]' : ''}`}
    >
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="16" cy="16" r="12.5" />
        <path d="M16 5.5v21M5.5 16h21" />
        <path d="M9 9.5c4.4 3.2 9.6 3.2 14 0M9 22.5c4.4-3.2 9.6-3.2 14 0" />
      </g>
    </svg>
  );
}

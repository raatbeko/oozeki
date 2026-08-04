/** «Мүйүз» (кыял) оюусунун бир курчоосу — эки жакка түйүлгөн мүйүз. */
function Horn({ transform }: { transform?: string }) {
  return (
    <g transform={transform} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M100 190V70c0-30 22-52 50-52 20 0 34 14 34 32 0 15-11 25-24 25-10 0-17-7-17-16 0-7 5-12 11-12" />
      <path d="M100 190V70c0-30-22-52-50-52-20 0-34 14-34 32 0 15 11 25 24 25 10 0 17-7 17-16 0-7-5-12-11-12" />
      <path d="M100 190v-40" strokeWidth="3.5" />
    </g>
  );
}

/**
 * Бурчтардагы ири мүйүз-оюу: текстура катары окулушу үчүн opacity өтө төмөн.
 * Экранды окууга тоскол болбошу үчүн pointer-events жок.
 */
export function OrnamentBackground() {
  return (
    <div aria-hidden="true" className="text-ink pointer-events-none fixed inset-0 z-0">
      <svg
        viewBox="0 0 200 200"
        className="absolute -top-14 -left-14 h-64 w-64 rotate-135 opacity-[0.05] sm:h-96 sm:w-96"
      >
        <Horn />
      </svg>
      <svg
        viewBox="0 0 200 200"
        className="absolute -right-14 -bottom-14 h-64 w-64 -rotate-45 opacity-[0.05] sm:h-96 sm:w-96"
      >
        <Horn />
      </svg>
    </div>
  );
}

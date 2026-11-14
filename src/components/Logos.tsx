import { claudePath, openaiPath, instagramPath, telegramPath } from '../icons'

interface Props {
  size?: number
  className?: string
}

function Tile({ path, bg, size = 40, className = '', label }: Props & { path: string; bg: string; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-grid shrink-0 place-items-center rounded-[24%] ${className}`}
      style={{ width: size, height: size, background: bg }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} aria-hidden="true">
        <path d={path} fill="#fff" />
      </svg>
    </span>
  )
}

export const ClaudeLogo = (p: Props) => <Tile {...p} path={claudePath} bg="#D97757" label="Claude" />
export const ChatGPTLogo = (p: Props) => <Tile {...p} path={openaiPath} bg="#111" label="ChatGPT" />

export function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={instagramPath} fill="currentColor" />
    </svg>
  )
}

export function TelegramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={telegramPath} fill="currentColor" />
    </svg>
  )
}

/** Монтаж белгиси: таймлайн */
export function MontajLogo({ size = 40, className = '' }: Props) {
  return (
    <span
      role="img"
      aria-label="Монтаж"
      className={`inline-grid shrink-0 place-items-center rounded-[24%] bg-blue ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} aria-hidden="true" fill="none">
        <rect x="2.5" y="5" width="12" height="4" rx="1.2" fill="#fff" />
        <rect x="9" y="11" width="12.5" height="4" rx="1.2" fill="#F6D21A" />
        <rect x="4" y="17" width="9" height="3" rx="1.2" fill="#fff" opacity=".7" />
        <path d="M16.5 3v18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  )
}

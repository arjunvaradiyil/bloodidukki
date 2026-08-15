import type { StatIcon } from '@/lib/defaults'

type IconProps = {
  className?: string
}

export function DropIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5C12 2.5 5.5 10.2 5.5 15.2a6.5 6.5 0 0 0 13 0C18.5 10.2 12 2.5 12 2.5Z"
        fill="currentColor"
      />
      <path
        d="M12 14.2c-.9 0-1.6.5-1.6 1.3 0 .6.4 1.1 1.1 1.4"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LogoDropIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 48" fill="none" aria-hidden="true">
      <path
        d="M20 2C20 2 4 18.5 4 30.5a16 16 0 0 0 32 0C36 18.5 20 2 20 2Z"
        fill="currentColor"
      />
      <path
        d="M20 28.5c-2.8-2.4-7.2-.9-7.2 2.7 0 2.4 2.1 4.3 4.7 5.5 1.6.7 3.3 1.1 4.5 1.1s2.9-.4 4.5-1.1c2.6-1.2 4.7-3.1 4.7-5.5 0-3.6-4.4-5.1-7.2-2.7-.6.5-1.4.5-2 0Z"
        fill="#E11D2E"
      />
    </svg>
  )
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 20.4s-7.2-4.4-9.4-8.3C.7 9.1 1.7 5.6 5 4.5c2-.7 4 .2 5.2 1.7C11.4 4.7 13.4 3.8 15.4 4.5c3.3 1.1 4.3 4.6 2.4 7.6-2.2 3.9-9.8 8.3-9.8 8.3Z" />
    </svg>
  )
}

export function PeopleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <circle cx="16.5" cy="9" r="2.6" opacity="0.9" />
      <path d="M2.5 19.5c.4-3.4 3.2-5.5 6.5-5.5s6.1 2.1 6.5 5.5" />
      <path d="M13.2 19.5c.3-2.2 1.8-3.8 4-4.2 2.5-.4 4.6 1.2 5.1 3.5" opacity="0.9" />
    </svg>
  )
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6.5-5.4 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.6 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10.5" r="2.2" fill="currentColor" />
    </svg>
  )
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5Z" />
    </svg>
  )
}

export function MouseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 36" fill="none" aria-hidden="true">
      <rect x="4" y="2" width="16" height="26" rx="8" stroke="currentColor" strokeWidth="1.6" />
      <rect x="11" y="7" width="2" height="6" rx="1" fill="currentColor" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5v3.5M16 3.5v3.5M3.5 10h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function StatIcon({ icon, className }: { icon: StatIcon; className?: string }) {
  if (icon === 'people') return <PeopleIcon className={className} />
  if (icon === 'heart') return <HeartIcon className={className} />
  return <DropIcon className={className} />
}

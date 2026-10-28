import { SITE_NAME } from '@/lib/defaults'

function PulseMark({ className }: { className?: string }) {
  return (
    <svg
      className={`h-auto overflow-visible ${className ?? ''}`}
      viewBox="0 0 220 72"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="[stroke-dasharray:210] [stroke-dashoffset:210] animate-ekg motion-reduce:animate-none"
        d="M6 36 H52 L66 10 L80 62 L94 20 L106 36 H150"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="origin-[172px_36px] animate-heartbeat motion-reduce:animate-none"
        d="M172 36c-6-8-18-6-18 5 0 11 18 22 18 22s18-11 18-22c0-11-12-13-18-5z"
        fill="white"
      />
    </svg>
  )
}

type SiteFooterProps = {
  pulse?: boolean
}

export function SiteFooter({ pulse = false }: SiteFooterProps) {
  return (
    <div className="relative z-[2] mt-auto w-full shrink-0 bg-blood-wave pb-[env(safe-area-inset-bottom)]">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-full h-[3.75rem] overflow-visible"
        aria-hidden="true"
      >
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="h-full w-full">
          <path
            className="fill-blood-wave"
            d="M0,36 C180,78 320,6 520,28 C720,50 860,78 1040,48 C1220,18 1340,8 1440,22 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
      <footer className="relative z-[3] px-4 py-3 lg:py-3.5">
        {pulse ? (
          <>
            <PulseMark className="pointer-events-none absolute top-1/2 left-2 w-[3.75rem] -translate-y-1/2 sm:left-3 sm:w-[5.5rem] lg:left-4 lg:w-[7.5rem]" />
            <PulseMark className="pointer-events-none absolute top-1/2 right-2 w-[3.75rem] -translate-y-1/2 sm:right-3 sm:w-[5.5rem] lg:right-4 lg:w-[7.5rem]" />
          </>
        ) : null}
        <div className="relative mx-auto min-w-0 text-center font-display text-[0.72rem] font-semibold tracking-wide text-white sm:text-[0.8rem]">
          <p className="m-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-5">
            <span>© 2026 {SITE_NAME.plain}</span>
            <span className="hidden text-white/45 sm:inline" aria-hidden="true">
              ·
            </span>
            <a href="#privacy" className="underline-offset-2 hover:underline">
              Privacy
            </a>
            <span className="hidden text-white/45 sm:inline" aria-hidden="true">
              ·
            </span>
            <a href="#policy" className="underline-offset-2 hover:underline">
              Policy
            </a>
          </p>
          <p className="m-0 mt-1 text-[0.62rem] leading-snug font-medium tracking-[0.02em] text-balance text-white/85 sm:text-[0.72rem]">
            Website powered by DYFI Idukki District Professional Sub Committee · {SITE_NAME.plain}
          </p>
        </div>
        <p className="relative z-[4] mt-1 text-center text-[0.5rem] font-medium tracking-[0.06em] text-white/75 lowercase sm:absolute sm:right-3 sm:bottom-1.5 sm:mt-0 sm:text-right lg:right-5">
          developed by faircode
        </p>
      </footer>
    </div>
  )
}

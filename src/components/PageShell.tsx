import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import { cn } from '@/lib/cn'
import { defaultHeader, HERO_BACKGROUND, SITE_NAME } from '@/lib/defaults'

type PageShellProps = {
  eyebrow?: string
  title: string
  titleAccent?: string
  description?: string
  tone?: 'plain' | 'hero'
  compact?: boolean
  children: ReactNode
}

export async function PageShell({
  eyebrow = 'DYFI Idukki',
  title,
  titleAccent,
  description,
  tone = 'plain',
  compact = false,
  children,
}: PageShellProps) {
  const hero = tone === 'hero'

  return (
    <div className="relative min-h-dvh bg-ink">
      <SiteHeader {...defaultHeader} />
      {hero ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] overflow-hidden" aria-hidden="true">
          <img
            src={HERO_BACKGROUND}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_35%] opacity-55"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,4,6,0.35)_0%,rgba(11,11,13,0.72)_55%,rgba(11,11,13,1)_100%),linear-gradient(90deg,rgba(8,4,6,0.55)_0%,rgba(8,4,6,0.12)_100%)]" />
        </div>
      ) : null}

      <div className="relative mx-auto w-[min(1180px,calc(100%-2.5rem))] pt-[calc(5.75rem+2.25rem)] pb-16 max-sm:w-[min(calc(100%-1.5rem),1180px)]">
        {compact ? null : (
          <p className="m-0 mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-white/55 uppercase">{eyebrow}</p>
        )}
        <h1
          className={cn(
            'm-0 max-w-[42rem] font-display font-extrabold tracking-tight leading-[1.08]',
            compact ? 'text-[clamp(1.9rem,4vw,2.6rem)]' : hero ? 'text-[clamp(2.35rem,6vw,4.1rem)]' : 'text-[clamp(2rem,5vw,3.4rem)]',
          )}
        >
          <span className="text-white">{title}</span>
          {titleAccent ? (
            <>
              {' '}
              <span className="text-blood">{titleAccent}</span>
            </>
          ) : null}
        </h1>
        {description && !compact ? (
          <p className="mt-4 max-w-[40rem] text-[1.05rem] leading-[1.65] text-white/75">{description}</p>
        ) : null}
        <div className={compact ? 'mt-6' : hero ? 'mt-12' : 'mt-10'}>{children}</div>
      </div>

      <footer className="relative overflow-hidden border-t border-white/8 bg-blood-wave px-5 py-5">
        <p className="m-0 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center font-display text-[0.8rem] font-semibold tracking-wide text-white">
          <span>© 2026 {SITE_NAME.plain}</span>
          <a href="#privacy" className="underline-offset-2 hover:underline">
            Privacy
          </a>
          <a href="#policy" className="underline-offset-2 hover:underline">
            Policy
          </a>
        </p>
        <p className="m-0 mt-1 text-center font-display text-[0.72rem] font-medium tracking-[0.04em] text-white/85">
          Website powered by DYFI Idukki District Professional Sub Committee · {SITE_NAME.plain}
        </p>
      </footer>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HeartIcon } from '@/components/Icons'
import { cn } from '@/lib/cn'
import { defaultHeader } from '@/lib/defaults'

type NavItem = {
  label: string
  href: string
  id?: string | null
}

type HeaderProps = {
  logoTextPrimary: string
  logoTextAccent: string
  navItems: NavItem[]
  ctaLabel: string
  ctaHref: string
  onDonate?: () => void
}

const NAV_ITEMS = defaultHeader.navItems

export function SiteHeader({ ctaLabel, onDonate }: HeaderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const ctaClass =
    'inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-blood-deep to-[#f26a2c] px-4 font-display text-[0.86rem] font-semibold text-white shadow-[0_8px_20px_rgba(225,29,46,0.28)] transition hover:brightness-110'

  const navClass =
    'rounded-full px-3 py-2 text-[0.9rem] font-medium text-[#3a2428] transition-colors hover:bg-black/5 hover:text-blood'

  const cta = onDonate ? (
    <button
      type="button"
      className={ctaClass}
      onClick={() => {
        setOpen(false)
        onDonate()
      }}
    >
      <HeartIcon className="size-4 shrink-0" />
      <span>{ctaLabel}</span>
      <span aria-hidden="true">→</span>
    </button>
  ) : (
    <a href="/donate" className={ctaClass} onClick={() => setOpen(false)}>
      <HeartIcon className="size-4 shrink-0" />
      <span>{ctaLabel}</span>
      <span aria-hidden="true">→</span>
    </a>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 max-sm:px-3">
      <div className="relative w-full max-w-[1100px]">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-full border border-white/70 bg-white/92 py-1.5 pr-1.5 pl-2 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl max-sm:pl-2.5">
          <Link href="/" prefetch={false} className="inline-flex items-center gap-2 pl-1" aria-label="DYFI Idukki">
            <img
              src="/images/STAR.jpg"
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 bg-white object-contain"
            />
            <span className="font-display text-[0.95rem] font-extrabold tracking-[0.12em] leading-none">
              <span className="text-[#1a1113]">DYFI</span>{' '}
              <span className="text-blood">IDUKKI</span>
            </span>
          </Link>

          <nav className="hidden min-w-0 items-center justify-center gap-1 md:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <button type="button" key={item.label} className={navClass}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            {cta}
            <button
              type="button"
              className="inline-flex size-10 shrink-0 flex-col items-center justify-center gap-[5px] md:hidden"
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={cn('h-0.5 w-5 rounded-full bg-[#1a1113] transition duration-150', open && 'translate-y-[7px] rotate-45')} />
              <span className={cn('h-0.5 w-5 rounded-full bg-[#1a1113] transition duration-150', open && 'opacity-0')} />
              <span className={cn('h-0.5 w-5 rounded-full bg-[#1a1113] transition duration-150', open && '-translate-y-[7px] -rotate-45')} />
            </button>
          </div>
        </div>

        {open ? (
          <nav
            className="absolute inset-x-0 top-[calc(100%+0.55rem)] z-50 rounded-[1.4rem] border border-white/70 bg-white/95 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl md:hidden"
            aria-label="Primary"
            id="site-nav"
          >
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    className="block w-full rounded-full px-4 py-3 text-left text-base font-medium text-[#2b1a1d]"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HeartIcon, StarIcon } from '@/components/Icons'
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
  activeHref?: string
  onDonate?: () => void
  onNavigate?: (href: string) => void
}

export function SiteHeader({
  logoTextPrimary,
  logoTextAccent,
  navItems = defaultHeader.navItems,
  ctaLabel,
  activeHref,
  onDonate,
  onNavigate,
}: HeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  function isPageLink(href: string) {
    return href.startsWith('/') && href !== '/'
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const ctaClass =
    'inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-blood-deep to-[#f26a2c] px-2.5 font-display text-[0.82rem] font-semibold text-white shadow-[0_8px_20px_rgba(225,29,46,0.28)] transition hover:brightness-110 sm:gap-1.5 sm:px-4 sm:text-[0.86rem]'

  const navClass =
    'inline-flex h-10 items-center rounded-full px-2.5 text-[0.86rem] font-bold text-[#3a2428] transition-colors hover:bg-black/5 hover:text-blood xl:px-3 xl:text-[0.9rem]'

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
      <span className="hidden sm:inline" aria-hidden="true">
        →
      </span>
    </button>
  ) : (
    <a href="/donate" className={ctaClass} onClick={() => setOpen(false)}>
      <HeartIcon className="size-4 shrink-0" />
      <span>{ctaLabel}</span>
      <span className="hidden sm:inline" aria-hidden="true">
        →
      </span>
    </a>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 max-sm:px-3">
      <div className="relative w-full max-w-[1100px]">
        <div className="grid h-[3.25rem] grid-cols-[1fr_auto] items-center rounded-full border border-white/70 bg-white/92 pr-1.5 pl-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <Link
            href="/"
            prefetch={false}
            className="flex h-10 min-w-0 items-center gap-2 justify-self-start"
            aria-label={`${logoTextPrimary} ${logoTextAccent}`}
            onClick={() => {
              setOpen(false)
              onNavigate?.('#home')
            }}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blood text-white">
              <StarIcon className="block size-3.5" />
            </span>
            <span className="hidden items-center whitespace-nowrap font-display text-[0.95rem] font-extrabold tracking-tight leading-none min-[22rem]:flex">
              <span className="text-[#1a1113]">{logoTextPrimary}</span>
              <span className="ml-1.5 text-blood">{logoTextAccent}</span>
            </span>
          </Link>

          {navItems.length > 0 ? (
            <nav
              className="hidden items-center justify-center gap-0.5 lg:flex xl:gap-1"
              aria-label="Primary"
            >
              {navItems.map((item) =>
                isPageLink(item.href) ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    prefetch={false}
                    className={cn(navClass, pathname.startsWith(item.href) && 'bg-black/5 text-blood')}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    key={item.label}
                    className={cn(navClass, activeHref === item.href && 'bg-black/5 text-blood')}
                    onClick={() => {
                      setOpen(false)
                      onNavigate?.(item.href)
                    }}
                  >
                    {item.label}
                  </button>
                ),
              )}
            </nav>
          ) : (
            <div className="min-w-0 flex-1" />
          )}

          <div className="flex h-10 shrink-0 items-center justify-end justify-self-end gap-1 sm:gap-2">
            {cta}
            {navItems.length > 0 ? (
            <button
              type="button"
              className="inline-flex size-10 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={cn(
                  'h-0.5 w-5 rounded-full bg-[#1a1113] transition duration-150',
                  open && 'translate-y-[7px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'h-0.5 w-5 rounded-full bg-[#1a1113] transition duration-150',
                  open && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'h-0.5 w-5 rounded-full bg-[#1a1113] transition duration-150',
                  open && '-translate-y-[7px] -rotate-45',
                )}
              />
            </button>
            ) : null}
          </div>
        </div>

        {open && navItems.length > 0 ? (
          <nav
            className="absolute inset-x-0 top-[calc(100%+0.55rem)] z-50 rounded-[1.4rem] border border-white/70 bg-white/95 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:hidden"
            aria-label="Primary"
            id="site-nav"
          >
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {navItems.map((item) => (
                <li key={item.label}>
                  {isPageLink(item.href) ? (
                    <Link
                      href={item.href}
                      prefetch={false}
                      className={cn(
                        'block rounded-full px-4 py-3 text-base font-bold text-[#2b1a1d]',
                        pathname.startsWith(item.href) && 'bg-black/5 text-blood',
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={cn(
                        'block w-full rounded-full px-4 py-3 text-left text-base font-bold text-[#2b1a1d]',
                        activeHref === item.href && 'bg-black/5 text-blood',
                      )}
                      onClick={() => {
                        setOpen(false)
                        onNavigate?.(item.href)
                      }}
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  )
}

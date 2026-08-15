'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HeartIcon } from '@/components/Icons'
import { cn } from '@/lib/cn'
import { btnBase, btnHeader, btnPrimary } from '@/lib/ui'

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

function navHref(href: string) {
  if (href === '#home') return '/'
  if (href.startsWith('#')) return `/${href}`
  return href
}

export function SiteHeader({ navItems, ctaLabel, onDonate }: HeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(navItems[0]?.href ?? '#home')

  useEffect(() => {
    if (pathname !== '/') {
      setActive('')
      return
    }

    const onScroll = () => {
      const sections = navItems
        .map((item) => item.href)
        .filter((href) => href.startsWith('#'))
        .map((href) => document.querySelector(href))
        .filter(Boolean) as HTMLElement[]

      const y = window.scrollY + 120
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.offsetTop <= y) {
          setActive(`#${section.id}`)
          break
        }
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [navItems, pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const donateClass = cn(btnBase, btnPrimary, btnHeader, 'max-sm:[&>span]:hidden')

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[5.25rem] bg-gradient-to-b from-black/70 via-black/20 to-transparent backdrop-blur-[2px]">
      <div className="relative mx-auto grid h-full w-[min(1240px,calc(100%-2.5rem))] grid-cols-[auto_1fr_auto] items-center gap-6 max-sm:w-[min(calc(100%-1.5rem),1240px)]">
        <Link href="/" className="col-start-1 inline-flex h-full items-center" aria-label="DYFI Idukki">
          <Image
            src="/images/dyfi.jpg"
            alt="DYFI Idukki"
            width={220}
            height={220}
            className="h-[2.65rem] w-auto rounded-[0.35rem] bg-white object-contain"
            priority
          />
        </Link>

        {navItems.length > 0 ? (
          <nav
            className={cn(
              'lg:justify-self-center max-lg:absolute max-lg:top-[calc(100%-0.4rem)] max-lg:right-0 max-lg:left-0 max-lg:z-50 max-lg:rounded-[1rem] max-lg:border max-lg:border-white/10 max-lg:bg-[rgba(10,6,8,0.96)] max-lg:px-4 max-lg:py-3.5 max-lg:shadow-[0_18px_40px_rgba(0,0,0,0.4)] max-lg:backdrop-blur-xl',
              open ? 'max-lg:block' : 'max-lg:hidden',
            )}
            aria-label="Primary"
            id="site-nav"
          >
            <ul className="m-0 flex list-none items-center justify-center gap-[1.35rem] p-0 max-lg:flex-col max-lg:items-stretch max-lg:gap-1">
              {navItems.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    href={navHref(item.href)}
                    className={cn(
                      'relative block px-1 py-[0.35rem] text-[0.92rem] font-medium text-white/90 transition-colors duration-150 hover:text-blood max-lg:py-3 max-lg:text-base',
                      pathname === '/' && active === item.href && 'text-blood after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-blood',
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="col-start-3 flex items-center justify-self-end gap-3">
          {onDonate ? (
            <button
              type="button"
              className={donateClass}
              onClick={() => {
                setOpen(false)
                onDonate()
              }}
            >
              <HeartIcon className="size-[1.1rem] shrink-0" />
              <span>{ctaLabel}</span>
            </button>
          ) : (
            <Link href="/donate" className={donateClass} onClick={() => setOpen(false)}>
              <HeartIcon className="size-[1.1rem] shrink-0" />
              <span>{ctaLabel}</span>
            </Link>
          )}
          {navItems.length > 0 ? (
            <button
              type="button"
              className="inline-flex size-10 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={cn('h-0.5 w-5 rounded-full bg-white transition duration-150', open && 'translate-y-[7px] rotate-45')} />
              <span className={cn('h-0.5 w-5 rounded-full bg-white transition duration-150', open && 'opacity-0')} />
              <span className={cn('h-0.5 w-5 rounded-full bg-white transition duration-150', open && '-translate-y-[7px] -rotate-45')} />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}

'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ContactPeople } from '@/components/ContactPeople'
import { DonateForm } from '@/components/DonateForm'
import { Hero } from '@/components/Hero'
import { HospitalDirectory } from '@/components/HospitalDirectory'
import { LegalPanel } from '@/components/LegalPanel'
import { RequestForm } from '@/components/RequestForm'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { HERO_BACKGROUND, type StatIcon } from '@/lib/defaults'
import type { Hospital } from '@/lib/hospitals'

type NavItem = {
  label: string
  href: string
  id?: string | null
}

type Cta = {
  label: string
  href: string
}

type Stat = {
  icon: StatIcon
  value: string
  label: string
  id?: string | null
}

type Panel = 'donate' | 'hospitals' | 'request' | 'contact' | 'privacy' | 'policy' | null

type HomeDonateProps = {
  header: {
    logoTextPrimary: string
    logoTextAccent: string
    navItems: NavItem[]
    ctaLabel: string
    ctaHref: string
  }
  hero: {
    headlinePrimary: string
    headlineAccent: string
    subheadline: string
    description: string
    backgroundImageUrl?: string | null
    backgroundVideoUrl?: string | null
    primaryCta: Cta
    secondaryCta: Cta
    stats: Stat[]
  }
  hospitals: Hospital[]
  formOpen?: boolean
}

function panelFromHash(hash: string): Panel {
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  if (
    id === 'donate' ||
    id === 'hospitals' ||
    id === 'request' ||
    id === 'contact' ||
    id === 'privacy' ||
    id === 'policy'
  ) {
    return id
  }
  return null
}

function PanelOverlay({
  children,
  center = false,
  onBack,
}: {
  children: ReactNode
  center?: boolean
  onBack?: () => void
}) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={HERO_BACKGROUND}
          alt=""
          className="h-full w-full object-cover object-[72%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,4,6,0.72)_0%,rgba(8,4,6,0.88)_42%,rgba(8,4,6,0.96)_100%),linear-gradient(90deg,rgba(8,4,6,0.7)_0%,rgba(8,4,6,0.35)_100%)]" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-y-contain scroll-pb-[12rem]">
        <div
          className={
            center
              ? 'relative flex min-h-full items-center justify-center px-6 pt-[6.75rem] pb-[12rem] max-sm:px-4 max-sm:pt-[5.75rem] max-sm:pb-[10rem]'
              : 'relative mx-auto w-[min(1180px,calc(100%-2.5rem))] pt-[6.75rem] pb-[12rem] max-sm:w-[min(calc(100%-1.25rem),1180px)] max-sm:pt-[5.75rem] max-sm:pb-[10rem]'
          }
        >
          {onBack ? (
            <button
              type="button"
              className="mb-4 inline-flex min-h-9 items-center rounded-full border border-white/16 bg-white/8 px-3.5 text-[0.82rem] font-semibold text-white/90 hover:bg-white/14"
              onClick={onBack}
            >
              Back to home
            </button>
          ) : null}
          {children}
        </div>
      </div>
      <SiteFooter pulse />
    </div>
  )
}

export function HomeDonate({ header, hero, hospitals, formOpen = false }: HomeDonateProps) {
  const [panel, setPanel] = useState<Panel>(formOpen ? 'donate' : null)

  function openPanel(next: Panel, mode: 'push' | 'replace' = 'push') {
    setPanel(next)
    const url = next ? `/#${next}` : '/'
    const state = { panel: next }
    if (mode === 'replace') window.history.replaceState(state, '', url)
    else window.history.pushState(state, '', url)
  }

  useEffect(() => {
    const current = panelFromHash(window.location.hash)
    if (current && window.history.state?.panel === undefined) {
      window.history.replaceState({ panel: null }, '', '/')
      window.history.pushState({ panel: current }, '', `/#${current}`)
    }
    const sync = () => setPanel(panelFromHash(window.location.hash))
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  useEffect(() => {
    if (!panel) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') openPanel(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [panel])

  function onNavigate(href: string) {
    if (href === '#home' || href === '/') {
      openPanel(null)
      return
    }
    openPanel(panelFromHash(href))
  }

  return (
    <div
      className={
        panel
          ? 'hero-lock relative h-dvh overflow-hidden'
          : 'hero-lock relative h-dvh overflow-x-hidden overflow-y-auto overscroll-y-contain'
      }
    >
      <SiteHeader
        {...header}
        activeHref={panel ? `#${panel}` : undefined}
        onDonate={() => openPanel('donate')}
        onNavigate={onNavigate}
      />
      <Hero
        {...hero}
        onDonate={() => openPanel('donate')}
        onRequest={() => openPanel('request')}
        form={
          panel === 'donate' ? (
            <DonateForm onClose={() => openPanel(null)} />
          ) : panel === 'request' ? (
            <RequestForm onClose={() => openPanel(null)} />
          ) : undefined
        }
      />
      {panel === 'hospitals' ? (
        <PanelOverlay onBack={() => openPanel(null)}>
          <p className="m-0 mb-1.5 text-[0.7rem] font-bold tracking-[0.16em] text-white/55 uppercase max-sm:mb-1">
            Idukki directory
          </p>
          <h2 className="m-0 font-display text-[clamp(1.7rem,3.6vw,2.45rem)] font-extrabold tracking-tight leading-[1.08] max-sm:text-[1.55rem]">
            <span className="text-white">Find</span> <span className="text-blood">hospitals</span>
          </h2>
          <p className="mt-2 mb-5 max-w-[36rem] text-[0.92rem] leading-[1.5] text-white/75 max-sm:mt-1 max-sm:mb-3 max-sm:text-[0.84rem] max-sm:leading-snug">
            Search by name, place or block to reach a centre across Idukki.
          </p>
          <HospitalDirectory hospitals={hospitals} />
        </PanelOverlay>
      ) : null}
      {panel === 'contact' ? (
        <PanelOverlay onBack={() => openPanel(null)}>
          <ContactPeople />
        </PanelOverlay>
      ) : null}
      {panel === 'privacy' ? (
        <PanelOverlay center onBack={() => openPanel(null)}>
          <LegalPanel kind="privacy" />
        </PanelOverlay>
      ) : null}
      {panel === 'policy' ? (
        <PanelOverlay center onBack={() => openPanel(null)}>
          <LegalPanel kind="policy" />
        </PanelOverlay>
      ) : null}
    </div>
  )
}

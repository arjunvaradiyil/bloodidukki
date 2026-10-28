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

function PanelOverlay({ children, center = false }: { children: ReactNode; center?: boolean }) {
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
      <div className="relative min-h-0 flex-1 overflow-y-auto scroll-pb-[8.5rem]">
        <div
          className={
            center
              ? 'relative flex min-h-full items-center justify-center px-6 pt-[6.75rem] pb-[8.5rem] max-sm:px-4 max-sm:pt-[5.75rem] max-sm:pb-[6.75rem]'
              : 'relative mx-auto w-[min(1180px,calc(100%-2.5rem))] pt-[6.75rem] pb-[8.5rem] max-sm:w-[min(calc(100%-1.25rem),1180px)] max-sm:pt-[5.75rem] max-sm:pb-[6.75rem]'
          }
        >
          {children}
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}

export function HomeDonate({ header, hero, hospitals, formOpen = false }: HomeDonateProps) {
  const [panel, setPanel] = useState<Panel>(formOpen ? 'donate' : null)

  function openPanel(next: Panel) {
    setPanel(next)
    const url = next ? `/#${next}` : '/'
    window.history.replaceState(null, '', url)
  }

  useEffect(() => {
    const sync = () => setPanel(panelFromHash(window.location.hash))
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
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
    <div className="hero-lock relative h-dvh overflow-hidden">
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
        form={panel === 'donate' ? <DonateForm /> : panel === 'request' ? <RequestForm /> : undefined}
      />
      {panel === 'hospitals' ? (
        <PanelOverlay>
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
        <PanelOverlay>
          <ContactPeople />
        </PanelOverlay>
      ) : null}
      {panel === 'privacy' ? (
        <PanelOverlay center>
          <LegalPanel kind="privacy" />
        </PanelOverlay>
      ) : null}
      {panel === 'policy' ? (
        <PanelOverlay center>
          <LegalPanel kind="policy" />
        </PanelOverlay>
      ) : null}
    </div>
  )
}

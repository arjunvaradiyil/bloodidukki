'use client'

import { useState } from 'react'
import { DonateForm } from '@/components/DonateForm'
import { Hero } from '@/components/Hero'
import { SiteHeader } from '@/components/SiteHeader'
import type { StatIcon } from '@/lib/defaults'

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
  formOpen?: boolean
}

export function HomeDonate({ header, hero, formOpen = false }: HomeDonateProps) {
  const [open, setOpen] = useState(formOpen)

  return (
    <div className="hero-lock h-screen h-dvh min-h-screen overflow-hidden">
      <SiteHeader {...header} onDonate={() => setOpen(true)} />
      <Hero {...hero} onDonate={() => setOpen(true)} form={open ? <DonateForm /> : undefined} />
    </div>
  )
}

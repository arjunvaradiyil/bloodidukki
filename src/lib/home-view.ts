import { cache } from 'react'
import { defaultHome, type StatIcon } from '@/lib/defaults'
import { getMediaUrl } from '@/lib/media'
import { getPayloadClient, withTimeout } from '@/lib/payload-client'
import { getHeaderProps } from '@/lib/site-header'

export type HomeHeroView = {
  headlinePrimary: string
  headlineAccent: string
  subheadline: string
  description: string
  backgroundImageUrl?: string | null
  backgroundVideoUrl?: string | null
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  stats: {
    icon: StatIcon
    value: string
    label: string
    id?: string | null
  }[]
}

export const getHomeView = cache(async () => {
  const payload = await withTimeout(getPayloadClient(), 800, null)
  const [header, homeDoc] = await Promise.all([
    getHeaderProps(),
    payload ? withTimeout(payload.findGlobal({ slug: 'home', depth: 2 }), 800, null) : null,
  ])

  const hero = homeDoc?.hero || defaultHome.hero
  const stats =
    homeDoc?.stats
      ?.filter((stat) => Boolean(stat?.value && stat?.label && stat?.icon))
      .map((stat) => ({
        icon: stat.icon as StatIcon,
        value: stat.value as string,
        label: stat.label as string,
        id: stat.id,
      })) || defaultHome.stats

  return {
    header,
    hero: {
      headlinePrimary: hero.headlinePrimary || defaultHome.hero.headlinePrimary,
      headlineAccent: hero.headlineAccent || defaultHome.hero.headlineAccent,
      subheadline: hero.subheadline || defaultHome.hero.subheadline,
      description: hero.description || defaultHome.hero.description,
      backgroundImageUrl: getMediaUrl(hero.backgroundImage),
      backgroundVideoUrl: hero.backgroundVideo || null,
      primaryCta: {
        label: hero.primaryCta?.label || defaultHome.hero.primaryCta.label,
        href: '/donate',
      },
      secondaryCta: {
        label: defaultHome.hero.secondaryCta.label,
        href: defaultHome.hero.secondaryCta.href,
      },
      stats,
    } satisfies HomeHeroView,
  }
})

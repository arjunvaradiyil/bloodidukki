import { defaultHome, type StatIcon } from '@/lib/defaults'
import { getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload-client'
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

export async function getHomeView() {
  const payload = await getPayloadClient()
  const [header, homeDoc] = await Promise.all([
    getHeaderProps(),
    payload ? payload.findGlobal({ slug: 'home', depth: 2 }).catch(() => null) : null,
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
        label: hero.secondaryCta?.label || defaultHome.hero.secondaryCta.label,
        href: hero.secondaryCta?.href || defaultHome.hero.secondaryCta.href,
      },
      stats,
    } satisfies HomeHeroView,
  }
}

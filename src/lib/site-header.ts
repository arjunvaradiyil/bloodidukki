import { defaultHeader } from '@/lib/defaults'
import { getPayloadClient } from '@/lib/payload-client'

export async function getHeaderProps() {
  const payload = await getPayloadClient()
  const headerDoc = payload
    ? await payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null)
    : null

  return {
    logoTextPrimary: headerDoc?.logoTextPrimary || defaultHeader.logoTextPrimary,
    logoTextAccent: headerDoc?.logoTextAccent || defaultHeader.logoTextAccent,
    navItems:
      (
        headerDoc?.navItems?.filter((item): item is { label: string; href: string; id?: string | null } =>
          Boolean(item?.label && item?.href),
        ) || defaultHeader.navItems
      ).filter((item) => {
        if (item.href === '#home' || item.href === '/') return false
        if (item.href.startsWith('#')) return false
        return true
      }),
    ctaLabel: headerDoc?.ctaLabel || defaultHeader.ctaLabel,
    ctaHref: '/donate',
  }
}

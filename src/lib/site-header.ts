import { getPayload } from 'payload'
import { defaultHeader } from '@/lib/defaults'
import config from '@/payload.config'

export async function getHeaderProps() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const headerDoc = await payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null)

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

import { cache } from 'react'
import { defaultHeader } from '@/lib/defaults'
import { getPayloadClient, withTimeout } from '@/lib/payload-client'

const PAGE_NAV = defaultHeader.navItems

export const getHeaderProps = cache(async () => {
  const payload = await withTimeout(getPayloadClient(), 800, null)
  const headerDoc = payload
    ? await withTimeout(payload.findGlobal({ slug: 'header', depth: 1 }), 800, null)
    : null

  return {
    logoTextPrimary:
      headerDoc?.logoTextPrimary && headerDoc.logoTextPrimary !== 'DONATE'
        ? headerDoc.logoTextPrimary
        : defaultHeader.logoTextPrimary,
    logoTextAccent:
      headerDoc?.logoTextAccent && headerDoc.logoTextAccent !== 'BLOOD'
        ? headerDoc.logoTextAccent
        : defaultHeader.logoTextAccent,
    navItems: PAGE_NAV,
    ctaLabel: headerDoc?.ctaLabel || defaultHeader.ctaLabel,
    ctaHref: '/donate',
  }
})

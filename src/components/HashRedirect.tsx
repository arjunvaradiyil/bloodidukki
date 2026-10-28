'use client'

import { useEffect } from 'react'

export function HashRedirect({ hash }: { hash: string }) {
  useEffect(() => {
    const next = hash.startsWith('#') ? hash : `#${hash}`
    window.location.replace(`/${next}`)
  }, [hash])

  return null
}

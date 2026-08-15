import type { CSSProperties } from 'react'

export function overlayStyleFor(
  anchor: DOMRect,
  options?: { maxHeight?: number; width?: number; minHeight?: number },
): CSSProperties {
  const gap = 6
  const margin = 8
  const maxHeight = options?.maxHeight ?? 340
  const minHeight = options?.minHeight ?? 132
  const width = Math.min(options?.width ?? anchor.width, window.innerWidth - margin * 2)
  const left = Math.min(Math.max(margin, anchor.left), window.innerWidth - width - margin)
  const spaceBelow = window.innerHeight - anchor.bottom - gap - margin
  const spaceAbove = anchor.top - gap - margin
  const openUp = spaceBelow < 160 && spaceAbove > spaceBelow
  const height = Math.min(maxHeight, Math.max(minHeight, openUp ? spaceAbove : spaceBelow))

  return {
    position: 'fixed',
    left,
    width,
    zIndex: 120,
    maxHeight: height,
    ...(openUp
      ? { top: 'auto', bottom: window.innerHeight - anchor.top + gap }
      : { top: anchor.bottom + gap, bottom: 'auto' }),
  }
}

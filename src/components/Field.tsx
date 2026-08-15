import type { ReactNode } from 'react'

export function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="block">
      <span className="mb-2 block text-[0.78rem] font-bold tracking-[0.08em] text-white/55 uppercase">{label}</span>
      {children}
      {error ? (
        <span className="mt-2 block text-sm text-blood" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
}

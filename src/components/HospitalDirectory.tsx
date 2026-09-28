'use client'

import { useMemo, useState } from 'react'
import { DropIcon, PhoneIcon, PinIcon, SearchIcon } from '@/components/Icons'
import { cn } from '@/lib/cn'
import { BLOCKS } from '@/lib/idukki'
import { blockLabel, kindLabel, type Hospital, type HospitalKind } from '@/lib/hospitals'
import { btnBase, btnGhost, btnPrimary, fieldControl } from '@/lib/ui'

type HospitalDirectoryProps = {
  hospitals: Hospital[]
}

const KINDS = [
  ['all', 'All centres'],
  ['hospital', 'Hospitals'],
  ['blood-bank', 'Blood banks'],
] as const

export function HospitalDirectory({ hospitals }: HospitalDirectoryProps) {
  const [query, setQuery] = useState('')
  const [block, setBlock] = useState('all')
  const [kind, setKind] = useState<'all' | HospitalKind>('all')

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return hospitals.filter((item) => {
      if (block !== 'all' && item.block !== block) return false
      if (kind !== 'all' && item.kind !== kind) return false
      if (!needle) return true
      return [item.name, item.place, item.address, item.notes, blockLabel(item.block)]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(needle))
    })
  }, [block, hospitals, kind, query])

  return (
    <div className="mt-8">
      <div className="rounded-[1.35rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[18px] sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(10rem,0.7fr)] sm:items-end">
          <label className="block">
            <span className="mb-2 block text-[0.78rem] font-bold tracking-[0.08em] text-white/55 uppercase">
              Search
            </span>
            <span className="relative block">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-[1.1rem] -translate-y-1/2 text-blood" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Hospital, place or block"
                className={cn(fieldControl, 'pl-11')}
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-[0.78rem] font-bold tracking-[0.08em] text-white/55 uppercase">
              Block
            </span>
            <select
              value={block}
              onChange={(event) => setBlock(event.target.value)}
              className={cn(fieldControl, 'bg-[#171217]')}
            >
              <option value="all">All blocks</option>
              {BLOCKS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {KINDS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={cn(
                btnBase,
                kind === value ? btnPrimary : btnGhost,
                'min-h-10 rounded-full px-4 text-sm',
              )}
              onClick={() => setKind(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-white/55">
        {results.length} {results.length === 1 ? 'centre' : 'centres'} match this search
      </p>

      {results.length === 0 ? (
        <p className="mt-4 rounded-[1.15rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-5 text-white/75">
          No centres match this search. Try another block or name.
        </p>
      ) : (
        <ul className="mt-4 m-0 grid list-none gap-3 p-0">
          {results.map((item) => (
            <li
              key={`${item.name}-${item.place}`}
              className="group relative overflow-hidden rounded-[1.15rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-[18px] transition duration-150 hover:border-blood/40"
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-blood" aria-hidden="true" />
              <div className="flex gap-3 pl-2">
                <span
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-2xl',
                    item.kind === 'blood-bank' ? 'bg-blood/15 text-blood' : 'bg-white/8 text-white',
                  )}
                >
                  {item.kind === 'blood-bank' ? (
                    <DropIcon className="size-6" />
                  ) : (
                    <PinIcon className="size-6 text-blood" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[0.68rem] font-bold tracking-[0.14em] text-blood uppercase">
                    {kindLabel(item.kind)}
                  </p>
                  <h2 className="mt-1 font-display text-[1.08rem] font-bold leading-tight">{item.name}</h2>
                  <p className="mt-1.5 flex items-start gap-1.5 text-[0.9rem] leading-[1.45] text-white/70">
                    <PinIcon className="mt-0.5 size-3.5 shrink-0 text-blood" />
                    <span>
                      {item.place}, {blockLabel(item.block)}
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.phone ? (
                      <a
                        href={`tel:${item.phone.replace(/\s+/g, '')}`}
                        className={cn(btnBase, btnPrimary, 'min-h-9 px-3 text-[0.8rem]')}
                      >
                        <PhoneIcon className="size-3.5" />
                        Call
                      </a>
                    ) : null}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name}, ${item.address}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(btnBase, btnGhost, 'min-h-9 px-3 text-[0.8rem]')}
                    >
                      <PinIcon className="size-3.5" />
                      Map
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

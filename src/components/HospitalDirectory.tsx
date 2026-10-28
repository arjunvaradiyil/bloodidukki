'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDownIcon, DropIcon, PhoneIcon, PinIcon, SearchIcon } from '@/components/Icons'
import { cn } from '@/lib/cn'
import { BLOCKS } from '@/lib/idukki'
import { blockLabel, kindLabel, type Hospital } from '@/lib/hospitals'
import { btnBase, btnGhost, btnPrimary, fieldControl } from '@/lib/ui'

const PAGE_SIZE_DESKTOP = 2
const PAGE_SIZE_MOBILE = 1

type HospitalDirectoryProps = {
  hospitals: Hospital[]
}

export function HospitalDirectory({ hospitals }: HospitalDirectoryProps) {
  const [query, setQuery] = useState('')
  const [block, setBlock] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const apply = () => setPageSize(media.matches ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  const listedBlocks = useMemo(() => {
    const used = new Set(hospitals.map((item) => item.block).filter(Boolean))
    return BLOCKS.filter((item) => used.has(item.value))
  }, [hospitals])
  const hasOutside = hospitals.some((item) => !item.block)

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return hospitals.filter((item) => {
      if (block === 'outside' && item.block) return false
      if (block !== 'all' && block !== 'outside' && item.block !== block) return false
      if (!needle) return true
      return [item.name, item.place, item.address, item.notes, blockLabel(item.block)]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(needle))
    })
  }, [block, hospitals, query])

  const filters = [
    { value: 'all', label: 'All blocks' },
    ...listedBlocks.map((item) => ({ value: item.value, label: item.label })),
    ...(hasOutside ? [{ value: 'outside', label: 'Outside Idukki' }] : []),
  ]

  const pageCount = Math.max(1, Math.ceil(results.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const paged = results.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const from = results.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, results.length)

  useEffect(() => {
    setPage(1)
  }, [query, block, pageSize])

  function goTo(next: number) {
    setPage(next)
    const scroller = rootRef.current?.closest('.overflow-y-auto')
    scroller?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={rootRef}>
      <div className="rounded-[1.15rem] border border-white/12 bg-white/[0.06] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl max-sm:p-2.5 sm:p-3.5">
        <label className="block">
          <span className="mb-1.5 block text-[0.75rem] font-bold tracking-[0.08em] text-white/55 uppercase">
            Search
          </span>
          <span className="relative block">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-[1rem] -translate-y-1/2 text-blood" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Hospital, place or block"
              className={cn(fieldControl, 'min-h-10 py-2 pl-10 text-sm')}
            />
          </span>
        </label>
        <div className="mt-3 flex flex-nowrap gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setBlock(item.value)}
              className={cn(
                'min-h-8 shrink-0 rounded-full px-3 text-[0.78rem] font-semibold transition',
                block === item.value
                  ? 'bg-blood text-white shadow-[0_8px_20px_rgba(225,29,46,0.28)]'
                  : 'border border-white/14 bg-white/[0.04] text-white/80 hover:border-white/30 hover:bg-white/[0.08]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="mt-3 text-[0.8rem] text-white/55">No centres match this search</p>
      ) : (
        <p className="mt-3 text-[0.8rem] text-white/55 max-sm:sr-only">
          Showing {from}–{to} of {results.length} {results.length === 1 ? 'centre' : 'centres'}
        </p>
      )}

      {results.length === 0 ? (
        <div className="mt-4 rounded-[1.4rem] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-xl">
          <p className="m-0 text-white/75">No hospitals match this search. Clear the filters to see every centre.</p>
          <button
            type="button"
            className={cn(btnBase, btnPrimary, 'mt-4 min-h-10 px-4 text-sm')}
            onClick={() => {
              setQuery('')
              setBlock('all')
              setPage(1)
            }}
          >
            Show all hospitals
          </button>
        </div>
      ) : (
        <ul className="mt-3 m-0 grid list-none gap-3 p-0 max-sm:mt-2 md:grid-cols-2">
          {paged.map((item) => (
            <li
              key={`${item.name}-${item.place}`}
              className="group relative overflow-hidden rounded-[1rem] border border-white/12 bg-white/[0.06] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-150 hover:border-blood/45 hover:bg-white/[0.08]"
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-blood" aria-hidden="true" />
              <div className="flex gap-3 pl-1.5">
                <span
                  className={cn(
                    'grid size-9 shrink-0 place-items-center rounded-xl',
                    item.kind === 'blood-bank' ? 'bg-blood/15 text-blood' : 'bg-blood/12 text-blood',
                  )}
                >
                  {item.kind === 'blood-bank' ? (
                    <DropIcon className="size-4.5" />
                  ) : (
                    <PinIcon className="size-4.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[0.72rem] font-bold tracking-[0.14em] text-blood uppercase">
                    {kindLabel(item.kind)}
                  </p>
                  <h3 className="mt-0.5 font-display text-[1.02rem] font-bold leading-tight">{item.name}</h3>
                  <p className="mt-1 text-[0.84rem] leading-[1.35] text-white/75">{item.place}</p>
                  <p className="mt-0.5 truncate text-[0.78rem] leading-[1.35] text-white/55">{item.address}</p>
                  <span className="mt-2 inline-flex min-h-7 items-center rounded-full bg-white/8 px-2.5 text-[0.75rem] text-white/80">
                    {blockLabel(item.block)}
                  </span>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {item.phone ? (
                      <a
                        href={`tel:${item.phone.replace(/\s+/g, '')}`}
                        className={cn(btnBase, btnPrimary, 'min-h-8 px-3 text-[0.78rem]')}
                      >
                        <PhoneIcon className="size-3" />
                        Call
                      </a>
                    ) : null}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name}, ${item.address}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(btnBase, btnPrimary, 'min-h-8 px-3 text-[0.78rem]')}
                    >
                      <PinIcon className="size-3" />
                      Map
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {results.length > pageSize ? (
        <nav className="mt-3 mb-1 flex flex-wrap items-center justify-center gap-1.5 max-sm:mt-2.5" aria-label="Hospital pages">
          <button
            type="button"
            className={cn(btnBase, btnGhost, 'min-h-8 px-3 text-[0.78rem]')}
            disabled={currentPage <= 1}
            onClick={() => goTo(currentPage - 1)}
          >
            <ChevronDownIcon className="size-4 rotate-90" />
            Prev
          </button>
          <p className="m-0 min-w-[4.5rem] text-center text-[0.82rem] font-semibold text-white/75 sm:hidden">
            {currentPage} / {pageCount}
          </p>
          <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-1.5">
            {Array.from({ length: pageCount }, (_, index) => {
              const number = index + 1
              return (
                <button
                  key={number}
                  type="button"
                  aria-current={number === currentPage ? 'page' : undefined}
                  className={cn(
                    btnBase,
                    'min-h-8 min-w-8 px-0 text-[0.78rem]',
                    number === currentPage ? btnPrimary : btnGhost,
                  )}
                  onClick={() => goTo(number)}
                >
                  {number}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className={cn(btnBase, btnGhost, 'min-h-8 px-3 text-[0.78rem]')}
            disabled={currentPage >= pageCount}
            onClick={() => goTo(currentPage + 1)}
          >
            Next
            <ChevronDownIcon className="size-4 -rotate-90" />
          </button>
        </nav>
      ) : null}
    </div>
  )
}

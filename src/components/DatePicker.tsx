'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { CalendarIcon, ChevronDownIcon } from '@/components/Icons'
import { cn } from '@/lib/cn'
import { overlayStyleFor } from '@/lib/overlay-position'
import { fieldControl, fieldInvalid } from '@/lib/ui'

type DatePickerProps = {
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  min?: string
  max?: string
  invalid?: boolean
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function stamp(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseStamp(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDisplay(value: string) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function DatePicker({
  name,
  value,
  onChange,
  placeholder = 'dd / mm / yyyy',
  min,
  max,
  invalid = false,
}: DatePickerProps) {
  const today = stamp(new Date())
  const initial = value ? parseStamp(value) : new Date()
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() })
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    if (!trigger) return

    const update = () => {
      const anchor = trigger.getBoundingClientRect()
      setMenuStyle(
        overlayStyleFor(anchor, {
          maxHeight: 360,
          minHeight: 220,
          width: Math.max(anchor.width, 220),
        }),
      )
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const days = useMemo(() => {
    const first = new Date(view.year, view.month, 1)
    const startWeekday = first.getDay()
    const start = new Date(view.year, view.month, 1 - startWeekday)
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start)
      date.setDate(start.getDate() + index)
      const iso = stamp(date)
      const inMonth = date.getMonth() === view.month
      const disabled = Boolean((min && iso < min) || (max && iso > max))
      return { iso, day: date.getDate(), inMonth, disabled, isToday: iso === today }
    })
  }, [view, min, max, today])

  const openPicker = () => {
    const base = value ? parseStamp(value) : new Date()
    setView({ year: base.getFullYear(), month: base.getMonth() })
    setOpen((current) => !current)
  }

  const shiftMonth = (delta: number) => {
    const next = new Date(view.year, view.month + delta, 1)
    setView({ year: next.getFullYear(), month: next.getMonth() })
  }

  return (
    <div ref={rootRef} className={cn('relative z-[1]', open && 'z-[8]')}>
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        type="button"
        className={cn(fieldControl, 'flex items-center justify-between gap-3', invalid && fieldInvalid)}
        aria-invalid={invalid}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={openPicker}
      >
        <span className={value ? 'tracking-wide text-white' : 'text-white/42'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <CalendarIcon className="size-[1.15rem] shrink-0 text-white/70" />
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={panelRef}
              className="z-[120] rounded-xl border border-white/12 bg-[#171217] px-2 py-2 shadow-[0_18px_36px_rgba(0,0,0,0.45)]"
              role="dialog"
              aria-label="Choose date"
              style={menuStyle}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <p className="m-0 font-display text-[0.78rem] font-bold">
                  {MONTHS[view.month]} {view.year}
                </p>
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    aria-label="Previous month"
                    className="grid size-[1.55rem] place-items-center rounded-[0.35rem] text-white/85 hover:bg-blood/20"
                    onClick={() => shiftMonth(-1)}
                  >
                    <ChevronDownIcon className="size-[0.85rem] rotate-90" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    className="grid size-[1.55rem] place-items-center rounded-[0.35rem] text-white/85 hover:bg-blood/20"
                    onClick={() => shiftMonth(1)}
                  >
                    <ChevronDownIcon className="size-[0.85rem] -rotate-90" />
                  </button>
                </div>
              </div>

              <div className="mb-0.5 grid grid-cols-7">
                {WEEKDAYS.map((day, index) => (
                  <span key={`${day}-${index}`} className="text-center text-[0.62rem] font-bold tracking-wide text-white/45">
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {days.map((item) => (
                  <button
                    key={item.iso}
                    type="button"
                    disabled={item.disabled}
                    className={cn(
                      'm-[0.04rem] aspect-square rounded-[0.3rem] text-[0.72rem] font-semibold text-white hover:enabled:bg-blood/20 disabled:cursor-not-allowed disabled:text-white/20',
                      !item.inMonth && 'text-white/30',
                      item.isToday && item.iso !== value && 'shadow-[inset_0_0_0_1px_rgba(225,29,46,0.7)]',
                      item.iso === value && 'bg-blood text-white',
                    )}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={(event) => {
                      if (item.disabled) return
                      event.preventDefault()
                      event.stopPropagation()
                      onChange(item.iso)
                      setOpen(false)
                    }}
                  >
                    {item.day}
                  </button>
                ))}
              </div>

              <div className="mt-1.5 flex justify-between px-1 text-[0.75rem]">
                <button type="button" className="text-white/70 hover:text-white" onClick={() => onChange('')}>
                  Clear
                </button>
                <button
                  type="button"
                  className="text-blood hover:text-white"
                  onClick={() => {
                    const next = today
                    if ((min && next < min) || (max && next > max)) return
                    onChange(next)
                    setOpen(false)
                  }}
                >
                  Today
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

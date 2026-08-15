'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDownIcon } from '@/components/Icons'
import { cn } from '@/lib/cn'
import { overlayStyleFor } from '@/lib/overlay-position'
import { fieldControl, fieldInvalid } from '@/lib/ui'

export type DropdownOption = {
  value: string
  label: string
}

type DropdownProps = {
  name: string
  value: string
  options: DropdownOption[]
  placeholder: string
  onChange: (value: string) => void
  disabled?: boolean
  invalid?: boolean
  autoFocus?: boolean
}

export function Dropdown({
  name,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  invalid = false,
  autoFocus = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value)

  useLayoutEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    if (!trigger) return

    const update = () => setMenuStyle(overlayStyleFor(trigger.getBoundingClientRect()))
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, options.length])

  useEffect(() => {
    if (!open) return

    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
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

  function choose(next: string) {
    onChange(next)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('relative z-[1]', open && 'z-[8]', disabled && 'opacity-50')}>
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        type="button"
        className={cn(fieldControl, 'flex items-center justify-between gap-3', invalid && fieldInvalid)}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-invalid={invalid}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? 'text-white' : 'text-white/42'}>{selected?.label ?? placeholder}</span>
        <ChevronDownIcon className={cn('size-[1.1rem] shrink-0 text-white/70 transition-transform duration-150', open && 'rotate-180')} />
      </button>
      {open && typeof document !== 'undefined'
        ? createPortal(
            <ul
              ref={menuRef}
              className="z-[120] m-0 max-h-[16.5rem] list-none overflow-auto rounded-[0.9rem] border border-white/12 bg-[#171217] p-1.5 shadow-[0_22px_48px_rgba(0,0,0,0.45)]"
              id={listId}
              role="listbox"
              style={menuStyle}
            >
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <li key={option.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        'flex min-h-[2.6rem] w-full items-center rounded-[0.65rem] px-3 py-2 text-left text-white/90 hover:bg-blood/20 focus-visible:bg-blood/20 focus-visible:outline-none',
                        isSelected && 'bg-blood text-white',
                      )}
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        choose(option.value)
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                )
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  )
}

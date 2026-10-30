'use client'

import { useActionState, useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import { DatePicker } from '@/components/DatePicker'
import { Dropdown } from '@/components/Dropdown'
import { DropIcon, PinIcon } from '@/components/Icons'
import { submitBloodRequest, type RequestState } from '@/app/(frontend)/actions/request'
import { cn } from '@/lib/cn'
import { localToday } from '@/lib/donate-validation'
import { BLOOD_GROUPS, BLOCKS } from '@/lib/idukki'
import {
  errorForRequestField,
  validateBloodRequest,
  type RequestValues,
} from '@/lib/request-validation'
import { btnBase, btnDefault, btnGhost, btnPrimary, fieldControl, fieldInvalid } from '@/lib/ui'

const initialState: RequestState = { ok: false, error: null }

const emptyValues: RequestValues = {
  patientName: '',
  bloodGroup: '',
  units: '',
  hospital: '',
  block: '',
  neededBy: '',
  requesterName: '',
  mobile: '',
  notes: '',
}

type Step = {
  key: keyof RequestValues
  title: string
  hint?: string
  optional?: boolean
}

const steps: Step[] = [
  { key: 'patientName', title: 'What is the patient’s name?' },
  { key: 'bloodGroup', title: 'What blood group is needed?' },
  { key: 'units', title: 'How many units are needed?', hint: 'Enter a number between 1 and 10.' },
  { key: 'neededBy', title: 'When is the blood needed?' },
  { key: 'hospital', title: 'Which hospital is the patient in?' },
  { key: 'block', title: 'Which block is the hospital in?' },
  { key: 'requesterName', title: 'What is your name?', hint: 'Attendant or person making this request.' },
  { key: 'mobile', title: 'What is your mobile number?' },
  { key: 'notes', title: 'Any extra details?', hint: 'Optional — ward, doctor, or other notes.', optional: true },
]

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-2 text-sm text-blood" role="alert">
      {message}
    </p>
  )
}

export function RequestForm({ onClose }: { onClose?: () => void }) {
  const [state, formAction, pending] = useActionState(submitBloodRequest, initialState)
  const [values, setValues] = useState(emptyValues)
  const [index, setIndex] = useState(0)
  const [stepError, setStepError] = useState('')
  const today = useMemo(() => localToday(), [])
  const stepIndex = Math.min(index, steps.length - 1)
  const step = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1
  const progress = ((stepIndex + 1) / steps.length) * 100

  function update(key: keyof RequestValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
    setStepError('')
  }

  function goNextFrom(nextValues: RequestValues, key: keyof RequestValues) {
    const error = errorForRequestField(nextValues, key, today)
    if (error) {
      setStepError(error)
      return false
    }
    setStepError('')
    const currentIdx = steps.findIndex((item) => item.key === key)
    if (currentIdx >= 0 && currentIdx < steps.length - 1) {
      setIndex(currentIdx + 1)
    }
    return true
  }

  function goNext() {
    return goNextFrom(values, step.key)
  }

  function chooseAndNext(key: keyof RequestValues, value: string) {
    const nextValues = { ...values, [key]: value }
    setValues(nextValues)
    goNextFrom(nextValues, key)
  }

  useEffect(() => {
    if (!state.fieldErrors) return
    const first = steps.find((item) => state.fieldErrors?.[item.key])
    if (!first) return
    setIndex(steps.indexOf(first))
    setStepError(state.fieldErrors[first.key] || '')
  }, [state])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (!isLast) {
      event.preventDefault()
      goNext()
      return
    }
    const nextErrors = validateBloodRequest(values, today)
    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault()
      const first = steps.find((item) => nextErrors[item.key])
      setStepError(nextErrors[step.key] || 'Please check your answers.')
      if (first) setIndex(steps.indexOf(first))
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== 'Enter') return
    const tag = (event.target as HTMLElement).tagName
    if (tag === 'TEXTAREA' || tag === 'BUTTON') return
    event.preventDefault()
    if (isLast) {
      ;(event.currentTarget as HTMLFormElement).requestSubmit()
      return
    }
    goNext()
  }

  if (state.ok) {
    return (
      <div className="w-full" role="status">
        <p className="m-0 mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-white/55 uppercase">Request received</p>
        <h2 className="m-0 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold tracking-tight">
          We have your blood request.
        </h2>
        <p className="mt-3 leading-[1.6] text-white/75">
          DYFI Idukki volunteers will try to reach you with donor support. For emergencies, also contact the hospital
          blood bank directly.
        </p>
        <div className="mt-6 grid gap-3">
          <a href="#hospitals" className={cn(btnBase, btnPrimary, btnDefault, 'w-full')}>
            <PinIcon className="size-[1.05rem]" />
            Find hospitals
          </a>
          <a href="#home" className={cn(btnBase, btnGhost, btnDefault, 'w-full')}>
            Back to home
          </a>
        </div>
      </div>
    )
  }

  const controlClass = cn(fieldControl, stepError && fieldInvalid)

  return (
    <form className="w-full" action={formAction} onSubmit={onSubmit} onKeyDown={onKeyDown} noValidate>
      <input
        type="text"
        name="company"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {(Object.keys(emptyValues) as (keyof RequestValues)[]).map((key) =>
        key === step.key ? null : <input key={key} type="hidden" name={key} value={values[key]} />,
      )}

      <div className="mb-[0.7rem] flex items-center justify-between text-[0.78rem] font-bold tracking-[0.12em] text-white/55 uppercase">
        <span>
          {stepIndex + 1} / {steps.length}
        </span>
        {step.optional ? <em className="not-italic text-white/40">Optional</em> : null}
      </div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <span className="block h-full bg-blood transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>

      <h2 className="m-0 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold tracking-tight leading-[1.2]">
        {step.title}
      </h2>
      {step.hint ? <p className="mt-[0.65rem] leading-normal text-white/60">{step.hint}</p> : null}

      <div className="mt-[1.35rem] w-full">
        {step.key === 'patientName' ? (
          <input
            key="patientName"
            name="patientName"
            type="text"
            autoComplete="name"
            maxLength={80}
            placeholder="Patient full name"
            value={values.patientName}
            onChange={(event) => update('patientName', event.target.value)}
            autoFocus
            className={controlClass}
          />
        ) : null}

        {step.key === 'bloodGroup' ? (
          <Dropdown
            name="bloodGroup"
            value={values.bloodGroup}
            onChange={(value) => chooseAndNext('bloodGroup', value)}
            placeholder="Select blood group"
            options={BLOOD_GROUPS.map((item) => ({ value: item, label: item }))}
            invalid={Boolean(stepError)}
            autoFocus
          />
        ) : null}

        {step.key === 'units' ? (
          <input
            key="units"
            name="units"
            type="number"
            min={1}
            max={10}
            inputMode="numeric"
            placeholder="1–10"
            value={values.units}
            onChange={(event) => update('units', event.target.value)}
            autoFocus
            className={controlClass}
          />
        ) : null}

        {step.key === 'neededBy' ? (
          <DatePicker
            name="neededBy"
            value={values.neededBy}
            onChange={(value) => update('neededBy', value)}
            min={today}
            invalid={Boolean(stepError)}
          />
        ) : null}

        {step.key === 'hospital' ? (
          <input
            key="hospital"
            name="hospital"
            type="text"
            maxLength={120}
            placeholder="Hospital name"
            value={values.hospital}
            onChange={(event) => update('hospital', event.target.value)}
            autoFocus
            className={controlClass}
          />
        ) : null}

        {step.key === 'block' ? (
          <Dropdown
            name="block"
            value={values.block}
            onChange={(value) => chooseAndNext('block', value)}
            placeholder="Select block"
            options={BLOCKS.map((item) => ({ value: item.value, label: item.label }))}
            invalid={Boolean(stepError)}
            autoFocus
          />
        ) : null}

        {step.key === 'requesterName' ? (
          <input
            key="requesterName"
            name="requesterName"
            type="text"
            autoComplete="name"
            maxLength={80}
            placeholder="Attendant / requester"
            value={values.requesterName}
            onChange={(event) => update('requesterName', event.target.value)}
            autoFocus
            className={controlClass}
          />
        ) : null}

        {step.key === 'mobile' ? (
          <input
            key="mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            placeholder="10-digit number"
            value={values.mobile}
            onChange={(event) => update('mobile', event.target.value.replace(/\D/g, '').slice(0, 10))}
            autoFocus
            className={controlClass}
          />
        ) : null}

        {step.key === 'notes' ? (
          <textarea
            key="notes"
            name="notes"
            rows={4}
            maxLength={400}
            placeholder="Ward, doctor, or any extra detail"
            value={values.notes}
            onChange={(event) => update('notes', event.target.value)}
            autoFocus
            className={cn(controlClass, 'min-h-28')}
          />
        ) : null}

        <FieldError message={stepError || (isLast ? state.error || undefined : undefined)} />
      </div>

      <div className="mt-6 grid grid-cols-[1fr_1.4fr] gap-3">
        <button
          type="button"
          className={cn(btnBase, btnGhost, btnDefault, 'w-full')}
          onClick={() => {
            setStepError('')
            if (stepIndex === 0) {
              onClose?.()
              return
            }
            setIndex((current) => Math.max(0, current - 1))
          }}
        >
          Back
        </button>
        {isLast ? (
          <button type="submit" className={cn(btnBase, btnPrimary, btnDefault, 'w-full')} disabled={pending}>
            <DropIcon className="size-[1.1rem] shrink-0" />
            <span>{pending ? 'Sending…' : 'Submit request'}</span>
          </button>
        ) : (
          <button type="button" className={cn(btnBase, btnPrimary, btnDefault, 'w-full')} onClick={goNext}>
            <span>{step.optional && !values[step.key] ? 'Skip' : 'Next'}</span>
          </button>
        )}
      </div>
    </form>
  )
}

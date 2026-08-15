'use client'

import { useActionState, useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import { DatePicker } from '@/components/DatePicker'
import { Dropdown } from '@/components/Dropdown'
import { HeartIcon } from '@/components/Icons'
import { submitDonation, type DonateState } from '@/app/(frontend)/actions/donate'
import { cn } from '@/lib/cn'
import { errorForField, validateDonation, type DonateValues } from '@/lib/donate-validation'
import {
  BLOOD_GROUPS,
  BLOCKS,
  DISTRICT,
  GENDERS,
  mekhalasFor,
} from '@/lib/idukki'
import { btnBase, btnDefault, btnGhost, btnPrimary, fieldControl, fieldInvalid } from '@/lib/ui'

const initialState: DonateState = { ok: false, error: null }

const emptyValues: DonateValues = {
  name: '',
  age: '',
  gender: '',
  bloodGroup: '',
  block: '',
  mekhala: '',
  mobile: '',
  email: '',
  address: '',
  donatedBefore: '',
  lastDonationDate: '',
  preferredDate: '',
}

type Step = {
  key: keyof DonateValues
  title: string
  hint?: string
  optional?: boolean
}

function getSteps(donatedBefore: string): Step[] {
  const steps: Step[] = [
    { key: 'name', title: 'What is your name?' },
    { key: 'age', title: 'How old are you?', hint: 'Donors must be between 18 and 65.' },
    { key: 'gender', title: 'What is your gender?' },
    { key: 'bloodGroup', title: 'What is your blood group?' },
    { key: 'block', title: 'Which block committee are you in?', hint: `District is ${DISTRICT}.` },
    { key: 'mekhala', title: 'Which mekhala are you in?' },
    { key: 'mobile', title: 'What is your mobile number?' },
    { key: 'email', title: 'What is your email ID?', hint: 'Optional — you can skip this.', optional: true },
    { key: 'address', title: 'What is your address / location?' },
    { key: 'donatedBefore', title: 'Have you donated blood before?' },
  ]

  if (donatedBefore === 'yes') {
    steps.push({ key: 'lastDonationDate', title: 'When did you last donate blood?' })
  }

  steps.push({ key: 'preferredDate', title: 'When do you prefer to donate?' })
  return steps
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-2 text-sm text-blood" role="alert">
      {message}
    </p>
  )
}

export function DonateForm() {
  const [state, formAction, pending] = useActionState(submitDonation, initialState)
  const [values, setValues] = useState(emptyValues)
  const [index, setIndex] = useState(0)
  const [stepError, setStepError] = useState('')
  const mekhalas = useMemo(() => mekhalasFor(values.block), [values.block])
  const today = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }, [])
  const steps = getSteps(values.donatedBefore)
  const stepIndex = Math.min(index, steps.length - 1)
  const step = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1
  const progress = ((stepIndex + 1) / steps.length) * 100

  function applyValue(key: keyof DonateValues, value: string): DonateValues {
    const next = { ...values, [key]: value }
    if (key === 'block') next.mekhala = ''
    if (key === 'donatedBefore' && value === 'no') next.lastDonationDate = ''
    return next
  }

  function update(key: keyof DonateValues, value: string) {
    setValues(applyValue(key, value))
    setStepError('')
  }

  function goNextFrom(nextValues: DonateValues, key: keyof DonateValues) {
    const error = errorForField(nextValues, key, today)
    if (error) {
      setStepError(error)
      return false
    }
    setStepError('')
    const nextSteps = getSteps(nextValues.donatedBefore)
    const currentIdx = nextSteps.findIndex((item) => item.key === key)
    if (currentIdx >= 0 && currentIdx < nextSteps.length - 1) {
      setIndex(currentIdx + 1)
    }
    return true
  }

  function goNext() {
    return goNextFrom(values, step.key)
  }

  function chooseAndNext(key: keyof DonateValues, value: string) {
    const nextValues = applyValue(key, value)
    setValues(nextValues)
    goNextFrom(nextValues, key)
  }

  useEffect(() => {
    if (!state.fieldErrors) return
    const currentSteps = getSteps(values.donatedBefore)
    const first = currentSteps.find((item) => state.fieldErrors?.[item.key])
    if (!first) return
    setIndex(currentSteps.indexOf(first))
    setStepError(state.fieldErrors[first.key] || '')
  }, [state, values.donatedBefore])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (!isLast) {
      event.preventDefault()
      goNext()
      return
    }
    const nextErrors = validateDonation(values, today)
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
        <p className="m-0 mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-white/55 uppercase">Registered</p>
        <h2 className="m-0 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold tracking-tight">Thank you for registering.</h2>
        <p className="mt-3 leading-[1.6] text-white/75">We have received your details. Our team will reach out with camp and slot information.</p>
        <a href="/" className={cn(btnBase, btnPrimary, btnDefault, 'mt-6 w-full')}>
          Back to home
        </a>
      </div>
    )
  }

  const controlClass = cn(fieldControl, stepError && fieldInvalid)

  return (
    <form className="w-full" action={formAction} onSubmit={onSubmit} onKeyDown={onKeyDown} noValidate>
      <input type="text" name="company" className="absolute -left-[9999px] h-px w-px overflow-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="district" value={DISTRICT} />
      {(Object.keys(emptyValues) as (keyof DonateValues)[]).map((key) =>
        key === step.key ? null : (
          <input key={key} type="hidden" name={key} value={values[key]} />
        ),
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

      <h2 className="m-0 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold tracking-tight leading-[1.2]">{step.title}</h2>
      {step.hint ? <p className="mt-[0.65rem] leading-normal text-white/60">{step.hint}</p> : null}

      <div className="mt-[1.35rem] w-full">
        {step.key === 'name' ? (
          <input
            key="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            placeholder="Full name"
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
            autoFocus
            className={controlClass}
          />
        ) : null}

        {step.key === 'age' ? (
          <input
            key="age"
            name="age"
            type="number"
            min={18}
            max={65}
            inputMode="numeric"
            placeholder="18–65"
            value={values.age}
            onChange={(event) => update('age', event.target.value)}
            autoFocus
            className={controlClass}
          />
        ) : null}

        {step.key === 'gender' ? (
          <Dropdown
            name="gender"
            value={values.gender}
            onChange={(value) => chooseAndNext('gender', value)}
            placeholder="Select gender"
            options={GENDERS.map((item) => ({ value: item, label: item }))}
            invalid={Boolean(stepError)}
            autoFocus
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

        {step.key === 'block' ? (
          <Dropdown
            name="block"
            value={values.block}
            onChange={(value) => chooseAndNext('block', value)}
            placeholder="Select block committee"
            options={BLOCKS.map((item) => ({ value: item.value, label: item.label }))}
            invalid={Boolean(stepError)}
            autoFocus
          />
        ) : null}

        {step.key === 'mekhala' ? (
          mekhalas.length > 0 ? (
            <Dropdown
              name="mekhala"
              value={values.mekhala}
              onChange={(value) => chooseAndNext('mekhala', value)}
              placeholder="Select mekhala"
              options={mekhalas.map((item) => ({ value: item, label: item }))}
              invalid={Boolean(stepError)}
              autoFocus
            />
          ) : (
            <input
              key="mekhala"
              name="mekhala"
              type="text"
              maxLength={80}
              placeholder="Enter mekhala"
              value={values.mekhala}
              onChange={(event) => update('mekhala', event.target.value)}
              autoFocus
              className={controlClass}
            />
          )
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

        {step.key === 'email' ? (
          <input
            key="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={120}
            placeholder="name@email.com"
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            autoFocus
            className={controlClass}
          />
        ) : null}

        {step.key === 'address' ? (
          <textarea
            key="address"
            name="address"
            rows={4}
            maxLength={400}
            placeholder="House, place, panchayat or landmark"
            value={values.address}
            onChange={(event) => update('address', event.target.value)}
            autoFocus
            className={cn(controlClass, 'min-h-28')}
          />
        ) : null}

        {step.key === 'donatedBefore' ? (
          <div className="grid grid-cols-2 gap-2.5">
            {(['yes', 'no'] as const).map((option) => (
              <label
                key={option}
                className={cn(
                  'flex min-h-[3.1rem] cursor-pointer items-center justify-center rounded-[0.8rem] border border-white/14 bg-[rgba(7,6,8,0.72)] font-display font-semibold',
                  values.donatedBefore === option && 'border-blood bg-blood text-white',
                  stepError && values.donatedBefore !== option && 'border-blood/85',
                )}
              >
                <input
                  type="radio"
                  name="donatedBefore"
                  value={option}
                  className="sr-only"
                  checked={values.donatedBefore === option}
                  onChange={() => chooseAndNext('donatedBefore', option)}
                />
                {option === 'yes' ? 'Yes' : 'No'}
              </label>
            ))}
          </div>
        ) : null}

        {step.key === 'lastDonationDate' ? (
          <DatePicker
            name="lastDonationDate"
            value={values.lastDonationDate}
            onChange={(value) => update('lastDonationDate', value)}
            max={today}
            invalid={Boolean(stepError)}
          />
        ) : null}

        {step.key === 'preferredDate' ? (
          <DatePicker
            name="preferredDate"
            value={values.preferredDate}
            onChange={(value) => update('preferredDate', value)}
            min={today}
            invalid={Boolean(stepError)}
          />
        ) : null}

        <FieldError message={stepError || (isLast ? state.error || undefined : undefined)} />
      </div>

      <div className="mt-6 grid grid-cols-[1fr_1.4fr] gap-3">
        <button
          type="button"
          className={cn(btnBase, btnGhost, btnDefault, 'w-full')}
          disabled={stepIndex === 0}
          onClick={() => {
            setStepError('')
            setIndex((current) => Math.max(0, current - 1))
          }}
        >
          Back
        </button>
        {isLast ? (
          <button type="submit" className={cn(btnBase, btnPrimary, btnDefault, 'w-full')} disabled={pending}>
            <HeartIcon className="size-[1.1rem] shrink-0" />
            <span>{pending ? 'Submitting…' : 'Register to Donate'}</span>
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

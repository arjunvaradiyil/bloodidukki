'use client'

import { useActionState, useMemo, useState } from 'react'
import { DatePicker } from '@/components/DatePicker'
import { Dropdown } from '@/components/Dropdown'
import { Field } from '@/components/Field'
import { DropIcon, PinIcon } from '@/components/Icons'
import { submitBloodRequest, type RequestState } from '@/app/(frontend)/actions/request'
import { cn } from '@/lib/cn'
import { localToday } from '@/lib/donate-validation'
import { BLOOD_GROUPS, BLOCKS } from '@/lib/idukki'
import { btnBase, btnDefault, btnGhost, btnPrimary, fieldControl, fieldInvalid } from '@/lib/ui'

const initialState: RequestState = { ok: false, error: null }

export function RequestForm() {
  const [state, formAction, pending] = useActionState(submitBloodRequest, initialState)
  const [bloodGroup, setBloodGroup] = useState('')
  const [block, setBlock] = useState('')
  const [neededBy, setNeededBy] = useState('')
  const today = useMemo(() => localToday(), [])

  if (state.ok) {
    return (
      <div className="rounded-[1.25rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[18px]">
        <p className="m-0 mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-blood uppercase">Request received</p>
        <h2 className="m-0 font-display text-[clamp(1.6rem,3vw,2.1rem)] font-extrabold leading-tight">
          We have your blood request.
        </h2>
        <p className="mt-3 leading-[1.65] text-white/75">
          DYFI Idukki volunteers will try to reach you with donor support. For emergencies, also contact the hospital
          blood bank directly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/hospitals" className={cn(btnBase, btnPrimary, btnDefault)}>
            <PinIcon className="size-[1.05rem]" />
            Find hospitals
          </a>
          <a href="/" className={cn(btnBase, btnGhost, btnDefault)}>
            Back to home
          </a>
        </div>
      </div>
    )
  }

  const invalid = (key: string) => Boolean(state.fieldErrors?.[key])

  return (
    <form
      action={formAction}
      className="rounded-[1.25rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[18px] sm:p-7"
      noValidate
    >
      <input
        type="text"
        name="company"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <p className="m-0 mb-5 flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.16em] text-white/55 uppercase">
        <DropIcon className="size-4 text-blood" />
        Patient request
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Patient name" error={state.fieldErrors?.patientName}>
          <input
            name="patientName"
            maxLength={80}
            placeholder="Patient full name"
            className={cn(fieldControl, invalid('patientName') && fieldInvalid)}
          />
        </Field>
        <Field label="Blood group needed" error={state.fieldErrors?.bloodGroup}>
          <Dropdown
            name="bloodGroup"
            value={bloodGroup}
            onChange={setBloodGroup}
            placeholder="Select blood group"
            options={BLOOD_GROUPS.map((item) => ({ value: item, label: item }))}
            invalid={invalid('bloodGroup')}
          />
        </Field>
        <Field label="Units needed" error={state.fieldErrors?.units}>
          <input
            name="units"
            type="number"
            min={1}
            max={10}
            placeholder="1–10"
            className={cn(fieldControl, invalid('units') && fieldInvalid)}
          />
        </Field>
        <Field label="Needed by" error={state.fieldErrors?.neededBy}>
          <DatePicker name="neededBy" value={neededBy} onChange={setNeededBy} min={today} invalid={invalid('neededBy')} />
        </Field>
        <Field label="Hospital" error={state.fieldErrors?.hospital}>
          <input
            name="hospital"
            maxLength={120}
            placeholder="Hospital name"
            className={cn(fieldControl, invalid('hospital') && fieldInvalid)}
          />
        </Field>
        <Field label="Block" error={state.fieldErrors?.block}>
          <Dropdown
            name="block"
            value={block}
            onChange={setBlock}
            placeholder="Select block"
            options={BLOCKS.map((item) => ({ value: item.value, label: item.label }))}
            invalid={invalid('block')}
          />
        </Field>
        <Field label="Your name" error={state.fieldErrors?.requesterName}>
          <input
            name="requesterName"
            maxLength={80}
            placeholder="Attendant / requester"
            className={cn(fieldControl, invalid('requesterName') && fieldInvalid)}
          />
        </Field>
        <Field label="Mobile" error={state.fieldErrors?.mobile}>
          <input
            name="mobile"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit number"
            className={cn(fieldControl, invalid('mobile') && fieldInvalid)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Notes (optional)">
            <textarea
              name="notes"
              rows={4}
              maxLength={400}
              placeholder="Ward, doctor, or any extra detail"
              className={cn(fieldControl, 'min-h-28')}
            />
          </Field>
        </div>
      </div>
      {state.error ? (
        <p className="mt-4 text-sm text-blood" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className={cn(btnBase, btnPrimary, btnDefault, 'mt-6 w-full')} disabled={pending}>
        {pending ? 'Sending…' : 'Submit blood request'}
      </button>
    </form>
  )
}

'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Field } from '@/components/Field'
import { submitContact, type ContactState } from '@/app/(frontend)/actions/contact'
import { cn } from '@/lib/cn'
import { btnBase, btnDefault, btnPrimary, fieldControl, fieldInvalid } from '@/lib/ui'

const initialState: ContactState = { ok: false, error: null }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  if (state.ok) {
    return (
      <div className="rounded-[1.15rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-6 backdrop-blur-[18px]">
        <p className="m-0 mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-white/55 uppercase">Message sent</p>
        <h2 className="m-0 font-display text-[1.6rem] font-bold">Thank you for writing to us.</h2>
        <p className="mt-3 leading-[1.6] text-white/75">The DYFI Idukki team will get back to you.</p>
        <Link href="/" className={cn(btnBase, btnPrimary, btnDefault, 'mt-6')}>
          Back to home
        </Link>
      </div>
    )
  }

  const invalid = (key: string) => Boolean(state.fieldErrors?.[key])

  return (
    <form action={formAction} className="rounded-[1.15rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[18px]" noValidate>
      <input type="text" name="company" className="absolute -left-[9999px] h-px w-px overflow-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid gap-4">
        <Field label="Name" error={state.fieldErrors?.name}>
          <input name="name" maxLength={80} placeholder="Your name" className={cn(fieldControl, invalid('name') && fieldInvalid)} />
        </Field>
        <Field label="Mobile" error={state.fieldErrors?.mobile}>
          <input name="mobile" type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit number" className={cn(fieldControl, invalid('mobile') && fieldInvalid)} />
        </Field>
        <Field label="Email (optional)" error={state.fieldErrors?.email}>
          <input name="email" type="email" maxLength={120} placeholder="name@email.com" className={cn(fieldControl, invalid('email') && fieldInvalid)} />
        </Field>
        <Field label="Message" error={state.fieldErrors?.message}>
          <textarea name="message" rows={5} maxLength={800} placeholder="How can we help?" className={cn(fieldControl, 'min-h-32', invalid('message') && fieldInvalid)} />
        </Field>
      </div>
      {state.error ? (
        <p className="mt-4 text-sm text-blood" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className={cn(btnBase, btnPrimary, btnDefault, 'mt-6 w-full')} disabled={pending}>
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

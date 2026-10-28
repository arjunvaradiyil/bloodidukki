'use server'

import { contactValuesFromFormData, validateContact } from '@/lib/contact-validation'
import { persistForm } from '@/lib/form-store'
import { describeError } from '@/lib/payload-client'

export type ContactState = {
  ok: boolean
  error: string | null
  fieldErrors?: Record<string, string>
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (String(formData.get('company') ?? '').trim()) {
    return { ok: true, error: null }
  }

  const values = contactValuesFromFormData(formData)
  const fieldErrors = validateContact(values)

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors }
  }

  try {
    await persistForm('contact-messages', {
      name: values.name,
      mobile: values.mobile,
      email: values.email || undefined,
      message: values.message,
    })
  } catch (error) {
    console.error('Contact submit failed', describeError(error))
    return { ok: false, error: 'Could not submit right now. Please try again.' }
  }

  return { ok: true, error: null }
}

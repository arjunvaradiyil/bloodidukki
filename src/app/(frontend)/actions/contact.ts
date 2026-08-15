'use server'

import { getPayload, ValidationError } from 'payload'
import config from '@payload-config'
import { contactValuesFromFormData, validateContact } from '@/lib/contact-validation'

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
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      data: {
        name: values.name,
        mobile: values.mobile,
        email: values.email || undefined,
        message: values.message,
      },
    })
  } catch (error) {
    console.error('Contact submit failed', error)
    if (error instanceof ValidationError) {
      const nextFieldErrors: Record<string, string> = {}
      const data = error.data as { errors?: { path?: string; message?: string }[] } | undefined
      for (const item of data?.errors ?? []) {
        if (item.path && item.message) nextFieldErrors[item.path] = item.message
      }
      if (Object.keys(nextFieldErrors).length > 0) {
        return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors: nextFieldErrors }
      }
    }
    return { ok: false, error: 'Could not submit right now. Please try again.' }
  }

  return { ok: true, error: null }
}

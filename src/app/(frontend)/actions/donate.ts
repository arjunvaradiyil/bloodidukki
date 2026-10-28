'use server'

import { ValidationError } from 'payload'
import { BLOOD_GROUPS, BLOCKS, DISTRICT, GENDERS } from '@/lib/idukki'
import { toPayloadDate, validateDonation, valuesFromFormData } from '@/lib/donate-validation'
import { describeError, getWritablePayload, withDeadline } from '@/lib/payload-client'

export type DonateState = {
  ok: boolean
  error: string | null
  fieldErrors?: Record<string, string>
}

const WRITE_TIMEOUT_MS = 8000

export async function submitDonation(
  _prev: DonateState,
  formData: FormData,
): Promise<DonateState> {
  if (String(formData.get('company') ?? '').trim()) {
    return { ok: true, error: null }
  }

  const values = valuesFromFormData(formData)
  const fieldErrors = validateDonation(values)

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors }
  }

  const blockLabel = BLOCKS.find((item) => item.value === values.block)?.label ?? values.block
  const preferredDate = toPayloadDate(values.preferredDate)
  const lastDonationDate =
    values.donatedBefore === 'yes' ? toPayloadDate(values.lastDonationDate) : null

  if (!preferredDate) {
    return {
      ok: false,
      error: 'Please fix the highlighted fields.',
      fieldErrors: { preferredDate: 'Choose a preferred donation date.' },
    }
  }

  try {
    const payload = await getWritablePayload()
    if (!payload) {
      return { ok: false, error: 'Could not submit right now. Please try again.' }
    }

    await withDeadline(
      payload.create({
        collection: 'donations',
        overrideAccess: true,
        data: {
          name: values.name,
          district: DISTRICT,
          block: blockLabel,
          mekhala: values.mekhala,
          age: Number(values.age),
          gender: values.gender as (typeof GENDERS)[number],
          bloodGroup: values.bloodGroup as (typeof BLOOD_GROUPS)[number],
          mobile: values.mobile,
          email: values.email || undefined,
          address: values.address,
          donatedBefore: values.donatedBefore as 'yes' | 'no',
          lastDonationDate,
          preferredDate,
        },
      }),
      WRITE_TIMEOUT_MS,
      'Donation save timed out',
    )
  } catch (error) {
    console.error('Donation submit failed', describeError(error))

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

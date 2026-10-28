'use server'

import { ValidationError } from 'payload'
import { BLOOD_GROUPS, isBlockValue } from '@/lib/idukki'
import { localToday, toPayloadDate } from '@/lib/donate-validation'
import { describeError, getWritablePayload, withDeadline } from '@/lib/payload-client'
import { requestValuesFromFormData, validateBloodRequest } from '@/lib/request-validation'

export type RequestState = {
  ok: boolean
  error: string | null
  fieldErrors?: Record<string, string>
}

const WRITE_TIMEOUT_MS = 8000

export async function submitBloodRequest(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  if (String(formData.get('company') ?? '').trim()) {
    return { ok: true, error: null }
  }

  const values = requestValuesFromFormData(formData)
  const fieldErrors = validateBloodRequest(values, localToday())

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors }
  }

  if (!isBlockValue(values.block)) {
    return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors: { block: 'Select a block.' } }
  }

  const neededBy = toPayloadDate(values.neededBy)
  if (!neededBy) {
    return {
      ok: false,
      error: 'Please fix the highlighted fields.',
      fieldErrors: { neededBy: 'Choose when the blood is needed.' },
    }
  }

  try {
    const payload = await getWritablePayload()
    if (!payload) {
      return { ok: false, error: 'Could not submit right now. Please try again.' }
    }

    await withDeadline(
      payload.create({
        collection: 'blood-requests',
        overrideAccess: true,
        data: {
          patientName: values.patientName,
          bloodGroup: values.bloodGroup as (typeof BLOOD_GROUPS)[number],
          units: Number(values.units),
          hospital: values.hospital,
          block: values.block,
          neededBy,
          requesterName: values.requesterName,
          mobile: values.mobile,
          notes: values.notes || undefined,
        },
      }),
      WRITE_TIMEOUT_MS,
      'Blood request save timed out',
    )
  } catch (error) {
    console.error('Blood request submit failed', describeError(error))
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

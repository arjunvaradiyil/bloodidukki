'use server'

import { BLOOD_GROUPS, isBlockValue } from '@/lib/idukki'
import { persistForm } from '@/lib/form-store'
import { localToday, toPayloadDate } from '@/lib/donate-validation'
import { describeError } from '@/lib/payload-client'
import { requestValuesFromFormData, validateBloodRequest } from '@/lib/request-validation'

export type RequestState = {
  ok: boolean
  error: string | null
  fieldErrors?: Record<string, string>
}

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
    await persistForm('blood-requests', {
      patientName: values.patientName,
      bloodGroup: values.bloodGroup as (typeof BLOOD_GROUPS)[number],
      units: Number(values.units),
      hospital: values.hospital,
      block: values.block,
      neededBy,
      requesterName: values.requesterName,
      mobile: values.mobile,
      notes: values.notes || undefined,
    })
  } catch (error) {
    console.error('Blood request submit failed', describeError(error))
    return { ok: false, error: 'Could not submit right now. Please try again.' }
  }

  return { ok: true, error: null }
}

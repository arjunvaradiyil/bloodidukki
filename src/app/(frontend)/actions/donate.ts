'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { BLOOD_GROUPS, BLOCKS, DISTRICT, GENDERS } from '@/lib/idukki'
import { validateDonation, valuesFromFormData } from '@/lib/donate-validation'

export type DonateState = {
  ok: boolean
  error: string | null
  fieldErrors?: Record<string, string>
}

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

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'donations',
      overrideAccess: false,
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
        lastDonationDate: values.donatedBefore === 'yes' ? values.lastDonationDate : null,
        preferredDate: values.preferredDate,
      },
    })
  } catch {
    return { ok: false, error: 'Could not submit right now. Please try again.' }
  }

  return { ok: true, error: null }
}

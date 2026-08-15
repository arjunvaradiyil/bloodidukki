import { BLOOD_GROUPS, isBlockValue } from '@/lib/idukki'

export type RequestValues = {
  patientName: string
  bloodGroup: string
  units: string
  hospital: string
  block: string
  neededBy: string
  requesterName: string
  mobile: string
  notes: string
}

const MOBILE_RE = /^[6-9]\d{9}$/
const NAME_RE = /^[\p{L}][\p{L} .']{1,79}$/u

export function requestValuesFromFormData(formData: FormData): RequestValues {
  const read = (key: string) => String(formData.get(key) ?? '').trim()
  return {
    patientName: read('patientName').slice(0, 80),
    bloodGroup: read('bloodGroup'),
    units: read('units').slice(0, 2),
    hospital: read('hospital').slice(0, 120),
    block: read('block'),
    neededBy: read('neededBy'),
    requesterName: read('requesterName').slice(0, 80),
    mobile: read('mobile').slice(0, 10),
    notes: read('notes').slice(0, 400),
  }
}

export function validateBloodRequest(values: RequestValues, today: string) {
  const fieldErrors: Record<string, string> = {}
  const units = Number(values.units)

  if (!values.patientName) fieldErrors.patientName = 'Enter the patient name.'
  else if (!NAME_RE.test(values.patientName)) fieldErrors.patientName = 'Use letters only in the name.'

  if (!BLOOD_GROUPS.includes(values.bloodGroup as (typeof BLOOD_GROUPS)[number])) {
    fieldErrors.bloodGroup = 'Select the blood group needed.'
  }

  if (!values.units) fieldErrors.units = 'Enter units needed.'
  else if (!Number.isInteger(units) || units < 1 || units > 10) {
    fieldErrors.units = 'Units must be between 1 and 10.'
  }

  if (!values.hospital) fieldErrors.hospital = 'Enter the hospital name.'
  if (!isBlockValue(values.block)) fieldErrors.block = 'Select a block.'

  if (!values.neededBy) fieldErrors.neededBy = 'Choose when blood is needed.'
  else if (values.neededBy < today) fieldErrors.neededBy = 'Needed-by date cannot be in the past.'

  if (!values.requesterName) fieldErrors.requesterName = 'Enter your name.'
  else if (!NAME_RE.test(values.requesterName)) fieldErrors.requesterName = 'Use letters only in your name.'

  if (!values.mobile) fieldErrors.mobile = 'Enter your mobile number.'
  else if (!MOBILE_RE.test(values.mobile)) fieldErrors.mobile = 'Enter a valid 10-digit mobile number.'

  return fieldErrors
}

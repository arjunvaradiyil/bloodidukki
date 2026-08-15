import { BLOOD_GROUPS, GENDERS, isBlockValue, mekhalasFor } from '@/lib/idukki'

export type DonateValues = {
  name: string
  age: string
  gender: string
  bloodGroup: string
  block: string
  mekhala: string
  mobile: string
  email: string
  address: string
  donatedBefore: string
  lastDonationDate: string
  preferredDate: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE_RE = /^[6-9]\d{9}$/
const NAME_RE = /^[\p{L}][\p{L} .']{1,79}$/u

export function localToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function valuesFromFormData(formData: FormData): DonateValues {
  const read = (key: string) => String(formData.get(key) ?? '').trim()
  return {
    name: read('name').slice(0, 80),
    age: read('age').slice(0, 3),
    gender: read('gender'),
    bloodGroup: read('bloodGroup'),
    block: read('block'),
    mekhala: read('mekhala').slice(0, 80),
    mobile: read('mobile').slice(0, 10),
    email: read('email').slice(0, 120),
    address: read('address').slice(0, 400),
    donatedBefore: read('donatedBefore'),
    lastDonationDate: read('lastDonationDate'),
    preferredDate: read('preferredDate'),
  }
}

export function validateDonation(values: DonateValues, today = localToday()) {
  const fieldErrors: Record<string, string> = {}
  const age = Number(values.age)

  if (!values.name) fieldErrors.name = 'Enter your full name.'
  else if (!NAME_RE.test(values.name)) fieldErrors.name = 'Use letters only in your name.'

  if (!values.age) fieldErrors.age = 'Enter your age.'
  else if (!Number.isInteger(age) || age < 18 || age > 65) {
    fieldErrors.age = 'Age must be between 18 and 65.'
  }

  if (!GENDERS.includes(values.gender as (typeof GENDERS)[number])) {
    fieldErrors.gender = 'Select gender.'
  }
  if (!BLOOD_GROUPS.includes(values.bloodGroup as (typeof BLOOD_GROUPS)[number])) {
    fieldErrors.bloodGroup = 'Select blood group.'
  }
  if (!isBlockValue(values.block)) fieldErrors.block = 'Select a block committee.'

  const mekhalaOptions = mekhalasFor(values.block)
  if (!values.mekhala) fieldErrors.mekhala = 'Enter or select your mekhala.'
  else if (mekhalaOptions.length > 0 && !mekhalaOptions.includes(values.mekhala)) {
    fieldErrors.mekhala = 'Select a valid mekhala.'
  }

  if (!values.mobile) fieldErrors.mobile = 'Enter your mobile number.'
  else if (!MOBILE_RE.test(values.mobile)) {
    fieldErrors.mobile = 'Enter a valid 10-digit mobile number.'
  }

  if (values.email && !EMAIL_RE.test(values.email)) {
    fieldErrors.email = 'Enter a valid email address.'
  }

  if (!values.address) fieldErrors.address = 'Enter your address or location.'
  else if (values.address.length < 8) fieldErrors.address = 'Enter a more complete address.'

  if (values.donatedBefore !== 'yes' && values.donatedBefore !== 'no') {
    fieldErrors.donatedBefore = 'Tell us if you have donated before.'
  }

  if (values.donatedBefore === 'yes') {
    if (!values.lastDonationDate) {
      fieldErrors.lastDonationDate = 'Enter your last donation date.'
    } else if (values.lastDonationDate > today) {
      fieldErrors.lastDonationDate = 'Last donation date cannot be in the future.'
    }
  }

  if (!values.preferredDate) {
    fieldErrors.preferredDate = 'Choose a preferred donation date.'
  } else if (values.preferredDate < today) {
    fieldErrors.preferredDate = 'Preferred date cannot be in the past.'
  } else if (
    values.donatedBefore === 'yes' &&
    values.lastDonationDate &&
    daysBetween(values.lastDonationDate, values.preferredDate) < 56
  ) {
    fieldErrors.preferredDate = 'Wait at least 56 days after your last donation.'
  }

  return fieldErrors
}

export function errorForField(
  values: DonateValues,
  key: keyof DonateValues,
  today = localToday(),
) {
  if (key === 'email' && !values.email.trim()) return ''
  return validateDonation(values, today)[key] || ''
}

function daysBetween(from: string, to: string) {
  const start = new Date(`${from}T00:00:00`)
  const end = new Date(`${to}T00:00:00`)
  return Math.round((end.getTime() - start.getTime()) / 86400000)
}

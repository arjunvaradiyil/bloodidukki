export type ContactValues = {
  name: string
  mobile: string
  email: string
  message: string
}

const MOBILE_RE = /^[6-9]\d{9}$/
const NAME_RE = /^[\p{L}][\p{L} .']{1,79}$/u
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function contactValuesFromFormData(formData: FormData): ContactValues {
  const read = (key: string) => String(formData.get(key) ?? '').trim()
  return {
    name: read('name').slice(0, 80),
    mobile: read('mobile').slice(0, 10),
    email: read('email').slice(0, 120),
    message: read('message').slice(0, 800),
  }
}

export function validateContact(values: ContactValues) {
  const fieldErrors: Record<string, string> = {}

  if (!values.name) fieldErrors.name = 'Enter your name.'
  else if (!NAME_RE.test(values.name)) fieldErrors.name = 'Use letters only in your name.'

  if (!values.mobile) fieldErrors.mobile = 'Enter your mobile number.'
  else if (!MOBILE_RE.test(values.mobile)) fieldErrors.mobile = 'Enter a valid 10-digit mobile number.'

  if (values.email && !EMAIL_RE.test(values.email)) {
    fieldErrors.email = 'Enter a valid email address.'
  }

  if (!values.message) fieldErrors.message = 'Enter your message.'
  else if (values.message.length < 10) fieldErrors.message = 'Please write a little more detail.'

  return fieldErrors
}

import { getWritablePayload } from '@/lib/payload-client'

export type FormKind = 'donations' | 'blood-requests' | 'contact-messages'

/** Writes a website form submission to Payload. Throws on failure so callers can show an error. */
export async function persistForm(kind: FormKind, data: Record<string, unknown>) {
  const payload = await getWritablePayload()
  if (!payload) throw new Error('Payload is not available')

  await payload.create({
    collection: kind,
    data: data as never,
    overrideAccess: true,
  })
}

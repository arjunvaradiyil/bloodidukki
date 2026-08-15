import { DEFAULT_HOSPITALS, type Hospital, type HospitalKind } from '@/lib/hospitals'
import { isBlockValue } from '@/lib/idukki'
import { getPayloadClient, withTimeout } from '@/lib/payload-client'

function asHospital(value: {
  name?: string | null
  kind?: string | null
  block?: string | null
  place?: string | null
  address?: string | null
  phone?: string | null
  notes?: string | null
  active?: boolean | null
}): Hospital | null {
  if (!value.name || !value.place || !value.address) return null
  if (value.kind !== 'hospital' && value.kind !== 'blood-bank') return null
  if (!value.block || !isBlockValue(value.block)) return null
  if (value.active === false) return null
  return {
    name: value.name,
    kind: value.kind as HospitalKind,
    block: value.block,
    place: value.place,
    address: value.address,
    phone: value.phone || undefined,
    notes: value.notes || undefined,
  }
}

export async function getHospitals(): Promise<Hospital[]> {
  const payload = await withTimeout(getPayloadClient(), 800, null)
  if (!payload) return DEFAULT_HOSPITALS

  const result = await withTimeout(
    payload.find({
      collection: 'hospitals',
      limit: 100,
      sort: 'name',
      where: { active: { not_equals: false } },
    }),
    800,
    null,
  )

  const fromCms = result?.docs.map((doc) => asHospital(doc)).filter((item): item is Hospital => Boolean(item)) ?? []
  return fromCms.length > 0 ? fromCms : DEFAULT_HOSPITALS
}

export const DISTRICT = 'Idukki'

/**
 * Block committee list for Idukki.
 * Replace these with the official committee names when you have them.
 */
export const BLOCKS = [
  { value: 'adimaly', label: 'Adimaly' },
  { value: 'azhutha', label: 'Azhutha' },
  { value: 'devikulam', label: 'Devikulam' },
  { value: 'elamdesam', label: 'Elamdesam' },
  { value: 'idukki', label: 'Idukki' },
  { value: 'kattappana', label: 'Kattappana' },
  { value: 'nedumkandam', label: 'Nedumkandam' },
  { value: 'peerumade', label: 'Peerumade' },
] as const

export type BlockValue = (typeof BLOCKS)[number]['value']

/**
 * Mekhala list keyed by block value.
 * Add names when the list is ready, e.g. adimaly: ['Mekhala A', 'Mekhala B'].
 * An empty list shows a text field instead of a dropdown.
 */
export const MEKHALAS_BY_BLOCK: Record<BlockValue, string[]> = {
  adimaly: [],
  azhutha: [],
  devikulam: [],
  elamdesam: [],
  idukki: [],
  kattappana: [],
  nedumkandam: [],
  peerumade: [],
}

export const GENDERS = ['Male', 'Female', 'Other'] as const
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const

export function isBlockValue(value: string): value is BlockValue {
  return BLOCKS.some((block) => block.value === value)
}

export function mekhalasFor(block: string): string[] {
  if (!isBlockValue(block)) return []
  return MEKHALAS_BY_BLOCK[block]
}

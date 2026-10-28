export const DISTRICT = 'Idukki'

export const BLOCKS = [
  { value: 'elappara', label: 'Elappara' },
  { value: 'peerumade', label: 'Peerumade' },
  { value: 'vandanmedu', label: 'Vandanmedu' },
  { value: 'kattappana', label: 'Kattappana' },
  { value: 'idukki', label: 'Idukki' },
  { value: 'nedumkandam', label: 'Nedumkandam' },
  { value: 'santhanpara', label: 'Santhanpara' },
  { value: 'rajakkad', label: 'Rajakkad' },
  { value: 'adimali', label: 'Adimali' },
  { value: 'munnar', label: 'Munnar' },
  { value: 'marayur', label: 'Marayur' },
  { value: 'moolamattom', label: 'Moolamattom' },
  { value: 'thodupuzha-west', label: 'Thodupuzha West' },
  { value: 'thodupuzha-east', label: 'Thodupuzha East' },
  { value: 'karimannoor', label: 'Karimannoor' },
] as const

export type BlockValue = (typeof BLOCKS)[number]['value']

/**
 * Mekhala list keyed by block value.
 * An empty list shows a text field instead of a dropdown.
 */
export const MEKHALAS_BY_BLOCK: Record<BlockValue, string[]> = {
  elappara: [],
  peerumade: [],
  vandanmedu: [],
  kattappana: [],
  idukki: [],
  nedumkandam: [],
  santhanpara: [],
  rajakkad: [],
  adimali: [],
  munnar: [],
  marayur: [],
  moolamattom: [],
  'thodupuzha-west': [],
  'thodupuzha-east': [],
  karimannoor: [],
}

export const GENDERS = ['Male', 'Female', 'Transgender'] as const
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const

export function isBlockValue(value: string): value is BlockValue {
  return BLOCKS.some((block) => block.value === value)
}

export function mekhalasFor(block: string): string[] {
  if (!isBlockValue(block)) return []
  return MEKHALAS_BY_BLOCK[block]
}

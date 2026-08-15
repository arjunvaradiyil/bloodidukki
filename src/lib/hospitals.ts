import { BLOCKS, type BlockValue } from '@/lib/idukki'

export type HospitalKind = 'hospital' | 'blood-bank'

export type Hospital = {
  name: string
  kind: HospitalKind
  block: BlockValue
  place: string
  address: string
  phone?: string
  notes?: string
}

export const HOSPITAL_KINDS: { value: HospitalKind; label: string }[] = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'blood-bank', label: 'Blood bank' },
]

export const DEFAULT_HOSPITALS: Hospital[] = [
  {
    name: 'Government Medical College, Idukki',
    kind: 'hospital',
    block: 'idukki',
    place: 'Cheruthoni',
    address: 'GMC Idukki, Cheruthoni, Idukki',
    notes: 'Medical college hospital with emergency and transfusion support.',
  },
  {
    name: 'District Hospital, Idukki',
    kind: 'hospital',
    block: 'idukki',
    place: 'Painavu',
    address: 'District Hospital, Painavu, Idukki',
    notes: 'District headquarters hospital.',
  },
  {
    name: 'Idukki District Blood Bank',
    kind: 'blood-bank',
    block: 'idukki',
    place: 'Painavu',
    address: 'District Hospital campus, Painavu, Idukki',
    notes: 'Contact the blood bank through District Hospital, Idukki.',
  },
  {
    name: 'District Hospital, Kattappana',
    kind: 'hospital',
    block: 'kattappana',
    place: 'Kattappana',
    address: 'District Hospital, Kattappana, Idukki',
  },
  {
    name: 'St. John’s Hospital, Kattappana',
    kind: 'hospital',
    block: 'kattappana',
    place: 'Kattappana',
    address: 'St. John’s Hospital, Kattappana, Idukki',
  },
  {
    name: 'Taluk Hospital, Adimaly',
    kind: 'hospital',
    block: 'adimaly',
    place: 'Adimaly',
    address: 'Taluk Hospital, Adimaly, Idukki',
  },
  {
    name: 'Taluk Hospital, Nedumkandam',
    kind: 'hospital',
    block: 'nedumkandam',
    place: 'Nedumkandam',
    address: 'Taluk Hospital, Nedumkandam, Idukki',
  },
  {
    name: 'Taluk Hospital, Peermade',
    kind: 'hospital',
    block: 'peerumade',
    place: 'Peermade',
    address: 'Taluk Hospital, Peermade, Idukki',
  },
  {
    name: 'Taluk Hospital, Devikulam',
    kind: 'hospital',
    block: 'devikulam',
    place: 'Devikulam',
    address: 'Taluk Hospital, Devikulam, Idukki',
  },
  {
    name: 'Community Health Centre, Kumily',
    kind: 'hospital',
    block: 'azhutha',
    place: 'Kumily',
    address: 'CHC Kumily, Azhutha block, Idukki',
  },
  {
    name: 'Holy Family Hospital, Muthalakodam',
    kind: 'hospital',
    block: 'elamdesam',
    place: 'Thodupuzha',
    address: 'Holy Family Hospital, Muthalakodam, Thodupuzha, Idukki',
  },
  {
    name: 'Taluk Headquarters Hospital, Thodupuzha',
    kind: 'hospital',
    block: 'elamdesam',
    place: 'Thodupuzha',
    address: 'THQH Thodupuzha, Idukki',
  },
]

export function blockLabel(value: string) {
  return BLOCKS.find((item) => item.value === value)?.label ?? value
}

export function kindLabel(kind: HospitalKind) {
  return HOSPITAL_KINDS.find((item) => item.value === kind)?.label ?? kind
}

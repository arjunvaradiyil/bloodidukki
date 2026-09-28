import { BLOCKS, type BlockValue } from '@/lib/idukki'

export type HospitalKind = 'hospital' | 'blood-bank'

export type Hospital = {
  name: string
  kind: HospitalKind
  block: string
  place: string
  address: string
  phone?: string
  notes?: string
  lat?: number
  lng?: number
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
    lat: 9.8475,
    lng: 76.968,
  },
  {
    name: 'District Hospital, Idukki',
    kind: 'hospital',
    block: 'idukki',
    place: 'Painavu',
    address: 'District Hospital, Painavu, Idukki',
    notes: 'District headquarters hospital.',
    lat: 9.847,
    lng: 76.941,
  },
  {
    name: 'Idukki District Blood Bank',
    kind: 'blood-bank',
    block: 'idukki',
    place: 'Painavu',
    address: 'District Hospital campus, Painavu, Idukki',
    notes: 'Contact the blood bank through District Hospital, Idukki.',
    lat: 9.8472,
    lng: 76.9415,
  },
  {
    name: 'District Hospital, Kattappana',
    kind: 'hospital',
    block: 'kattappana',
    place: 'Kattappana',
    address: 'District Hospital, Kattappana, Idukki',
    lat: 9.7548,
    lng: 77.1169,
  },
  {
    name: 'St. John’s Hospital, Kattappana',
    kind: 'hospital',
    block: 'kattappana',
    place: 'Kattappana',
    address: 'St. John’s Hospital, Kattappana, Idukki',
    lat: 9.748,
    lng: 77.115,
  },
  {
    name: 'Taluk Hospital, Adimaly',
    kind: 'hospital',
    block: 'adimaly',
    place: 'Adimaly',
    address: 'Taluk Hospital, Adimaly, Idukki',
    lat: 10.011,
    lng: 76.951,
  },
  {
    name: 'Taluk Hospital, Nedumkandam',
    kind: 'hospital',
    block: 'nedumkandam',
    place: 'Nedumkandam',
    address: 'Taluk Hospital, Nedumkandam, Idukki',
    lat: 9.833,
    lng: 77.155,
  },
  {
    name: 'Taluk Hospital, Peermade',
    kind: 'hospital',
    block: 'peerumade',
    place: 'Peermade',
    address: 'Taluk Hospital, Peermade, Idukki',
    lat: 9.57,
    lng: 77.02,
  },
  {
    name: 'Taluk Hospital, Devikulam',
    kind: 'hospital',
    block: 'devikulam',
    place: 'Devikulam',
    address: 'Taluk Hospital, Devikulam, Idukki',
    lat: 10.063,
    lng: 77.108,
  },
  {
    name: 'Community Health Centre, Kumily',
    kind: 'hospital',
    block: 'azhutha',
    place: 'Kumily',
    address: 'CHC Kumily, Azhutha block, Idukki',
    lat: 9.603,
    lng: 77.165,
  },
  {
    name: 'Holy Family Hospital, Muthalakodam',
    kind: 'hospital',
    block: 'elamdesam',
    place: 'Thodupuzha',
    address: 'Holy Family Hospital, Muthalakodam, Thodupuzha, Idukki',
    lat: 9.928,
    lng: 76.718,
  },
  {
    name: 'Taluk Headquarters Hospital, Thodupuzha',
    kind: 'hospital',
    block: 'elamdesam',
    place: 'Thodupuzha',
    address: 'THQH Thodupuzha, Idukki',
    lat: 9.896,
    lng: 76.711,
  },
]

export function blockLabel(value: string) {
  return BLOCKS.find((item) => item.value === value)?.label ?? value
}

export function kindLabel(kind: HospitalKind) {
  return HOSPITAL_KINDS.find((item) => item.value === kind)?.label ?? kind
}

import { BLOCKS } from '@/lib/idukki'

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
    name: 'Idukki Medical College',
    kind: 'hospital',
    block: 'idukki',
    place: 'Painavu',
    address: 'Idukki Medical College, Painavu, Idukki',
    lat: 9.847,
    lng: 76.941,
  },
  {
    name: 'St. John’s Hospital',
    kind: 'hospital',
    block: 'kattappana',
    place: 'Kattappana',
    address: 'St. John’s Hospital, Kattappana, Idukki',
    lat: 9.748,
    lng: 77.115,
  },
  {
    name: 'Peerumedu Taluk Hospital',
    kind: 'hospital',
    block: 'peerumade',
    place: 'Pambanar',
    address: 'Peerumedu Taluk Hospital, Pambanar, Idukki',
    lat: 9.575,
    lng: 76.977,
  },
  {
    name: 'Kattappana Taluk Hospital',
    kind: 'hospital',
    block: 'kattappana',
    place: 'Kattappana',
    address: 'Kattappana Taluk Hospital, Kattappana, Idukki',
    lat: 9.7548,
    lng: 77.1169,
  },
  {
    name: 'Nedumkandam Taluk Hospital',
    kind: 'hospital',
    block: 'nedumkandam',
    place: 'Nedumkandam',
    address: 'Nedumkandam Taluk Hospital, Nedumkandam, Idukki',
    lat: 9.833,
    lng: 77.155,
  },
  {
    name: 'Kottayam Medical College',
    kind: 'hospital',
    block: '',
    place: 'Kottayam',
    address: 'Government Medical College, Kottayam',
    lat: 9.568,
    lng: 76.546,
  },
  {
    name: 'Mar Sleeva Medicity',
    kind: 'hospital',
    block: '',
    place: 'Pala',
    address: 'Mar Sleeva Medicity, Pala',
    lat: 9.713,
    lng: 76.688,
  },
  {
    name: 'BMH',
    kind: 'hospital',
    block: 'thodupuzha-east',
    place: 'Thodupuzha',
    address: 'BMH, Thodupuzha, Idukki',
  },
  {
    name: 'Smitha Memorial',
    kind: 'hospital',
    block: 'thodupuzha-east',
    place: 'Thodupuzha',
    address: 'Smitha Memorial Hospital, Thodupuzha, Idukki',
  },
  {
    name: 'St. Mary’s',
    kind: 'hospital',
    block: 'thodupuzha-east',
    place: 'Thodupuzha',
    address: 'St. Mary’s Hospital, Thodupuzha, Idukki',
  },
  {
    name: 'Holy Family',
    kind: 'hospital',
    block: 'thodupuzha-east',
    place: 'Muthalakodam',
    address: 'Holy Family Hospital, Muthalakodam, Thodupuzha, Idukki',
  },
  {
    name: 'Al Azhar Medical College',
    kind: 'hospital',
    block: 'thodupuzha-east',
    place: 'Ezhalloor',
    address: 'Al Azhar Medical College, Ezhalloor, Thodupuzha, Idukki',
  },
  {
    name: 'District Hospital Thodupuzha',
    kind: 'hospital',
    block: 'thodupuzha-east',
    place: 'Thodupuzha',
    address: 'District Hospital, Thodupuzha, Idukki',
  },
  {
    name: 'District Co-operative Hospital',
    kind: 'hospital',
    block: 'thodupuzha-east',
    place: 'Thodupuzha',
    address: 'District Co-operative Hospital, Thodupuzha, Idukki',
  },
  {
    name: 'IMA Blood Bank Thodupuzha',
    kind: 'blood-bank',
    block: 'thodupuzha-east',
    place: 'Thodupuzha',
    address: 'IMA Blood Bank, Thodupuzha, Idukki',
  },
]

export function blockLabel(value: string) {
  if (!value) return 'Outside Idukki'
  return BLOCKS.find((item) => item.value === value)?.label ?? value
}

export function kindLabel(kind: HospitalKind) {
  return HOSPITAL_KINDS.find((item) => item.value === kind)?.label ?? kind
}

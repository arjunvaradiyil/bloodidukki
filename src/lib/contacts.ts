export type ContactPerson = {
  name: string
  englishName: string
  roles: string[]
  phone: string
  photo: string
  photoZoom?: number
  photoPosition?: string
  photoOrigin?: string
}

export const contactPeople: ContactPerson[] = [
  {
    name: 'എസ്. സുധീഷ്',
    englishName: 'S. Sudheesh',
    roles: ['DYFI State Secretariat Member', 'Idukki District Secretary'],
    phone: '+918156908156',
    photo: '/images/contacts/s-sudheesh.jpg',
    photoPosition: 'center 12%',
  },
  {
    name: 'ബി. അനൂപ്',
    englishName: 'B. Anoop',
    roles: ['DYFI State Committee Member', 'Idukki District President'],
    phone: '+919526422357',
    photo: '/images/contacts/b-anoop.jpg',
    photoZoom: 1.95,
    photoPosition: 'center 26%',
    photoOrigin: 'center 26%',
  },
  {
    name: 'ശരത്ത്. എം. എസ്',
    englishName: 'Sarath M. S.',
    roles: ['DYFI State Committee Member', 'District Treasurer'],
    phone: '+918547704826',
    photo: '/images/contacts/sharath-ms.jpg',
    photoZoom: 1.55,
    photoPosition: 'center 10%',
  },
  {
    name: 'തേജസ്‌ കെ ജോസ്',
    englishName: 'Thejas K Jose',
    roles: ['DYFI State Committee Member'],
    phone: '+919400119900',
    photo: '/images/contacts/tejas-k-jose.jpg',
    photoZoom: 1.85,
    photoPosition: 'center 14%',
  },
]

export type ContactPerson = {
  name: string
  englishName: string
  roles: string[]
  photo: string
}

export const contactPeople: ContactPerson[] = [
  {
    name: 'എസ്. സുധീഷ്',
    englishName: 'S. Sudheesh',
    roles: ['DYFI സംസ്ഥാന സെക്രട്ടറിയറ്റ് അംഗം', 'ഇടുക്കി ജില്ലാ സെക്രട്ടറി'],
    photo: '/images/contacts/s-sudheesh.jpg',
  },
  {
    name: 'ബി. അനൂപ്',
    englishName: 'B. Anoop',
    roles: ['DYFI സംസ്ഥാന കമ്മിറ്റി അംഗം', 'ഇടുക്കി ജില്ലാ പ്രസിഡന്റ്'],
    photo: '/images/contacts/b-anoop.jpg',
  },
  {
    name: 'ശരത്ത്. എം. എസ്',
    englishName: 'Sharath M. S.',
    roles: ['DYFI സംസ്ഥാന കമ്മിറ്റി അംഗം', 'ജില്ലാ ട്രഷറർ'],
    photo: '/images/contacts/sharath-ms.jpg',
  },
  {
    name: 'തേജസ്‌ കെ ജോസ്',
    englishName: 'Tejas K Jose',
    roles: ['DYFI സംസ്ഥാന കമ്മിറ്റി അംഗം'],
    photo: '/images/contacts/tejas-k-jose.jpg',
  },
]

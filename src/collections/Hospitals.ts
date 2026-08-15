import type { CollectionConfig } from 'payload'
import { BLOCKS } from '@/lib/idukki'

export const Hospitals: CollectionConfig = {
  slug: 'hospitals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'block', 'phone', 'active'],
    description: 'Hospitals and blood banks shown on the Find Hospitals page.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'hospital',
      options: [
        { label: 'Hospital', value: 'hospital' },
        { label: 'Blood bank', value: 'blood-bank' },
      ],
    },
    {
      name: 'block',
      type: 'select',
      required: true,
      options: BLOCKS.map((item) => ({ label: item.label, value: item.value })),
    },
    { name: 'place', type: 'text', required: true },
    { name: 'address', type: 'textarea', required: true },
    { name: 'phone', type: 'text' },
    { name: 'notes', type: 'textarea' },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
  timestamps: true,
}

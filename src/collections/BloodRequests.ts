import type { CollectionConfig } from 'payload'
import { BLOOD_GROUPS, BLOCKS } from '@/lib/idukki'

export const BloodRequests: CollectionConfig = {
  slug: 'blood-requests',
  admin: {
    useAsTitle: 'patientName',
    defaultColumns: ['patientName', 'bloodGroup', 'hospital', 'neededBy', 'mobile', 'createdAt'],
    description: 'Emergency blood requests submitted from the website.',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'patientName', type: 'text', required: true },
    {
      name: 'bloodGroup',
      type: 'select',
      required: true,
      options: BLOOD_GROUPS.map((item) => ({ label: item, value: item })),
    },
    { name: 'units', type: 'number', required: true, min: 1, max: 10 },
    { name: 'hospital', type: 'text', required: true },
    {
      name: 'block',
      type: 'select',
      required: true,
      options: BLOCKS.map((item) => ({ label: item.label, value: item.value })),
    },
    {
      name: 'neededBy',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'requesterName', type: 'text', required: true },
    { name: 'mobile', type: 'text', required: true, index: true },
    { name: 'notes', type: 'textarea' },
  ],
  timestamps: true,
}

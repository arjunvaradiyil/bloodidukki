import type { CollectionConfig } from 'payload'

export const Donations: CollectionConfig = {
  slug: 'donations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'mobile', 'bloodGroup', 'block', 'preferredDate', 'createdAt'],
    description: 'Donor registrations submitted from the website form.',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'district', type: 'text', required: true, defaultValue: 'Idukki' },
    { name: 'block', type: 'text', required: true },
    { name: 'mekhala', type: 'text', required: true },
    { name: 'age', type: 'number', required: true, min: 18, max: 65 },
    {
      name: 'gender',
      type: 'select',
      required: true,
      options: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      name: 'bloodGroup',
      type: 'select',
      required: true,
      options: [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
      ],
    },
    { name: 'mobile', type: 'text', required: true, index: true },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'textarea', required: true },
    {
      name: 'donatedBefore',
      type: 'select',
      required: true,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      name: 'lastDonationDate',
      type: 'date',
      admin: {
        condition: (_, siblingData) => siblingData?.donatedBefore === 'yes',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'preferredDate',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
  ],
  timestamps: true,
}

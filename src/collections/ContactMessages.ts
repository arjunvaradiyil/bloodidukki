import type { CollectionConfig } from 'payload'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'mobile', 'email', 'createdAt'],
    description: 'Messages sent from the Contact Us page.',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'mobile', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'message', type: 'textarea', required: true },
  ],
  timestamps: true,
}

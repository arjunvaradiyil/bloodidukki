import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    cookies: {
      sameSite: 'Lax',
      secure: Boolean(process.env.VERCEL),
    },
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  access: {
    admin: () => true,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}

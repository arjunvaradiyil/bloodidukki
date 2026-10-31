import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    useSessions: false,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
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

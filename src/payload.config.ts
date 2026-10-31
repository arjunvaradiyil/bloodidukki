import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Donations } from './collections/Donations'
import { Hospitals } from './collections/Hospitals'
import { BloodRequests } from './collections/BloodRequests'
import { ContactMessages } from './collections/ContactMessages'
import { Header } from './globals/Header'
import { Home } from './globals/Home'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function requireEnv(name: string) {
  const value = process.env[name]?.trim()
  if (value) return value
  // `next build` imports this config without runtime secrets.
  if (process.env.NEXT_PHASE === 'phase-production-build') return `build-placeholder-${name}`
  throw new Error(`Missing required environment variable: ${name}`)
}

/** A linked Vercel Postgres/Neon store injects POSTGRES_URL, not DATABASE_URL. */
function databaseUrl() {
  for (const name of ['DATABASE_URL', 'POSTGRES_URL', 'POSTGRES_PRISMA_URL']) {
    const value = process.env[name]?.trim()
    if (value && /^postgres(ql)?:\/\//.test(value)) return value
  }
  return requireEnv('DATABASE_URL')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Donate Blood',
    },
    components: {
      views: {
        dashboard: {
          Component: '/components/AdminDashboard#AdminDashboard',
        },
      },
    },
  },
  collections: [Users, Media, Donations, Hospitals, BloodRequests, ContactMessages],
  globals: [Header, Home],
  editor: lexicalEditor(),
  secret: requireEnv('PAYLOAD_SECRET'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: databaseUrl() },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Schema changes ship as migrations, never auto-push. Pending ones run on boot in production.
    push: false,
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
  onInit: async (payload) => {
    const email = process.env.ADMIN_EMAIL?.trim()
    const password = process.env.ADMIN_PASSWORD?.trim()
    if (!email || !password) return

    try {
      const existing = await payload.find({
        collection: 'users',
        limit: 1,
        overrideAccess: true,
      })
      if (existing.totalDocs > 0) return

      await payload.create({
        collection: 'users',
        overrideAccess: true,
        data: { email, password },
      })
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Admin user seed skipped' })
    }
  },
})

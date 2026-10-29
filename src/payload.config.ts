import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { sqliteFileUrl } from './lib/sqlite-path'

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

function mongoUrl() {
  const raw =
    process.env.MONGODB_URI ||
    (process.env.DATABASE_URL?.startsWith('mongodb') ? process.env.DATABASE_URL : '')
  if (!raw) return null

  try {
    const parsed = new URL(raw)
    if (!parsed.pathname || parsed.pathname === '/') parsed.pathname = '/bloodidukki'
    return parsed.toString()
  } catch {
    return raw
  }
}

const atlasUrl = mongoUrl()

function useMongo() {
  if (!atlasUrl) return false
  if (process.env.USE_MONGO === 'true') return true
  if (process.env.USE_MONGO === 'false') return false
  if (process.env.VERCEL) return false
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('mongodb')) return false
  return true
}

function payloadSecret() {
  const fromEnv = process.env.PAYLOAD_SECRET?.trim()
  if (fromEnv) return fromEnv
  if (process.env.NEXT_PHASE === 'phase-production-build') return 'build-placeholder'
  if (process.env.VERCEL) return 'jeevanam-idukki-vercel-forms'
  return ''
}

const mongoEnabled = useMongo()

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
  secret: payloadSecret(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongoEnabled && atlasUrl
    ? mongooseAdapter({
        url: atlasUrl,
        connectOptions: {
          serverSelectionTimeoutMS: 4000,
          connectTimeoutMS: 4000,
        },
      })
    : sqliteAdapter({
        client: {
          url: sqliteFileUrl(),
        },
        allowIDOnCreate: true,
        busyTimeout: 5000,
        push: false,
        prodMigrations: migrations,
      }),
  sharp,
  plugins: [],
  onInit: async (payload) => {
    const email = process.env.ADMIN_EMAIL?.trim() || 'dyfiidukki@gmail.com'
    const password = process.env.ADMIN_PASSWORD?.trim() || 'dyfiidukki'

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
        data: { id: 1, email, password },
      })
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Admin user seed skipped' })
    }
  },
})

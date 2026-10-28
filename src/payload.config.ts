import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import os from 'os'
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

function sqliteUrl() {
  if (process.env.VERCEL) {
    return `file:${path.join(os.tmpdir(), 'bloodidukki.db')}`
  }

  const url = process.env.DATABASE_URL
  if (url && !url.startsWith('mongodb')) return url
  return 'file:./.db'
}

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
          url: sqliteUrl(),
        },
        busyTimeout: 5000,
        push: true,
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
        where: { email: { equals: email } },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'users',
          overrideAccess: true,
          data: { email, password },
        })
      } else {
        await payload.update({
          collection: 'users',
          id: existing.docs[0].id,
          overrideAccess: true,
          data: { password },
        })
      }
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Admin user seed skipped' })
    }
  },
})

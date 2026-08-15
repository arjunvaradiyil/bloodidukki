import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
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
const useMongo = Boolean(
  atlasUrl && (process.env.VERCEL || process.env.DATABASE_URL?.startsWith('mongodb')),
)

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
  secret:
    process.env.PAYLOAD_SECRET ||
    (process.env.NEXT_PHASE === 'phase-production-build' ? 'build-placeholder' : ''),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: useMongo && atlasUrl
    ? mongooseAdapter({
        url: atlasUrl,
        connectOptions: { serverSelectionTimeoutMS: 8000 },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || 'file:./.db',
        },
      }),
  sharp,
  plugins: [],
})

import os from 'os'
import path from 'path'

export function sqliteFileUrl() {
  if (process.env.VERCEL) {
    return `file:${path.join(os.tmpdir(), 'bloodidukki.db')}`
  }

  const url = process.env.DATABASE_URL
  if (url && !url.startsWith('mongodb')) return url
  return 'file:./.db'
}

export function sqliteFilePath() {
  return sqliteFileUrl().replace(/^file:/, '')
}

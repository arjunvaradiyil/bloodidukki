import { appendFile, mkdir } from 'fs/promises'
import os from 'os'
import path from 'path'
import { describeError } from '@/lib/payload-client'

type FormKind = 'donations' | 'blood-requests' | 'contact-messages'

function storeDir() {
  return process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), '.data')
}

function jsonlPath() {
  return path.join(storeDir(), 'submissions.jsonl')
}

function sqlitePath() {
  return path.join(storeDir(), 'bloodidukki-forms.db')
}

async function persistJsonl(kind: FormKind, data: Record<string, unknown>) {
  await mkdir(storeDir(), { recursive: true })
  const record = { kind, at: new Date().toISOString(), data }
  await appendFile(jsonlPath(), `${JSON.stringify(record)}\n`, 'utf8')
}

async function persistSqlite(kind: FormKind, data: Record<string, unknown>) {
  const { DatabaseSync } = (await import('node:sqlite')) as {
    DatabaseSync: new (path: string) => {
      exec(sql: string): void
      prepare(sql: string): { run: (...args: unknown[]) => void; close?: () => void }
      close(): void
    }
  }

  await mkdir(storeDir(), { recursive: true })
  const db = new DatabaseSync(sqlitePath())
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kind TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `)
    const stmt = db.prepare('INSERT INTO submissions (kind, payload, created_at) VALUES (?, ?, ?)')
    stmt.run(kind, JSON.stringify(data), new Date().toISOString())
  } finally {
    db.close()
  }
}

export async function persistForm(kind: FormKind, data: Record<string, unknown>) {
  await persistJsonl(kind, data)

  try {
    await persistSqlite(kind, data)
  } catch (error) {
    console.error('SQLite form persist failed', describeError(error))
  }
}

import { appendFile, mkdir, readFile } from 'fs/promises'
import os from 'os'
import path from 'path'
import { randomUUID } from 'crypto'
import { describeError } from '@/lib/payload-client'
import type { Payload } from 'payload'

export type FormKind = 'donations' | 'blood-requests' | 'contact-messages'

export type SubmissionRecord = {
  id: string
  kind: FormKind
  at: string
  data: Record<string, unknown>
}

function jsonlPath() {
  const dir = process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), '.data')
  return path.join(dir, 'submissions.jsonl')
}

function token() {
  return (
    process.env.SUBMISSIONS_TOKEN?.trim() ||
    process.env.GH_TOKEN?.trim() ||
    process.env.GITHUB_TOKEN?.trim() ||
    ''
  )
}

function kvUrl() {
  return (
    process.env.KV_REST_API_URL?.trim() ||
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    ''
  )
}

function kvToken() {
  return (
    process.env.KV_REST_API_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    ''
  )
}

const KV_KEY = process.env.SUBMISSIONS_KV_KEY?.trim() || 'bloodidukki:submissions'

async function kvCommand(command: Array<string | number>) {
  const url = kvUrl()
  const auth = kvToken()
  if (!url || !auth) return null

  const res = await fetch(url.replace(/\/$/, ''), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`KV command failed (${res.status})`)
  return (await res.json()) as { result?: unknown }
}

async function readKv(): Promise<SubmissionRecord[]> {
  const json = await kvCommand(['LRANGE', KV_KEY, 0, -1])
  if (!json) return []

  const rows = Array.isArray(json.result) ? json.result : []
  return rows
    .map((item) => {
      try {
        return typeof item === 'string' ? (JSON.parse(item) as SubmissionRecord) : null
      } catch {
        return null
      }
    })
    .filter((item): item is SubmissionRecord => Boolean(item?.kind && item?.data))
}

async function writeKv(record: SubmissionRecord) {
  const json = await kvCommand(['RPUSH', KV_KEY, JSON.stringify(record)])
  return json != null
}

function repo() {
  return process.env.SUBMISSIONS_REPO?.trim() || ''
}

function filePath() {
  return process.env.SUBMISSIONS_PATH?.trim() || 'submissions.json'
}

async function readJsonl(): Promise<SubmissionRecord[]> {
  try {
    const raw = await readFile(jsonlPath(), 'utf8')
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as SubmissionRecord)
      .filter((item) => item?.kind && item?.data)
  } catch {
    return []
  }
}

async function writeJsonl(record: SubmissionRecord) {
  await mkdir(path.dirname(jsonlPath()), { recursive: true })
  await appendFile(jsonlPath(), `${JSON.stringify(record)}\n`, 'utf8')
}

async function githubHeaders() {
  const auth = token()
  if (!auth) return null
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${auth}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'jeevanam-idukki',
  }
}

async function readGithub(): Promise<{ records: SubmissionRecord[]; sha?: string }> {
  const headers = await githubHeaders()
  if (!headers || !repo()) return { records: [] }

  const res = await fetch(
    `https://api.github.com/repos/${repo()}/contents/${encodeURIComponent(filePath())}`,
    { headers, cache: 'no-store' },
  )
  if (res.status === 404) return { records: [] }
  if (!res.ok) {
    throw new Error(`GitHub read failed (${res.status})`)
  }

  const json = (await res.json()) as { content?: string; sha?: string }
  const decoded = Buffer.from(json.content || '', 'base64').toString('utf8')
  const parsed = decoded ? (JSON.parse(decoded) as SubmissionRecord[]) : []
  return { records: Array.isArray(parsed) ? parsed : [], sha: json.sha }
}

async function writeGithub(records: SubmissionRecord[], sha?: string) {
  const headers = await githubHeaders()
  if (!headers || !repo()) return false

  const res = await fetch(
    `https://api.github.com/repos/${repo()}/contents/${encodeURIComponent(filePath())}`,
    {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Store ${records.at(-1)?.kind || 'form'} submission`,
        content: Buffer.from(`${JSON.stringify(records, null, 2)}\n`, 'utf8').toString('base64'),
        sha,
      }),
    },
  )

  if (res.status === 409) return false
  if (!res.ok) throw new Error(`GitHub write failed (${res.status})`)
  return true
}

export async function listSubmissions(kind?: FormKind): Promise<SubmissionRecord[]> {
  const local = await readJsonl()
  let remote: SubmissionRecord[] = []
  try {
    remote = [...(await readKv()), ...(await readGithub()).records]
  } catch (error) {
    console.error('Submission log read failed', describeError(error))
  }

  const merged = new Map<string, SubmissionRecord>()
  for (const item of [...remote, ...local]) {
    merged.set(item.id || `${item.kind}-${item.at}`, item)
  }

  return [...merged.values()]
    .filter((item) => !kind || item.kind === kind)
    .sort((a, b) => b.at.localeCompare(a.at))
}

export async function appendSubmission(kind: FormKind, data: Record<string, unknown>) {
  const record: SubmissionRecord = {
    id: randomUUID(),
    kind,
    at: new Date().toISOString(),
    data,
  }

  try {
    await writeJsonl(record)
  } catch (error) {
    console.error('JSONL form persist failed', describeError(error))
  }

  try {
    if (await writeKv(record)) return record
  } catch (error) {
    console.error('KV form persist failed', describeError(error))
  }

  if (!token() || !repo()) return record

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const current = await readGithub()
    const next = [...current.records, record]
    const saved = await writeGithub(next, current.sha)
    if (saved) return record
  }

  throw new Error('Could not save the shared submission log')
}

function alreadyImported(
  kind: FormKind,
  record: SubmissionRecord,
  existing: Array<Record<string, unknown>>,
) {
  return existing.some((doc) => {
    if (kind === 'donations') {
      return doc.mobile === record.data.mobile && doc.name === record.data.name
    }
    if (kind === 'blood-requests') {
      return doc.mobile === record.data.mobile && doc.patientName === record.data.patientName
    }
    return doc.mobile === record.data.mobile && doc.message === record.data.message
  })
}

export async function importSubmissions(payload: Payload) {
  const records = await listSubmissions()
  if (records.length === 0) return

  const kinds: FormKind[] = ['donations', 'blood-requests', 'contact-messages']
  for (const kind of kinds) {
    const items = records.filter((item) => item.kind === kind)
    if (items.length === 0) continue

    const existing = await payload.find({
      collection: kind,
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })

    for (const item of items) {
      if (alreadyImported(kind, item, existing.docs as Array<Record<string, unknown>>)) continue
      try {
        await payload.create({
          collection: kind,
          overrideAccess: true,
          data: item.data,
        })
      } catch (error) {
        payload.logger.error({ err: error, msg: `Submission import skipped for ${kind}` })
      }
    }
  }
}

export function hasSharedLog() {
  return Boolean((kvUrl() && kvToken()) || (token() && repo()))
}

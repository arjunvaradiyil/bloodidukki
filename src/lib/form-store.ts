import { appendFile, mkdir } from 'fs/promises'
import os from 'os'
import path from 'path'
import { describeError, getWritablePayload } from '@/lib/payload-client'
import { sqliteFilePath } from '@/lib/sqlite-path'

type FormKind = 'donations' | 'blood-requests' | 'contact-messages'

function storeDir() {
  return process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), '.data')
}

function jsonlPath() {
  return path.join(storeDir(), 'submissions.jsonl')
}

async function persistJsonl(kind: FormKind, data: Record<string, unknown>) {
  await mkdir(storeDir(), { recursive: true })
  const record = { kind, at: new Date().toISOString(), data }
  await appendFile(jsonlPath(), `${JSON.stringify(record)}\n`, 'utf8')
}

function text(value: unknown) {
  return value == null ? null : String(value)
}

function requiredText(value: unknown) {
  return String(value ?? '')
}

function requiredNumber(value: unknown) {
  return Number(value)
}

async function persistPayloadSqlite(kind: FormKind, data: Record<string, unknown>) {
  const { DatabaseSync } = (await import('node:sqlite')) as {
    DatabaseSync: new (path: string) => {
      prepare(sql: string): { run: (...args: unknown[]) => void }
      close(): void
    }
  }

  const now = new Date().toISOString()
  const db = new DatabaseSync(sqliteFilePath())

  try {
    if (kind === 'donations') {
      db.prepare(
        `INSERT INTO donations (
          name, district, block, mekhala, age, gender, blood_group, mobile, email,
          address, donated_before, last_donation_date, preferred_date, updated_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        requiredText(data.name),
        requiredText(data.district || 'Idukki'),
        requiredText(data.block),
        requiredText(data.mekhala),
        requiredNumber(data.age),
        requiredText(data.gender),
        requiredText(data.bloodGroup),
        requiredText(data.mobile),
        text(data.email),
        requiredText(data.address),
        requiredText(data.donatedBefore),
        text(data.lastDonationDate),
        requiredText(data.preferredDate),
        now,
        now,
      )
      return
    }

    if (kind === 'blood-requests') {
      db.prepare(
        `INSERT INTO blood_requests (
          patient_name, blood_group, units, hospital, block, needed_by,
          requester_name, mobile, notes, updated_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        requiredText(data.patientName),
        requiredText(data.bloodGroup),
        requiredNumber(data.units),
        requiredText(data.hospital),
        requiredText(data.block),
        requiredText(data.neededBy),
        requiredText(data.requesterName),
        requiredText(data.mobile),
        text(data.notes),
        now,
        now,
      )
      return
    }

    db.prepare(
      `INSERT INTO contact_messages (
        name, mobile, email, message, updated_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(
      requiredText(data.name),
      requiredText(data.mobile),
      text(data.email),
      requiredText(data.message),
      now,
      now,
    )
  } finally {
    db.close()
  }
}

export async function persistForm(kind: FormKind, data: Record<string, unknown>) {
  try {
    await persistJsonl(kind, data)
  } catch (error) {
    console.error('JSONL form persist failed', describeError(error))
  }

  try {
    const payload = await getWritablePayload()
    if (payload) {
      await payload.create({
        collection: kind,
        data,
        overrideAccess: true,
      })
      return
    }
  } catch (error) {
    console.error('Payload form persist failed', describeError(error))
  }

  await persistPayloadSqlite(kind, data)
}

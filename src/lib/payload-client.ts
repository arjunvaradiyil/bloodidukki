import { cache } from 'react'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'

const INIT_TIMEOUT_MS = 5000
const WRITE_INIT_TIMEOUT_MS = 8000

let inflight: Promise<Payload | null> | null = null

export function describeError(error: unknown) {
  const err = error as { name?: string; code?: string | number; message?: string } | null
  return {
    name: err?.name ?? typeof error,
    code: err?.code,
    message: String(err?.message ?? error)
      .replace(/mongodb(\+srv)?:\/\/\S+/gi, 'mongodb://[redacted]')
      .slice(0, 300),
  }
}

function startPayload() {
  if (!inflight) {
    inflight = (async () => {
      const payloadConfig = await config
      return getPayload({ config: payloadConfig })
    })().catch((error) => {
      console.error('Payload init failed', describeError(error))
      inflight = null
      return null
    })
  }
  return inflight
}

export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise.catch(() => fallback),
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback), ms)
    }),
  ])
}

export function withDeadline<T>(promise: Promise<T>, ms: number, label = 'Timed out'): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(label)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

export const getPayloadClient = cache(async (): Promise<Payload | null> => {
  try {
    return await withTimeout(startPayload(), INIT_TIMEOUT_MS, null)
  } catch (error) {
    console.error('Payload client failed', describeError(error))
    return null
  }
})

export async function getWritablePayload(): Promise<Payload | null> {
  try {
    const payload = await withDeadline(startPayload(), WRITE_INIT_TIMEOUT_MS, 'Payload init timed out')
    if (!payload) inflight = null
    return payload
  } catch (error) {
    inflight = null
    console.error('Payload write client failed', describeError(error))
    return null
  }
}

import { cache } from 'react'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'

const INIT_TIMEOUT_MS = 5000

let inflight: Promise<Payload | null> | null = null

function startPayload() {
  if (!inflight) {
    inflight = (async () => {
      const payloadConfig = await config
      return getPayload({ config: payloadConfig })
    })().catch((error) => {
      console.error('Payload init failed', error)
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

export const getPayloadClient = cache(async (): Promise<Payload | null> => {
  if (!process.env.PAYLOAD_SECRET) return null

  try {
    return await withTimeout(startPayload(), INIT_TIMEOUT_MS, null)
  } catch (error) {
    console.error('Payload client failed', error)
    return null
  }
})

import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getPayloadClient() {
  if (!process.env.PAYLOAD_SECRET) return null

  try {
    const payloadConfig = await config
    return await getPayload({ config: payloadConfig })
  } catch {
    return null
  }
}

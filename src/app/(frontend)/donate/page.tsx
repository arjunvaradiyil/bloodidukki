import type { Metadata } from 'next'
import { HomeDonate } from '@/components/HomeDonate'
import { getHomeView } from '@/lib/home-view'

export const metadata: Metadata = {
  title: 'Register to Donate — DYFI Idukki',
  description: 'Register as a blood donor in Idukki. Choose your block, mekhala, and preferred date.',
}

export default async function DonatePage() {
  const view = await getHomeView()
  return <HomeDonate formOpen header={view.header} hero={view.hero} />
}

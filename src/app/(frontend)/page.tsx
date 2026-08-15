import { HomeDonate } from '@/components/HomeDonate'
import { getHomeView } from '@/lib/home-view'

export default async function HomePage() {
  const view = await getHomeView()
  return <HomeDonate header={view.header} hero={view.hero} />
}

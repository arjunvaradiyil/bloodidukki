import { HomeDonate } from '@/components/HomeDonate'
import { getHomeView } from '@/lib/home-view'
import { getHospitals } from '@/lib/hospital-view'

export default async function HomePage() {
  const [view, hospitals] = await Promise.all([getHomeView(), getHospitals()])
  return <HomeDonate header={view.header} hero={view.hero} hospitals={hospitals} />
}

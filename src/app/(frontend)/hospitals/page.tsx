import type { Metadata } from 'next'
import { HospitalDirectory } from '@/components/HospitalDirectory'
import { PageShell } from '@/components/PageShell'
import { getHospitals } from '@/lib/hospital-view'

export const metadata: Metadata = {
  title: 'Find Hospitals — DYFI Idukki',
  description: 'Find hospitals and blood banks across Idukki blocks for donation and emergency support.',
}

export default async function HospitalsPage() {
  const hospitals = await getHospitals()

  return (
    <PageShell
      tone="hero"
      eyebrow="Find hospitals"
      title="Centres across"
      titleAccent="Idukki."
      description="Look up hospitals and blood banks by block. For an urgent need, submit a blood request and our volunteers will try to help."
    >
      <HospitalDirectory hospitals={hospitals} />
    </PageShell>
  )
}

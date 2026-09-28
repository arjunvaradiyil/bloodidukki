import type { Metadata } from 'next'
import { HospitalDirectory } from '@/components/HospitalDirectory'
import { SiteHeader } from '@/components/SiteHeader'
import { defaultHeader } from '@/lib/defaults'
import { getHospitals } from '@/lib/hospital-view'

export const metadata: Metadata = {
  title: 'Find Hospitals — DYFI Idukki',
  description: 'Find hospitals and blood banks across Idukki for donation and emergency support.',
}

export default async function HospitalsPage() {
  const hospitals = await getHospitals()

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_58%,rgba(225,29,46,0.18),transparent_42%)]"
        aria-hidden="true"
      />
      <SiteHeader {...defaultHeader} />

      <div className="relative mx-auto grid w-[min(1180px,calc(100%-2.5rem))] items-start gap-8 pt-[calc(5.75rem+1.25rem)] pb-16 max-sm:w-[min(calc(100%-1.5rem),1180px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:gap-6">
        <div className="min-w-0">
          <p className="m-0 text-[0.78rem] font-bold tracking-[0.18em] text-blood uppercase">
            Find hospitals
          </p>
          <h1 className="mt-2 max-w-[20ch] font-display text-[clamp(2.15rem,5vw,3.5rem)] font-extrabold tracking-tight leading-[1.08]">
            Find a Hospital <span className="text-blood">Near You</span>
          </h1>
          <p className="mt-3 max-w-[34rem] text-[1.02rem] leading-[1.65] text-white/70">
            Search hospitals and blood banks across Idukki. Call, open the map, or request blood when you need
            support.
          </p>

          <img
            src="/images/hospitals-bg.png"
            alt=""
            className="mx-auto mt-4 h-auto w-full max-w-[22rem] object-contain lg:hidden"
          />

          <HospitalDirectory hospitals={hospitals} />
        </div>

        <aside className="sticky top-28 hidden h-[min(40rem,calc(100dvh-8rem))] lg:block">
          <img
            src="/images/hospitals-bg.png"
            alt="Hospital location illustration"
            className="h-full w-full object-contain object-center drop-shadow-[0_24px_80px_rgba(225,29,46,0.18)]"
          />
        </aside>
      </div>

      <footer className="relative bg-blood-wave px-[max(1.25rem,calc((100%-min(1180px,calc(100%-2.5rem)))/2))] py-4">
        <p className="m-0 font-display text-[0.72rem] font-semibold tracking-[0.12em] text-white uppercase">
          Developed by DYFI Idukki © 2026
        </p>
      </footer>
    </div>
  )
}

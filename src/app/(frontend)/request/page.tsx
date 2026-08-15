import type { Metadata } from 'next'
import { DropIcon, PinIcon } from '@/components/Icons'
import { PageShell } from '@/components/PageShell'
import { RequestForm } from '@/components/RequestForm'
import { cn } from '@/lib/cn'
import { btnBase, btnGhost } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Request Blood — DYFI Idukki',
  description: 'Request blood support in Idukki. Tell us the patient details, hospital, and blood group needed.',
}

const STEPS = [
  {
    title: 'Patient details',
    body: 'Name, blood group, and how many units are needed.',
  },
  {
    title: 'Hospital & block',
    body: 'Where the patient is admitted, so volunteers can coordinate nearby.',
  },
  {
    title: 'Your contact',
    body: 'We use this only to reach you about donor support.',
  },
]

export default function RequestPage() {
  return (
    <PageShell
      tone="hero"
      eyebrow="Request for blood"
      title="Need blood."
      titleAccent="Ask for help."
      description="Share the patient, hospital, and blood group. This is volunteer support — also inform the hospital blood bank for emergencies."
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,22.5rem)_minmax(0,1fr)] lg:gap-12">
        <aside className="flex flex-col gap-5">
          <div className="rounded-[1.25rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-6 backdrop-blur-[18px]">
            <p className="m-0 text-[0.78rem] font-bold tracking-[0.16em] text-blood uppercase">Before you send</p>
            <p className="mt-3 leading-[1.6] text-white/80">
              For emergencies, call the hospital blood bank first. Then send this request so DYFI Idukki volunteers can
              try to find donors.
            </p>
            <a href="/hospitals" className={cn(btnBase, btnGhost, 'mt-5 min-h-11 px-4 text-sm')}>
              <PinIcon className="size-4" />
              Find hospitals
            </a>
          </div>
          <ol className="m-0 grid list-none gap-3 p-0">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-3 rounded-[1.15rem] border border-white/10 bg-white/4 px-4 py-3.5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blood font-display text-sm font-bold">
                  {index + 1}
                </span>
                <span>
                  <span className="block font-display text-[0.98rem] font-semibold">{step.title}</span>
                  <span className="mt-1 block text-sm leading-[1.45] text-white/65">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="m-0 flex items-center gap-2 text-sm text-white/50">
            <DropIcon className="size-4 text-blood" />
            Safe, voluntary donor support across Idukki
          </p>
        </aside>
        <RequestForm />
      </div>
    </PageShell>
  )
}

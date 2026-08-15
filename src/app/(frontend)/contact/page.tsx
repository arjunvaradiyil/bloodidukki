import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { PageShell } from '@/components/PageShell'
import { defaultHome } from '@/lib/defaults'

export const metadata: Metadata = {
  title: 'Contact Us — DYFI Idukki',
  description: 'Contact DYFI Idukki for blood donation camps, donor support, and volunteer enquiries.',
}

export default function ContactPage() {
  const { email, phone, body } = defaultHome.contact

  return (
    <PageShell
      tone="hero"
      eyebrow="Contact us"
      title="Reach"
      titleAccent="DYFI Idukki."
      description={body}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,22.5rem)_minmax(0,1fr)] lg:gap-12">
        <aside className="rounded-[1.25rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-6 backdrop-blur-[18px]">
          <p className="m-0 text-[0.78rem] font-bold tracking-[0.16em] text-blood uppercase">Reach us</p>
          <p className="mt-4 font-display text-xl font-bold">DYFI Idukki</p>
          <p className="mt-4 text-white/75">
            Phone{' '}
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-white hover:text-blood">
              {phone}
            </a>
          </p>
          <p className="mt-2 text-white/75">
            Email{' '}
            <a href={`mailto:${email}`} className="text-white hover:text-blood">
              {email}
            </a>
          </p>
        </aside>
        <ContactForm />
      </div>
    </PageShell>
  )
}

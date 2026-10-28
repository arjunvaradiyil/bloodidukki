import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type PageSectionProps = {
  id: string
  eyebrow: string
  title: string
  titleAccent?: string
  description?: string
  children: ReactNode
}

export function PageSection({ id, eyebrow, title, titleAccent, description, children }: PageSectionProps) {
  return (
    <section id={id} className="scroll-mt-28 relative bg-ink">
      <div className="mx-auto w-[min(1180px,calc(100%-2.5rem))] py-16 max-sm:w-[min(calc(100%-1.5rem),1180px)] sm:py-20">
        <p className="m-0 mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-white/55 uppercase">{eyebrow}</p>
        <h2 className="m-0 max-w-[42rem] font-display text-[clamp(2rem,5vw,3.4rem)] font-extrabold tracking-tight leading-[1.08]">
          <span className="text-white">{title}</span>
          {titleAccent ? (
            <>
              {' '}
              <span className="text-blood">{titleAccent}</span>
            </>
          ) : null}
        </h2>
        {description ? (
          <p className="mt-4 max-w-[40rem] text-[1.05rem] leading-[1.65] text-white/75">{description}</p>
        ) : null}
        <div className={cn(description ? 'mt-10' : 'mt-8')}>{children}</div>
      </div>
    </section>
  )
}

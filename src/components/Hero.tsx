'use client'

import type { ReactNode } from 'react'
import { DropIcon, PinIcon, StatIcon } from '@/components/Icons'
import { SiteFooter } from '@/components/SiteFooter'
import { cn } from '@/lib/cn'
import { HERO_BACKGROUND, type StatIcon as StatIconType } from '@/lib/defaults'
import { btnBase, btnDefault, btnGhost, btnPrimary } from '@/lib/ui'

type Cta = {
  label: string
  href: string
}

type Stat = {
  icon: StatIconType
  value: string
  label: string
  id?: string | null
}

type HeroProps = {
  headlinePrimary: string
  headlineAccent: string
  subheadline: string
  description: string
  backgroundImageUrl?: string | null
  backgroundVideoUrl?: string | null
  primaryCta: Cta
  secondaryCta: Cta
  stats: Stat[]
  form?: ReactNode
  onDonate?: () => void
  onRequest?: () => void
}

function Stats({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex flex-wrap items-start gap-x-12 gap-y-6" id="impact">
      {stats.map((stat, index) => (
        <div
          className="flex min-w-[10.5rem] animate-rise items-start gap-3 motion-reduce:animate-none"
          style={{ animationDelay: index === 1 ? '120ms' : index === 2 ? '220ms' : undefined }}
          key={`${stat.value}-${stat.label}`}
        >
          <StatIcon icon={stat.icon} className="mt-[0.15rem] size-[1.7rem] shrink-0 text-blood" />
          <div>
            <p className="m-0 font-display text-[clamp(1.35rem,2.2vh,1.7rem)] font-bold leading-tight">
              {stat.value}
            </p>
            <p className="mt-[0.3rem] max-w-[9.5rem] text-[0.88rem] leading-[1.4] text-white/80">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Hero({
  headlinePrimary,
  headlineAccent,
  subheadline,
  description,
  backgroundImageUrl,
  backgroundVideoUrl,
  primaryCta,
  secondaryCta,
  stats,
  form,
  onDonate,
  onRequest,
}: HeroProps) {
  const imageSrc =
    backgroundImageUrl && (backgroundImageUrl.startsWith('/') || backgroundImageUrl.startsWith('http'))
      ? backgroundImageUrl
      : HERO_BACKGROUND

  const copy = (
    <>
      <h1
        className={cn(
          'm-0 font-display font-extrabold tracking-tight leading-[1.06] [text-shadow:0_2px_18px_rgba(0,0,0,0.72)]',
          form
            ? 'text-[clamp(2rem,5.2vh,3.6rem)] max-lg:text-[clamp(1.6rem,7vw,2.4rem)]'
            : 'text-[clamp(2.6rem,7.2vh,5.5rem)] max-sm:text-[clamp(2.35rem,9vw,3.4rem)] max-[760px]:text-[clamp(2.1rem,6.8vh,3.2rem)]',
        )}
      >
        <span className="block text-white">{headlinePrimary}</span>
        <span className="block text-blood">{headlineAccent}</span>
      </h1>
      <p
        className={cn(
          'm-0 max-w-[36rem] font-display text-[clamp(1.15rem,2.4vh,1.7rem)] font-semibold leading-[1.35]',
          form && 'max-lg:hidden',
        )}
      >
        {subheadline}
      </p>
      <p
        className={cn(
          'm-0 max-w-[36rem] text-[clamp(0.98rem,1.8vh,1.12rem)] leading-[1.65] text-white/80',
          form && 'max-lg:hidden',
        )}
      >
        {description}
      </p>
    </>
  )

  return (
    <section
      className={cn(
        'relative isolate flex h-full min-h-0 flex-col overflow-hidden bg-blood-wave',
        form && 'max-lg:min-h-0 max-lg:overflow-y-auto',
      )}
      id="home"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {backgroundVideoUrl ? (
          <video
            className="h-full w-full animate-hero-ken object-cover object-[72%_center] motion-reduce:animate-none"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_BACKGROUND}
          >
            <source src={backgroundVideoUrl} />
          </video>
        ) : (
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 h-full w-full animate-hero-ken object-cover object-[72%_center] motion-reduce:animate-none"
            onError={(event) => {
              event.currentTarget.src = HERO_BACKGROUND
            }}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,4,6,0.9)_0%,rgba(8,4,6,0.78)_32%,rgba(8,4,6,0.42)_58%,rgba(8,4,6,0.16)_100%),linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.52)_100%)]" />
      </div>

      {form ? (
        <div className="relative z-[2] mx-auto flex min-h-0 w-[min(1180px,calc(100%-2.5rem))] flex-1 items-center justify-center gap-[clamp(2rem,5vw,4.5rem)] pt-[6.25rem] pb-6 max-lg:h-auto max-lg:flex-col max-lg:items-stretch max-lg:gap-5 max-lg:pb-8">
          <div className="m-0 flex w-auto max-w-[36rem] flex-1 basis-[28rem] animate-rise flex-col justify-center gap-[clamp(0.85rem,2vh,1.5rem)] p-0 motion-reduce:animate-none max-lg:max-w-none">
            {copy}
            <Stats stats={stats} />
            <ul
              className="mt-[0.35rem] grid list-none gap-[0.55rem] p-0 max-lg:hidden"
              aria-label="Why register"
            >
              {[
                'Takes about 2 minutes to register',
                'We match you with camps near your block',
                'Safe, voluntary donation across Idukki',
              ].map((item) => (
                <li
                  key={item}
                  className="relative pl-[1.35rem] text-[0.95rem] leading-[1.45] text-white/80 before:absolute before:top-[0.45rem] before:left-0 before:size-[0.55rem] before:rounded-full before:bg-blood before:shadow-[0_0_0_3px_rgba(225,29,46,0.22)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative z-[3] w-full min-w-0 max-h-[calc(100dvh-5.25rem-5.5rem)] flex-[0_1_26.5rem] overflow-y-auto rounded-[1.15rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-[1.45rem_1.4rem_1.3rem] shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[18px] sm:w-[min(26.5rem,100%)]">
            {form}
          </div>
        </div>
      ) : (
        <div className="relative z-[2] mx-auto flex min-h-0 w-[min(1180px,calc(100%-2.5rem))] flex-1 animate-rise flex-col items-start justify-center gap-[clamp(1.15rem,2.6vh,2rem)] pt-[6.25rem] pr-4 pb-12 pl-[clamp(1.25rem,7vw,6.5rem)] motion-reduce:animate-none max-sm:w-[min(calc(100%-1.5rem),1240px)] max-sm:pt-[5.75rem] max-sm:pl-0">
          {copy}
          <div className="flex flex-wrap gap-4 max-sm:flex-col max-sm:items-stretch">
            {onDonate ? (
              <button
                type="button"
                className={cn(
                  btnBase,
                  btnPrimary,
                  btnDefault,
                  'min-h-[3.25rem] shrink-0 whitespace-nowrap px-[1.55rem] text-base max-sm:w-full',
                )}
                onClick={onDonate}
              >
                <DropIcon className="size-[1.1rem] shrink-0" />
                <span className="whitespace-nowrap">{primaryCta.label}</span>
              </button>
            ) : (
              <a
                href={primaryCta.href || '#donate'}
                className={cn(
                  btnBase,
                  btnPrimary,
                  btnDefault,
                  'min-h-[3.25rem] shrink-0 whitespace-nowrap px-[1.55rem] text-base max-sm:w-full',
                )}
              >
                <DropIcon className="size-[1.1rem] shrink-0" />
                <span className="whitespace-nowrap">{primaryCta.label}</span>
              </a>
            )}
            {secondaryCta.label && secondaryCta.href ? (
              onRequest ? (
                <button
                  type="button"
                  className={cn(
                    btnBase,
                    btnGhost,
                    btnDefault,
                    'min-h-[3.25rem] shrink-0 whitespace-nowrap px-[1.55rem] text-base max-sm:w-full',
                  )}
                  onClick={onRequest}
                >
                  <PinIcon className="size-[1.1rem] shrink-0" />
                  <span className="whitespace-nowrap">{secondaryCta.label}</span>
                </button>
              ) : (
                <a
                  href={secondaryCta.href}
                  className={cn(
                    btnBase,
                    btnGhost,
                    btnDefault,
                    'min-h-[3.25rem] shrink-0 whitespace-nowrap px-[1.55rem] text-base max-sm:w-full',
                  )}
                >
                  <PinIcon className="size-[1.1rem] shrink-0" />
                  <span className="whitespace-nowrap">{secondaryCta.label}</span>
                </a>
              )
            ) : null}
          </div>
          <Stats stats={stats} />
        </div>
      )}

      <SiteFooter pulse />
    </section>
  )
}

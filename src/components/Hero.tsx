'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { DropIcon, PinIcon, StatIcon } from '@/components/Icons'
import { cn } from '@/lib/cn'
import type { StatIcon as StatIconType } from '@/lib/defaults'
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
}

function Stats({ stats }: { stats: Stat[] }) {
  return (
    <div className="mt-[0.35rem] flex flex-wrap items-start gap-x-10 gap-y-6" id="impact">
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
}: HeroProps) {
  const imageSrc =
    backgroundImageUrl && (backgroundImageUrl.startsWith('/') || backgroundImageUrl.startsWith('http'))
      ? backgroundImageUrl
      : '/images/hero-bg.jpg'

  const copy = (
    <>
      <h1
        className={cn(
          'm-0 font-display font-extrabold tracking-tight leading-[1.06]',
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
        'relative isolate grid min-h-screen min-h-dvh grid-rows-[minmax(0,1fr)_auto] overflow-hidden pt-[calc(5.5rem+0.75rem)]',
        form && 'max-lg:min-h-0 max-lg:overflow-visible',
      )}
      id="home"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {backgroundVideoUrl ? (
          <video
            className="h-full w-full animate-hero-ken object-cover motion-reduce:animate-none"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-bg.jpg"
          >
            <source src={backgroundVideoUrl} />
          </video>
        ) : (
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 h-full w-full animate-hero-ken object-cover motion-reduce:animate-none"
            onError={(event) => {
              event.currentTarget.src = '/images/hero-bg.jpg'
            }}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,4,6,0.72)_0%,rgba(8,4,6,0.38)_45%,rgba(8,4,6,0.22)_100%),linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.12)_40%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      {form ? (
        <div className="relative z-[2] mx-auto flex h-full min-h-0 w-[min(1180px,calc(100%-2.5rem))] items-center justify-center gap-[clamp(2rem,5vw,4.5rem)] justify-self-center py-[clamp(0.5rem,2vh,1.5rem)] pb-3 max-lg:h-auto max-lg:flex-col max-lg:items-stretch max-lg:gap-5 max-lg:pb-8">
          <div className="m-0 flex w-auto max-w-[36rem] flex-1 basis-[28rem] animate-rise flex-col justify-center gap-[clamp(1rem,2.4vh,1.75rem)] p-0 motion-reduce:animate-none max-lg:max-w-none">
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
          <div className="relative z-[3] w-full min-w-0 max-h-[calc(100dvh-5.25rem-5.5rem)] flex-[0_1_26.5rem] overflow-visible rounded-[1.15rem] border border-white/12 bg-[rgba(10,5,7,0.72)] p-[1.45rem_1.4rem_1.3rem] shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[18px] max-lg:max-h-none sm:w-[min(26.5rem,100%)]">
            {form}
          </div>
        </div>
      ) : (
        <div className="relative z-[2] mx-auto flex min-h-0 w-[min(52rem,calc(100%-2.5rem))] max-w-[52rem] animate-rise flex-col items-start justify-center justify-self-center gap-[clamp(1rem,2.4vh,1.75rem)] py-[clamp(0.75rem,2.2vh,1.75rem)] pb-[clamp(1.25rem,3vh,2.25rem)] motion-reduce:animate-none max-sm:w-[min(calc(100%-1.5rem),1240px)]">
          {copy}
          <div className="mt-[0.15rem] flex flex-wrap gap-[0.9rem] max-sm:flex-col max-sm:items-stretch">
            {onDonate ? (
              <button
                type="button"
                className={cn(
                  btnBase,
                  btnPrimary,
                  btnDefault,
                  'min-h-[3.25rem] px-[1.55rem] text-base max-sm:w-full',
                )}
                onClick={onDonate}
              >
                <DropIcon className="size-[1.1rem] shrink-0" />
                <span>{primaryCta.label}</span>
              </button>
            ) : (
              <Link
                href="/donate"
                className={cn(
                  btnBase,
                  btnPrimary,
                  btnDefault,
                  'min-h-[3.25rem] px-[1.55rem] text-base max-sm:w-full',
                )}
              >
                <DropIcon className="size-[1.1rem] shrink-0" />
                <span>{primaryCta.label}</span>
              </Link>
            )}
            <a
              href={secondaryCta.href || '/contact'}
              className={cn(
                btnBase,
                btnGhost,
                btnDefault,
                'min-h-[3.25rem] px-[1.55rem] text-base max-sm:w-full',
              )}
            >
              <PinIcon className="size-[1.1rem] shrink-0" />
              <span>{secondaryCta.label}</span>
            </a>
          </div>
          <Stats stats={stats} />
        </div>
      )}

      <div className="relative z-[2] h-[clamp(4.5rem,11vh,7.5rem)] shrink-0 max-sm:h-[clamp(3.75rem,10vh,5.5rem)]">
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-visible"
          aria-hidden="true"
        >
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="h-full w-full">
            <path
              className="fill-blood-wave"
              d="M0,120 C180,200 320,40 520,90 C720,140 860,210 1040,160 C1220,110 1340,40 1440,70 L1440,220 L0,220 Z"
            />
          </svg>
          <svg
            className="absolute top-[48%] right-[clamp(1.5rem,5.5vw,4.75rem)] h-auto w-[clamp(9.25rem,14vw,12.5rem)] -translate-y-[40%] overflow-visible"
            viewBox="0 0 220 72"
            fill="none"
          >
            <path
              className="[stroke-dasharray:210] [stroke-dashoffset:210] animate-ekg motion-reduce:animate-none"
              d="M6 36 H52 L66 10 L80 62 L94 20 L106 36 H150"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="origin-[172px_36px] animate-heartbeat motion-reduce:animate-none"
              d="M172 36c-6-8-18-6-18 5 0 11 18 22 18 22s18-11 18-22c0-11-12-13-18-5z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

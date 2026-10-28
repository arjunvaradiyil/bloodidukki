import type { Metadata } from 'next'
import { Sora, Manrope, Noto_Sans_Malayalam } from 'next/font/google'
import React from 'react'
import { SITE_NAME } from '@/lib/defaults'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const malayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam'],
  weight: ['400', '600', '700'],
  variable: '--font-ml',
  display: 'swap',
})

export const metadata: Metadata = {
  title: SITE_NAME.full,
  description: `${SITE_NAME.plain} connects donors with patients who need blood. Donate, find a hospital, or request support.`,
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${malayalam.variable}`}>
      <body className="min-h-full overflow-x-hidden bg-ink font-body text-white antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}

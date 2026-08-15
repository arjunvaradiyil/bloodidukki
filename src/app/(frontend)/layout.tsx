import type { Metadata } from 'next'
import { Sora, Manrope } from 'next/font/google'
import React from 'react'
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

export const metadata: Metadata = {
  title: 'Donate Blood — One Donation. Countless Lives.',
  description:
    'Your blood can be someone’s second chance. Donate blood, find a camp, and help save lives in your community.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body className="min-h-full overflow-x-hidden bg-ink font-body text-white antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}

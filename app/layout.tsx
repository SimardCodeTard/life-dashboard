import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from "next/font/google"
import './globals.scss'

export const metadata: Metadata = {
  title: 'Life Dashboard',
  description: 'apanyan',
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SpeedInsights/>
        {children}
      </body>
    </html>
  )
}

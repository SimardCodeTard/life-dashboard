import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css'
import NavBar from './components/dashboard-widgets/navbar.component'

export const metadata: Metadata = {
  title: 'Life Dashboard',
  description: 'apanyan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SpeedInsights/>
        <NavBar></NavBar>
        {children}
      </body>
    </html>
  )
}

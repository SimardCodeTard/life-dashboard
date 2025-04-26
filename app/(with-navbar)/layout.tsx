import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from "next/font/google"
import '../globals.scss'
import NavBar from '../components/dashboard-widgets/navbar/navbar.component'

export const metadata: Metadata = {
  title: 'Life Dashboard',
  description: 'apanyan',
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayoutWithNavbar({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SpeedInsights/>
        <NavBar></NavBar>
        {children}
      </body>
    </html>
  )
}

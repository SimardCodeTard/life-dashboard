import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from './components/client/navbar/navbar.component'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <NavBar></NavBar>
        {children}
      </body>
    </html>
  )
}

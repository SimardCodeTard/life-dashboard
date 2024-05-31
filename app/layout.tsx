import type { Metadata } from 'next'
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
        <NavBar></NavBar>
        {children}
      </body>
    </html>
  )
}

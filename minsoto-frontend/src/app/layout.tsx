import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// NOTE: Make sure you import your AuthProvider here as well
// import { AuthProvider } from '../context/AuthContext'; 

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Minsoto',
  description: 'A new social network designed for focus and growth.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <AuthProvider> */}
          {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  )
}
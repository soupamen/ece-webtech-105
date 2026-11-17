import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { metadataBase } from '@/lib/metadata'

export const metadata = {
  metadataBase,
  title: {
    default: 'OpenFinder | Open-source alternatives',
    template: '%s | OpenFinder',
  },
  description: 'Find open-source alternatives to proprietary software.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

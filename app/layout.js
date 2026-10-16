import './globals.css'
import Header from '../components/layout/Header'

export const metadata = {
  title: 'WebTech 105',
  description: 'ECE WebTech project — team 105',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  )
}

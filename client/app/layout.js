import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const sans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata = {
  title: { default: 'WebTech 105', template: '%s · WebTech 105' },
  description: 'ECE WebTech project — team 105',
}

// Runs before paint: saved choice, else system preference. Avoids a light flash in dark mode.
const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches)}catch(e){}`

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the script above changes <html> class before React hydrates.
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

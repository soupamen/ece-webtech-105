import Link from 'next/link'
import NavLinks from './NavLinks'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="rounded-sm font-bold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          OpenFinder
        </Link>
        <NavLinks>
          <ThemeToggle />
        </NavLinks>
      </div>
    </header>
  )
}

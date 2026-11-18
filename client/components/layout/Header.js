import Link from 'next/link'
import NavLinks from './NavLinks'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-bold">
          WebTech 105
        </Link>
        <NavLinks>
          <ThemeToggle />
        </NavLinks>
      </div>
    </header>
  )
}

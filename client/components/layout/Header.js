import Link from 'next/link'
import NavLinks from './NavLinks'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:flex sm:h-14 sm:items-center sm:justify-between sm:py-0">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-bold" aria-label="OpenFinder home">
            OpenFinder
          </Link>
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4 sm:mt-0">
          <NavLinks />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

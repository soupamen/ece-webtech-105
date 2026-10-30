import Link from 'next/link'
import NavLinks from './NavLinks'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-bold">
          WebTech 105
        </Link>
        <div className="flex items-center gap-4">
          <SearchBar />
          <NavLinks />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

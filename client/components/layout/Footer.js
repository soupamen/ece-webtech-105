import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-gray-500 dark:text-gray-400 sm:flex-row">
        <p>© {new Date().getFullYear()} OpenFinder</p>
        <Link
          href="/about"
          className="hover:text-gray-900 dark:hover:text-gray-100"
        >
          About
        </Link>
      </div>
    </footer>
  )
}

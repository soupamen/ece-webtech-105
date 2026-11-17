'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/category', label: 'Categories' },
  { href: '/list', label: 'My lists' },
  { href: '/profile', label: 'Profile' },
]

export default function NavLinks() {
  const pathname = usePathname()

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  return (
    <nav aria-label="Main navigation" className="min-w-0">
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm sm:gap-x-6 sm:text-base">
        {links.map(({ href, label }) => {
          const active = isActive(href)
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={
                  active
                    ? 'font-semibold underline underline-offset-4'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

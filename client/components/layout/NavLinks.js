'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import SearchBar from './SearchBar'

const links = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/category', label: 'Category' },
  { href: '/list', label: 'List' },
  { href: '/profile', label: 'Profile' },
]

export default function NavLinks() {
  const pathname = usePathname()

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  return (
    <nav aria-label="Main">
      <ul className="flex gap-3 text-sm sm:gap-6 sm:text-base">
        {links.map(({ href, label }, index) => {
          const active = isActive(href)
          return (
            <Fragment key={href}>
              <li>
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
              {index === 0 && (
                <li>
                  <SearchBar />
                </li>
              )}
            </Fragment>
          )
        })}
      </ul>
    </nav>
  )
}

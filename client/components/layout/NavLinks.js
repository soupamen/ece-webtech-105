'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// Home is reached through the logo; search lives on Home and Explore.
const links = [
  { href: '/explore', label: 'Explore' },
  { href: '/category', label: 'Categories' },
  { href: '/list', label: 'My lists' },
  { href: '/suggest', label: 'Suggest a tool' },
  { href: '/profile', label: 'Profile' },
]

const focusRing = 'rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'

const linkClass = (active) =>
  cn(
    focusRing,
    active
      ? 'font-semibold text-foreground underline underline-offset-4'
      : 'text-muted-foreground transition-colors hover:text-foreground'
  )

// children: server-rendered extras (ThemeToggle) placed between the links and the menu button.
export default function NavLinks({ children }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/')

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <nav aria-label="Main" className="flex items-center gap-4">
      <ul className="hidden items-center gap-6 md:flex">
        {links.map(({ href, label }) => {
          const active = isActive(href)
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? 'page' : undefined} className={linkClass(active)}>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>

      {children}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="inline-flex size-10 items-center justify-center rounded-md transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 md:hidden"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5">
          <path
            d={open ? 'M5 5l10 10M15 5L5 15' : 'M3 6h14M3 10h14M3 14h14'}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b bg-background shadow-[0_12px_24px_-16px_oklch(0_0_0/0.3)] md:hidden"
      >
        <div className="mx-auto max-w-5xl px-4 pt-3 pb-4">
          <ul className="flex flex-col">
            {links.map(({ href, label }) => {
              const active = isActive(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={cn('flex h-11 items-center rounded-md', linkClass(active))}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}

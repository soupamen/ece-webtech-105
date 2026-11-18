'use client'

import { useSyncExternalStore } from 'react'

const THEME_CHANGE_EVENT = 'openfinder-theme-change'

function subscribeToTheme(callback) {
  window.addEventListener(THEME_CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains('dark')
}

function getServerThemeSnapshot() {
  return false
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  )

  const toggleTheme = () => {
    const nextDark = !dark
    document.documentElement.classList.toggle('dark', nextDark)
    try {
      window.localStorage.setItem('theme', nextDark ? 'dark' : 'light')
    } catch {}
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'Activate light theme' : 'Activate dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {dark ? (
          <>
            <circle cx="10" cy="10" r="3.5" />
            <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.3 4.3l1.1 1.1M14.6 14.6l1.1 1.1M4.3 15.7l1.1-1.1M14.6 5.4l1.1-1.1" />
          </>
        ) : (
          <path d="M16 12.5A6.5 6.5 0 0 1 7.5 4a6.5 6.5 0 1 0 8.5 8.5Z" />
        )}
      </svg>
    </button>
  )
}

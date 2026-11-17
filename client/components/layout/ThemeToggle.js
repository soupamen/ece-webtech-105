'use client'

import { useEffect, useSyncExternalStore } from 'react'

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

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }, [])

  const toggleTheme = () => {
    const nextDark = !dark
    const root = document.documentElement
    root.classList.toggle('dark', nextDark)
    root.classList.toggle('light', !nextDark)
    window.localStorage.setItem('theme', nextDark ? 'dark' : 'light')
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'Activate light theme' : 'Activate dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className="rounded-full border border-gray-200 px-3 py-1.5 text-sm transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}

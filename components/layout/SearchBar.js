'use client'

import { useEffect, useRef, useState } from 'react'

export default function SearchBar() {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus()
    }
  }, [expanded])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setExpanded(false)
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className={`flex items-center overflow-hidden rounded-full border transition-all duration-300 ${
        expanded
          ? 'w-48 border-gray-400 bg-white sm:w-64 dark:border-gray-500 dark:bg-gray-900'
          : 'w-10 border-transparent'
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded(true)}
        aria-label="Open search"
        aria-expanded={expanded}
        className="flex h-9 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <span aria-hidden="true" className="text-lg">
          🔍
        </span>
      </button>

      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search..."
        aria-label="Search"
        tabIndex={expanded ? 0 : -1}
        className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-gray-400"
      />

      {expanded && query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="mr-2 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
        >
          ×
        </button>
      )}
    </div>
  )
}

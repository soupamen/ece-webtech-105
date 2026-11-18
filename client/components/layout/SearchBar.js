'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function SearchBar() {
  const router = useRouter()
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

  const handleSubmit = (event) => {
    event.preventDefault()
    const q = query.trim()
    if (q) router.push(`/explore?q=${encodeURIComponent(q)}`)
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      // focus-within ring: overflow-hidden would clip the inner button's own outline.
      className={`flex shrink-0 items-center overflow-hidden rounded-full border transition-[width,colors] duration-300 focus-within:ring-[3px] focus-within:ring-ring/50 ${
        expanded
          ? 'w-52 border-ring bg-background sm:w-64'
          : 'w-20 border-border'
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((isExpanded) => !isExpanded)}
        aria-label={expanded ? 'Close search' : 'Open search'}
        aria-expanded={expanded}
        className={`flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full text-sm text-muted-foreground transition outline-none hover:bg-accent hover:text-foreground ${
          expanded ? 'w-9' : 'w-20'
        }`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 shrink-0">
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {!expanded && <span aria-hidden="true">Search</span>}
      </button>

      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search..."
        aria-label="Search"
        tabIndex={expanded ? 0 : -1}
        // border-0/focus:ring-0 undo @tailwindcss/forms; the pill draws the focus ring and our own clear button.
        className="min-w-0 flex-1 border-0 bg-transparent px-1 py-0 text-sm outline-none placeholder:text-muted-foreground focus:ring-0 [&::-webkit-search-cancel-button]:hidden"
      />

      {expanded && query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="mr-1.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition outline-none hover:bg-accent hover:text-foreground"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
            <path d="M4.5 4.5l7 7m0-7l-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </form>
  )
}

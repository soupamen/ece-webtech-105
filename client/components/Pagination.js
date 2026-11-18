import Link from 'next/link'
import { cn } from '@/lib/utils'

export function exploreHref({ q, category, page }) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category) params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const search = params.toString()
  return search ? `/explore?${search}` : '/explore'
}

// First, last, and current ±1; null marks a gap.
function pageWindow(page, totalPages) {
  const pages = []
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) pages.push(n)
    else if (pages.at(-1) !== null) pages.push(null)
  }
  return pages
}

const item =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-md px-3 font-mono text-sm tabular-nums transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'

function Chevron({ flip }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn('size-4', flip && 'rotate-180')}>
      <path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Edge({ href, rel, label, flip }) {
  const content = (
    <>
      {!flip && <Chevron />}
      <span className="hidden sm:inline">{label}</span>
      {flip && <Chevron flip />}
    </>
  )
  if (!href) {
    return (
      <span aria-disabled="true" className={cn(item, 'gap-1 font-sans text-muted-foreground/50')}>
        {content}
      </span>
    )
  }
  return (
    <Link href={href} rel={rel} aria-label={label} className={cn(item, 'gap-1 font-sans hover:bg-accent')}>
      {content}
    </Link>
  )
}

export default function Pagination({ page, totalPages, q, category }) {
  if (totalPages <= 1) return null
  const href = (n) => exploreHref({ q, category, page: n })

  return (
    <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Pagination">
      <Edge href={page > 1 && href(page - 1)} rel="prev" label="Previous" />
      <ul className="flex items-center gap-1">
        {pageWindow(page, totalPages).map((n, i) =>
          n === null ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-sm text-muted-foreground">
              …
            </li>
          ) : (
            <li key={n}>
              <Link
                href={href(n)}
                aria-label={`Page ${n}`}
                aria-current={n === page ? 'page' : undefined}
                className={cn(
                  item,
                  n === page ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {n}
              </Link>
            </li>
          )
        )}
      </ul>
      <Edge href={page < totalPages && href(page + 1)} rel="next" label="Next" flip />
    </nav>
  )
}

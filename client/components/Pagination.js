import Link from 'next/link'

function pageHref(page, q, category) {
  const params = new URLSearchParams({ page: String(page) })
  if (q) params.set('q', q)
  if (category) params.set('category', category)
  return `/explore?${params.toString()}`
}

export default function Pagination({ page, totalPages, q, category }) {
  if (totalPages <= 1) return null

  return (
    <nav className="mt-8 flex justify-center gap-4" aria-label="Pagination">
      {page > 1 ? (
        <Link className="text-sm underline hover:no-underline" href={pageHref(page - 1, q, category)}>
          Previous
        </Link>
      ) : (
        <span className="text-sm text-muted-foreground">Previous</span>
      )}
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link className="text-sm underline hover:no-underline" href={pageHref(page + 1, q, category)}>
          Next
        </Link>
      ) : (
        <span className="text-sm text-muted-foreground">Next</span>
      )}
    </nav>
  )
}

import { cache } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import SearchBar from '@/components/SearchBar'
import ToolCard from '@/components/ToolCard'
import EmptyState from '@/components/EmptyState'
import Pagination, { exploreHref } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { getCategories, getToolsPage } from '@/lib/supabase'

// SSR: results depend on URL filters, rendered on every request
export const dynamic = 'force-dynamic'

// Shared by generateMetadata and Page within one request.
const loadCategories = cache(getCategories)

function parseParams(params) {
  const q = typeof params.q === 'string' ? params.q.trim().slice(0, 100) : ''
  const category =
    typeof params.category === 'string' ? params.category.trim().slice(0, 80) : ''
  const parsedPage = Number.parseInt(params.page, 10)
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
  return { q, category, page }
}

export async function generateMetadata({ searchParams }) {
  const { q, category } = parseParams(await searchParams)
  const categoryName = category
    ? (await loadCategories()).find((item) => item.slug === category)?.name
    : null
  const title = q ? `“${q}” — Explore` : categoryName ? `${categoryName} — Explore` : 'Explore'
  return {
    title,
    description: categoryName
      ? `Open-source alternatives in ${categoryName}.`
      : 'Search every open-source alternative.',
  }
}

function FilterChip({ label, href }) {
  return (
    <Link
      href={href}
      aria-label={`Remove filter ${label}`}
      className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-secondary/60 pr-2 pl-3 text-xs transition-colors outline-none hover:border-foreground/25 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {label}
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 text-muted-foreground">
        <path d="M4.5 4.5l7 7m0-7l-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </Link>
  )
}

function emptyCopy({ q, categoryName, unknownCategory, category }) {
  if (unknownCategory) {
    return { title: 'Unknown category', description: `“${category}” isn't a category. Pick one from the list above.` }
  }
  if (q && categoryName) {
    return { title: `No match for “${q}” in ${categoryName}`, description: 'Try another term, or search all categories.' }
  }
  if (q) {
    return { title: `No match for “${q}”`, description: 'Try a shorter term, or the name of the software it replaces.' }
  }
  if (categoryName) {
    return { title: `No tools in ${categoryName} yet`, description: 'Browse another category in the meantime.' }
  }
  return { title: 'The catalogue is empty', description: 'Tools will appear here once they are added.' }
}

export default async function Page({ searchParams }) {
  const { q, category, page } = parseParams(await searchParams)

  // Errors propagate to error.js (retry UI).
  const [categories, result] = await Promise.all([
    loadCategories(),
    getToolsPage({ q, category, page }),
  ])

  const categoryName = categories.find((item) => item.slug === category)?.name
  const unknownCategory = Boolean(category && !categoryName)
  const hasFilters = Boolean(q || category)
  const empty = emptyCopy({ q, categoryName, unknownCategory, category })

  return (
    <>
      <PageHeader title="Explore" description="Search every open-source alternative." />

      <SearchBar key={`${q}|${category}`} defaultValue={q} category={category} categories={categories} />

      <div className="mt-4 mb-6 flex min-h-8 flex-wrap items-center gap-x-3 gap-y-2">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          <span className="font-mono text-foreground tabular-nums">{result.totalCount}</span>{' '}
          {result.totalCount === 1 ? 'tool' : 'tools'}
          {result.totalPages > 1 && (
            <span className="sr-only">, page {result.page} of {result.totalPages}</span>
          )}
        </p>
        {hasFilters && (
          <>
            <ul className="flex flex-wrap gap-2" aria-label="Active filters">
              {q && (
                <li>
                  <FilterChip label={`“${q}”`} href={exploreHref({ category })} />
                </li>
              )}
              {category && (
                <li>
                  <FilterChip label={categoryName ?? category} href={exploreHref({ q })} />
                </li>
              )}
            </ul>
            <Link
              href="/explore"
              className="rounded-sm text-xs text-muted-foreground underline underline-offset-4 outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              Clear all
            </Link>
          </>
        )}
      </div>

      {result.tools.length ? (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.tools.map((tool) => (
              <li key={tool.slug}>
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>
          <Pagination page={result.page} totalPages={result.totalPages} q={q} category={category} />
        </>
      ) : (
        <EmptyState title={empty.title} description={empty.description}>
          {hasFilters && (
            <Button asChild variant="outline">
              <Link href="/explore">Clear filters</Link>
            </Button>
          )}
        </EmptyState>
      )}
    </>
  )
}

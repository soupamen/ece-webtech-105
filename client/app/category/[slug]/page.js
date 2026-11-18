import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import ToolCard from '@/components/ToolCard'
import EmptyState from '@/components/EmptyState'
import { exploreHref } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { createPageMetadata } from '@/lib/metadata'
import { getCategory, getToolsByCategory } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Shared by generateMetadata and Page within one request.
const loadCategory = cache(getCategory)

export async function generateMetadata({ params }) {
  const { slug } = await params
  const category = await loadCategory(slug)
  return createPageMetadata({
    title: category?.name ?? 'Category not found',
    description:
      category?.description ?? 'Browse open-source alternatives by category.',
    path: `/category/${slug}`,
  })
}

export default async function Page({ params }) {
  const { slug } = await params
  const category = await loadCategory(slug)
  if (!category) notFound()
  const list = await getToolsByCategory(slug)

  return (
    <>
      {/* Same breadcrumb markup as app/tool/[slug]/page.js. */}
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              href="/category"
              className="rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              Categories
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {category.name}
          </li>
        </ol>
      </nav>
      <PageHeader title={category.name} description={category.description}>
        {list.length > 0 && (
          <Button asChild variant="outline" className="self-start sm:self-auto">
            <Link href={exploreHref({ category: slug })}>Search in {category.name}</Link>
          </Button>
        )}
      </PageHeader>
      {list.length ? (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            <span className="font-mono text-foreground tabular-nums">{list.length}</span>{' '}
            {list.length === 1 ? 'tool' : 'tools'}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <li key={t.slug}>
                <ToolCard tool={t} hideCategory />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <EmptyState title={`No tools in ${category.name} yet`} description="Browse another category in the meantime.">
          <Button asChild variant="outline">
            <Link href="/category">All categories</Link>
          </Button>
        </EmptyState>
      )}
    </>
  )
}

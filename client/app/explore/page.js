import PageHeader from '@/components/PageHeader'
import SearchBar from '@/components/SearchBar'
import ToolCard from '@/components/ToolCard'
import EmptyState from '@/components/EmptyState'
import { getCategories, searchTools } from '@/lib/supabase'

// SSR: results depend on URL filters, rendered on every request
export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }) {
  const params = await searchParams
  const rawQuery = typeof params.q === 'string' ? params.q.trim() : ''
  const q = rawQuery.slice(0, 100)
  const category =
    typeof params.category === 'string' ? params.category.trim().slice(0, 80) : ''

  try {
    const [categories, tools] = await Promise.all([
      getCategories(),
      searchTools({ q, category }),
    ])

    return (
      <>
        <PageHeader title="Explore" description="Search every open-source alternative." />
        <div className="mb-6">
          <SearchBar defaultValue={q} category={category} categories={categories} />
        </div>
        {tools.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyState title="No result" description={`Nothing matches "${q}".`} />
        )}
      </>
    )
  } catch (error) {
    console.error('Failed to load explore results', error)
    return (
      <EmptyState
        title="Unable to load results"
        description="Please try again later."
      />
    )
  }
}

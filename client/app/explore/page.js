import PageHeader from '@/components/PageHeader'
import SearchBar from '@/components/SearchBar'
import ToolCard from '@/components/ToolCard'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import { parseExploreParams } from '@/lib/explore'
import { getCategories, getToolsPage } from '@/lib/supabase'

// rendu serveur, resultat dependant des filtres dans l url
export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }) {
  const params = parseExploreParams(await searchParams)
  const [categories, result] = await Promise.all([
    getCategories(),
    getToolsPage(params),
  ])

  return (
    <>
      <PageHeader title="Explore" description="Search every open-source alternative." />
      <div className="mb-6">
        <SearchBar
          defaultValue={params.q}
          category={params.category}
          categories={categories}
        />
      </div>
      {result.tools.length ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            q={params.q}
            category={params.category}
          />
        </>
      ) : (
        <EmptyState
          title="No result"
          description={
            params.q
              ? `Nothing matches "${params.q}".`
              : 'No tools are available for this filter.'
          }
        />
      )}
    </>
  )
}

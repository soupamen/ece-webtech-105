import PageHeader from '@/components/PageHeader'
import SearchBar from '@/components/SearchBar'
import ToolCard from '@/components/ToolCard'
import EmptyState from '@/components/EmptyState'
import { tools } from '@/lib/placeholder-data'

// SSR: results depend on URL filters, rendered on every request
export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }) {
  const { q = '' } = await searchParams
  const query = q.toLowerCase()
  const results = tools.filter((t) =>
    `${t.name} ${t.alternativeTo}`.toLowerCase().includes(query)
  )

  return (
    <>
      <PageHeader title="Explore" description="Search every open-source alternative." />
      <div className="mb-6">
        <SearchBar defaultValue={q} />
      </div>
      {results.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      ) : (
        <EmptyState title="No result" description={`Nothing matches "${q}".`} />
      )}
    </>
  )
}

import SearchBar from '@/components/SearchBar'
import CategoryCard from '@/components/CategoryCard'
import ToolCard from '@/components/ToolCard'
import EmptyState from '@/components/EmptyState'
import { getCategories, getTools } from '@/lib/supabase'
import { createPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata = createPageMetadata({
  title: 'Open-source alternatives',
  description: 'Search open-source alternatives to popular proprietary tools.',
  path: '/',
})

export default async function Page() {
  const [categories, tools] = await Promise.all([getCategories(), getTools()])

  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center gap-4 py-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Find the open-source alternative
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Search a proprietary tool and discover the open-source software that replaces it.
        </p>
        <SearchBar />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Categories</h2>
        {categories.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No categories yet"
            description="Check back soon for the first category."
          />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Featured tools</h2>
        {tools.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tools yet"
            description="Check back soon for the first open-source alternatives."
          />
        )}
      </section>
    </div>
  )
}

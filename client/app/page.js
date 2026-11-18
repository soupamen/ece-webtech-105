import Link from 'next/link'
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
        <h1 className="wt-title sm:text-4xl">
          Find the open-source alternative
        </h1>
        <p className="max-w-xl text-balance text-muted-foreground">
          Search a proprietary tool and discover the open-source software that replaces it.
        </p>
        <div className="w-full max-w-xl">
          <SearchBar />
        </div>
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
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold">Featured tools</h2>
          <Link
            href="/explore"
            className="rounded-sm text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            See all {tools.length}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.slice(0, 6).map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>
    </div>
  )
}

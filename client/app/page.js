import SearchBar from '@/components/SearchBar'
import CategoryCard from '@/components/CategoryCard'
import ToolCard from '@/components/ToolCard'
import { getCategories, getTools } from '@/lib/supabase'

// ISR: static, refreshed every hour
export const revalidate = 3600

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Featured tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>
    </div>
  )
}

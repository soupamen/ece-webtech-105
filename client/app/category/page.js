import PageHeader from '@/components/PageHeader'
import CategoryCard from '@/components/CategoryCard'
import EmptyState from '@/components/EmptyState'
import { createPageMetadata } from '@/lib/metadata'
import { getCategories } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata = createPageMetadata({
  title: 'Categories',
  description: 'Browse open-source alternatives by software category.',
  path: '/category',
})

export const metadata = {
  title: 'Categories',
  description: 'Browse open-source alternatives by type of software.',
}

export default async function Page() {
  const categories = await getCategories()

  return (
    <>
      <PageHeader title="Categories" description="Browse alternatives by type of software." />
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
    </>
  )
}

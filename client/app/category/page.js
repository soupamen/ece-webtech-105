import PageHeader from '@/components/PageHeader'
import CategoryCard from '@/components/CategoryCard'
import { getCategories } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const categories = await getCategories()

  return (
    <>
      <PageHeader title="Categories" description="Browse alternatives by type of software." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>
    </>
  )
}

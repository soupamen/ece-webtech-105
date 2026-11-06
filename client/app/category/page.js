import PageHeader from '@/components/PageHeader'
import CategoryCard from '@/components/CategoryCard'
import { categories } from '@/lib/placeholder-data'

// SSG: categories rarely change, built once
export const dynamic = 'force-static'

export default function Page() {
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

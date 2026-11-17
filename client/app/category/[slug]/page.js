import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import ToolCard from '@/components/ToolCard'
import EmptyState from '@/components/EmptyState'
import { getCategory, getToolsByCategory } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Page({ params }) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()
  const list = await getToolsByCategory(slug)

  return (
    <>
      <p className="mb-2 text-sm text-muted-foreground">
        <Link href="/category" className="hover:underline">Categories</Link> / {category.name}
      </p>
      <PageHeader title={category.name} description={category.description} />
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      ) : (
        <EmptyState title="No tool yet" description="This category is empty." />
      )}
    </>
  )
}

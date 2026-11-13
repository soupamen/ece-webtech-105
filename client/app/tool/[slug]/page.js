import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { categories, tools } from '@/lib/placeholder-data'

// ISR: one static page per tool, refreshed every 60 seconds
export const revalidate = 60

export async function generateStaticParams() {
  return tools.map(({ slug }) => ({ slug }))
}

export default async function Page({ params }) {
  const { slug } = await params
  const tool = tools.find((t) => t.slug === slug)
  if (!tool) notFound()
  const category = categories.find((c) => c.slug === tool.category)

  return (
    <>
      <p className="mb-2 text-sm text-muted-foreground">
        <Link href={`/category/${category.slug}`} className="hover:underline">
          {category.name}
        </Link>{' '}
        / {tool.name}
      </p>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{tool.name}</h1>
          <p className="mt-2 text-muted-foreground">{tool.description}</p>
          <Badge variant="secondary" className="mt-3">
            Alternative to {tool.alternativeTo}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button disabled>Add to list</Button>
          <Button variant="outline" disabled>
            Website
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          The full description, license and links will appear here.
        </CardContent>
      </Card>
    </>
  )
}

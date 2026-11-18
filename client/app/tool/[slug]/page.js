import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getGithubRepository } from '@/lib/github'
import { getTool, getTools } from '@/lib/supabase'

// ISR: one static page per tool, refreshed every 60 seconds
export const revalidate = 60

export async function generateStaticParams() {
  const tools = await getTools()
  return tools.map(({ slug }) => ({ slug }))
}

export default async function Page({ params }) {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) notFound()
  const github = await getGithubRepository(tool.githubRepo)

  return (
    <>
      <p className="mb-2 text-sm text-muted-foreground">
        <Link href={`/category/${tool.category}`} className="hover:underline">
          {tool.categoryName}
        </Link>{' '}
        / {tool.name}
      </p>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="wt-title">{tool.name}</h1>
          <p className="mt-2 text-muted-foreground">{tool.description}</p>
          <Badge variant="secondary" className="mt-3">
            Alternative to {tool.alternativeTo}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button disabled>Add to list</Button>
          {tool.websiteUrl ? (
            <Button asChild variant="outline">
              <a href={tool.websiteUrl} target="_blank" rel="noreferrer">
                Website
              </a>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Website
            </Button>
          )}
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
      {github && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Open source info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              {github.stars.toLocaleString()} stars · {github.forks.toLocaleString()} forks
            </p>
            {github.license && <p>License: {github.license}</p>}
            <a className="underline hover:no-underline" href={github.url} target="_blank" rel="noreferrer">
              View repository on GitHub
            </a>
          </CardContent>
        </Card>
      )}
    </>
  )
}

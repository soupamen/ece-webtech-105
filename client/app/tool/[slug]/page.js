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

  // 'en': the UI is English; the server locale would otherwise pick the separator (79 125 vs 79,125).
  const stats = github
    ? [
        ['Stars', github.stars.toLocaleString('en')],
        ['Forks', github.forks.toLocaleString('en')],
        ['License', github.license],
      ].filter(([, value]) => value)
    : []

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              href={`/category/${tool.category}`}
              className="rounded-sm transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {tool.categoryName}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {tool.name}
          </li>
        </ol>
      </nav>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="wt-title">{tool.name}</h1>
          <p className="mt-3 max-w-prose text-pretty text-muted-foreground">{tool.description}</p>
          <Badge variant="secondary" className="mt-3">
            Alternative to {tool.alternativeTo}
          </Badge>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button disabled>Add to list</Button>
          {tool.websiteUrl && (
            <Button asChild variant="outline">
              <a href={tool.websiteUrl} target="_blank" rel="noreferrer">
                Website<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          )}
        </div>
      </div>
      {/* Side by side on desktop; About takes the full width when GitHub data is missing. */}
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="min-w-0 md:flex-[2]">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            The full description, license and links will appear here.
          </CardContent>
        </Card>
        {github && (
          <Card className="min-w-0 md:flex-1">
            <CardHeader>
              <CardTitle>Open source info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 text-sm">
              <dl className="divide-y">
                {stats.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2 first:pt-0">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={github.url}
                target="_blank"
                rel="noreferrer"
                className="mt-auto w-fit rounded-sm text-muted-foreground underline underline-offset-4 transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                View repository on GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

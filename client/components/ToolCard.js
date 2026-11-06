import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ToolCard({ tool }) {
  return (
    <Link href={`/tool/${tool.slug}`} className="block rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>{tool.description}</CardDescription>
          <Badge variant="secondary" className="mt-2 w-fit">
            Alternative to {tool.alternativeTo}
          </Badge>
        </CardHeader>
      </Card>
    </Link>
  )
}

import PageHeader from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { createPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = createPageMetadata({
  title: 'About',
  description: 'Learn about the OpenFinder open-source alternatives directory.',
  path: '/about',
})

export default function Page() {
  return (
    <>
      <PageHeader title="About" />
      <Card className="max-w-2xl">
        <CardContent className="text-muted-foreground">
          OpenFinder is a searchable directory of open-source alternatives to proprietary
          software. Built for the ECE WebTech course by team 105.
        </CardContent>
      </Card>
    </>
  )
}

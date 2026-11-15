import PageHeader from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

// SSG: static content, built once
export const dynamic = 'force-static'

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

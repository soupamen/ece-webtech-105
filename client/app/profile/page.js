import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// SSR: personal data, rendered on every request
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <PageHeader title="Profile" />
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted font-semibold">
              ?
            </div>
            <div>
              <CardTitle>Guest</CardTitle>
              <CardDescription>Sign in to see your account.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button disabled>Sign in</Button>
          <Button variant="outline" disabled>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import NewListForm from '@/components/NewListForm'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

// SSR: personal data, rendered on every request
export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <>
        <PageHeader title="My lists" description="Tools you saved, grouped by list." />
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>Sign in to create and view your lists.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Go to login</Link>
            </Button>
          </CardContent>
        </Card>
      </>
    )
  }

  const { data: lists, error } = await supabase
    .from('lists')
    .select('id, name, description, created_at, list_items(tool_id)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader title="My lists" description="Tools you saved, grouped by list." />
      <Card className="mb-6 max-w-md">
        <CardHeader>
          <CardTitle>New list</CardTitle>
          <CardDescription>Create a collection of tools.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewListForm />
        </CardContent>
      </Card>
      {error ? (
        <p className="text-sm text-destructive" role="alert">{error.message}</p>
      ) : lists?.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {lists.map((list) => (
            <Card key={list.id}>
              <CardHeader>
                <CardTitle>{list.name}</CardTitle>
                {list.description && <CardDescription>{list.description}</CardDescription>}
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {list.list_items?.length ?? 0} tool(s)
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No list yet" description="Create a list to save tools you like." />
      )}
    </>
  )
}

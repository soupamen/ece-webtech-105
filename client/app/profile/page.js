import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AuthMessage from '@/components/auth/AuthMessage'
import PageHeader from '@/components/PageHeader'
import { createPageMetadata } from '@/lib/metadata'
import { isModerator } from '@/lib/moderation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { signOutAction } from '@/app/auth/actions'

export const dynamic = 'force-dynamic'

export const metadata = createPageMetadata({
  title: 'Profile',
  description: 'Manage your OpenFinder account.',
  path: '/profile',
})

export default async function ProfilePage({ searchParams }) {
  const params = await searchParams
  const supabase = await createSupabaseServerClient()
  const user = await getCurrentUser(supabase)

  return (
    <>
      <PageHeader title="Profile" description="Your OpenFinder account." />
      <div className="max-w-md">
        <AuthMessage error={params.error} notice={params.notice} />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted font-semibold">
                {user ? user.email?.[0]?.toUpperCase() ?? 'U' : '?'}
              </div>
              <div className="min-w-0">
                <CardTitle>{user ? 'Your account' : 'Guest'}</CardTitle>
                <CardDescription className="break-all">
                  {user?.email ?? 'Sign in to save and manage your lists.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {user ? (
              <>
                <Button asChild>
                  <Link href="/list">My lists</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/suggest">Suggest a tool</Link>
                </Button>
                {isModerator(user) && (
                  <Button asChild variant="outline">
                    <Link href="/moderation">Moderation queue</Link>
                  </Button>
                )}
                <form action={signOutAction}>
                  <Button type="submit" variant="outline">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/auth/signup">Create account</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

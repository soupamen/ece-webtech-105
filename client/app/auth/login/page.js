import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AuthMessage from '@/components/auth/AuthMessage'
import { signInAction } from '@/app/auth/actions'
import { getSafeReturnPath } from '@/lib/auth'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Sign in',
  description: 'Sign in to manage your OpenFinder lists.',
  path: '/auth/login',
})

export default async function LoginPage({ searchParams }) {
  const params = await searchParams
  const next = getSafeReturnPath(params.next)

  return (
    <section className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle as="h1">Sign in to OpenFinder</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthMessage error={params.error} checkEmail={params['check-email']} />
          <form action={signInAction} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            New to OpenFinder?{' '}
            <Link
              className="underline hover:no-underline rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              href={`/auth/signup?next=${encodeURIComponent(next)}`}
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

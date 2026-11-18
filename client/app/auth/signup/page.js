import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AuthMessage from '@/components/auth/AuthMessage'
import { signUpAction } from '@/app/auth/actions'
import { getSafeReturnPath } from '@/lib/auth'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Create an account',
  description: 'Create an OpenFinder account to save software alternatives.',
  path: '/auth/signup',
})

export default async function SignupPage({ searchParams }) {
  const params = await searchParams
  const next = getSafeReturnPath(params.next)

  return (
    <section className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle as="h1">Create your OpenFinder account</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthMessage error={params.error} />
          <form action={signUpAction} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="signup-email">
                Email
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="signup-password">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="signup-password-confirmation">
                Confirm password
              </label>
              <input
                id="signup-password-confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              className="underline hover:no-underline rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              href={`/auth/login?next=${encodeURIComponent(next)}`}
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

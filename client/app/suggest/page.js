import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import { createPageMetadata } from '@/lib/metadata'
import {
  getModerationMessage,
  getUserSubmissions,
} from '@/lib/moderation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { submitToolSuggestionAction } from './actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  ...createPageMetadata({
    title: 'Suggest a tool',
    description: 'Suggest an open-source alternative for the OpenFinder catalogue.',
    path: '/suggest',
  }),
  robots: { index: false, follow: false },
}

export default async function SuggestToolPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createSupabaseServerClient()
  const user = await getCurrentUser(supabase)
  if (!user) redirect('/auth/login?next=%2Fsuggest')

  const [{ data: categories, error }, submissions] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    getUserSubmissions(supabase),
  ])
  if (error) throw error

  const errorMessage = getModerationMessage(params.error)
  const noticeMessage = getModerationMessage(params.notice)

  return (
    <>
      <PageHeader
        title="Suggest a tool"
        description="Send a tool suggestion to the OpenFinder moderation team."
      />
      {(errorMessage || noticeMessage) && (
        <p
          className="mb-6 max-w-2xl rounded-md border border-border p-3 text-sm"
          role={errorMessage ? 'alert' : 'status'}
        >
          {errorMessage ?? noticeMessage}
        </p>
      )}

      <Card className="mb-8 max-w-2xl">
        <CardHeader>
          <CardTitle>Tool details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={submitToolSuggestionAction} className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="tool-name">
                Tool name
              </label>
              <input
                id="tool-name"
                name="name"
                maxLength={80}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="alternative-to">
                Alternative to
              </label>
              <input
                id="alternative-to"
                name="alternative_to"
                maxLength={100}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="tool-category">
                Category
              </label>
              <select
                id="tool-category"
                name="category_id"
                defaultValue=""
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="tool-description">
                Description
              </label>
              <textarea
                id="tool-description"
                name="description"
                maxLength={500}
                required
                rows={4}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="github-repo">
                GitHub repository
              </label>
              <input
                id="github-repo"
                name="github_repo"
                maxLength={100}
                placeholder="owner/repository"
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="website-url">
                Official website
              </label>
              <input
                id="website-url"
                name="website_url"
                type="url"
                maxLength={2048}
                placeholder="https://example.com"
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Suggestions are private until reviewed. Submitting a suggestion
              does not automatically add it to the public catalogue.
            </p>
            <div>
              <Button type="submit">Send suggestion</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section aria-labelledby="your-suggestions-title" className="max-w-2xl">
        <h2 id="your-suggestions-title" className="mb-4 text-xl font-semibold">
          Your suggestions
        </h2>
        {submissions.length ? (
          <ul className="space-y-3">
            {submissions.map((submission) => (
              <li key={submission.id}>
                <Card>
                  <CardContent className="flex flex-wrap items-start justify-between gap-3 py-5">
                    <div>
                      <p className="font-medium">{submission.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Alternative to {submission.alternative_to}
                        {submission.category?.name
                          ? ` · ${submission.category.name}`
                          : ''}
                      </p>
                      {submission.moderator_note && (
                        <p className="mt-2 text-sm">
                          Moderator note: {submission.moderator_note}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full border px-3 py-1 text-xs capitalize">
                      {submission.status}
                    </span>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            You have not sent any suggestions yet.
          </p>
        )}
      </section>
    </>
  )
}

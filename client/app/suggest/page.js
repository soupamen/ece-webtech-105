import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import SuggestToolForm from '@/components/SuggestToolForm'
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
          {/* Remounts (and clears) after each new suggestion appears in the list. */}
          <SuggestToolForm
            key={submissions[0]?.id ?? 'empty'}
            categories={categories}
            action={submitToolSuggestionAction}
          />
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

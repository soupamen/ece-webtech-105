import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import { createPageMetadata } from '@/lib/metadata'
import {
  getModerationMessage,
  getSubmissionsForModeration,
  isModerator,
} from '@/lib/moderation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { updateSubmissionStatusAction } from '@/app/suggest/actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  ...createPageMetadata({
    title: 'Moderation queue',
    description: 'Review OpenFinder catalogue suggestions.',
    path: '/moderation',
  }),
  robots: { index: false, follow: false },
}

export default async function ModerationPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createSupabaseServerClient()
  const user = await getCurrentUser(supabase)
  if (!user) redirect('/auth/login?next=%2Fmoderation')
  if (!isModerator(user)) redirect('/profile')

  const [submissions, errorMessage, noticeMessage] = [
    await getSubmissionsForModeration(supabase),
    getModerationMessage(params.error),
    getModerationMessage(params.notice),
  ]

  return (
    <>
      <PageHeader
        title="Moderation queue"
        description="Review suggestions before they can be added to the catalogue."
      />
      {(errorMessage || noticeMessage) && (
        <p
          className="mb-6 rounded-md border border-border p-3 text-sm"
          role={errorMessage ? 'alert' : 'status'}
        >
          {errorMessage ?? noticeMessage}
        </p>
      )}

      {submissions.length ? (
        <ul className="space-y-4">
          {submissions.map((submission) => (
            <li key={submission.id}>
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>{submission.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Alternative to {submission.alternative_to}
                        {submission.category?.name
                          ? ` · ${submission.category.name}`
                          : ''}
                      </p>
                    </div>
                    <span className="rounded-full border px-3 py-1 text-xs capitalize">
                      {submission.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{submission.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    {submission.github_repo && (
                      <a
                        href={`https://github.com/${submission.github_repo}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-4 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        {submission.github_repo}
                      </a>
                    )}
                    {submission.website_url && (
                      <a
                        href={submission.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-4 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        Official website
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Submitted {new Date(submission.created_at).toISOString().slice(0, 10)}
                  </p>
                  {submission.status === 'pending' ? (
                    <form
                      action={updateSubmissionStatusAction}
                      className="space-y-3 border-t pt-4"
                    >
                      <input
                        type="hidden"
                        name="submission_id"
                        value={submission.id}
                      />
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor={`note-${submission.id}`}
                        >
                          Moderator note
                        </label>
                        <textarea
                          id={`note-${submission.id}`}
                          name="moderator_note"
                          maxLength={500}
                          rows={2}
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button type="submit" name="status" value="approved">
                          Approve
                        </Button>
                        <Button
                          type="submit"
                          name="status"
                          value="rejected"
                          variant="outline"
                        >
                          Reject
                        </Button>
                      </div>
                    </form>
                  ) : (
                    submission.moderator_note && (
                      <p className="border-t pt-4 text-sm">
                        Moderator note: {submission.moderator_note}
                      </p>
                    )
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="font-medium">No suggestions to review</p>
          </CardContent>
        </Card>
      )}
    </>
  )
}

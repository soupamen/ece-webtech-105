'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { validateToolSubmission } from '@/lib/moderation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

function getValue(formData, name) {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

export async function submitToolSuggestionAction(formData) {
  const fields = validateToolSubmission({
    name: formData.get('name'),
    alternativeTo: formData.get('alternative_to'),
    description: formData.get('description'),
    categoryId: formData.get('category_id'),
    githubRepo: formData.get('github_repo'),
    websiteUrl: formData.get('website_url'),
  })

  if (!fields) redirect('/suggest?error=invalid-submission')

  const supabase = await createSupabaseServerClient()
  const user = await getCurrentUser(supabase)
  if (!user) redirect('/auth/login?next=%2Fsuggest')

  const { error } = await supabase
    .from('tool_submissions')
    .insert({ ...fields, user_id: user.id })

  if (error) {
    console.error('Supabase tool suggestion failed', error)
    redirect('/suggest?error=submission-save')
  }

  revalidatePath('/suggest')
  revalidatePath('/moderation')
  redirect('/suggest?notice=submitted')
}

export async function updateSubmissionStatusAction(formData) {
  const id = getValue(formData, 'submission_id')
  const status = getValue(formData, 'status')
  const moderatorNote = getValue(formData, 'moderator_note')

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ||
    !['approved', 'rejected'].includes(status) ||
    moderatorNote.length > 500
  ) {
    redirect('/moderation?error=invalid-decision')
  }

  const supabase = await createSupabaseServerClient()
  const user = await getCurrentUser(supabase)
  if (!user) redirect('/auth/login?next=%2Fmoderation')
  if (user.app_metadata?.role !== 'moderator') redirect('/profile')

  const { data, error } = await supabase
    .from('tool_submissions')
    .update({
      status,
      moderator_note: moderatorNote || null,
    })
    .eq('id', id)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('Supabase moderation update failed', error)
    redirect('/moderation?error=moderation-save')
  }
  if (!data) redirect('/moderation?error=submission-not-found')

  revalidatePath('/moderation')
  revalidatePath('/suggest')
  redirect('/moderation?notice=decision-saved')
}

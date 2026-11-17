const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const githubRepoPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/

export function validateToolSubmission(values) {
  const name = typeof values.name === 'string' ? values.name.trim() : ''
  const alternativeTo =
    typeof values.alternativeTo === 'string'
      ? values.alternativeTo.trim()
      : ''
  const description =
    typeof values.description === 'string' ? values.description.trim() : ''
  const categoryId =
    typeof values.categoryId === 'string' ? values.categoryId.trim() : ''
  const githubRepo =
    typeof values.githubRepo === 'string' ? values.githubRepo.trim() : ''
  const websiteUrl =
    typeof values.websiteUrl === 'string' ? values.websiteUrl.trim() : ''

  if (
    !name ||
    name.length > 80 ||
    !alternativeTo ||
    alternativeTo.length > 100 ||
    !description ||
    description.length > 500 ||
    !uuidPattern.test(categoryId) ||
    (githubRepo &&
      (githubRepo.length > 100 || !githubRepoPattern.test(githubRepo))) ||
    websiteUrl.length > 2048
  ) {
    return null
  }

  if (websiteUrl) {
    try {
      if (new URL(websiteUrl).protocol !== 'https:') return null
    } catch {
      return null
    }
  }

  return {
    name,
    alternative_to: alternativeTo,
    description,
    category_id: categoryId,
    github_repo: githubRepo || null,
    website_url: websiteUrl || null,
  }
}

export function isModerator(user) {
  return user?.app_metadata?.role === 'moderator'
}

export function getModerationMessage(status) {
  const messages = {
    'invalid-submission': 'Check the required fields and optional links.',
    'submission-save': 'Your suggestion could not be saved. Please try again.',
    'submission-not-found': 'That suggestion is no longer available.',
    'invalid-decision': 'Choose a valid moderation decision.',
    'moderation-save': 'The moderation decision could not be saved.',
    submitted: 'Your suggestion was sent to the moderation team.',
    'decision-saved': 'The moderation decision was saved.',
  }

  return typeof status === 'string' ? messages[status] ?? null : null
}

export async function getUserSubmissions(supabase) {
  const { data, error } = await supabase
    .from('tool_submissions')
    .select(
      'id, name, alternative_to, status, moderator_note, created_at, category:categories(name)'
    )
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}

export async function getSubmissionsForModeration(supabase) {
  const { data, error } = await supabase
    .from('tool_submissions')
    .select(
      'id, name, alternative_to, description, github_repo, website_url, status, moderator_note, created_at, category:categories(name)'
    )
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

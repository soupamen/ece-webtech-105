export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
    )
  }

  return { url, key }
}

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL
  if (!value) {
    throw new Error('Missing NEXT_PUBLIC_SITE_URL')
  }

  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTP or HTTPS')
  }

  return url.origin
}

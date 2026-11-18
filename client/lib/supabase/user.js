import { redirect } from 'next/navigation'
import { getSafeReturnPath } from '@/lib/auth'

export async function getCurrentUser(supabase) {
  const { data, error } = await supabase.auth.getUser()

  if (error && error.name !== 'AuthSessionMissingError') {
    throw error
  }

  return data.user
}

export async function requireUser(supabase, returnPath) {
  const user = await getCurrentUser(supabase)
  if (user) return user

  const next = getSafeReturnPath(returnPath)
  redirect(`/auth/login?next=${encodeURIComponent(next)}`)
}

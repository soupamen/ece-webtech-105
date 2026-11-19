'use server'

import { redirect } from 'next/navigation'
import { getSafeReturnPath, isValidEmail } from '@/lib/auth'
import { getSiteUrl } from '@/lib/supabase/config'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function getFormValue(formData, name) {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

function getNextPath(formData) {
  return getSafeReturnPath(getFormValue(formData, 'next'))
}

export async function signInAction(formData) {
  const next = getNextPath(formData)
  const email = getFormValue(formData, 'email').toLowerCase()
  const password = formData.get('password')

  if (
    !isValidEmail(email) ||
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 128
  ) {
    redirect(`/auth/login?error=invalid-input&next=${encodeURIComponent(next)}`)
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error('Supabase sign in failed', error)
    redirect(`/auth/login?error=credentials&next=${encodeURIComponent(next)}`)
  }

  redirect(next)
}

export async function signInWithGitHubAction(formData) {
  const next = getNextPath(formData)
  const supabase = await createSupabaseServerClient()
  const callbackUrl = new URL('/auth/callback', getSiteUrl())
  callbackUrl.searchParams.set('next', next)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: callbackUrl.toString(),
    },
  })

  if (error) {
    console.error('Supabase GitHub sign in failed', error)
    redirect(`/auth/login?error=github&next=${encodeURIComponent(next)}`)
  }

  if (data.url) {
    redirect(data.url)
  }

  redirect(`/auth/login?error=github&next=${encodeURIComponent(next)}`)
}

export async function signUpAction(formData) {
  const next = getNextPath(formData)
  const email = getFormValue(formData, 'email').toLowerCase()
  const password = formData.get('password')
  const confirmation = formData.get('password_confirmation')

  if (
    !isValidEmail(email) ||
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 128 ||
    password !== confirmation
  ) {
    const error = password === confirmation ? 'invalid-input' : 'password-mismatch'
    redirect(`/auth/signup?error=${error}&next=${encodeURIComponent(next)}`)
  }

  const supabase = await createSupabaseServerClient()
  const callbackUrl = new URL('/auth/callback', getSiteUrl())
  callbackUrl.searchParams.set('next', next)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: callbackUrl.toString() },
  })

  if (error) {
    console.error('Supabase sign up failed', error)
    redirect(`/auth/signup?error=signup&next=${encodeURIComponent(next)}`)
  }

  if (data.session) {
    redirect(next)
  }

  redirect('/auth/login?check-email=1')
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Supabase sign out failed', error)
    redirect('/profile?error=sign-out')
  }

  redirect('/profile?notice=signed-out')
}

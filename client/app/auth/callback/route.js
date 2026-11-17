import { NextResponse } from 'next/server'
import { getSafeReturnPath } from '@/lib/auth'
import { getSiteUrl } from '@/lib/supabase/config'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = getSafeReturnPath(requestUrl.searchParams.get('next'))

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(next, getSiteUrl()))
    }

    console.error('Supabase auth callback failed', error)
  }

  const errorUrl = new URL('/auth/login?error=callback', getSiteUrl())
  return NextResponse.redirect(errorUrl)
}

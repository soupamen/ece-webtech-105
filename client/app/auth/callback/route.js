import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function getSafeNextUrl(request, next) {
  if (typeof next !== 'string' || !next.startsWith('/') || next.startsWith('//')) {
    return new URL('/list', request.url)
  }
  return new URL(next, request.url)
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = getSafeNextUrl(request, searchParams.get('next'))

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(next)
    }
  }

  return NextResponse.redirect(new URL('/login?error=oauth', request.url))
}

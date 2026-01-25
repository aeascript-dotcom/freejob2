import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get('provider') || 'google'

  if (provider === 'google') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${request.headers.get('origin')}/auth/callback`,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.redirect(data.url)
  }

  return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
}

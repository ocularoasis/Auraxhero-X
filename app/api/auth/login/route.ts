import { NextResponse } from 'next/server'
import { setAuthCookies, supabaseAuth, supabaseRpc } from '../../../../lib/deletemefast/supabase-http'

export async function POST(request: Request) {
  let body: { email?: string; password?: string; next?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  const email = body.email?.trim().toLowerCase()
  const password = body.password
  if (!email || !password) return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })

  const response = await supabaseAuth('token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  const data = await response.json()
  if (!response.ok) return NextResponse.json({ error: data.error_description ?? data.msg ?? 'Unable to sign in.' }, { status: 401 })

  await setAuthCookies(data.access_token, data.refresh_token)
  const userResponse = await supabaseAuth('user', { headers: { Authorization: `Bearer ${data.access_token}` } })
  const user = userResponse.ok ? await userResponse.json() : {}
  const profileName = user.user_metadata?.display_name ?? email.split('@')[0]
  await supabaseRpc('dmf_upsert_customer_profile', data.access_token, {
    p_display_name: profileName,
    p_email: email,
  })
  const next = typeof body.next === 'string' && body.next.startsWith('/') ? body.next : '/onboarding'
  return NextResponse.json({ ok: true, next })
}

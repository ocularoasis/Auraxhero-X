import { NextResponse } from 'next/server'
import { setAuthCookies, supabaseAuth } from '../../../../lib/deletemefast/supabase-http'

export async function POST(request: Request) {
  let body: { email?: string; password?: string; name?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  const email = body.email?.trim().toLowerCase()
  const password = body.password
  const name = body.name?.trim()
  if (!email || !password || !name) return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 })

  const response = await supabaseAuth('signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, data: { display_name: name } }),
  })
  const data = await response.json()
  if (!response.ok) return NextResponse.json({ error: data.msg ?? data.error_description ?? 'Unable to create account.' }, { status: 400 })

  if (data.access_token) await setAuthCookies(data.access_token, data.refresh_token)
  return NextResponse.json({ ok: true, authenticated: Boolean(data.access_token), needsEmailConfirmation: !data.access_token })
}

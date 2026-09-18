import { NextResponse } from 'next/server'
import { currentUser, supabaseRpc } from '../../../../lib/deletemefast/supabase-http'

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

  let body: { name?: string; email?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase() || user.email
  if (!name || !email) return NextResponse.json({ error: 'Profile name and email are required.' }, { status: 400 })

  const response = await supabaseRpc('dmf_upsert_customer_profile', user.accessToken, {
    p_display_name: name,
    p_email: email,
  })
  if (!response.ok) return NextResponse.json({ error: 'Unable to save the customer profile.' }, { status: 500 })

  return NextResponse.json({ ok: true, customer: await response.json() })
}

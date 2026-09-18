import { NextResponse } from 'next/server'
import { currentUser, supabaseRpc } from '../../../../../lib/deletemefast/supabase-http'

export async function POST() {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

  const response = await supabaseRpc('dmf_complete_onboarding_slideshow', user.accessToken)
  if (!response.ok) return NextResponse.json({ error: 'Your profile must be created before onboarding can continue.' }, { status: 409 })
  return NextResponse.json({ ok: true, customer: await response.json() })
}

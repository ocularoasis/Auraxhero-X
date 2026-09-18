import { NextResponse } from 'next/server'
import { currentUser, supabaseRpc, supabaseRest } from '../../../../../lib/deletemefast/supabase-http'

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid questionnaire.' }, { status: 400 }) }

  const customerResponse = await supabaseRest(
    'dmf_customers?select=id,onboarding_slideshow_completed_at,profile_completed_at&limit=1',
    user.accessToken,
  )
  if (!customerResponse.ok) return NextResponse.json({ error: 'Unable to verify onboarding state.' }, { status: 500 })
  const customers = await customerResponse.json()
  if (!customers[0]?.onboarding_slideshow_completed_at || !customers[0]?.profile_completed_at) {
    return NextResponse.json({ error: 'Complete onboarding before the questionnaire.' }, { status: 409 })
  }

  const response = await supabaseRpc('dmf_complete_questionnaire', user.accessToken, { p_response: body })
  if (!response.ok) {
    const detail = await response.text()
    return NextResponse.json({ error: detail.includes('payment required') ? 'Payment is required before the questionnaire can be opened.' : 'Unable to complete questionnaire.' }, { status: 409 })
  }

  const customer = await response.json()
  return NextResponse.json({ ok: true, customer })
}

import { NextResponse } from 'next/server'
import { currentUser, supabaseRest } from '../../../../lib/deletemefast/supabase-http'
import { createStripeCheckoutSession } from '../../../../lib/deletemefast/stripe'
import { serviceForCode, totalForService } from '../../../../lib/deletemefast/service-catalog'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ ok: false, code: 'AUTH_REQUIRED' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const serviceCode = typeof body?.serviceCode === 'string' ? body.serviceCode : ''
  const service = serviceForCode(serviceCode)

  if (!service) {
    return NextResponse.json({ ok: false, code: 'INVALID_SERVICE' }, { status: 400 })
  }

  const customerResponse = await supabaseRest(
    'dmf_customers?select=id,email,display_name,onboarding_stage&limit=1',
    user.accessToken,
  )
  if (!customerResponse.ok) {
    return NextResponse.json({ ok: false, code: 'CUSTOMER_LOOKUP_FAILED' }, { status: 502 })
  }

  const customers = await customerResponse.json()
  const customer = customers[0]
  if (!customer?.id || !customer?.email) {
    return NextResponse.json({ ok: false, code: 'PROFILE_REQUIRED' }, { status: 409 })
  }

  const origin = new URL(request.url).origin
  try {
    const session = await createStripeCheckoutSession({
      customerId: customer.id,
      email: customer.email,
      serviceCode: service.code,
      serviceName: service.name,
      amountCents: totalForService(service),
      currency: service.currency,
      mode: service.mode,
      successUrl: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/pricing?payment=cancelled`,
    })

    return NextResponse.json({
      ok: true,
      checkoutSessionId: session.id,
      checkoutUrl: session.url,
      amountCents: totalForService(service),
      currency: service.currency,
      serviceCode: service.code,
      mode: service.mode,
    })
  } catch (error) {
    console.error('DeleteMeFast Stripe Checkout error', error)
    return NextResponse.json({ ok: false, code: 'CHECKOUT_UNAVAILABLE' }, { status: 502 })
  }
}

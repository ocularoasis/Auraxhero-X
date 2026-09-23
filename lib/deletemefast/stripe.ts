import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

const STRIPE_API = 'https://api.stripe.com/v1'

function secret() {
  const value = process.env.STRIPE_SECRET_KEY
  if (!value) throw new Error('DeleteMeFast Stripe secret key is not configured.')
  return value
}

function formValue(value: string) {
  return encodeURIComponent(value)
}

export async function createStripeCheckoutSession(input: {
  customerId: string
  email: string
  serviceCode: string
  serviceName: string
  amountCents: number
  currency: string
  successUrl: string
  cancelUrl: string
}) {
  const body = [
    ['mode', 'payment'],
    ['success_url', input.successUrl],
    ['cancel_url', input.cancelUrl],
    ['customer_email', input.email],
    ['line_items[0][price_data][currency]', input.currency],
    ['line_items[0][price_data][product_data][name]', input.serviceName],
    ['line_items[0][price_data][product_data][description]', 'DeleteMeFast protected service delivery.'],
    ['line_items[0][price_data][unit_amount]', String(input.amountCents)],
    ['line_items[0][quantity]', '1'],
    ['payment_intent_data[metadata][dmf_customer_id]', input.customerId],
    ['payment_intent_data[metadata][dmf_service_code]', input.serviceCode],
    ['metadata[dmf_customer_id]', input.customerId],
    ['metadata[dmf_service_code]', input.serviceCode],
  ].map(([key, value]) => `${formValue(key)}=${formValue(value)}`).join('&')

  const response = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  })

  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.id || !data?.url) {
    throw new Error(`Stripe Checkout creation failed (${response.status}).`)
  }

  return {
    id: data.id as string,
    url: data.url as string,
    paymentStatus: data.payment_status as string | undefined,
  }
}

function stripeWebhookSecret() {
  const value = process.env.STRIPE_WEBHOOK_SECRET
  if (!value) throw new Error('DeleteMeFast Stripe webhook secret is not configured.')
  return value
}

function constantTimeHexEqual(a: string, b: string) {
  const left = Buffer.from(a, 'hex')
  const right = Buffer.from(b, 'hex')
  return left.length === right.length && timingSafeEqual(left, right)
}

export function verifyStripeWebhookSignature(payload: string, signature: string) {
  const secretValue = stripeWebhookSecret()
  const timestampPart = signature.split(',').find((part) => part.startsWith('t='))
  const signatures = signature
    .split(',')
    .filter((part) => part.startsWith('v1='))
    .map((part) => part.slice(3))
  if (!timestampPart || !signatures.length) return false

  const timestamp = Number(timestampPart.slice(2))
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > 300) return false

  const expected = createHmac('sha256', secretValue)
    .update(`${timestamp}.${payload}`, 'utf8')
    .digest('hex')

  return signatures.some((candidate) => constantTimeHexEqual(candidate, expected))
}

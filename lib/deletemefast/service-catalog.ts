export type DeleteMeFastService = {
  code: string
  name: string
  amountCents: number
  currency: 'usd'
  durationHours: number
  mode: 'payment' | 'subscription'
}

export const DELETEMEFAST_SERVICES: Record<string, DeleteMeFastService> = {
  SUSPICIOUS_SITE_ASSESSMENT: {
    code: 'SUSPICIOUS_SITE_ASSESSMENT',
    name: 'Suspicious site or app assessment',
    amountCents: 14900,
    currency: 'usd',
    durationHours: 2,
    mode: 'payment',
  },
  ACCOUNT_COMPROMISE_RESPONSE: {
    code: 'ACCOUNT_COMPROMISE_RESPONSE',
    name: 'Account compromise response',
    amountCents: 29900,
    currency: 'usd',
    durationHours: 24,
    mode: 'payment',
  },
  IMPERSONATION_RESPONSE: {
    code: 'IMPERSONATION_RESPONSE',
    name: 'Impersonation response',
    amountCents: 39900,
    currency: 'usd',
    durationHours: 48,
    mode: 'payment',
  },
  AI_DEEPFAKE_RESPONSE: {
    code: 'AI_DEEPFAKE_RESPONSE',
    name: 'AI / deepfake response',
    amountCents: 49900,
    currency: 'usd',
    durationHours: 72,
    mode: 'payment',
  },
  MULTI_PLATFORM_RESPONSE: {
    code: 'MULTI_PLATFORM_RESPONSE',
    name: 'Multi-platform response',
    amountCents: 99900,
    currency: 'usd',
    durationHours: 168,
    mode: 'payment',
  },
  ONGOING_PROTECTION: {
    code: 'ONGOING_PROTECTION',
    name: 'Ongoing protection',
    amountCents: 9900,
    currency: 'usd',
    durationHours: 720,
    mode: 'subscription',
  },
}

export const PROTECTION_PROCESSING_FEE_CENTS = 250

export function serviceForCode(code: string) {
  return DELETEMEFAST_SERVICES[code] ?? null
}

export function totalForService(service: DeleteMeFastService) {
  return service.amountCents + PROTECTION_PROCESSING_FEE_CENTS
}

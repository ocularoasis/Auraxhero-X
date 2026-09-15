import type { AccessLevel, PolicyDecision, RequestContext } from './types'

const rank: Record<AccessLevel, number> = { PUBLIC: 0, AUTHENTICATED: 1, FOUNDER: 2 }

export function authorize(context: RequestContext, required: AccessLevel): PolicyDecision {
  if (rank[context.access] >= rank[required]) return { allowed: true, reason: 'policy satisfied' }
  return { allowed: false, reason: `${required} access is required` }
}

export function assertAuthorized(context: RequestContext, required: AccessLevel) {
  const decision = authorize(context, required)
  if (!decision.allowed) throw new Error(decision.reason)
}

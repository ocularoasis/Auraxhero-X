export type AccessLevel = 'PUBLIC' | 'AUTHENTICATED' | 'FOUNDER'

export type Principal = {
  id: string
  authenticated: boolean
  roles: string[]
  scopes?: string[]
  authStrength?: 'NONE' | 'PASSWORD' | 'MFA' | 'PASSKEY'
  provider?: string
}

export type RequestContext = {
  requestId: string
  principal: Principal
  access: AccessLevel
  purpose: string
}

export type AuditEvent = {
  id: string
  at: string
  requestId: string
  actorId: string
  action: string
  outcome: 'ALLOWED' | 'DENIED' | 'FAILED'
  target?: string
  metadata?: Record<string, string>
}

export type PolicyDecision = {
  allowed: boolean
  reason: string
}

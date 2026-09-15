import { randomUUID } from 'node:crypto'
import type { AccessLevel, Principal, RequestContext } from './types'

const anonymous: Principal = { id: 'anonymous', authenticated: false, roles: [] }

export function requestContext(purpose: string, principal: Principal = anonymous): RequestContext {
  const access: AccessLevel = principal.roles.includes('FOUNDER')
    ? 'FOUNDER'
    : principal.authenticated ? 'AUTHENTICATED' : 'PUBLIC'

  return { requestId: randomUUID(), principal, access, purpose }
}

export function anonymousPrincipal(): Principal {
  return anonymous
}

export function requireAuthenticated(context: RequestContext) {
  if (!context.principal.authenticated) throw new Error('Authentication required')
}

export function requireFounder(context: RequestContext) {
  if (!context.principal.authenticated || !context.principal.roles.includes('FOUNDER')) {
    throw new Error('Founder authorization required')
  }
}

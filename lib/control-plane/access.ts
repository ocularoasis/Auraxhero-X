import type { Principal, RequestContext } from './types'
import { can, hasRole, type AuraxRole, type CapabilityAction } from './roles'

export function requireRole(context: RequestContext, role: AuraxRole): void {
  if (!context.principal.authenticated || !hasRole(context.principal, role)) {
    throw new Error(`${role} role is required`)
  }
}

export function requireAction(context: RequestContext, action: CapabilityAction): void {
  if (!context.principal.authenticated || !can(context.principal, action)) {
    throw new Error(`${action} capability is not authorized`)
  }
}

export function scopedPrincipal(principal: Principal, scopes: string[]): Principal {
  return { ...principal, scopes: [...new Set(scopes)] }
}

export function hasScope(principal: Principal, scope: string): boolean {
  return principal.scopes?.includes(scope) ?? false
}

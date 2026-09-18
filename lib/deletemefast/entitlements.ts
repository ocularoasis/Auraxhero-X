export type LookupKind = 'IP' | 'PHONE' | 'EMAIL' | 'USERNAME' | 'DOMAIN' | 'URL'

export type LookupEntitlement = {
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED'
  customerId: string
  caseId: string
  subscriptionId: string
  identityVerified: boolean
  dailyIncludedLimit: number
  usedToday: number
  expiresAt: string | null
}

export function canPerformLookup(entitlement: LookupEntitlement, now = new Date()): boolean {
  if (entitlement.status !== 'ACTIVE') return false
  if (!entitlement.identityVerified) return false
  if (entitlement.expiresAt && new Date(entitlement.expiresAt) <= now) return false
  if (entitlement.usedToday >= entitlement.dailyIncludedLimit) return false
  return true
}

export function remainingIncludedLookups(entitlement: LookupEntitlement): number {
  return Math.max(0, entitlement.dailyIncludedLimit - entitlement.usedToday)
}

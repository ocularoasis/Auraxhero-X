import type { Principal } from './types'

export const HUMAN_ROLES = [
  'USER', 'CUSTOMER', 'DEVELOPER', 'PARTNER', 'PROVIDER', 'STAFF', 'OPERATIONS',
  'SECURITY', 'FINANCE', 'ACCOUNTING', 'LEGAL', 'ADMIN', 'FOUNDER',
] as const

export const MACHINE_ROLES = ['MACHINE', 'AGENT', 'SERVICE'] as const
export type AuraxRole = (typeof HUMAN_ROLES | typeof MACHINE_ROLES)[number]

export type CapabilityAction =
  | 'READ' | 'WRITE' | 'EXECUTE' | 'PUBLISH' | 'REVOKE' | 'SETTLE' | 'DEPLOY' | 'AUDIT'

const roleCapabilities: Record<AuraxRole, readonly CapabilityAction[]> = {
  USER: ['READ', 'WRITE'],
  CUSTOMER: ['READ', 'WRITE', 'EXECUTE'],
  DEVELOPER: ['READ', 'WRITE', 'EXECUTE', 'PUBLISH'],
  PARTNER: ['READ', 'WRITE', 'EXECUTE'],
  PROVIDER: ['READ', 'WRITE', 'EXECUTE'],
  STAFF: ['READ', 'WRITE'],
  OPERATIONS: ['READ', 'WRITE', 'EXECUTE'],
  SECURITY: ['READ', 'WRITE', 'REVOKE', 'AUDIT'],
  FINANCE: ['READ', 'WRITE', 'AUDIT'],
  ACCOUNTING: ['READ', 'AUDIT'],
  LEGAL: ['READ', 'AUDIT'],
  ADMIN: ['READ', 'WRITE', 'EXECUTE', 'PUBLISH', 'REVOKE', 'AUDIT'],
  FOUNDER: ['READ', 'WRITE', 'EXECUTE', 'PUBLISH', 'REVOKE', 'SETTLE', 'DEPLOY', 'AUDIT'],
  MACHINE: ['READ', 'EXECUTE'],
  AGENT: ['READ', 'EXECUTE'],
  SERVICE: ['READ', 'EXECUTE'],
}

export function isHumanRole(role: string): role is (typeof HUMAN_ROLES)[number] {
  return (HUMAN_ROLES as readonly string[]).includes(role)
}

export function isMachineRole(role: string): role is (typeof MACHINE_ROLES)[number] {
  return (MACHINE_ROLES as readonly string[]).includes(role)
}

export function hasRole(principal: Principal, role: AuraxRole): boolean {
  return principal.roles.includes(role)
}

export function canRole(role: AuraxRole, action: CapabilityAction): boolean {
  return roleCapabilities[role].includes(action)
}

export function can(principal: Principal, action: CapabilityAction): boolean {
  return principal.roles.some((role) =>
    isHumanRole(role) || isMachineRole(role)
      ? canRole(role, action)
      : false,
  )
}

export function isPrivilegedRole(role: AuraxRole): boolean {
  return ['SECURITY', 'FINANCE', 'ACCOUNTING', 'LEGAL', 'ADMIN', 'FOUNDER'].includes(role)
}

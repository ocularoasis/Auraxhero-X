import type { ServiceStatus } from './service-network'

const transitions: Record<ServiceStatus, readonly ServiceStatus[]> = {
  DRAFT: ['DISCOVERED', 'CANCELLED', 'EXPIRED'],
  DISCOVERED: ['QUALIFIED', 'CANCELLED', 'EXPIRED'],
  QUALIFIED: ['MATCHED', 'CANCELLED', 'EXPIRED'],
  MATCHED: ['QUOTED', 'CANCELLED', 'EXPIRED'],
  QUOTED: ['AUTHORIZED', 'CANCELLED', 'EXPIRED'],
  AUTHORIZED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['SCHEDULED', 'CANCELLED'],
  SCHEDULED: ['EXECUTING', 'CANCELLED'],
  EXECUTING: ['COMPLETED', 'FAILED', 'DISPUTED', 'RECOVERING'],
  COMPLETED: ['VERIFIED', 'FAILED', 'DISPUTED', 'RECOVERING'],
  VERIFIED: ['SETTLED', 'DISPUTED'],
  SETTLED: ['RECONCILED', 'DISPUTED'],
  RECONCILED: [],
  FAILED: ['RECOVERING', 'CANCELLED'],
  CANCELLED: [],
  DISPUTED: ['RECOVERING', 'CANCELLED'],
  RECOVERING: ['SCHEDULED', 'EXECUTING', 'CANCELLED', 'FAILED'],
  EXPIRED: [],
}

export function canTransition(from: ServiceStatus, to: ServiceStatus): boolean {
  return transitions[from].includes(to)
}

export function transitionServiceStatus(
  from: ServiceStatus,
  to: ServiceStatus,
): ServiceStatus {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid service transition: ${from} -> ${to}`)
  }
  return to
}

export function allowedNextStatuses(status: ServiceStatus): readonly ServiceStatus[] {
  return transitions[status]
}

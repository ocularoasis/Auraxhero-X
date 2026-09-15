import type { Capability, EconomicEvent } from '../types'

/**
 * A service is the buyer-facing result of composing capabilities, resources,
 * providers, agents, and (where authorized) human work. It is deliberately
 * separate from a capability: capabilities are ingredients; services are the
 * meal the buyer orders.
 */
export type ServiceKind =
  | 'INFORMATION'
  | 'COMPUTATIONAL'
  | 'SPECIALIST'
  | 'MANAGED'
  | 'OUTCOME'
  | 'ENTERPRISE'

export type ServiceStatus =
  | 'DRAFT'
  | 'DISCOVERED'
  | 'QUALIFIED'
  | 'MATCHED'
  | 'QUOTED'
  | 'AUTHORIZED'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'SETTLED'
  | 'RECONCILED'
  | 'FAILED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'RECOVERING'
  | 'EXPIRED'

export type StationKind =
  | 'INTAKE'
  | 'DISCOVERY'
  | 'RESEARCH'
  | 'COMPOSITION'
  | 'BUILD'
  | 'ANALYSIS'
  | 'COORDINATION'
  | 'EXECUTION'
  | 'VERIFICATION'
  | 'SETTLEMENT'
  | 'RECOVERY'

export interface ServiceDefinition {
  id: string
  name: string
  purpose: string
  kind: ServiceKind
  desiredOutcomes: string[]
  requiredCapabilities: string[]
  optionalCapabilities: string[]
  inputs: string[]
  outputs: string[]
  constraints: string[]
  maturity: Capability['maturity']
  version: string
}

export interface ServiceTicket {
  id: string
  serviceId: string
  requesterId: string
  status: ServiceStatus
  desiredOutcome: string
  inputs: Record<string, unknown>
  constraints: Record<string, unknown>
  requiredCapabilities: string[]
  assignedStations: StationKind[]
  createdAt: string
  updatedAt: string
}

export interface WorkReceipt {
  id: string
  ticketId: string
  station: StationKind
  workerId: string
  status: 'RECEIVED' | 'STARTED' | 'COMPLETED' | 'FAILED' | 'BLOCKED'
  inputsDigest: string
  outputsDigest?: string
  evidenceRefs: string[]
  startedAt?: string
  completedAt?: string
  failureReason?: string
}

export interface ServiceQuote {
  id: string
  ticketId: string
  serviceId: string
  currency: string
  amount: number
  pricingBasis: 'FIXED' | 'USAGE' | 'SUBSCRIPTION' | 'COMMISSION' | 'CUSTOM'
  inclusions: string[]
  exclusions: string[]
  validUntil: string
  provenance: string[]
}

export interface ServiceResult {
  ticketId: string
  status: 'SUCCEEDED' | 'PARTIAL' | 'FAILED'
  outputs: Record<string, unknown>
  evidenceRefs: string[]
  receiptIds: string[]
  verifiedAt?: string
}

export interface ServiceAccountingRecord {
  ticketId: string
  receiptIds: string[]
  economicEvent?: EconomicEvent
  certification: {
    evidenceComplete: boolean
    authorizationVerified: boolean
    executionRecorded: boolean
    settlementVerified: boolean
  }
  filteredForAccounting: boolean
}

export interface ServiceStationWorker {
  id: string
  station: StationKind
  status: 'AVAILABLE' | 'BUSY' | 'PAUSED' | 'REVOKED'
  acceptedTicketTypes: string[]
  scope: string[]
}

/**
 * Deterministic station routing. This is planning only: it does not execute,
 * authorize, charge, or claim that a provider exists.
 */
export function routeTicketToStations(ticket: ServiceTicket): StationKind[] {
  const stations: StationKind[] = ['INTAKE']

  if (ticket.requiredCapabilities.length > 0) stations.push('DISCOVERY')
  stations.push('COMPOSITION')
  stations.push('EXECUTION')
  stations.push('VERIFICATION')

  return [...new Set(stations)]
}

/**
 * Accounting receives certified receipts, not raw agent chatter. This gate
 * intentionally returns false until every required certification is present.
 */
export function isAccountingEligible(record: ServiceAccountingRecord): boolean {
  const { certification } = record
  return (
    certification.evidenceComplete &&
    certification.authorizationVerified &&
    certification.executionRecorded &&
    certification.settlementVerified
  )
}

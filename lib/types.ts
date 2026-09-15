export type Maturity =
  | 'IDEA' | 'HYPOTHESIS' | 'RESEARCHED' | 'PROTOTYPE' | 'REPRODUCIBLE'
  | 'EVALUATED' | 'HARDENED' | 'CANDIDATE' | 'APPROVED' | 'PRODUCTION'
  | 'MONITORED' | 'DEPRECATED' | 'ARCHIVED'

export type InventoryState =
  | 'LIVE' | 'PARTIAL' | 'BROKEN' | 'DISCONNECTED' | 'MOCK' | 'PLACEHOLDER'
  | 'DUPLICATED' | 'STALE' | 'UNSAFE' | 'ORPHANED'

export type AgentRole =
  | 'ARTISAN' | 'SKEPTIC' | 'ARCHITECT' | 'SECURITY' | 'PROVENANCE'
  | 'ECONOMIC' | 'ADVERSARIAL' | 'EVALUATOR' | 'CURATOR' | 'MAINTAINER'
  | 'OBSERVER' | 'FORECASTER'

export interface Capability {
  id: string
  name: string
  purpose: string
  maturity: Maturity
  version: string
  inputs: string[]
  outputs: string[]
  dependencies: string[]
  owner: string
  securityScope: string
  tests: string[]
  failureModes: string[]
  rollback: string
}

export interface WorkabilityContract {
  purpose: string
  inputs: string[]
  outputs: string[]
  dependencies: string[]
  environments: string[]
  limitations: string[]
  failureModes: string[]
  tests: string[]
  securityBoundaries: string[]
  dataRequirements: string[]
  operatingCost: string
  owner: string
  version: string
  rollback: string
  monitoring: string[]
}

export interface EvaluationGate {
  evidence: string[]
  reproducible: boolean
  independentEvaluation: boolean
  securityReviewed: boolean
  provenanceReviewed: boolean
  economicReviewed: boolean
  governanceApproved: boolean
}

export interface AgentIdentity {
  id: string
  role: AgentRole
  status: 'ACTIVE' | 'PAUSED' | 'REVOKED'
  scope: string[]
  authority: string[]
  createdAt: string
}

export interface EconomicEvent {
  id: string
  type: 'SALE' | 'SUBSCRIPTION' | 'REFERRAL' | 'COMMISSION' | 'LICENSE' | 'MACHINE_PAYMENT' | 'REFUND' | 'FEE'
  gross: number
  fees: number
  refunds: number
  currency: string
  settled: boolean
  settlementReference?: string
  source: string
  occurredAt: string
}

export interface ComputeRequirement {
  memoryGb?: number
  latencyMs?: number
  throughput?: number
  precision?: string
  framework?: string
  maxCost?: number
  security?: string[]
  geography?: string
}

export interface FounderChallenge {
  assumption: string
  countercase: string
  evidence: string[]
  consequence: string
  decisionRequired: string
}

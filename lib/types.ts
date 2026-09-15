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

export type ProductLevel =
  | 'RAW_RESOURCE' | 'CAPABILITY' | 'TOOL' | 'SPECIALIST_SERVICE'
  | 'COMPOSITE_SERVICE' | 'MANAGED_SERVICE' | 'OUTCOME_SERVICE'
  | 'ENTERPRISE_FUNCTION'

export type WorkerKind = 'AGENT' | 'SOFTWARE' | 'EXTERNAL_API' | 'HUMAN_SPECIALIST' | 'PROVIDER' | 'INTERNAL'

export type Station =
  | 'INTAKE' | 'DISCOVERY' | 'RESEARCH' | 'COMPOSITION' | 'BUILD'
  | 'ANALYSIS' | 'COORDINATION' | 'EXECUTION' | 'VERIFICATION'
  | 'SETTLEMENT' | 'RECOVERY'

export type WorkState =
  | 'AVAILABLE' | 'DISCOVERABLE' | 'REQUESTABLE' | 'CONFIGURING' | 'QUOTED'
  | 'AWAITING_AUTHORIZATION' | 'SCHEDULED' | 'EXECUTING' | 'VERIFYING'
  | 'COMPLETED' | 'DISPUTED' | 'RECOVERING' | 'FAILED' | 'UNAVAILABLE'

export type DataClass =
  | 'PUBLIC' | 'ACCOUNT' | 'SERVICE' | 'CONFIDENTIAL' | 'SENSITIVE'
  | 'SECURITY' | 'FINANCIAL' | 'LEGAL' | 'SYSTEM'

export type EvidenceClass = 'HUMAN' | 'MACHINE' | 'OBSERVED_REALITY' | 'HYPOTHESIS' | 'SIMULATION' | 'VERIFIED'

export type EconomicState = 'FORECAST' | 'INTENT' | 'QUOTED' | 'AUTHORIZED' | 'PAID' | 'SETTLED' | 'RECONCILED' | 'ACCOUNTING_ELIGIBLE'

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

export interface ServiceContract {
  id: string
  name: string
  level: ProductLevel
  purpose: string
  inputs: string[]
  outputs: string[]
  requirements: string[]
  constraints: string[]
  availability: WorkState
  maturity: Maturity
  evaluation: string[]
  provenance: string[]
  limitations: string[]
  pricing?: { amount: number; currency: string; basis: string }
  authorization: string[]
  execution: string
  resultFormat: string
  failureBehavior: string[]
  settlementMethod?: string
}

export interface CompositionComponent {
  kind: 'CAPABILITY' | 'RESOURCE' | 'DATA' | 'COMPUTE' | 'SOFTWARE' | 'PROVIDER' | 'SPECIALIST' | 'AGENT' | 'WORKFLOW' | 'VERIFICATION' | 'GOVERNANCE' | 'ECONOMIC'
  reference: string
  required: boolean
}

export interface ServiceComposition {
  serviceId: string
  components: CompositionComponent[]
  orderedSteps: string[]
  verificationRequired: boolean
  governanceRequirements: string[]
  economicConditions: string[]
}

export interface WorkerIdentity {
  id: string
  kind: WorkerKind
  capabilityScope: string[]
  stationScope: Station[]
  authorizationScope: string[]
  availability: 'AVAILABLE' | 'BUSY' | 'PAUSED' | 'REVOKED' | 'UNAVAILABLE'
  concurrency: number
  provenance: string[]
}

export interface WorkTicket {
  id: string
  serviceId: string
  station: Station
  state: WorkState
  requesterId?: string
  workerId?: string
  authorizedScope: string[]
  inputs: string[]
  createdAt: string
  expiresAt?: string
}

export interface WorkReceipt {
  id: string
  ticketId: string
  workerId: string
  station: Station
  authorizationReference: string
  inputEvidence: string[]
  outputEvidence: string[]
  provenance: string[]
  timestamps: Record<string, string>
  integrityReference: string
  resultStatus: WorkState
  verificationState: 'UNVERIFIED' | 'VERIFIED' | 'DISPUTED'
}

export interface CaseRecord {
  id: string
  requesterId?: string
  request: string
  scope: string[]
  status: WorkState
  attachmentReferences: string[]
  messageReferences: string[]
  assignedHandling?: string
  timestamps: Record<string, string>
  requiredActions: string[]
  resolution?: string
  auditReference?: string
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
  state?: EconomicState
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

export interface EvidenceRecord {
  id: string
  class: EvidenceClass
  source: string
  observedAt: string
  recordedAt: string
  integrityReference?: string
  confidence?: number
}

export interface FounderChallenge {
  assumption: string
  countercase: string
  evidence: string[]
  consequence: string
  decisionRequired: string
}

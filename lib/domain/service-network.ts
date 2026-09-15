export type DemandKind = 'HUMAN_REQUEST' | 'MACHINE_REQUEST' | 'API_DEMAND' | 'INTERNAL_OPPORTUNITY'

export type CapabilityKind =
  | 'NATIVE'
  | 'API'
  | 'TOOL'
  | 'SERVICE'
  | 'AGENT'
  | 'WORKFLOW'
  | 'PRODUCT'
  | 'COMPOSITE'
  | 'RESOURCE'

export type SupplyKind = 'AURAXHERO' | 'PROVIDER' | 'PARTNER' | 'EXTERNAL_SERVICE' | 'MACHINE'

export type ServiceRequestStatus =
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
  | 'DECLINED'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'RECOVERING'

export interface Intent {
  id: string
  kind: DemandKind
  statement: string
  desiredOutcome: string
  constraints: Record<string, string | number | boolean>
  inputs: string[]
  createdAt: string
}

export interface CapabilityOffering {
  capabilityId: string
  version: string
  kind: CapabilityKind
  name: string
  purpose: string
  inputs: string[]
  outputs: string[]
  requirements: string[]
  limitations: string[]
  maturity: string
  availability: 'AVAILABLE' | 'ON_REQUEST' | 'UNAVAILABLE' | 'NOT_CONFIGURED'
  price?: { amount: number; currency: string; unit: string }
  execution?: { mode: 'API' | 'HUMAN' | 'AGENT' | 'HYBRID'; endpoint?: string }
}

export interface SupplyNode {
  id: string
  kind: SupplyKind
  name: string
  capabilities: string[]
  coverage?: string[]
  availability: 'AVAILABLE' | 'ON_REQUEST' | 'UNAVAILABLE' | 'UNKNOWN'
  provenance: string[]
}

export type CapabilityRelation =
  | 'REQUIRES'
  | 'PROVIDED_BY'
  | 'COMPOSES_WITH'
  | 'ALTERNATIVE_TO'
  | 'PRODUCES'
  | 'VERIFIED_BY'
  | 'DEPENDS_ON'
  | 'SERVES'

export interface CapabilityEdge {
  from: string
  relation: CapabilityRelation
  to: string
  evidence?: string[]
}

export interface ResourceRequirement {
  id: string
  type: 'DATA' | 'COMPUTE' | 'SOFTWARE' | 'HUMAN' | 'MACHINE' | 'MONEY' | 'TIME' | 'ACCESS' | 'LOCATION' | 'OTHER'
  description: string
  required: boolean
  constraints: Record<string, string | number | boolean>
}

export interface PlanStep {
  id: string
  capabilityId: string
  purpose: string
  requirements: string[]
  dependsOn: string[]
  reversible: boolean
}

export interface ExecutionPlan {
  id: string
  intentId: string
  steps: PlanStep[]
  resources: ResourceRequirement[]
  assumptions: string[]
  expectedOutputs: string[]
  estimatedCost?: { amount: number; currency: string }
}

export interface Quote {
  id: string
  requestId: string
  supplierId: string
  capabilityId: string
  amount: number
  currency: string
  terms: string[]
  expiresAt: string
  status: 'DRAFT' | 'ISSUED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
}

export interface ServiceRequest {
  id: string
  intent: Intent
  status: ServiceRequestStatus
  candidates: string[]
  selectedSupplierId?: string
  planId?: string
  quoteId?: string
  result?: { outputs: string[]; evidence: string[] }
  economicEventId?: string
  createdAt: string
  updatedAt: string
}

const transitions: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
  DISCOVERED: ['QUALIFIED', 'DECLINED', 'EXPIRED'],
  QUALIFIED: ['MATCHED', 'DECLINED', 'EXPIRED'],
  MATCHED: ['QUOTED', 'DECLINED', 'FAILED'],
  QUOTED: ['AUTHORIZED', 'DECLINED', 'EXPIRED'],
  AUTHORIZED: ['ACCEPTED', 'CANCELLED', 'FAILED'],
  ACCEPTED: ['SCHEDULED', 'EXECUTING', 'CANCELLED', 'FAILED'],
  SCHEDULED: ['EXECUTING', 'CANCELLED', 'FAILED'],
  EXECUTING: ['COMPLETED', 'FAILED', 'RECOVERING'],
  COMPLETED: ['VERIFIED', 'DISPUTED', 'RECOVERING'],
  VERIFIED: ['SETTLED', 'DISPUTED'],
  SETTLED: ['RECONCILED', 'DISPUTED'],
  RECONCILED: [],
  DECLINED: [],
  FAILED: ['RECOVERING'],
  EXPIRED: [],
  CANCELLED: [],
  DISPUTED: ['RECOVERING', 'SETTLED'],
  RECOVERING: ['MATCHED', 'QUOTED', 'AUTHORIZED', 'EXECUTING', 'FAILED', 'CANCELLED'],
}

export function canTransition(from: ServiceRequestStatus, to: ServiceRequestStatus): boolean {
  return transitions[from].includes(to)
}

export function transitionRequest(request: ServiceRequest, to: ServiceRequestStatus, now = new Date().toISOString()): ServiceRequest {
  if (!canTransition(request.status, to)) {
    throw new Error(`Invalid service request transition: ${request.status} -> ${to}`)
  }
  return { ...request, status: to, updatedAt: now }
}

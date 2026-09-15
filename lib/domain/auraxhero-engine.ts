import {
  CapabilityEdge,
  CapabilityOffering,
  ExecutionPlan,
  Intent,
  PlanStep,
  ResourceRequirement,
  ServiceRequest,
  SupplyNode,
} from './service-network'

export interface DiscoverySource {
  id: string
  search(intent: Intent): Promise<DiscoveryRecord[]>
}

export interface DiscoveryRecord {
  id: string
  sourceId: string
  offering?: CapabilityOffering
  supplier?: SupplyNode
  evidence: string[]
}

export interface APIProductDefinition {
  id: string
  name: string
  purpose: string
  version: string
  inputSchema: Record<string, unknown>
  outputSchema: Record<string, unknown>
  authentication: 'NONE' | 'API_KEY' | 'OAUTH' | 'MACHINE_AUTH'
  pricing?: { amount: number; currency: string; unit: string }
  settlement?: 'DIRECT' | 'X402' | 'INVOICE' | 'PARTNER'
  rateLimit?: number
  provenance: string[]
}

export interface RevenueOpportunity {
  id: string
  kind: 'API_PRODUCT' | 'SERVICE' | 'LICENSE' | 'REFERRAL' | 'SUBSCRIPTION' | 'COMMISSION' | 'MACHINE_COMMERCE'
  capabilityId: string
  source: 'NATIVE' | 'PROVIDER' | 'PARTNER' | 'DISCOVERED_DEMAND'
  description: string
  evidence: string[]
}

export interface EngineSnapshot {
  intent: Intent
  matches: DiscoveryRecord[]
  applicableEdges: CapabilityEdge[]
  plan?: ExecutionPlan
  opportunities: RevenueOpportunity[]
}

export interface AuraxheroEngine {
  discover(intent: Intent): Promise<DiscoveryRecord[]>
  match(intent: Intent, records: DiscoveryRecord[]): DiscoveryRecord[]
  compose(intent: Intent, records: DiscoveryRecord[], edges: CapabilityEdge[]): ExecutionPlan | undefined
  identifyRevenue(intent: Intent, records: DiscoveryRecord[]): RevenueOpportunity[]
}

export function createEngine(sources: DiscoverySource[], edges: CapabilityEdge[] = []): AuraxheroEngine {
  return {
    async discover(intent) {
      const results = await Promise.all(sources.map((source) => source.search(intent)))
      return results.flat()
    },

    match(intent, records) {
      const words = `${intent.statement} ${intent.desiredOutcome}`.toLowerCase().split(/\W+/).filter(Boolean)
      return records
        .map((record) => {
          const text = `${record.offering?.name ?? ''} ${record.offering?.purpose ?? ''} ${record.supplier?.name ?? ''}`.toLowerCase()
          const score = words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0)
          return { record, score }
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ record }) => record)
    },

    compose(intent, records, graphEdges) {
      const usable = records.filter((record) => record.offering?.availability === 'AVAILABLE' || record.offering?.availability === 'ON_REQUEST')
      if (usable.length === 0) return undefined

      const steps: PlanStep[] = usable.slice(0, 8).map((record, index) => ({
        id: `step-${index + 1}`,
        capabilityId: record.offering!.capabilityId,
        purpose: record.offering!.purpose,
        requirements: record.offering!.requirements,
        dependsOn: graphEdges.filter((edge) => edge.from === record.offering!.capabilityId && edge.relation === 'REQUIRES').map((edge) => edge.to),
        reversible: true,
      }))

      const resources: ResourceRequirement[] = steps.flatMap((step) => step.requirements.map((description, index) => ({
        id: `${step.id}-resource-${index + 1}`,
        type: 'OTHER' as const,
        description,
        required: true,
        constraints: {},
      })))

      return {
        id: `plan-${intent.id}`,
        intentId: intent.id,
        steps,
        resources,
        assumptions: ['Plan contains only discovered offerings with declared availability.'],
        expectedOutputs: usable.flatMap((record) => record.offering?.outputs ?? []),
      }
    },

    identifyRevenue(intent, records) {
      return records.flatMap((record) => {
        const offering = record.offering
        if (!offering) return []
        const kind = offering.kind === 'API' ? 'API_PRODUCT' : offering.kind === 'SERVICE' || offering.kind === 'COMPOSITE' ? 'SERVICE' : 'LICENSE'
        return [{
          id: `opportunity-${intent.id}-${offering.capabilityId}`,
          kind,
          capabilityId: offering.capabilityId,
          source: record.supplier?.kind === 'PROVIDER' ? 'PROVIDER' : record.supplier?.kind === 'PARTNER' ? 'PARTNER' : 'NATIVE',
          description: offering.purpose,
          evidence: record.evidence,
        }]
      })
    },
  }
}

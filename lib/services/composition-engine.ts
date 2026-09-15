import type { Capability } from '../types'
import type { ServiceDefinition } from './service-network'

/**
 * A composition plan is a proposed way to assemble real capabilities into a
 * buyer-facing service. Planning never implies that supply, authorization,
 * pricing, or execution exists; those are separate gates.
 */
export interface CompositionCandidate {
  capabilityIds: string[]
  missingCapabilityIds: string[]
  unresolvedInputs: string[]
  unresolvedOutputs: string[]
}

export interface CompositionPlan {
  serviceId: string
  serviceVersion: string
  candidate: CompositionCandidate
  feasible: boolean
  gates: {
    capabilityCoverage: boolean
    inputCoverage: boolean
    outputCoverage: boolean
    authorizationRequired: boolean
    supplyVerificationRequired: boolean
    pricingRequired: boolean
  }
}

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

/**
 * Deterministically composes published capability definitions against a
 * service template. It does not call external systems and does not invent
 * providers, prices, availability, or execution results.
 */
export function composeService(
  service: ServiceDefinition,
  capabilities: Capability[],
): CompositionPlan {
  const required = new Set(service.requiredCapabilities)
  const matched = capabilities.filter((capability) => required.has(capability.id))
  const matchedIds = new Set(matched.map((capability) => capability.id))
  const missingCapabilityIds = service.requiredCapabilities.filter((id) => !matchedIds.has(id))

  const inputCoverage = service.inputs.every((input) =>
    matched.some((capability) => capability.outputs.includes(input)),
  )
  const outputCoverage = service.outputs.every((output) =>
    matched.some((capability) => capability.outputs.includes(output)),
  )

  return {
    serviceId: service.id,
    serviceVersion: service.version,
    candidate: {
      capabilityIds: unique(matched.map((capability) => capability.id)),
      missingCapabilityIds: unique(missingCapabilityIds),
      unresolvedInputs: inputCoverage ? [] : [...service.inputs],
      unresolvedOutputs: outputCoverage ? [] : [...service.outputs],
    },
    feasible: missingCapabilityIds.length === 0 && inputCoverage && outputCoverage,
    gates: {
      capabilityCoverage: missingCapabilityIds.length === 0,
      inputCoverage,
      outputCoverage,
      authorizationRequired: true,
      supplyVerificationRequired: true,
      pricingRequired: true,
    },
  }
}

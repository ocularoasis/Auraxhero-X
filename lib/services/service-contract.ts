import type { Capability, ServiceContract } from '../types'

/**
 * Converts a published capability into the public contract shape used by
 * human and machine discovery. The registry remains the source of truth;
 * this adapter never invents availability, pricing, or execution access.
 */
export function capabilityToServiceContract(capability: Capability): ServiceContract {
  return {
    id: capability.id,
    name: capability.name,
    level: 'CAPABILITY',
    purpose: capability.purpose,
    inputs: capability.inputs,
    outputs: capability.outputs,
    requirements: [],
    constraints: [],
    availability: capability.maturity === 'PRODUCTION' || capability.maturity === 'MONITORED'
      ? 'DISCOVERABLE'
      : 'UNAVAILABLE',
    maturity: capability.maturity,
    evaluation: capability.tests,
    provenance: [capability.owner],
    limitations: capability.failureModes,
    authorization: [capability.securityScope],
    execution: 'Published execution method is defined by the capability owner.',
    resultFormat: 'Capability-specific structured result.',
    failureBehavior: capability.failureModes,
  }
}

export function validateServiceContract(contract: ServiceContract): string[] {
  const errors: string[] = []
  if (!contract.id.trim()) errors.push('id is required')
  if (!contract.name.trim()) errors.push('name is required')
  if (!contract.purpose.trim()) errors.push('purpose is required')
  if (contract.inputs.length === 0) errors.push('inputs must be declared')
  if (contract.outputs.length === 0) errors.push('outputs must be declared')
  if (contract.authorization.length === 0) errors.push('authorization requirements must be declared')
  if (contract.provenance.length === 0) errors.push('provenance must be declared')
  return errors
}

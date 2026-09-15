import { ComputeRequirement } from './types'

export type ComputeProvider = {
  id: string
  class: string
  capabilities: string[]
  available: boolean
}

export function describeComputeRouting(requirement: ComputeRequirement) {
  return {
    principle: 'least-resource adequate substrate',
    requirement,
    providers: [] as ComputeProvider[],
    paidResourceRequired: false,
  }
}

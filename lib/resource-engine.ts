import { ComputeRequirement } from './types'

export type ComputeOption = {
  id: string
  memoryGb: number
  latencyMs: number
  throughput: number
  cost: number
  security: string[]
}

export function chooseAdequateCompute(requirement: ComputeRequirement, options: ComputeOption[]) {
  const eligible = options.filter((option) =>
    (requirement.memoryGb === undefined || option.memoryGb >= requirement.memoryGb) &&
    (requirement.latencyMs === undefined || option.latencyMs <= requirement.latencyMs) &&
    (requirement.throughput === undefined || option.throughput >= requirement.throughput) &&
    (requirement.maxCost === undefined || option.cost <= requirement.maxCost) &&
    (requirement.security === undefined || requirement.security.every((x) => option.security.includes(x)))
  )
  return eligible.sort((a, b) => a.cost - b.cost)[0] ?? null
}

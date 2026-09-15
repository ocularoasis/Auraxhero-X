import { Capability } from './types'

// Bootstrap registry: intentionally empty of fabricated production capabilities.
const capabilities: Capability[] = []

export function listCapabilities(): Capability[] {
  return capabilities
}

export function registerCapability(capability: Capability): void {
  if (capabilities.some((item) => item.id === capability.id)) {
    throw new Error(`Capability already exists: ${capability.id}`)
  }
  capabilities.push(capability)
}

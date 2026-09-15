import { listCapabilities } from '../registry'
import type { Capability } from '../types'

export type CapabilitySummary = Pick<Capability, 'id' | 'name' | 'purpose' | 'maturity' | 'version'>

export function discoverPublicCapabilities(query = ''): CapabilitySummary[] {
  const needle = query.trim().toLowerCase()
  return listCapabilities()
    .filter((capability) => !needle || `${capability.name} ${capability.purpose}`.toLowerCase().includes(needle))
    .map(({ id, name, purpose, maturity, version }) => ({ id, name, purpose, maturity, version }))
}

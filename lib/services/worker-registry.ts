import type { AgentIdentity } from '../types'
import type { ServiceStationWorker, StationKind } from './service-network'

/**
 * Worker registration is intentionally descriptive. Registration does not
 * grant authority; identity, policy and capability scope remain authoritative.
 */
export interface WorkerRegistration extends ServiceStationWorker {
  identityId: AgentIdentity['id']
  capabilityIds: string[]
  concurrency: number
}

export function canAcceptTicket(
  worker: WorkerRegistration,
  station: StationKind,
  ticketType: string,
): boolean {
  if (worker.status !== 'AVAILABLE') return false
  if (worker.station !== station) return false
  if (worker.concurrency < 1) return false
  return worker.acceptedTicketTypes.length === 0 || worker.acceptedTicketTypes.includes(ticketType)
}

export function selectAvailableWorker(
  workers: WorkerRegistration[],
  station: StationKind,
  ticketType: string,
): WorkerRegistration | undefined {
  return workers
    .filter((worker) => canAcceptTicket(worker, station, ticketType))
    .sort((a, b) => a.id.localeCompare(b.id))[0]
}

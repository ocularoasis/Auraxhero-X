import { EconomicEvent } from './types'

export function settledNet(event: EconomicEvent): number | null {
  if (!event.settled) return null
  return event.gross - event.fees - event.refunds
}

export function revenueLedger(events: EconomicEvent[]) {
  return events
    .filter((event) => event.settled)
    .map((event) => ({
      id: event.id,
      source: event.source,
      currency: event.currency,
      net: settledNet(event)!,
      settlementReference: event.settlementReference,
      occurredAt: event.occurredAt,
    }))
}

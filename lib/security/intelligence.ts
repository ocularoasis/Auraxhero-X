import { randomUUID } from 'node:crypto'

export type SecurityOutcome = 'OBSERVED' | 'CONTAINED' | 'BLOCKED' | 'ESCALATED'
export type Confidence = 'CONFIRMED' | 'PROBABLE' | 'POSSIBLE' | 'UNKNOWN'

export type SecurityEvent = {
  id: string
  requestId: string
  observedAt: string
  actorId: string
  action: string
  outcome: SecurityOutcome
  indicators: string[]
  metadata?: Record<string, string>
}

export type SecurityIncident = {
  id: string
  firstObservedAt: string
  lastObservedAt: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  confidence: Confidence
  affectedSystem: string
  eventIds: string[]
  evidenceReferences: string[]
  containment: 'NONE' | 'PARTIAL' | 'COMPLETE'
  legalReview: 'NOT_REQUESTED' | 'PENDING' | 'REVIEWED'
}

export interface SecurityEventSink {
  record(event: SecurityEvent): Promise<void>
}

export class MemorySecurityEventSink implements SecurityEventSink {
  private readonly events: SecurityEvent[] = []

  async record(event: SecurityEvent) {
    this.events.push(event)
  }

  snapshot(): SecurityEvent[] {
    return [...this.events]
  }
}

export const securityEventSink: SecurityEventSink = new MemorySecurityEventSink()

export async function recordSecurityEvent(input: Omit<SecurityEvent, 'id'>): Promise<SecurityEvent> {
  const event = { ...input, id: randomUUID() }
  await securityEventSink.record(event)
  return event
}

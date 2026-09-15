import type { AuditEvent } from './types'

export interface AuditSink {
  write(event: AuditEvent): Promise<void>
}

export class MemoryAuditSink implements AuditSink {
  private readonly events: AuditEvent[] = []

  async write(event: AuditEvent) {
    this.events.push(event)
  }

  snapshot() {
    return [...this.events]
  }
}

export const auditSink: AuditSink = new MemoryAuditSink()

export async function audit(event: Omit<AuditEvent, 'id' | 'at'>) {
  await auditSink.write({ ...event, id: crypto.randomUUID(), at: new Date().toISOString() })
}

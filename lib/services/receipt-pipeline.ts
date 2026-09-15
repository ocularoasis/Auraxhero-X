import type {
  ServiceAccountingRecord,
  ServiceResult,
  ServiceTicket,
  WorkReceipt,
} from './service-network'

export interface ReceiptCertification {
  receiptId: string
  ticketId: string
  authenticatedWorker: boolean
  authorizedForStation: boolean
  inputEvidencePresent: boolean
  outputEvidencePresent: boolean
  provenancePresent: boolean
  integrityVerified: boolean
  certifiedAt: string
}

export interface AccountingFilterResult {
  eligible: boolean
  reason:
    | 'CERTIFIED'
    | 'MISSING_AUTHORIZATION'
    | 'MISSING_EVIDENCE'
    | 'MISSING_PROVENANCE'
    | 'INTEGRITY_FAILURE'
    | 'EXECUTION_NOT_COMPLETE'
    | 'SETTLEMENT_NOT_VERIFIED'
}

/**
 * Back-end swarm primitive: independent checks converge on a receipt before
 * the economic/accounting plane may consume it. A receipt is evidence of work,
 * not proof of revenue by itself.
 */
export function certifyReceipt(
  receipt: WorkReceipt,
  checks: Omit<ReceiptCertification, 'receiptId' | 'ticketId' | 'certifiedAt'>,
): ReceiptCertification {
  return {
    receiptId: receipt.id,
    ticketId: receipt.ticketId,
    ...checks,
    certifiedAt: new Date().toISOString(),
  }
}

export function filterForAccounting(
  ticket: ServiceTicket,
  result: ServiceResult,
  receipts: ReceiptCertification[],
  settlementVerified: boolean,
): AccountingFilterResult {
  if (result.status !== 'SUCCEEDED' && result.status !== 'PARTIAL') {
    return { eligible: false, reason: 'EXECUTION_NOT_COMPLETE' }
  }

  if (receipts.length === 0 || receipts.some((receipt) => receipt.ticketId !== ticket.id)) {
    return { eligible: false, reason: 'MISSING_EVIDENCE' }
  }

  if (receipts.some((receipt) => !receipt.authenticatedWorker || !receipt.authorizedForStation)) {
    return { eligible: false, reason: 'MISSING_AUTHORIZATION' }
  }

  if (receipts.some((receipt) => !receipt.inputEvidencePresent || !receipt.outputEvidencePresent)) {
    return { eligible: false, reason: 'MISSING_EVIDENCE' }
  }

  if (receipts.some((receipt) => !receipt.provenancePresent)) {
    return { eligible: false, reason: 'MISSING_PROVENANCE' }
  }

  if (receipts.some((receipt) => !receipt.integrityVerified)) {
    return { eligible: false, reason: 'INTEGRITY_FAILURE' }
  }

  if (!settlementVerified) {
    return { eligible: false, reason: 'SETTLEMENT_NOT_VERIFIED' }
  }

  return { eligible: true, reason: 'CERTIFIED' }
}

/**
 * Converts certified work evidence into the accounting-plane envelope. The
 * economic event remains optional until actual settlement evidence exists.
 */
export function buildAccountingRecord(
  ticket: ServiceTicket,
  result: ServiceResult,
  receipts: ReceiptCertification[],
  settlementVerified: boolean,
): ServiceAccountingRecord {
  const filter = filterForAccounting(ticket, result, receipts, settlementVerified)

  return {
    ticketId: ticket.id,
    receiptIds: receipts.map((receipt) => receipt.receiptId),
    certification: {
      evidenceComplete: receipts.length > 0 && receipts.every((receipt) => receipt.inputEvidencePresent && receipt.outputEvidencePresent),
      authorizationVerified: receipts.every((receipt) => receipt.authenticatedWorker && receipt.authorizedForStation),
      executionRecorded: result.receiptIds.length > 0,
      settlementVerified,
    },
    filteredForAccounting: filter.eligible,
  }
}

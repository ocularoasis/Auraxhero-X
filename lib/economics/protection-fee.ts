export const PROTECTION_PROCESSING_FEE_CENTS = 250
export const PROTECTION_PROCESSING_FEE_LABEL = 'Protection & Processing Fee'

export type BillableQuery = {
  queryId: string
  baseAmountCents: number
}

export function priceBillableQuery(query: BillableQuery) {
  if (!query.queryId.trim()) throw new Error('queryId is required')
  if (!Number.isInteger(query.baseAmountCents) || query.baseAmountCents < 0) {
    throw new Error('baseAmountCents must be a non-negative integer')
  }
  return {
    ...query,
    protectionProcessingFeeCents: PROTECTION_PROCESSING_FEE_CENTS,
    totalAmountCents: query.baseAmountCents + PROTECTION_PROCESSING_FEE_CENTS,
    currency: 'USD' as const,
    feeLabel: PROTECTION_PROCESSING_FEE_LABEL,
  }
}

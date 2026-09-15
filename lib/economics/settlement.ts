export type PaymentRail = 'X402' | 'CARD' | 'BANK' | 'WALLET' | 'OTHER'
export type SettlementState = 'PENDING' | 'SETTLED' | 'FAILED' | 'REFUNDED' | 'DISPUTED'

export type PaymentIntent = {
  id: string
  amount: number
  currency: string
  rail: PaymentRail
  purpose: string
  authorizedBy: string
}

export type SettlementRecord = {
  id: string
  paymentIntentId: string
  state: SettlementState
  gross: number
  fees: number
  net: number
  externalReference?: string
  settledAt?: string
}

export interface EconomicRail {
  readonly name: string
  createIntent(intent: PaymentIntent): Promise<{ reference: string }>
  verify(reference: string): Promise<{ verified: boolean }>
}

export interface SettlementReconciler {
  reconcile(record: SettlementRecord): Promise<SettlementRecord>
}

/**
 * x402 is a preferred machine-commerce rail where appropriate, not the
 * domain model itself. Other authorized rails can implement the same contract.
 */
export type EconomicAdapters = {
  x402?: EconomicRail
  alternate?: EconomicRail[]
  settlement?: SettlementReconciler
}

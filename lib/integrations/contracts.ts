export type AdapterStatus = 'CONFIGURED' | 'NOT_CONFIGURED' | 'DEGRADED'

export type AdapterResult<T> = {
  status: AdapterStatus
  value?: T
  provider?: string
  error?: string
}

export interface AuthenticationAdapter {
  readonly name: string
  resolve(request: Request): Promise<AdapterResult<{
    subject: string
    roles: string[]
    authenticated: boolean
  }>>
}

export interface ModelAdapter {
  readonly name: string
  generate(input: unknown): Promise<AdapterResult<unknown>>
}

export interface SearchAdapter {
  readonly name: string
  search(input: unknown): Promise<AdapterResult<unknown[]>>
}

export interface PaymentAdapter {
  readonly name: string
  createPayment(input: unknown): Promise<AdapterResult<{ reference: string }>>
  verifyPayment(input: unknown): Promise<AdapterResult<{ verified: boolean; reference?: string }>>
}

export interface SettlementAdapter {
  readonly name: string
  reconcile(input: unknown): Promise<AdapterResult<{ reconciled: boolean; reference?: string }>>
}

export interface NotificationAdapter {
  readonly name: string
  send(input: unknown): Promise<AdapterResult<{ accepted: boolean }>>
}

export interface StorageAdapter {
  readonly name: string
  put(input: unknown): Promise<AdapterResult<{ reference: string }>>
  get(input: unknown): Promise<AdapterResult<unknown>>
}

/**
 * Provider-neutral integration boundary.
 * Domain services depend on these contracts, never on a vendor SDK directly.
 */
export type AuraxIntegrationAdapters = {
  authentication?: AuthenticationAdapter
  model?: ModelAdapter
  search?: SearchAdapter
  payment?: PaymentAdapter
  settlement?: SettlementAdapter
  notification?: NotificationAdapter
  storage?: StorageAdapter
}

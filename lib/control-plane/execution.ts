import { audit } from './audit'
import { assertAuthorized } from './policy'
import type { AccessLevel, RequestContext } from './types'

export async function execute<T>(context: RequestContext, required: AccessLevel, action: string, operation: () => Promise<T>): Promise<T> {
  try {
    assertAuthorized(context, required)
    const result = await operation()
    await audit({ requestId: context.requestId, actorId: context.principal.id, action, outcome: 'ALLOWED' })
    return result
  } catch (error) {
    await audit({ requestId: context.requestId, actorId: context.principal.id, action, outcome: 'DENIED', metadata: { reason: error instanceof Error ? error.message : 'unknown' } })
    throw error
  }
}

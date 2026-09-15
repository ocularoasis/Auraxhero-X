import type { NextRequest } from 'next/server'
import { audit } from './audit'
import { authorize } from './policy'
import type { AccessLevel, Principal, RequestContext } from './types'

export type SecurityInspection = {
  requestId: string
  method: string
  path: string
  authenticated: boolean
  access: AccessLevel
  decision: 'ALLOW' | 'DENY'
  indicators: string[]
  telemetry: Record<string, string>
}

function requestId(request: Request): string {
  return request.headers.get('x-request-id')?.trim() || crypto.randomUUID()
}

function safeTelemetry(request: NextRequest): Record<string, string> {
  const telemetry: Record<string, string> = {
    method: request.method,
    path: request.nextUrl.pathname,
    userAgentPresent: request.headers.has('user-agent') ? 'true' : 'false',
  }
  if (request.headers.has('x-forwarded-for')) telemetry.networkObserved = 'true'
  return telemetry
}

export async function inspectRequest(
  request: NextRequest,
  context: RequestContext,
  required: AccessLevel,
): Promise<SecurityInspection> {
  const decision = authorize(context, required)
  const indicators: string[] = []

  if (!context.principal.authenticated && required !== 'PUBLIC') indicators.push('UNAUTHENTICATED')
  if (context.principal.id === 'anonymous' && required !== 'PUBLIC') indicators.push('ANONYMOUS_PRINCIPAL')

  const inspection: SecurityInspection = {
    requestId: requestId(request),
    method: request.method,
    path: request.nextUrl.pathname,
    authenticated: context.principal.authenticated,
    access: context.access,
    decision: decision.allowed ? 'ALLOW' : 'DENY',
    indicators,
    telemetry: safeTelemetry(request),
  }

  await audit({
    requestId: inspection.requestId,
    actorId: context.principal.id,
    action: `security.inspect:${request.nextUrl.pathname}`,
    outcome: decision.allowed ? 'ALLOWED' : 'DENIED',
    target: request.nextUrl.pathname,
    metadata: {
      method: request.method,
      access: context.access,
      authenticated: String(context.principal.authenticated),
      decision: inspection.decision,
      indicators: indicators.join(','),
      networkObserved: inspection.telemetry.networkObserved ?? 'false',
    },
  })

  return inspection
}

export function contextFromPrincipal(principal: Principal, purpose: string, request: Request): RequestContext {
  return {
    requestId: requestId(request),
    principal,
    access: principal.authenticated
      ? principal.roles.includes('FOUNDER') ? 'FOUNDER' : 'AUTHENTICATED'
      : 'PUBLIC',
    purpose,
  }
}

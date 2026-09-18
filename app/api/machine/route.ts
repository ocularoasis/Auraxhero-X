import { NextRequest, NextResponse } from 'next/server'
import { authenticationProvider } from '../../../lib/control-plane/auth'
import { contextFromPrincipal, inspectRequest } from '../../../lib/control-plane/security'
import { execute } from '../../../lib/control-plane/execution'
import { discoverPublicServiceContracts } from '../../../lib/services/capability-service'
import { economicStates, validateEconomicTicket } from '../../../lib/economics/lifecycle'

export const dynamic = 'force-dynamic'

/** Machine-readable discovery boundary; execution stays unavailable until a real provider is configured. */
export async function GET(request: NextRequest) {
  const principal = await authenticationProvider.resolve(request)
  const context = contextFromPrincipal(principal, 'machine-contract-discovery', request)
  const inspection = await inspectRequest(request, context, 'PUBLIC')
  const query = request.nextUrl.searchParams.get('q') ?? ''
  const contracts = await execute(context, 'PUBLIC', 'machine.contract.discover', async () =>
    discoverPublicServiceContracts(query),
  )

  return NextResponse.json({
    schema: 'deletemefast.machine.contracts',
    schemaVersion: '1',
    requestId: inspection.requestId,
    economicProtocol: {
      schema: 'deletemefast.economic-ticket',
      version: '1',
      lifecycle: economicStates,
      persistence: 'not_configured',
      paymentAcceptance: false,
    },
    execution: { discoverable: true, executable: false, reason: 'No production execution provider is configured.' },
    count: contracts.length,
    contracts,
  })
}

export async function POST(request: NextRequest) {
  const principal = await authenticationProvider.resolve(request)
  const context = contextFromPrincipal(principal, 'machine-execution-request', request)
  const inspection = await inspectRequest(request, context, 'AUTHENTICATED')

  let ticketValid = false
  if (inspection.decision !== 'DENY') {
    try {
      const body: unknown = await request.json()
      ticketValid = validateEconomicTicket(body).success
    } catch {
      ticketValid = false
    }
  }

  if (!ticketValid) {
    return NextResponse.json({
      schema: 'deletemefast.machine.execution',
      schemaVersion: '1',
      requestId: inspection.requestId,
      status: 'INVALID_REQUEST',
      error: 'A valid economic ticket is required before execution can be considered.',
      execution: 'No operation was performed and no payment was accepted.',
      authorization: inspection.decision,
    }, { status: inspection.decision === 'DENY' ? 403 : 400 })
  }

  return NextResponse.json({
    schema: 'deletemefast.machine.execution',
    schemaVersion: '1',
    requestId: inspection.requestId,
    status: 'UNAVAILABLE',
    error: 'Machine execution is not configured for production.',
    execution: 'No operation was performed and no payment was accepted.',
    authorization: inspection.decision,
    economicTicket: 'validated_only',
  }, { status: 503 })
}

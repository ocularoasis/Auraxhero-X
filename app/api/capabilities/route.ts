import { NextRequest, NextResponse } from 'next/server'
import { execute } from '../../../lib/control-plane/execution'
import { authenticationProvider } from '../../../lib/control-plane/auth'
import { requestContext } from '../../../lib/control-plane/identity'
import { discoverPublicServiceContracts } from '../../../lib/services/capability-service'

export async function GET(request: NextRequest) {
  const principal = await authenticationProvider.resolve(request)
  const query = request.nextUrl.searchParams.get('q') ?? ''
  const context = requestContext('public-capability-discovery', principal)
  const contracts = await execute(context, 'PUBLIC', 'capability.discover', async () => discoverPublicServiceContracts(query))

  return NextResponse.json({
    schemaVersion: '1',
    count: contracts.length,
    capabilities: contracts,
  })
}

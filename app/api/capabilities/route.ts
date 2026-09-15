import { NextRequest, NextResponse } from 'next/server'
import { execute } from '../../../lib/control-plane/execution'
import { authenticationProvider } from '../../../lib/control-plane/auth'
import { requestContext } from '../../../lib/control-plane/identity'
import { discoverPublicCapabilities } from '../../../lib/services/capability-service'

export async function GET(request: NextRequest) {
  const principal = await authenticationProvider.resolve(request)
  const query = request.nextUrl.searchParams.get('q') ?? ''
  const context = requestContext('public-capability-discovery', principal)
  const capabilities = await execute(context, 'PUBLIC', 'capability.discover', async () => discoverPublicCapabilities(query))
  return NextResponse.json({ count: capabilities.length, capabilities })
}

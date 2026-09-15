import { NextResponse } from 'next/server'
import { execute } from '../../../lib/control-plane/execution'
import { authenticationProvider } from '../../../lib/control-plane/auth'
import { requestContext } from '../../../lib/control-plane/identity'
import { discoverPublicCapabilities } from '../../../lib/services/capability-service'

export async function GET(request: Request) {
  const principal = await authenticationProvider.resolve(request)
  const context = requestContext('machine-capability-discovery', principal)
  const capabilities = await execute(context, 'PUBLIC', 'machine.discovery', async () => discoverPublicCapabilities())

  return NextResponse.json({
    name: 'Auraxhero X',
    protocol: 'auraxhero.machine-discovery.v0',
    status: 'bootstrap',
    capabilities,
    machineReadable: true,
    claims: { productionCapabilities: capabilities.length > 0 },
  })
}

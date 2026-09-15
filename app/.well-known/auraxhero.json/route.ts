import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    name: 'Auraxhero X',
    protocol: 'auraxhero.machine-discovery.v0',
    status: 'bootstrap',
    capabilities: [],
    machineReadable: true,
    claims: { productionCapabilities: false, revenue: false, autonomousAgents: false },
  })
}

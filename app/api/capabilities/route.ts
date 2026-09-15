import { NextResponse } from 'next/server'
import { listCapabilities } from '../../../lib/registry'

export async function GET() {
  return NextResponse.json({ count: listCapabilities().length, capabilities: listCapabilities() })
}

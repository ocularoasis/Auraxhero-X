import { NextResponse } from 'next/server'
import { healthSnapshot } from '../../../lib/observability'

export async function GET() {
  return NextResponse.json(healthSnapshot())
}

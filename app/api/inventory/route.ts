import { NextResponse } from 'next/server'

/** Inventory is not a public discovery endpoint. Return an explicit capability state, not a misleading 404. */
export async function GET() {
  return NextResponse.json({
    available: false,
    status: 'NOT_CONFIGURED',
    message: 'Inventory data is not configured for public access.',
  }, { status: 503 })
}

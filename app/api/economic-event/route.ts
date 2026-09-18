import { NextRequest, NextResponse } from 'next/server'

const PROTECTION_PROCESSING_FEE_CENTS = 250

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.queryId !== 'string' || body.queryId.trim().length === 0) {
    return NextResponse.json({ error: 'queryId is required' }, { status: 400 })
  }

  const baseAmountCents = Number.isInteger(body.baseAmountCents) && body.baseAmountCents >= 0
    ? body.baseAmountCents
    : 0

  return NextResponse.json({
    queryId: body.queryId,
    billable: true,
    currency: 'USD',
    baseAmountCents,
    protectionProcessingFeeCents: PROTECTION_PROCESSING_FEE_CENTS,
    totalAmountCents: baseAmountCents + PROTECTION_PROCESSING_FEE_CENTS,
    feeLabel: 'Protection & Processing Fee',
    status: 'pending',
  })
}

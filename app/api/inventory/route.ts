import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    productionClaims: false,
    states: ['LIVE','PARTIAL','BROKEN','DISCONNECTED','MOCK','PLACEHOLDER','DUPLICATED','STALE','UNSAFE','ORPHANED'],
    items: [],
  })
}

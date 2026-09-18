import { NextResponse } from 'next/server'
import { authenticationProvider } from '../../../lib/control-plane/auth'

const LOOKUP_KINDS = new Set(['IP', 'PHONE', 'EMAIL', 'USERNAME', 'DOMAIN', 'URL'])

export async function POST(request: Request) {
  const principal = await authenticationProvider.resolve(request)
  if (!principal.authenticated) {
    return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 })

  const input = body as Record<string, unknown>
  const kind = typeof input.kind === 'string' ? input.kind.toUpperCase() : ''
  const target = typeof input.target === 'string' ? input.target.trim() : ''
  if (!LOOKUP_KINDS.has(kind) || !target) return NextResponse.json({ error: 'INVALID_LOOKUP' }, { status: 400 })

  return NextResponse.json({ error: 'LOOKUP_BACKEND_NOT_CONFIGURED' }, { status: 503 })
}

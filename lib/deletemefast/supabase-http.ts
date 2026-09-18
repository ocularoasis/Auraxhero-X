import { cookies } from 'next/headers'

const accessCookie = 'dmf-access-token'
const refreshCookie = 'dmf-refresh-token'

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error('DeleteMeFast Supabase environment is not configured.')
  return { url: url.replace(/\/$/, ''), key }
}

export async function authHeaders(accessToken?: string) {
  const { key } = config()
  return {
    apikey: key,
    Authorization: `Bearer ${accessToken ?? ''}`,
    'Content-Type': 'application/json',
  }
}

export async function supabaseAuth(path: string, init: RequestInit = {}) {
  const { url, key } = config()
  return fetch(`${url}/auth/v1/${path}`, {
    ...init,
    headers: { apikey: key, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    cache: 'no-store',
  })
}

export async function supabaseRest(path: string, accessToken: string, init: RequestInit = {}) {
  const { url } = config()
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { ...(await authHeaders(accessToken)), ...(init.headers ?? {}) },
    cache: 'no-store',
  })
}

export async function supabaseRpc(name: string, accessToken: string, body: Record<string, unknown> = {}) {
  return supabaseRest(`rpc/${name}`, accessToken, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function currentUser() {
  const store = await cookies()
  const token = store.get(accessCookie)?.value
  if (!token) return null

  const response = await supabaseAuth('user', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) return null
  return { ...(await response.json()), accessToken: token }
}

export async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const store = await cookies()
  store.set(accessCookie, accessToken, {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60,
  })
  if (refreshToken) {
    store.set(refreshCookie, refreshToken, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
    })
  }
}

export async function clearAuthCookies() {
  const store = await cookies()
  store.delete(accessCookie)
  store.delete(refreshCookie)
}

export const dmfAccessCookie = accessCookie

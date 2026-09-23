import 'server-only'

const DELETE_ME_FAST_SUPABASE_URL = 'https://cmakyvrqgjsfgphfkkhr.supabase.co'

function serviceConfig() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('DeleteMeFast Supabase service role key is not configured.')
  return { url: DELETE_ME_FAST_SUPABASE_URL, key }
}

export async function supabaseServiceRest(
  path: string,
  init: RequestInit = {},
) {
  const { url, key } = serviceConfig()
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })
}

export async function supabaseServiceRpc(
  name: string,
  body: Record<string, unknown> = {},
) {
  return supabaseServiceRest(`rpc/${name}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

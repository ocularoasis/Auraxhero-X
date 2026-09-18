import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export type TrafficClass = 'BROWSER' | 'AUTOMATED' | 'UNKNOWN'

type LimitKind = 'browser' | 'automated' | 'unknown'

const hasRedis = Boolean(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN,
)

const redis = hasRedis ? Redis.fromEnv() : null

const cache = new Map<string, Ratelimit>()

function getLimiter(kind: LimitKind): Ratelimit | null {
  if (!redis) return null

  const existing = cache.get(kind)
  if (existing) return existing

  const requests =
    kind === 'automated' ? 10 :
    kind === 'unknown' ? 30 :
    60

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, '60 s'),
    analytics: false,
    prefix: `dmf:traffic:${kind}`,
    ephemeralCache: new Map(),
    timeout: 750,
  })

  cache.set(kind, limiter)
  return limiter
}

const AUTOMATION_PATTERN =
  /bot|crawler|spider|scrapy|headless|phantom|selenium|playwright|curl|wget|python-requests|httpclient/i

export function classifyTraffic(userAgent: string | null): TrafficClass {
  if (!userAgent) return 'UNKNOWN'
  if (AUTOMATION_PATTERN.test(userAgent)) return 'AUTOMATED'
  return 'BROWSER'
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'

  return headers.get('x-real-ip')?.trim() || 'unknown'
}

export async function checkTrafficLimit(
  trafficClass: TrafficClass,
  identifier: string,
) {
  const limiter = getLimiter(
    trafficClass === 'AUTOMATED'
      ? 'automated'
      : trafficClass === 'UNKNOWN'
        ? 'unknown'
        : 'browser',
  )

  if (!limiter) {
    return {
      configured: false,
      success: true,
      limit: 0,
      remaining: 0,
      reset: Date.now(),
    }
  }

  const result = await limiter.limit(identifier)

  return {
    configured: true,
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

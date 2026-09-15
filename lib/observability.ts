export type HealthStatus = 'UNKNOWN' | 'HEALTHY' | 'DEGRADED' | 'FAILED'

export function healthSnapshot() {
  return {
    status: 'UNKNOWN' as HealthStatus,
    checkedAt: new Date().toISOString(),
    productionClaims: false,
  }
}

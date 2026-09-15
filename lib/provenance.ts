export type ProvenanceCheck = {
  source: string
  permittedUse: boolean
  attributionRequired: boolean
  securityReviewed: boolean
  notes: string[]
}

export function canUseInProduction(check: ProvenanceCheck): boolean {
  return check.permittedUse && check.securityReviewed
}

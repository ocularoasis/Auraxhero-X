export type ArtifactDisposition = 'ACTIVE' | 'DEFERRED' | 'ARCHIVED' | 'REJECTED' | 'DEPRECATED' | 'HISTORICAL'

export type ArtifactRecord = {
  id: string
  name: string
  disposition: ArtifactDisposition
  source: string
  version: string
  evidence: string[]
  limitations: string[]
  dependencies: string[]
  reusablePrimitives: string[]
  possibleFutureUses: string[]
  reevaluationTriggers: string[]
  preservedAt: string
}

export function preserveArtifact(input: Omit<ArtifactRecord, 'preservedAt'>): ArtifactRecord {
  return { ...input, preservedAt: new Date().toISOString() }
}

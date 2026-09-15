import { EvaluationGate } from './types'

export function canPromote(gate: EvaluationGate): boolean {
  return Boolean(
    gate.evidence.length > 0 &&
    gate.reproducible &&
    gate.independentEvaluation &&
    gate.securityReviewed &&
    gate.provenanceReviewed &&
    gate.economicReviewed &&
    gate.governanceApproved
  )
}

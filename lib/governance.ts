import { FounderChallenge } from './types'

export function challengeFounderAssumption(challenge: FounderChallenge) {
  return challenge
}

export function requiresHumanAuthorization(action: string): boolean {
  return /money|settlement|production|security|governance|permission|credential|access/i.test(action)
}

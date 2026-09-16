import { z } from 'zod'

export const economicStates = [
  'intent',
  'discovery',
  'match',
  'terms',
  'authorization',
  'payment',
  'execution',
  'evidence',
  'settlement',
  'reputation',
  'next_opportunity',
] as const

export type EconomicState = (typeof economicStates)[number]

const transitions: Record<EconomicState, readonly EconomicState[]> = {
  intent: ['discovery'],
  discovery: ['match', 'intent'],
  match: ['terms', 'discovery'],
  terms: ['authorization', 'match'],
  authorization: ['payment', 'terms'],
  payment: ['execution', 'authorization'],
  execution: ['evidence', 'execution'],
  evidence: ['settlement', 'execution'],
  settlement: ['reputation'],
  reputation: ['next_opportunity'],
  next_opportunity: ['intent'],
}

export const economicTicketSchema = z.object({
  ticketId: z.string().min(1),
  principalId: z.string().min(1),
  authorizedActorId: z.string().min(1),
  capabilityId: z.string().min(1),
  intent: z.string().min(1).max(4000),
  state: z.enum(economicStates),
  terms: z.object({
    amountMinor: z.number().int().nonnegative(),
    currency: z.string().length(3),
    unit: z.string().min(1),
  }).strict(),
  authorityGrantId: z.string().min(1),
  authorityExpiresAt: z.string().datetime(),
  maxSpendMinor: z.number().int().nonnegative(),
  evidenceRequired: z.array(z.string().min(1)).default([]),
  settlementCondition: z.string().min(1),
}).strict()

export type EconomicTicket = z.infer<typeof economicTicketSchema>

export function canTransition(from: EconomicState, to: EconomicState): boolean {
  return transitions[from].includes(to)
}

export function transition(ticket: EconomicTicket, to: EconomicState): EconomicTicket {
  if (!canTransition(ticket.state, to)) {
    throw new Error(`Invalid economic transition: ${ticket.state} -> ${to}`)
  }
  return { ...ticket, state: to }
}

export function validateEconomicTicket(input: unknown) {
  return economicTicketSchema.safeParse(input)
}

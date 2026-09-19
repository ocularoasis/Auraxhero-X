export const PROTECTION_STATES = [
  'DISCOVERED',
  'AUTHORIZED',
  'REQUEST_PREPARED',
  'REQUEST_SENT',
  'ACKNOWLEDGED',
  'REMOVAL_CLAIMED',
  'VERIFIED',
  'MONITORING',
] as const;

export type ProtectionState = (typeof PROTECTION_STATES)[number];

const transitions: Record<ProtectionState, readonly ProtectionState[]> = {
  DISCOVERED: ['AUTHORIZED'],
  AUTHORIZED: ['REQUEST_PREPARED'],
  REQUEST_PREPARED: ['REQUEST_SENT'],
  REQUEST_SENT: ['ACKNOWLEDGED'],
  ACKNOWLEDGED: ['REMOVAL_CLAIMED'],
  REMOVAL_CLAIMED: ['VERIFIED'],
  VERIFIED: ['MONITORING'],
  MONITORING: [],
};

export type ProtectionTransitionContext = {
  caseId: string;
  actorId: string;
  authorizationId: string;
  now?: string;
};

export type ProtectionTransition = {
  caseId: string;
  actorId: string;
  authorizationId: string;
  from: ProtectionState;
  to: ProtectionState;
  occurredAt: string;
};

export function isProtectionState(value: string): value is ProtectionState {
  return (PROTECTION_STATES as readonly string[]).includes(value);
}

export function canTransitionProtection(from: ProtectionState, to: ProtectionState): boolean {
  return transitions[from].includes(to);
}

/**
 * Pure domain guard. Persistence belongs to the server/database boundary.
 * The browser must never be the authority for protection state.
 */
export function transitionProtection(
  from: ProtectionState,
  to: ProtectionState,
  context: ProtectionTransitionContext,
): ProtectionTransition {
  if (!context.caseId) throw new Error('Protection case ID is required.');
  if (!context.actorId) throw new Error('Protection actor ID is required.');
  if (!context.authorizationId) throw new Error('Protection authorization ID is required.');
  if (!canTransitionProtection(from, to)) {
    throw new Error(`Invalid DeleteMeFast protection transition: ${from} -> ${to}`);
  }

  return {
    caseId: context.caseId,
    actorId: context.actorId,
    authorizationId: context.authorizationId,
    from,
    to,
    occurredAt: context.now ?? new Date().toISOString(),
  };
}

export function createTicketId(now = new Date()): string {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '');
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()
    : Math.random().toString(36).slice(2, 14).toUpperCase();

  return `DMF-${date}-${id}`;
}

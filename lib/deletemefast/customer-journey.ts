export type QuestionnaireStage = 'SOFT' | 'CLIENT' | 'IDENTITY_VERIFICATION' | 'EVIDENCE';

export type IdentifierKind =
  | 'NAME'
  | 'ADDRESS'
  | 'PHONE'
  | 'EMAIL'
  | 'USERNAME'
  | 'ALIAS'
  | 'DOMAIN'
  | 'ORGANIZATION'
  | 'PLATFORM';

export type TicketState =
  | 'INTAKE'
  | 'AWAITING_IDENTITY_VERIFICATION'
  | 'EVIDENCE_READY'
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'SERVER_APPROVED'
  | 'IN_PROGRESS'
  | 'FOLLOW_UP'
  | 'COMPLETED';

export const questionnaireContract = {
  soft: {
    stage: 'SOFT' as const,
    purpose: 'Understand the reason for arrival before profile creation without asking for sensitive details.',
    questions: [
      'What brought you here today?',
      'What would you most like to be different after getting help?',
      'How urgent does this feel right now?',
      'Have you already tried anything to address it?',
    ],
  },
  client: {
    stage: 'CLIENT' as const,
    purpose: 'Understand the person, context, impact, and priorities before seating them at their private dashboard.',
    questions: [
      'What happened, in your own words?',
      'Who or what is affected?',
      'What are you most worried about right now?',
      'What outcome matters most to you?',
      'Are there safety, privacy, work, family, or reputation concerns we should account for?',
    ],
  },
  evidence: {
    stage: 'EVIDENCE' as const,
    purpose: 'Identify only the identifiers the customer authorizes us to search after identity verification.',
    identifierKinds: [
      'NAME',
      'ADDRESS',
      'PHONE',
      'EMAIL',
      'USERNAME',
      'ALIAS',
      'DOMAIN',
      'ORGANIZATION',
      'PLATFORM',
    ] as IdentifierKind[],
    questions: [
      'Which names have you used publicly or professionally?',
      'Which current or previous addresses should we check?',
      'Which phone numbers or email addresses should we check?',
      'Which usernames, aliases, domains, organizations, or platforms should we check?',
      'What should we prioritize: exposure, sale/sharing indicators, impersonation, account risk, or removal/opt-out work?',
    ],
  },
};

export function createTicketId(now = new Date()): string {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '');
  const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DMF-${date}-${entropy}`;
}

export function classifyTicketType(start: Date, end: Date): 'DISCOVERY' | 'RESPONSE' | 'MONITORING' {
  const durationHours = Math.max(0, end.getTime() - start.getTime()) / 3_600_000;
  if (durationHours <= 2) return 'DISCOVERY';
  if (durationHours <= 168) return 'RESPONSE';
  return 'MONITORING';
}

export function buildEvidenceTargets(selected: IdentifierKind[]): IdentifierKind[] {
  return [...new Set(selected)];
}

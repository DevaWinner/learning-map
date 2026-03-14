import type { ProjectFocus } from '@/domain/entities/project-focus';

const seededAt = '2026-03-14T00:00:00.000Z';

export const defaultProjectFocuses: ProjectFocus[] = [
  {
    id: 'simshield',
    name: 'SIMShield',
    tagline: 'Mobile money account-takeover and agent-fraud defense',
    desiredOutcome: 'Define an MVP fraud scoring workflow and ship a demo dashboard.',
    status: 'planning',
    notes:
      'Use this lane to capture ideas, data assumptions, and fraud graph milestones.',
    updatedAt: seededAt,
  },
  {
    id: 'cervicare',
    name: 'CerviCare',
    tagline: 'AI-assisted cervical screening and follow-up tracker',
    desiredOutcome:
      'Define the capture-to-follow-up workflow and outline an ethical pilot scope.',
    status: 'planning',
    notes:
      'Use this lane to track model validation, workflow design, and safety constraints.',
    updatedAt: seededAt,
  },
];


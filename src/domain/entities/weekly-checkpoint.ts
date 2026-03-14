export type DeliverableStatus =
  | 'not-started'
  | 'in-progress'
  | 'at-risk'
  | 'done';

export interface WeeklyCheckpoint {
  weekNumber: number;
  deliverableStatus: DeliverableStatus;
  blockers: string;
  nextAction: string;
  summaryNote: string;
  updatedAt: string;
}

export const deliverableStatusLabels: Record<DeliverableStatus, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'at-risk': 'At Risk',
  done: 'Done',
};


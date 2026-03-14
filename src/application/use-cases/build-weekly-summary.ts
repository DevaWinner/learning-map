import type { StudySession } from '@/domain/entities/study-session';
import type { StudyWeek } from '@/domain/entities/study-week';
import type { WeeklyCheckpoint } from '@/domain/entities/weekly-checkpoint';
import type { WeeklySummary } from '@/domain/entities/weekly-summary';

const FALLBACK_CHECKPOINT: WeeklyCheckpoint = {
  weekNumber: 0,
  deliverableStatus: 'not-started',
  blockers: '',
  nextAction: '',
  summaryNote: '',
  updatedAt: '',
};

export function buildWeeklySummary(
  week: StudyWeek,
  sessions: StudySession[],
  checkpoint: WeeklyCheckpoint | null,
  today: Date,
): WeeklySummary {
  const actualHours = sessions.reduce((total, session) => total + session.hours, 0);
  const remainingHours = Math.max(0, week.plannedHours - actualHours);
  const completionRate =
    week.plannedHours === 0 ? 0 : Math.min(actualHours / week.plannedHours, 1);
  const uniqueTasks = [...new Set(sessions.map((session) => session.task).filter(Boolean))];
  const outcomes = [...new Set(sessions.map((session) => session.outcome).filter(Boolean))];
  const resolvedCheckpoint = checkpoint ?? {
    ...FALLBACK_CHECKPOINT,
    weekNumber: week.weekNumber,
  };

  const dayOfWeek = today.getDay();
  let alert: string | null = null;

  if (dayOfWeek >= 3 && actualHours < 6) {
    alert = 'Mid-week pace is low. Aim for a recovery session today.';
  } else if (dayOfWeek >= 5 && resolvedCheckpoint.deliverableStatus !== 'done') {
    alert = 'Weekend is approaching and the deliverable is still open.';
  } else if (
    resolvedCheckpoint.deliverableStatus === 'at-risk' ||
    remainingHours > 8
  ) {
    alert = 'This week is at risk. Reduce scope or schedule a catch-up block.';
  }

  return {
    week,
    sessions,
    checkpoint: resolvedCheckpoint,
    actualHours,
    remainingHours,
    completionRate,
    uniqueTasks,
    outcomes,
    alert,
  };
}


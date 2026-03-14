import type { StudySession } from '@/domain/entities/study-session';
import type { StudyWeek } from '@/domain/entities/study-week';
import type { WeeklyCheckpoint } from '@/domain/entities/weekly-checkpoint';

export interface WeeklySummary {
  week: StudyWeek;
  sessions: StudySession[];
  checkpoint: WeeklyCheckpoint;
  actualHours: number;
  remainingHours: number;
  completionRate: number;
  uniqueTasks: string[];
  outcomes: string[];
  alert: string | null;
}


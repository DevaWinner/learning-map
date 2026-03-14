import type { StudyWeek } from '@/domain/entities/study-week';

export interface ScheduleRepository {
  getAllWeeks(): Promise<StudyWeek[]>;
  getWeekByNumber(weekNumber: number): Promise<StudyWeek | null>;
}


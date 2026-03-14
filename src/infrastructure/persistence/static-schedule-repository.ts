import type { ScheduleRepository } from '@/application/ports/schedule-repository';
import type { StudyWeek } from '@/domain/entities/study-week';
import roadmapData from '@/infrastructure/seeds/roadmap-data.generated.json';

export class StaticScheduleRepository implements ScheduleRepository {
  private readonly weeks: StudyWeek[] = roadmapData as StudyWeek[];

  async getAllWeeks(): Promise<StudyWeek[]> {
    return this.weeks;
  }

  async getWeekByNumber(weekNumber: number): Promise<StudyWeek | null> {
    return this.weeks.find((week) => week.weekNumber === weekNumber) ?? null;
  }
}


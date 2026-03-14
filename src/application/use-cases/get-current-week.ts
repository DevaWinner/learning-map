import type { ScheduleRepository } from '@/application/ports/schedule-repository';
import type { StudyWeek } from '@/domain/entities/study-week';
import { getWeekNumberForDate } from '@/infrastructure/services/study-calendar';

export async function getCurrentWeek(
  scheduleRepository: ScheduleRepository,
  today: Date,
): Promise<StudyWeek | null> {
  const weeks = await scheduleRepository.getAllWeeks();
  const currentWeekNumber = getWeekNumberForDate(today, weeks.length);
  return scheduleRepository.getWeekByNumber(currentWeekNumber);
}


import type { ProjectFocusRepository } from '@/application/ports/project-focus-repository';
import type { ScheduleRepository } from '@/application/ports/schedule-repository';
import type { StudySessionRepository } from '@/application/ports/study-session-repository';
import type { WeeklyCheckpointRepository } from '@/application/ports/weekly-checkpoint-repository';
import { LocalStorageProjectFocusRepository } from '@/infrastructure/persistence/local-storage-project-focus-repository';
import { LocalStorageStudySessionRepository } from '@/infrastructure/persistence/local-storage-study-session-repository';
import { LocalStorageWeeklyCheckpointRepository } from '@/infrastructure/persistence/local-storage-weekly-checkpoint-repository';
import { StaticScheduleRepository } from '@/infrastructure/persistence/static-schedule-repository';

export interface AppContext {
  scheduleRepository: ScheduleRepository;
  studySessionRepository: StudySessionRepository;
  weeklyCheckpointRepository: WeeklyCheckpointRepository;
  projectFocusRepository: ProjectFocusRepository;
}

export function createAppContext(): AppContext {
  return {
    scheduleRepository: new StaticScheduleRepository(),
    studySessionRepository: new LocalStorageStudySessionRepository(),
    weeklyCheckpointRepository: new LocalStorageWeeklyCheckpointRepository(),
    projectFocusRepository: new LocalStorageProjectFocusRepository(),
  };
}


import type { ProjectFocusRepository } from "@/application/ports/project-focus-repository";
import type { ScheduleRepository } from "@/application/ports/schedule-repository";
import type { StudySessionRepository } from "@/application/ports/study-session-repository";
import type { WeeklyCheckpointRepository } from "@/application/ports/weekly-checkpoint-repository";
import { DexieProjectFocusRepository } from "@/infrastructure/persistence/dexie-project-focus-repository";
import { DexieStudySessionRepository } from "@/infrastructure/persistence/dexie-study-session-repository";
import { DexieWeeklyCheckpointRepository } from "@/infrastructure/persistence/dexie-weekly-checkpoint-repository";
import { StaticScheduleRepository } from "@/infrastructure/persistence/static-schedule-repository";
import { syncManager } from "@/infrastructure/sync/sync-manager";

export interface AppContext {
  scheduleRepository: ScheduleRepository;
  studySessionRepository: StudySessionRepository;
  weeklyCheckpointRepository: WeeklyCheckpointRepository;
  projectFocusRepository: ProjectFocusRepository;
}

export function createAppContext(): AppContext {
  const apiUrl = import.meta.env.VITE_SYNC_API_URL || "/api/sync";
  const authToken = import.meta.env.VITE_SYNC_AUTH_TOKEN || "";
  syncManager.init(apiUrl, authToken);

  return {
    scheduleRepository: new StaticScheduleRepository(),
    studySessionRepository: new DexieStudySessionRepository(),
    weeklyCheckpointRepository: new DexieWeeklyCheckpointRepository(),
    projectFocusRepository: new DexieProjectFocusRepository(),
  };
}

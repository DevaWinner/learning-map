import type { WeeklyCheckpoint } from '@/domain/entities/weekly-checkpoint';

export interface WeeklyCheckpointRepository {
  getByWeek(weekNumber: number): Promise<WeeklyCheckpoint | null>;
  save(checkpoint: WeeklyCheckpoint): Promise<void>;
}


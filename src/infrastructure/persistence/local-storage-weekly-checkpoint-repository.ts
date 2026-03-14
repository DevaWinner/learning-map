import type { WeeklyCheckpointRepository } from '@/application/ports/weekly-checkpoint-repository';
import type { WeeklyCheckpoint } from '@/domain/entities/weekly-checkpoint';
import {
  readCollection,
  writeCollection,
} from '@/infrastructure/persistence/browser-storage';

const STORAGE_KEY = 'roadmap-os.weekly-checkpoints';

export class LocalStorageWeeklyCheckpointRepository
  implements WeeklyCheckpointRepository
{
  async getByWeek(weekNumber: number): Promise<WeeklyCheckpoint | null> {
    const checkpoints = readCollection<WeeklyCheckpoint[]>(STORAGE_KEY, []);
    return checkpoints.find((checkpoint) => checkpoint.weekNumber === weekNumber) ?? null;
  }

  async save(checkpoint: WeeklyCheckpoint): Promise<void> {
    const checkpoints = readCollection<WeeklyCheckpoint[]>(STORAGE_KEY, []);
    const nextCheckpoints = [
      ...checkpoints.filter((item) => item.weekNumber !== checkpoint.weekNumber),
      checkpoint,
    ];
    writeCollection(STORAGE_KEY, nextCheckpoints);
  }
}


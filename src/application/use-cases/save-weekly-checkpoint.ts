import type { WeeklyCheckpointRepository } from '@/application/ports/weekly-checkpoint-repository';
import type {
  DeliverableStatus,
  WeeklyCheckpoint,
} from '@/domain/entities/weekly-checkpoint';

export interface SaveWeeklyCheckpointInput {
  weekNumber: number;
  deliverableStatus: DeliverableStatus;
  blockers: string;
  nextAction: string;
  summaryNote: string;
}

export async function saveWeeklyCheckpoint(
  weeklyCheckpointRepository: WeeklyCheckpointRepository,
  input: SaveWeeklyCheckpointInput,
): Promise<WeeklyCheckpoint> {
  const checkpoint: WeeklyCheckpoint = {
    weekNumber: input.weekNumber,
    deliverableStatus: input.deliverableStatus,
    blockers: input.blockers.trim(),
    nextAction: input.nextAction.trim(),
    summaryNote: input.summaryNote.trim(),
    updatedAt: new Date().toISOString(),
  };

  await weeklyCheckpointRepository.save(checkpoint);
  return checkpoint;
}


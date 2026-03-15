import type { WeeklyCheckpointRepository } from "@/application/ports/weekly-checkpoint-repository";
import type { WeeklyCheckpoint } from "@/domain/entities/weekly-checkpoint";
import { db } from "@/infrastructure/db/dexie-db";

export class DexieWeeklyCheckpointRepository implements WeeklyCheckpointRepository {
  async getByWeek(weekNumber: number): Promise<WeeklyCheckpoint | null> {
    const checkpoint = await db.weeklyCheckpoints.get(weekNumber);
    return checkpoint ?? null;
  }

  async save(checkpoint: WeeklyCheckpoint): Promise<void> {
    const timestamp = Date.now();
    await db.transaction("rw", db.weeklyCheckpoints, db.syncQueue, async () => {
      // Update local state
      const updated = {
        ...checkpoint,
        updatedAt: new Date(timestamp).toISOString(),
      };
      await db.weeklyCheckpoints.put(updated);

      // Queue for remote sync
      await db.syncQueue.put({
        id: crypto.randomUUID(),
        tableName: "weekly_checkpoints",
        recordId: checkpoint.weekNumber.toString(),
        action: "UPSERT",
        payload: updated,
        timestamp,
      });
    });
  }
}

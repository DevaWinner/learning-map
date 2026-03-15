import type { StudySessionRepository } from "@/application/ports/study-session-repository";
import type { StudySession } from "@/domain/entities/study-session";
import { db } from "@/infrastructure/db/dexie-db";

export class DexieStudySessionRepository implements StudySessionRepository {
  async listAll(): Promise<StudySession[]> {
    return await db.studySessions.toArray();
  }

  async listByWeek(weekNumber: number): Promise<StudySession[]> {
    return await db.studySessions
      .where("weekNumber")
      .equals(weekNumber)
      .toArray();
  }

  async save(session: StudySession): Promise<void> {
    const timestamp = Date.now();
    await db.transaction("rw", db.studySessions, db.syncQueue, async () => {
      // 1. Update local UI state
      await db.studySessions.put({
        ...session,
        updatedAt: new Date(timestamp).toISOString(),
      } as any);

      // 2. Queue for remote sync
      await db.syncQueue.put({
        id: crypto.randomUUID(),
        tableName: "study_sessions",
        recordId: session.id,
        action: "UPSERT",
        payload: session,
        timestamp,
      });
    });
  }

  async remove(sessionId: string): Promise<void> {
    const timestamp = Date.now();
    await db.transaction("rw", db.studySessions, db.syncQueue, async () => {
      // 1. Update local UI state
      await db.studySessions.delete(sessionId);

      // 2. Queue for remote sync
      await db.syncQueue.put({
        id: crypto.randomUUID(),
        tableName: "study_sessions",
        recordId: sessionId,
        action: "DELETE",
        timestamp,
      });
    });
  }
}

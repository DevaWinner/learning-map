import type { ProjectFocusRepository } from "@/application/ports/project-focus-repository";
import type { ProjectFocus } from "@/domain/entities/project-focus";
import { db } from "@/infrastructure/db/dexie-db";

export class DexieProjectFocusRepository implements ProjectFocusRepository {
  async list(): Promise<ProjectFocus[]> {
    return await db.projectFocuses.toArray();
  }

  async save(project: ProjectFocus): Promise<void> {
    const timestamp = Date.now();
    await db.transaction("rw", db.projectFocuses, db.syncQueue, async () => {
      // Update local state
      const updated = {
        ...project,
        updatedAt: new Date(timestamp).toISOString(),
      };
      await db.projectFocuses.put(updated);

      // Queue for remote sync
      await db.syncQueue.put({
        id: crypto.randomUUID(),
        tableName: "project_focuses",
        recordId: project.id,
        action: "UPSERT",
        payload: updated,
        timestamp,
      });
    });
  }

  async remove(projectId: string): Promise<void> {
    const timestamp = Date.now();
    await db.transaction("rw", db.projectFocuses, db.syncQueue, async () => {
      // Update local state
      await db.projectFocuses.delete(projectId);

      // Queue for remote sync
      await db.syncQueue.put({
        id: crypto.randomUUID(),
        tableName: "project_focuses",
        recordId: projectId,
        action: "DELETE",
        timestamp,
      });
    });
  }
}

import type { ProjectFocusRepository } from "@/application/ports/project-focus-repository";
import type { ProjectFocus } from "@/domain/entities/project-focus";
import { db } from "@/infrastructure/db/dexie-db";
import { defaultProjectFocuses } from "@/infrastructure/seeds/default-project-focuses";

export class DexieProjectFocusRepository implements ProjectFocusRepository {
  private initialized = false;

  async list(): Promise<ProjectFocus[]> {
    if (!this.initialized) {
      const count = await db.projectFocuses.count();
      if (count === 0 && !localStorage.getItem("roadmap-os.seeded-projects")) {
        const timestamp = Date.now();
        await db.transaction(
          "rw",
          db.projectFocuses,
          db.syncQueue,
          async () => {
            for (const p of defaultProjectFocuses) {
              const project = {
                ...p,
                updatedAt: new Date(timestamp).toISOString(),
              };
              await db.projectFocuses.put(project);
              await db.syncQueue.put({
                id: crypto.randomUUID(),
                tableName: "project_focuses",
                recordId: project.id,
                action: "UPSERT",
                payload: project,
                timestamp,
              });
            }
          },
        );
        localStorage.setItem("roadmap-os.seeded-projects", "true");
      }
      this.initialized = true;
    }

    const projects = await db.projectFocuses.toArray();
    return projects.sort((left, right) => left.name.localeCompare(right.name));
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

import { db } from "@/infrastructure/db/dexie-db";
import type {
  StudySessionRow,
  WeeklyCheckpointRow,
  ProjectFocusRow,
} from "@/infrastructure/db/database.types";

interface SyncResponse {
  studySessions?: StudySessionRow[];
  weeklyCheckpoints?: WeeklyCheckpointRow[];
  projectFocuses?: ProjectFocusRow[];
}

// We expect these to be injected during app initialization or via Vite env vars
export class SyncManager {
  private apiUrl: string = "";
  private authToken: string = "";
  private isSyncing = false;
  private onlineListener: () => void;

  constructor() {
    this.onlineListener = () => {
      console.log("Network is back online. Attempting to sync...");
      void this.sync();
    };
  }

  /**
   * Initialize API connection settings and start listening for connectivity changes
   */
  init(apiUrl: string, authToken: string) {
    this.apiUrl = apiUrl;
    this.authToken = authToken;
    window.addEventListener("online", this.onlineListener);

    // Attempt an initial sync if we are online right now
    if (navigator.onLine) {
      void this.sync();
    }
  }

  destroy() {
    window.removeEventListener("online", this.onlineListener);
  }

  private get authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  /**
   * Runs the sync algorithm
   */
  async sync() {
    if (!this.apiUrl || this.isSyncing || !navigator.onLine) return;

    this.isSyncing = true;
    try {
      await this.pushLocalChanges();
      await this.pullRemoteChanges();
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * 1. Push all mutations in the local Dexie syncQueue to the Vercel API.
   */
  private async pushLocalChanges() {
    // Get all pending mutations sorted by timestamp oldest first
    const mutations = await db.syncQueue.orderBy("timestamp").toArray();

    if (mutations.length === 0) return;
    console.log(`Pushing ${mutations.length} local changes to NeonDB...`);

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: this.authHeaders,
        body: JSON.stringify({ mutations }),
      });

      if (!response.ok) {
        throw new Error(`Failed to push changes: ${response.statusText}`);
      }

      // If successful, clear the synchronized elements from the local sync queue
      // Since we batched them all, we can delete them all
      const ids = mutations.map((m) => m.id);
      await db.syncQueue.bulkDelete(ids);

      console.log(`Successfully pushed ${mutations.length} changes.`);
    } catch (err) {
      console.error(`Error pushing mutations:`, err);
    }
  }

  /**
   * 2. Pull remote changes. For a true multi-device sync, we'd pull by `updated_at > last_sync_at`.
   * For Phase V0, we pull the entire state and merge it locally.
   */
  private async pullRemoteChanges() {
    console.log("Pulling remote changes from NeonDB...");

    try {
      const response = await fetch(this.apiUrl, {
        method: "GET",
        headers: this.authHeaders,
      });

      if (!response.ok) {
        throw new Error(`Failed to pull changes: ${response.statusText}`);
      }

      const data: SyncResponse = await response.json();

      await db.transaction(
        "rw",
        db.studySessions,
        db.weeklyCheckpoints,
        db.projectFocuses,
        db.syncQueue,
        async () => {
          // --- Study Sessions ---
          if (data.studySessions) {
            const localSessions = await db.studySessions.toArray();
            const serverIds = new Set(data.studySessions.map((s) => s.id));

            // Remove locally deleted records (if no pending sync queue items exist)
            for (const local of localSessions) {
              if (!serverIds.has(local.id)) {
                const isPending = await db.syncQueue
                  .where("recordId")
                  .equals(local.id)
                  .count();
                if (isPending === 0) await db.studySessions.delete(local.id);
              }
            }

            // Upsert server records
            for (const s of data.studySessions) {
              const isPending = await db.syncQueue
                .where("recordId")
                .equals(s.id)
                .count();
              if (isPending === 0) {
                await db.studySessions.put({
                  id: s.id,
                  weekNumber: s.week_number,
                  date: s.date,
                  hours: Number(s.hours),
                  focusArea: s.focus_area as any,
                  task: s.task,
                  notes: s.notes,
                  outcome: s.outcome,
                  createdAt: s.created_at,
                  updatedAt: s.updated_at,
                });
              }
            }
          }

          // --- Checkpoints ---
          if (data.weeklyCheckpoints) {
            for (const c of data.weeklyCheckpoints) {
              const isPending = await db.syncQueue
                .where("recordId")
                .equals(c.week_number.toString())
                .count();
              if (isPending === 0) {
                await db.weeklyCheckpoints.put({
                  weekNumber: c.week_number,
                  deliverableStatus: c.deliverable_status as any,
                  blockers: c.blockers,
                  nextAction: c.next_action,
                  summaryNote: c.summary_note,
                  updatedAt: c.updated_at,
                });
              }
            }
          }

          // --- Projects ---
          if (data.projectFocuses) {
            const localProjects = await db.projectFocuses.toArray();
            const serverIds = new Set(data.projectFocuses.map((p) => p.id));

            for (const local of localProjects) {
              if (!serverIds.has(local.id)) {
                const isPending = await db.syncQueue
                  .where("recordId")
                  .equals(local.id)
                  .count();
                if (isPending === 0) await db.projectFocuses.delete(local.id);
              }
            }

            for (const p of data.projectFocuses) {
              const isPending = await db.syncQueue
                .where("recordId")
                .equals(p.id)
                .count();
              if (isPending === 0) {
                await db.projectFocuses.put({
                  id: p.id,
                  name: p.name,
                  tagline: p.tagline,
                  desiredOutcome: p.desired_outcome,
                  status: p.status as any,
                  notes: p.notes,
                  updatedAt: p.updated_at,
                });
              }
            }
          }
        },
      );
    } catch (err) {
      console.error("Error pulling remote changes:", err);
    }
  }
}

export const syncManager = new SyncManager();

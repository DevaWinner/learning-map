import Dexie, { type Table } from "dexie";
import type { ProjectFocus } from "@/domain/entities/project-focus";
import type { StudySession } from "@/domain/entities/study-session";
import type { WeeklyCheckpoint } from "@/domain/entities/weekly-checkpoint";

export interface SyncMutation {
  id: string; // generated uuid for the mutation itself
  tableName: "study_sessions" | "weekly_checkpoints" | "project_focuses";
  recordId: string; // The ID of the record being changed (weekNumber for checkpoints)
  action: "UPSERT" | "DELETE";
  payload?: any; // The full record (omitted if DELETE)
  timestamp: number;
}

export class RoadmapDatabase extends Dexie {
  studySessions!: Table<StudySession, string>;
  weeklyCheckpoints!: Table<WeeklyCheckpoint, number>;
  projectFocuses!: Table<ProjectFocus, string>;
  syncQueue!: Table<SyncMutation, string>;

  constructor() {
    super("RoadmapDB");

    // We only index properties we need to query by in the local storage layer:
    // study_sessions: query by weekNumber
    // checkpoints: primary key is weekNumber
    // projects: primary key is id
    // syncQueue: primary key is id, we process in timestamp order
    this.version(1).stores({
      studySessions: "id, weekNumber",
      weeklyCheckpoints: "weekNumber",
      projectFocuses: "id",
      syncQueue: "id, timestamp",
    });

    // Version 2 adds an index on recordId for the syncQueue since SyncManager queries by it
    this.version(2).stores({
      studySessions: "id, weekNumber",
      weeklyCheckpoints: "weekNumber",
      projectFocuses: "id",
      syncQueue: "id, timestamp, recordId",
    });
  }
}

export const db = new RoadmapDatabase();

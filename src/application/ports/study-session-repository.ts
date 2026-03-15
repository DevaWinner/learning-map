import type { StudySession } from "@/domain/entities/study-session";

export interface StudySessionRepository {
  listAll(): Promise<StudySession[]>;
  listByWeek(weekNumber: number): Promise<StudySession[]>;
  save(session: StudySession): Promise<void>;
  remove(sessionId: string): Promise<void>;
}

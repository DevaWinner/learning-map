import type { StudySession } from '@/domain/entities/study-session';

export interface StudySessionRepository {
  listByWeek(weekNumber: number): Promise<StudySession[]>;
  save(session: StudySession): Promise<void>;
  remove(sessionId: string): Promise<void>;
}


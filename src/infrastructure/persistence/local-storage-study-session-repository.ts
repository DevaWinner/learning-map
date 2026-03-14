import type { StudySessionRepository } from '@/application/ports/study-session-repository';
import type { StudySession } from '@/domain/entities/study-session';
import {
  readCollection,
  writeCollection,
} from '@/infrastructure/persistence/browser-storage';

const STORAGE_KEY = 'roadmap-os.study-sessions';

export class LocalStorageStudySessionRepository
  implements StudySessionRepository
{
  async listByWeek(weekNumber: number): Promise<StudySession[]> {
    const sessions = readCollection<StudySession[]>(STORAGE_KEY, []);
    return sessions
      .filter((session) => session.weekNumber === weekNumber)
      .sort((left, right) => right.date.localeCompare(left.date));
  }

  async save(session: StudySession): Promise<void> {
    const sessions = readCollection<StudySession[]>(STORAGE_KEY, []);
    const nextSessions = [...sessions.filter((item) => item.id !== session.id), session];
    writeCollection(STORAGE_KEY, nextSessions);
  }

  async remove(sessionId: string): Promise<void> {
    const sessions = readCollection<StudySession[]>(STORAGE_KEY, []);
    writeCollection(
      STORAGE_KEY,
      sessions.filter((session) => session.id !== sessionId),
    );
  }
}


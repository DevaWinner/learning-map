import type { StudySessionRepository } from "@/application/ports/study-session-repository";
import type { FocusArea, StudySession } from "@/domain/entities/study-session";

export interface LogStudySessionInput {
  weekNumber: number;
  date: string;
  hours: number;
  focusArea: FocusArea;
  task: string;
  notes: string;
  outcome: string;
}

export async function logStudySession(
  studySessionRepository: StudySessionRepository,
  input: LogStudySessionInput,
): Promise<StudySession> {
  const session: StudySession = {
    id: crypto.randomUUID(),
    weekNumber: input.weekNumber,
    date: input.date,
    hours: input.hours,
    focusArea: input.focusArea,
    task: input.task.trim(),
    notes: input.notes.trim(),
    outcome: input.outcome.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await studySessionRepository.save(session);
  return session;
}

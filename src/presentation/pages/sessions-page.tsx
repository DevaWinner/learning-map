import type { LogStudySessionInput } from '@/application/use-cases/log-study-session';
import type { StudySession } from '@/domain/entities/study-session';
import type { StudyWeek } from '@/domain/entities/study-week';
import { PageIntro } from '@/presentation/components/page-intro';
import { SessionList } from '@/presentation/components/session-list';
import { SessionLogForm } from '@/presentation/components/session-log-form';

interface SessionsPageProps {
  week: StudyWeek;
  sessions: StudySession[];
  onAddSession: (input: LogStudySessionInput) => Promise<void>;
  onRemoveSession: (sessionId: string) => Promise<void>;
}

export function SessionsPage({
  week,
  sessions,
  onAddSession,
  onRemoveSession,
}: SessionsPageProps) {
  return (
    <section className="space-y-4 pt-4">
      <PageIntro
        eyebrow="Sessions"
        title={`Log work for week ${week.weekNumber}`}
        description="Capture the actual study blocks you completed so the roadmap reflects execution, not intention."
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SessionLogForm weekNumber={week.weekNumber} onSubmit={onAddSession} />
        </div>
        <div className="lg:col-span-8">
          <SessionList sessions={sessions} onRemove={onRemoveSession} />
        </div>
      </div>
    </section>
  );
}


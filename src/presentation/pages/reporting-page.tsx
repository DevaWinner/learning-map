import type { SaveWeeklyCheckpointInput } from '@/application/use-cases/save-weekly-checkpoint';
import type { StudyWeek } from '@/domain/entities/study-week';
import type { WeeklyCheckpoint } from '@/domain/entities/weekly-checkpoint';
import type { WeeklySummary } from '@/domain/entities/weekly-summary';
import { PageIntro } from '@/presentation/components/page-intro';
import { RoadmapFocusCard } from '@/presentation/components/roadmap-focus-card';
import { WeeklyCheckpointCard } from '@/presentation/components/weekly-checkpoint-card';
import { WeeklySummaryCard } from '@/presentation/components/weekly-summary-card';

interface ReportingPageProps {
  week: StudyWeek;
  checkpoint: WeeklyCheckpoint | null;
  summary: WeeklySummary;
  onSaveCheckpoint: (input: SaveWeeklyCheckpointInput) => Promise<void>;
  onExport: () => void;
}

export function ReportingPage({
  week,
  checkpoint,
  summary,
  onSaveCheckpoint,
  onExport,
}: ReportingPageProps) {
  return (
    <section className="space-y-4 pt-4">
      <PageIntro
        title={`Close out week ${week.weekNumber} cleanly`}
        description="Track risk, blockers, next actions, and export a report that matches the actual week."
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <RoadmapFocusCard week={week} />
        </div>
        <div className="lg:col-span-4">
          <WeeklyCheckpointCard
            weekNumber={week.weekNumber}
            checkpoint={checkpoint}
            onSave={onSaveCheckpoint}
          />
        </div>
        <div className="lg:col-span-4">
          <WeeklySummaryCard summary={summary} onExport={onExport} />
        </div>
      </div>
    </section>
  );
}

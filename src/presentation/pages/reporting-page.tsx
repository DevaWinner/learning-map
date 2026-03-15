import type { SaveWeeklyCheckpointInput } from "@/application/use-cases/save-weekly-checkpoint";
import type { StudyWeek } from "@/domain/entities/study-week";
import type { WeeklyCheckpoint } from "@/domain/entities/weekly-checkpoint";
import type { WeeklySummary } from "@/domain/entities/weekly-summary";
import { PageIntro } from "@/presentation/components/page-intro";
import { RoadmapFocusCard } from "@/presentation/components/roadmap-focus-card";
import { WeeklyCheckpointCard } from "@/presentation/components/weekly-checkpoint-card";

interface ReportingPageProps {
  week: StudyWeek;
  checkpoint: WeeklyCheckpoint | null;
  onSaveCheckpoint: (input: SaveWeeklyCheckpointInput) => Promise<void>;
}

export function ReportingPage({
  week,
  checkpoint,
  onSaveCheckpoint,
}: ReportingPageProps) {
  return (
    <section className="space-y-4 pt-4">
      <PageIntro
        title={`Close out week ${week.weekNumber} cleanly`}
        description="Track risk, blockers, next actions, and export a report that matches the actual week."
      />

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-4">
          <RoadmapFocusCard week={week} />
        </div>
        <div>
          <WeeklyCheckpointCard
            weekNumber={week.weekNumber}
            checkpoint={checkpoint}
            onSave={onSaveCheckpoint}
          />
        </div>
      </div>
    </section>
  );
}

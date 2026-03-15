import type { StudyWeek } from "@/domain/entities/study-week";
import type { WeeklySummary } from "@/domain/entities/weekly-summary";
import type { StudySession } from "@/domain/entities/study-session";
import { PageIntro } from "@/presentation/components/page-intro";
import { RoadmapFocusCard } from "@/presentation/components/roadmap-focus-card";
import { WeekOverviewCard } from "@/presentation/components/week-overview-card";
import { WeeklySummaryCard } from "@/presentation/components/weekly-summary-card";
import { ConsistencyHeatmap } from "@/presentation/components/consistency-heatmap";

interface OverviewPageProps {
  week: StudyWeek;
  summary: WeeklySummary;
  allSessions: StudySession[];
  onExport: () => void;
}

export function OverviewPage({
  week,
  summary,
  allSessions,
  onExport,
}: OverviewPageProps) {
  return (
    <section className="min-w-0 space-y-4 pt-4">
      <PageIntro
        title={`Week ${week.weekNumber} at a glance`}
        description="Use this view to see the current commitment, planned roadmap work, and whether the week is on pace."
      />

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="min-w-0 flex flex-col gap-4">
          <WeekOverviewCard week={week} summary={summary} />
          <RoadmapFocusCard week={week} />
        </div>
        <div className="min-w-0">
          <div className="min-w-0 flex flex-col gap-4">
            <ConsistencyHeatmap sessions={allSessions} />
            <WeeklySummaryCard summary={summary} onExport={onExport} />
          </div>
        </div>
      </div>
    </section>
  );
}

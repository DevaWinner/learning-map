import type { StudyWeek } from '@/domain/entities/study-week';
import type { WeeklySummary } from '@/domain/entities/weekly-summary';
import { PageIntro } from '@/presentation/components/page-intro';
import { RoadmapFocusCard } from '@/presentation/components/roadmap-focus-card';
import { WeekOverviewCard } from '@/presentation/components/week-overview-card';
import { WeeklySummaryCard } from '@/presentation/components/weekly-summary-card';

interface OverviewPageProps {
  week: StudyWeek;
  summary: WeeklySummary;
  onExport: () => void;
}

export function OverviewPage({
  week,
  summary,
  onExport,
}: OverviewPageProps) {
  return (
    <section className="space-y-4 pt-4">
      <PageIntro
        title={`Week ${week.weekNumber} at a glance`}
        description="Use this view to see the current commitment, planned roadmap work, and whether the week is on pace."
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <WeekOverviewCard week={week} summary={summary} />
        </div>
        <div className="lg:col-span-5">
          <RoadmapFocusCard week={week} />
        </div>
        <div className="lg:col-span-12">
          <WeeklySummaryCard summary={summary} onExport={onExport} />
        </div>
      </div>
    </section>
  );
}

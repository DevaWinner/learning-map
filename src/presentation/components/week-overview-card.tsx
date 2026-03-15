import type { StudyWeek } from "@/domain/entities/study-week";
import type { WeeklySummary } from "@/domain/entities/weekly-summary";
import { deliverableStatusLabels } from "@/domain/entities/weekly-checkpoint";
import { formatLongDate } from "@/infrastructure/services/study-calendar";
import { Badge } from "@/presentation/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";

interface WeekOverviewCardProps {
  week: StudyWeek;
  summary: WeeklySummary;
}

export function WeekOverviewCard({ week, summary }: WeekOverviewCardProps) {
  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between sm:pb-4">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Current commitment
          </p>
          <CardTitle className="text-2xl md:text-3xl">
            Week {week.weekNumber}
          </CardTitle>
          <p className="text-sm font-medium text-muted-foreground">
            {formatLongDate(week.startDate)} to {formatLongDate(week.endDate)}
          </p>
        </div>
        <Badge
          variant="secondary"
          className="rounded-full px-3 py-1.5 text-xs font-semibold"
        >
          {week.plannedHours}h target
        </Badge>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-primary/10 bg-primary/[0.04] p-5">
            <div className="text-2xl font-bold text-primary">
              {summary.actualHours.toFixed(1)}h
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              logged
            </div>
          </article>
          <article className="rounded-xl border border-secondary/10 bg-secondary/[0.04] p-5">
            <div className="text-2xl font-bold text-secondary">
              {summary.remainingHours.toFixed(1)}h
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              remaining
            </div>
          </article>
          <article className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-5">
            <div className="text-2xl font-bold text-emerald-400">
              {Math.round(summary.completionRate * 100)}%
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              pace
            </div>
          </article>
          <article className="rounded-xl border border-violet-500/10 bg-violet-500/[0.04] p-5">
            <div className="text-base font-bold text-violet-400">
              {deliverableStatusLabels[summary.checkpoint.deliverableStatus]}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              deliverable
            </div>
          </article>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Progress toward weekly target</span>
            <span className="font-medium text-foreground/80">
              {Math.round(summary.completionRate * 100)}%
            </span>
          </div>
          <Progress value={Math.max(8, summary.completionRate * 100)} />
        </div>

        {summary.alert ? (
          <div className="rounded-xl border border-secondary/20 bg-secondary/[0.06] px-4 py-3 text-sm text-secondary">
            {summary.alert}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

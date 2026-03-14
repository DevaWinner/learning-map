import type { StudyWeek } from '@/domain/entities/study-week';
import type { WeeklySummary } from '@/domain/entities/weekly-summary';
import { deliverableStatusLabels } from '@/domain/entities/weekly-checkpoint';
import { formatLongDate } from '@/infrastructure/services/study-calendar';
import { Badge } from '@/presentation/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Progress } from '@/presentation/components/ui/progress';

interface WeekOverviewCardProps {
  week: StudyWeek;
  summary: WeeklySummary;
}

export function WeekOverviewCard({
  week,
  summary,
}: WeekOverviewCardProps) {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-amber-50/95 via-card to-emerald-50/70 shadow-lg">
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between sm:pb-4">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Current commitment
          </p>
          <CardTitle className="text-2xl md:text-3xl">Week {week.weekNumber}</CardTitle>
          <p className="text-sm font-medium text-muted-foreground/90">
            {formatLongDate(week.startDate)} to {formatLongDate(week.endDate)}
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1.5 text-xs font-semibold">
          {week.plannedHours}h target
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-lg border border-border/40 bg-gradient-to-br from-blue-50/70 to-background/80 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="text-2xl font-semibold text-primary">
              {summary.actualHours.toFixed(1)}h
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              logged
            </div>
          </article>
          <article className="rounded-lg border border-border/40 bg-gradient-to-br from-orange-50/70 to-background/80 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="text-2xl font-semibold text-amber-600">
              {summary.remainingHours.toFixed(1)}h
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              remaining
            </div>
          </article>
          <article className="rounded-lg border border-border/40 bg-gradient-to-br from-emerald-50/70 to-background/80 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="text-2xl font-semibold text-emerald-600">
              {Math.round(summary.completionRate * 100)}%
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              pace
            </div>
          </article>
          <article className="rounded-lg border border-border/40 bg-gradient-to-br from-purple-50/70 to-background/80 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="text-base font-semibold text-purple-700">
              {deliverableStatusLabels[summary.checkpoint.deliverableStatus]}
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              deliverable
            </div>
          </article>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Progress toward weekly target</span>
            <span>{Math.round(summary.completionRate * 100)}%</span>
          </div>
          <Progress value={Math.max(8, summary.completionRate * 100)} />
        </div>

        {summary.alert ? (
          <div className="rounded-xl border border-amber-300/60 bg-amber-100/60 px-3 py-2 text-sm text-amber-900">
            {summary.alert}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

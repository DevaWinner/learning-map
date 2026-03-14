import { Download } from 'lucide-react';
import type { WeeklySummary } from '@/domain/entities/weekly-summary';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Separator } from '@/presentation/components/ui/separator';

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
  onExport: () => void;
}

export function WeeklySummaryCard({
  summary,
  onExport,
}: WeeklySummaryCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between sm:pb-4">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Report readiness
          </p>
          <CardTitle className="text-xl">Weekly summary</CardTitle>
        </div>
        <Button variant="default" onClick={onExport} className="gap-2">
          <Download className="size-4" />
          Export Report
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border/50 bg-gradient-to-br from-purple-50/70 to-background/80 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-purple-700">
              Planned vs actual
            </div>
            <div className="mt-3 text-xl font-semibold text-purple-600">
              {summary.actualHours.toFixed(1)} / {summary.week.plannedHours}h
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-50/70 to-background/80 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Distinct tasks
            </div>
            <div className="mt-3 text-xl font-semibold text-blue-600">
              {summary.uniqueTasks.length}
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-gradient-to-br from-emerald-50/70 to-background/80 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Reported outcomes
            </div>
            <div className="mt-3 text-xl font-semibold text-emerald-600">
              {summary.outcomes.length}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Completed items
          </div>
          {summary.outcomes.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {summary.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="rounded-lg border border-border/60 bg-background/60 px-3 py-2"
                >
                  {outcome}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No completed items captured yet.
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Open blockers
          </div>
          <p className="text-sm text-muted-foreground">
            {summary.checkpoint.blockers || 'No blockers recorded.'}
          </p>
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Next action
          </div>
          <p className="text-sm text-muted-foreground">
            {summary.checkpoint.nextAction || 'No next action recorded yet.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

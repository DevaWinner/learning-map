import { Download } from "lucide-react";
import type { WeeklySummary } from "@/domain/entities/weekly-summary";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Separator } from "@/presentation/components/ui/separator";

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
  onExport: () => void;
}

export function WeeklySummaryCard({
  summary,
  onExport,
}: WeeklySummaryCardProps) {
  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between sm:pb-4">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Report readiness
          </p>
          <CardTitle className="text-xl">Weekly summary</CardTitle>
        </div>
        <Button variant="default" onClick={onExport} className="gap-2">
          <Download className="size-4" />
          Export Report
        </Button>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-violet-500/10 bg-violet-500/[0.04] p-5">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-violet-400">
              Planned vs actual
            </div>
            <div className="mt-3 text-xl font-bold text-violet-300">
              {summary.actualHours.toFixed(1)} / {summary.week.plannedHours}h
            </div>
          </div>
          <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-5">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
              Distinct tasks
            </div>
            <div className="mt-3 text-xl font-bold text-blue-300">
              {summary.uniqueTasks.length}
            </div>
          </div>
          <div className="rounded-xl border border-primary/10 bg-primary/[0.04] p-5">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Reported outcomes
            </div>
            <div className="mt-3 text-xl font-bold text-primary/80">
              {summary.outcomes.length}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Completed items
          </div>
          {summary.outcomes.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {summary.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-2.5 text-foreground/80"
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

        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Open blockers
          </div>
          <p className="text-sm text-foreground/70">
            {summary.checkpoint.blockers || "No blockers recorded."}
          </p>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Next action
          </div>
          <p className="text-sm text-foreground/70">
            {summary.checkpoint.nextAction || "No next action recorded yet."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

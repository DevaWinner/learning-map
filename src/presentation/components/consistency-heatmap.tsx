import { useMemo } from "react";
import type { StudySession } from "@/domain/entities/study-session";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { cn } from "@/lib/utils";

interface ConsistencyHeatmapProps {
  sessions: StudySession[];
}

function generateHeatmapDays(sessions: StudySession[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the Sunday of 25 weeks ago
  const startDay = new Date(today);
  const dayOfWeek = today.getDay(); // 0 is Sunday
  startDay.setDate(today.getDate() - 25 * 7 - dayOfWeek);

  const hoursByDate = new Map<string, number>();
  for (const session of sessions) {
    const current = hoursByDate.get(session.date) || 0;
    hoursByDate.set(session.date, current + session.hours);
  }

  const result = [];
  const currentDate = new Date(startDay);

  while (currentDate <= today) {
    // Correctly handle local dates ignoring timezone shifts
    const tzOffset = currentDate.getTimezoneOffset() * 60000;
    const localISOTime = new Date(currentDate.getTime() - tzOffset)
      .toISOString()
      .slice(0, 10);
    const dateStr = localISOTime;
    const hours = hoursByDate.get(dateStr) || 0;

    let intensity = 0;
    if (hours > 0 && hours <= 2) intensity = 1;
    else if (hours > 2 && hours <= 4) intensity = 2;
    else if (hours > 4 && hours <= 6) intensity = 3;
    else if (hours > 6) intensity = 4;

    result.push({
      dateStr,
      date: new Date(currentDate),
      hours,
      intensity,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Pad the remainder of the current week with invisible future dates
  // This ensures CSS Grid stays as a perfect rectangle
  while (currentDate.getDay() !== 0) {
    result.push({
      dateStr: currentDate.toISOString().split("T")[0],
      date: new Date(currentDate),
      hours: 0,
      intensity: -1, // Invisible
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

export function ConsistencyHeatmap({ sessions }: ConsistencyHeatmapProps) {
  const heatmapData = useMemo(() => generateHeatmapDays(sessions), [sessions]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Consistency
          </p>
          <CardTitle className="text-xl">180-Day Heatmap</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div className="max-w-full overflow-x-auto overscroll-x-contain pb-2">
          <div
            className="inline-grid gap-1 [grid-auto-columns:0.65rem] [grid-auto-flow:column] [grid-template-rows:repeat(7,_0.65rem)] sm:[grid-auto-columns:0.8rem] sm:[grid-template-rows:repeat(7,_0.8rem)]"
          >
            {heatmapData.map((day) => (
              <div
                key={day.dateStr}
                title={
                  day.intensity === -1
                    ? undefined
                    : `${day.hours > 0 ? day.hours.toFixed(1) + "h" : "No hours"} on ${day.date.toDateString()}`
                }
                className={cn(
                  "rounded-[3px] transition-colors",
                  day.intensity === -1 && "opacity-0",
                  day.intensity === 0 && "bg-white/[0.04]",
                  day.intensity === 1 && "bg-emerald-500/30",
                  day.intensity === 2 && "bg-emerald-500/50",
                  day.intensity === 3 && "bg-emerald-500/70",
                  day.intensity === 4 && "bg-emerald-400",
                  day.intensity >= 0 &&
                    "cursor-help hover:border hover:border-white/20",
                )}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

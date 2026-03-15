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
    <Card>
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Consistency
          </p>
          <CardTitle className="text-xl">180-Day Heatmap</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Scrollable container for mobile */}
        <div className="overflow-x-auto pb-2">
          {/* Ensure minimum width so it scrolls rather than squishes */}
          <div className="min-w-[700px]">
            <div
              className="grid gap-[4px]"
              style={{
                gridTemplateRows: "repeat(7, 1fr)",
                gridAutoFlow: "column",
                gridAutoColumns: "minmax(0, 1fr)",
              }}
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
                    "aspect-square rounded-[3px] transition-all",
                    day.intensity === -1 && "opacity-0",
                    day.intensity === 0 && "bg-white/[0.04]",
                    day.intensity === 1 && "bg-emerald-500/30",
                    day.intensity === 2 && "bg-emerald-500/50",
                    day.intensity === 3 && "bg-emerald-500/70",
                    day.intensity === 4 &&
                      "bg-emerald-400 shadow-[0_0_8px_hsl(152_69%_31%/0.3)]",
                    day.intensity >= 0 &&
                      "hover:border hover:border-white/20 cursor-help",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

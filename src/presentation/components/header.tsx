import type { StudyWeek } from "@/domain/entities/study-week";
import { WeekPicker } from "@/presentation/components/week-picker";
import { Badge } from "@/presentation/components/ui/badge";
import { useNetworkStatus } from "@/presentation/hooks/use-network-status";
import { WifiOff } from "lucide-react";

interface HeaderProps {
  weeks: StudyWeek[];
  selectedWeekNumber: number;
  onSelectWeek: (weekNumber: number) => void;
}

export function Header({
  weeks,
  selectedWeekNumber,
  onSelectWeek,
}: HeaderProps) {
  const { isOnline } = useNetworkStatus();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Roadmap OS
        </h1>
        {!isOnline && (
          <Badge
            variant="outline"
            className="gap-1.5 border-amber-500/20 bg-amber-500/10 text-amber-500"
          >
            <WifiOff className="size-3" />
            Offline
          </Badge>
        )}
      </div>
      <div className="w-full sm:w-72">
        <WeekPicker
          weeks={weeks}
          selectedWeekNumber={selectedWeekNumber}
          onSelectWeek={onSelectWeek}
        />
      </div>
    </header>
  );
}

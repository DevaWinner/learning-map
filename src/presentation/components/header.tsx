import type { StudyWeek } from "@/domain/entities/study-week";
import { WeekPicker } from "@/presentation/components/week-picker";

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
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Roadmap OS
      </h1>
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

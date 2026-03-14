import type { StudyWeek } from '@/domain/entities/study-week';
import { WeekPicker } from '@/presentation/components/week-picker';
import { Card, CardContent } from '@/presentation/components/ui/card';

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
    <header>
      <Card className="overflow-hidden border-white/15 bg-[linear-gradient(135deg,rgba(20,40,32,0.98),rgba(24,80,50,0.95))] text-primary-foreground shadow-2xl">
        <CardContent className="space-y-6 p-6 md:p-8">
          <div className="space-y-3 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/65">
              Local-first weekly execution system
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Roadmap OS
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-white/80 md:text-base">
              Keep the 20-hour roadmap visible, log what you actually did, and
              export a weekly report before drift sets in.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-white/12 p-4 backdrop-blur-lg shadow-lg">
            <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-white/65">
              Viewing week
            </p>
            <WeekPicker
              weeks={weeks}
              selectedWeekNumber={selectedWeekNumber}
              onSelectWeek={onSelectWeek}
            />
          </div>
        </CardContent>
      </Card>
    </header>
  );
}

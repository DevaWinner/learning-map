import type { StudyWeek } from '@/domain/entities/study-week';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Separator } from '@/presentation/components/ui/separator';

interface RoadmapFocusCardProps {
  week: StudyWeek;
}

export function RoadmapFocusCard({ week }: RoadmapFocusCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Planned work
          </p>
          <CardTitle className="text-xl">Roadmap focus</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <article className="space-y-2 rounded-lg bg-blue-50/40 p-4">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Coursera
          </span>
          <p className="text-sm font-semibold leading-6 text-foreground">{week.coursera}</p>
        </article>
        <Separator className="opacity-50" />
        <article className="space-y-2 rounded-lg bg-amber-50/40 p-4">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
            Math
          </span>
          <p className="text-sm font-semibold leading-6 text-foreground">{week.math}</p>
        </article>
        <Separator className="opacity-50" />
        <article className="space-y-2 rounded-lg bg-emerald-50/40 p-4">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Deliverable
          </span>
          <p className="text-sm font-semibold leading-6 text-foreground">{week.deliverable}</p>
        </article>
      </CardContent>
    </Card>
  );
}

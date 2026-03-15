import type { StudyWeek } from "@/domain/entities/study-week";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Separator } from "@/presentation/components/ui/separator";

interface RoadmapFocusCardProps {
  week: StudyWeek;
}

export function RoadmapFocusCard({ week }: RoadmapFocusCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Planned work
          </p>
          <CardTitle className="text-xl">Roadmap focus</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <Link
          to="/overview/focus/coursera"
          className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background rounded-xl"
        >
          <article className="space-y-2 rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4 transition-colors hover:bg-blue-500/[0.08]">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
              Coursera
            </span>
            <p className="text-sm font-medium leading-6 text-foreground/90">
              {week.coursera}
            </p>
          </article>
        </Link>
        <Separator />
        <Link
          to="/overview/focus/math"
          className="block focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background rounded-xl"
        >
          <article className="space-y-2 rounded-xl border border-secondary/10 bg-secondary/[0.04] p-4 transition-colors hover:bg-secondary/[0.08]">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Math
            </span>
            <p className="text-sm font-medium leading-6 text-foreground/90">
              {week.math}
            </p>
          </article>
        </Link>
        <Separator />
        <Link
          to="/overview/focus/deliverable"
          className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-xl"
        >
          <article className="space-y-2 rounded-xl border border-primary/10 bg-primary/[0.04] p-4 transition-colors hover:bg-primary/[0.08]">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Deliverable
            </span>
            <p className="text-sm font-medium leading-6 text-foreground/90">
              {week.deliverable}
            </p>
          </article>
        </Link>
      </CardContent>
    </Card>
  );
}

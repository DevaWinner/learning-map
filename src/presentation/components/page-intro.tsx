import { Badge } from '@/presentation/components/ui/badge';

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: PageIntroProps) {
  return (
    <section className="space-y-3">
      <Badge
        variant="outline"
        className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
      >
        {eyebrow}
      </Badge>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}


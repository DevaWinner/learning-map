interface PageIntroProps {
  title: string;
  description: string;
}

export function PageIntro({
  title,
  description,
}: PageIntroProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
        {description}
      </p>
    </section>
  );
}

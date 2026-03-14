import type { UpdateProjectFocusInput } from '@/application/use-cases/update-project-focus';
import type { ProjectFocus } from '@/domain/entities/project-focus';
import { PageIntro } from '@/presentation/components/page-intro';
import { ProjectFocusBoard } from '@/presentation/components/project-focus-board';

interface ProjectsPageProps {
  projects: ProjectFocus[];
  onSaveProject: (input: UpdateProjectFocusInput) => Promise<void>;
}

export function ProjectsPage({
  projects,
  onSaveProject,
}: ProjectsPageProps) {
  return (
    <section className="space-y-4 pt-4">
      <PageIntro
        eyebrow="Projects"
        title="Keep strategic work visible"
        description="This view separates long-horizon product thinking from the current week so the roadmap stays focused."
      />

      <div className="grid gap-4">
        <ProjectFocusBoard projects={projects} onSave={onSaveProject} />
      </div>
    </section>
  );
}


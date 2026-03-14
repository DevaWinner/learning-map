import type { ProjectFocusRepository } from '@/application/ports/project-focus-repository';
import type {
  ProjectFocus,
  ProjectStatus,
} from '@/domain/entities/project-focus';

export interface UpdateProjectFocusInput {
  id: string;
  name: string;
  tagline: string;
  desiredOutcome: string;
  status: ProjectStatus;
  notes: string;
}

export async function updateProjectFocus(
  projectFocusRepository: ProjectFocusRepository,
  input: UpdateProjectFocusInput,
): Promise<ProjectFocus> {
  const project: ProjectFocus = {
    id: input.id,
    name: input.name,
    tagline: input.tagline,
    desiredOutcome: input.desiredOutcome,
    status: input.status,
    notes: input.notes.trim(),
    updatedAt: new Date().toISOString(),
  };

  await projectFocusRepository.save(project);
  return project;
}


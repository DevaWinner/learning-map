import type { ProjectFocus } from '@/domain/entities/project-focus';

export interface ProjectFocusRepository {
  list(): Promise<ProjectFocus[]>;
  save(project: ProjectFocus): Promise<void>;
}


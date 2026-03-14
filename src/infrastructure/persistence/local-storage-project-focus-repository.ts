import type { ProjectFocusRepository } from '@/application/ports/project-focus-repository';
import type { ProjectFocus } from '@/domain/entities/project-focus';
import {
  readCollection,
  writeCollection,
} from '@/infrastructure/persistence/browser-storage';
import { defaultProjectFocuses } from '@/infrastructure/seeds/default-project-focuses';

const STORAGE_KEY = 'roadmap-os.project-focuses';

export class LocalStorageProjectFocusRepository implements ProjectFocusRepository {
  async list(): Promise<ProjectFocus[]> {
    const projects = readCollection<ProjectFocus[]>(STORAGE_KEY, defaultProjectFocuses);
    return projects.sort((left, right) => left.name.localeCompare(right.name));
  }

  async save(project: ProjectFocus): Promise<void> {
    const projects = readCollection<ProjectFocus[]>(STORAGE_KEY, defaultProjectFocuses);
    const nextProjects = [...projects.filter((item) => item.id !== project.id), project];
    writeCollection(STORAGE_KEY, nextProjects);
  }
}


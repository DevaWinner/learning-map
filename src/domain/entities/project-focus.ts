export type ProjectStatus = 'idea' | 'planning' | 'building' | 'paused';

export interface ProjectFocus {
  id: string;
  name: string;
  tagline: string;
  desiredOutcome: string;
  status: ProjectStatus;
  notes: string;
  updatedAt: string;
}

export const projectStatusLabels: Record<ProjectStatus, string> = {
  idea: 'Idea',
  planning: 'Planning',
  building: 'Building',
  paused: 'Paused',
};


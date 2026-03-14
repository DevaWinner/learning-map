import { useEffect, useState } from 'react';
import type {
  ProjectFocus,
  ProjectStatus,
} from '@/domain/entities/project-focus';
import { projectStatusLabels } from '@/domain/entities/project-focus';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Textarea } from '@/presentation/components/ui/textarea';

interface ProjectFocusBoardProps {
  projects: ProjectFocus[];
  onSave: (input: {
    id: string;
    name: string;
    tagline: string;
    desiredOutcome: string;
    status: ProjectStatus;
    notes: string;
  }) => Promise<void>;
}

const projectStatuses = Object.keys(projectStatusLabels) as ProjectStatus[];

export function ProjectFocusBoard({
  projects,
  onSave,
}: ProjectFocusBoardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Longer-horizon work
          </p>
          <CardTitle className="text-2xl">Project lanes</CardTitle>
          <CardDescription className="text-base text-muted-foreground/90">
            Track strategic product work separately from weekly schedule execution.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onSave={onSave} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectCardProps {
  project: ProjectFocus;
  onSave: (input: {
    id: string;
    name: string;
    tagline: string;
    desiredOutcome: string;
    status: ProjectStatus;
    notes: string;
  }) => Promise<void>;
}

function ProjectCard({ project, onSave }: ProjectCardProps) {
  const [draft, setDraft] = useState({
    status: project.status,
    notes: project.notes,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft({
      status: project.status,
      notes: project.notes,
    });
  }, [project.notes, project.status]);

  async function handleSave() {
    setIsSaving(true);

    try {
      await onSave({
        id: project.id,
        name: project.name,
        tagline: project.tagline,
        desiredOutcome: project.desiredOutcome,
        status: draft.status,
        notes: draft.notes,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="h-full shadow-md hover:shadow-lg transition-all border-border/50">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
          <CardDescription className="text-sm font-semibold text-primary">{project.tagline}</CardDescription>
        </div>
        <p className="text-base leading-7 text-foreground/85 font-medium">
          {project.desiredOutcome}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <Label className="font-bold text-foreground">Status</Label>
          <Select
            value={draft.status}
            onValueChange={(value) =>
              setDraft((current) => ({
                ...current,
                status: value as ProjectStatus,
              }))
            }
          >
            <SelectTrigger className="border-border/50 bg-background/80 font-medium">
              <SelectValue placeholder="Select project status" />
            </SelectTrigger>
            <SelectContent>
              {projectStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {projectStatusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="font-bold text-foreground">Notes</Label>
          <Textarea
            rows={6}
            value={draft.notes}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            className="border-border/50 bg-background/80 font-medium resize-none"
          />
        </div>

        <Button
          variant="secondary"
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="w-full font-bold"
        >
          {isSaving ? 'Saving…' : 'Save project'}
        </Button>
      </CardContent>
    </Card>
  );
}


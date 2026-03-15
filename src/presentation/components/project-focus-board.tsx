import { useEffect, useState } from "react";
import type {
  ProjectFocus,
  ProjectStatus,
} from "@/domain/entities/project-focus";
import { projectStatusLabels } from "@/domain/entities/project-focus";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Label } from "@/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Textarea } from "@/presentation/components/ui/textarea";

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
    <div className="grid gap-4 lg:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onSave={onSave} />
      ))}
    </div>
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
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="space-y-1.5">
          <CardTitle className="text-base font-semibold">
            {project.name}
          </CardTitle>
          <CardDescription className="text-sm">
            {project.tagline}
          </CardDescription>
        </div>
        <p className="text-sm leading-6 text-foreground/70">
          {project.desiredOutcome}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2.5">
          <Label className="text-sm font-medium">Status</Label>
          <Select
            value={draft.status}
            onValueChange={(value) =>
              setDraft((current) => ({
                ...current,
                status: value as ProjectStatus,
              }))
            }
          >
            <SelectTrigger>
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

        <div className="space-y-2.5">
          <Label className="text-sm font-medium">Notes</Label>
          <Textarea
            rows={6}
            value={draft.notes}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            className="resize-none"
          />
        </div>

        <Button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? "Saving…" : "Save project"}
        </Button>
      </CardContent>
    </Card>
  );
}

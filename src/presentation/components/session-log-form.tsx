import { useId, useState, type FormEvent } from "react";
import {
  focusAreaLabels,
  type FocusArea,
} from "@/domain/entities/study-session";
import { toIsoDate } from "@/infrastructure/services/study-calendar";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Textarea } from "@/presentation/components/ui/textarea";

interface SessionLogFormProps {
  weekNumber: number;
  onSubmit: (input: {
    weekNumber: number;
    date: string;
    hours: number;
    focusArea: FocusArea;
    task: string;
    notes: string;
    outcome: string;
  }) => Promise<void>;
}

const focusAreas = Object.keys(focusAreaLabels) as FocusArea[];

export function SessionLogForm({ weekNumber, onSubmit }: SessionLogFormProps) {
  const ids = {
    date: useId(),
    hours: useId(),
    focus: useId(),
    task: useId(),
    outcome: useId(),
    notes: useId(),
  };

  const [form, setForm] = useState({
    date: toIsoDate(new Date()),
    hours: 1.5,
    focusArea: "ml" as FocusArea,
    task: "",
    notes: "",
    outcome: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await onSubmit({
        weekNumber,
        date: form.date,
        hours: form.hours,
        focusArea: form.focusArea,
        task: form.task,
        notes: form.notes,
        outcome: form.outcome,
      });

      setForm((current) => ({
        ...current,
        task: "",
        notes: "",
        outcome: "",
      }));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Daily tracking
          </p>
          <CardTitle className="text-xl">Log a study session</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor={ids.date}>Date</Label>
              <Input
                id={ids.date}
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor={ids.hours}>Hours</Label>
              <Input
                id={ids.hours}
                type="number"
                min="0.5"
                max="12"
                step="0.5"
                value={form.hours}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    hours: Number(event.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={ids.focus}>Focus area</Label>
            <Select
              value={form.focusArea}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  focusArea: value as FocusArea,
                }))
              }
            >
              <SelectTrigger id={ids.focus}>
                <SelectValue placeholder="Select a focus area" />
              </SelectTrigger>
              <SelectContent>
                {focusAreas.map((focusArea) => (
                  <SelectItem key={focusArea} value={focusArea}>
                    {focusAreaLabels[focusArea]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={ids.task}>Task</Label>
            <Input
              id={ids.task}
              type="text"
              placeholder="Example: Finish Kaggle Intro to ML lesson"
              value={form.task}
              onChange={(event) =>
                setForm((current) => ({ ...current, task: event.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={ids.outcome}>Outcome</Label>
            <Input
              id={ids.outcome}
              type="text"
              placeholder="Example: Trained first sklearn baseline"
              value={form.outcome}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  outcome: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={ids.notes}>Notes</Label>
            <Textarea
              id={ids.notes}
              rows={4}
              placeholder="Capture blockers, insights, or what to do next."
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto text-base"
            size="lg"
          >
            {isSaving ? "Saving…" : "Save session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { useEffect, useId, useState, type FormEvent } from "react";
import {
  deliverableStatusLabels,
  type DeliverableStatus,
  type WeeklyCheckpoint,
} from "@/domain/entities/weekly-checkpoint";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
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

interface WeeklyCheckpointCardProps {
  weekNumber: number;
  checkpoint: WeeklyCheckpoint | null;
  onSave: (input: {
    weekNumber: number;
    deliverableStatus: DeliverableStatus;
    blockers: string;
    nextAction: string;
    summaryNote: string;
  }) => Promise<void>;
}

const deliverableStatuses = Object.keys(
  deliverableStatusLabels,
) as DeliverableStatus[];

export function WeeklyCheckpointCard({
  weekNumber,
  checkpoint,
  onSave,
}: WeeklyCheckpointCardProps) {
  const ids = {
    status: useId(),
    blockers: useId(),
    action: useId(),
    summary: useId(),
  };

  const [form, setForm] = useState({
    deliverableStatus: "not-started" as DeliverableStatus,
    blockers: "",
    nextAction: "",
    summaryNote: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({
      deliverableStatus: checkpoint?.deliverableStatus ?? "not-started",
      blockers: checkpoint?.blockers ?? "",
      nextAction: checkpoint?.nextAction ?? "",
      summaryNote: checkpoint?.summaryNote ?? "",
    });
  }, [checkpoint]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await onSave({
        weekNumber,
        deliverableStatus: form.deliverableStatus,
        blockers: form.blockers,
        nextAction: form.nextAction,
        summaryNote: form.summaryNote,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Weekly reporting
          </p>
          <CardTitle className="text-xl">Checkpoint</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2.5">
            <Label htmlFor={ids.status}>Deliverable status</Label>
            <Select
              value={form.deliverableStatus}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  deliverableStatus: value as DeliverableStatus,
                }))
              }
            >
              <SelectTrigger id={ids.status}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {deliverableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {deliverableStatusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={ids.blockers}>Blockers</Label>
            <Textarea
              id={ids.blockers}
              rows={3}
              placeholder="What is slowing this week down?"
              value={form.blockers}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  blockers: event.target.value,
                }))
              }
              className="resize-none"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={ids.action}>Next action</Label>
            <Textarea
              id={ids.action}
              rows={3}
              placeholder="What is the next concrete move?"
              value={form.nextAction}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  nextAction: event.target.value,
                }))
              }
              className="resize-none"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={ids.summary}>Weekly note</Label>
            <Textarea
              id={ids.summary}
              rows={4}
              placeholder="Capture a concise summary for the report."
              value={form.summaryNote}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  summaryNote: event.target.value,
                }))
              }
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving…" : "Save checkpoint"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

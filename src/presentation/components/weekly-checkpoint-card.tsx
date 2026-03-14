import { useEffect, useId, useState, type FormEvent } from 'react';
import {
  deliverableStatusLabels,
  type DeliverableStatus,
  type WeeklyCheckpoint,
} from '@/domain/entities/weekly-checkpoint';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
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
    deliverableStatus: 'not-started' as DeliverableStatus,
    blockers: '',
    nextAction: '',
    summaryNote: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({
      deliverableStatus: checkpoint?.deliverableStatus ?? 'not-started',
      blockers: checkpoint?.blockers ?? '',
      nextAction: checkpoint?.nextAction ?? '',
      summaryNote: checkpoint?.summaryNote ?? '',
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
    <Card className="shadow-lg">
      <CardHeader>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Weekly reporting
          </p>
          <CardTitle className="text-2xl">Checkpoint</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <Label htmlFor={ids.status} className="font-semibold text-foreground">Deliverable status</Label>
            <Select
              value={form.deliverableStatus}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  deliverableStatus: value as DeliverableStatus,
                }))
              }
            >
              <SelectTrigger id={ids.status} className="border-border/50 bg-background/80 font-medium">
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

          <div className="space-y-3">
            <Label htmlFor={ids.blockers} className="font-semibold text-foreground">Blockers</Label>
            <Textarea
              id={ids.blockers}
              rows={3}
              placeholder="What is slowing this week down?"
              value={form.blockers}
              onChange={(event) =>
                setForm((current) => ({ ...current, blockers: event.target.value }))
              }
              className="border-border/50 bg-background/80 font-medium resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor={ids.action} className="font-semibold text-foreground">Next action</Label>
            <Textarea
              id={ids.action}
              rows={3}
              placeholder="What is the next concrete move?"
              value={form.nextAction}
              onChange={(event) =>
                setForm((current) => ({ ...current, nextAction: event.target.value }))
              }
              className="border-border/50 bg-background/80 font-medium resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor={ids.summary} className="font-semibold text-foreground">Weekly note</Label>
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
              className="border-border/50 bg-background/80 font-medium resize-none"
            />
          </div>

          <Button type="submit" disabled={isSaving} className="w-full sm:w-auto font-bold text-base" size="lg">
            {isSaving ? 'Saving…' : 'Save checkpoint'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

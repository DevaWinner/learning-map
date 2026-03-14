import {
  focusAreaLabels,
  type StudySession,
} from '@/domain/entities/study-session';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';

interface SessionListProps {
  sessions: StudySession[];
  onRemove: (sessionId: string) => Promise<void>;
}

export function SessionList({ sessions, onRemove }: SessionListProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Execution trail
          </p>
          <CardTitle className="text-2xl">Recent sessions</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            No study sessions recorded for this week yet. Start with one concrete
            block.
          </p>
        ) : (
          <ScrollArea className="max-h-[30rem] pr-4">
            <div className="space-y-3">
              {sessions.map((session) => (
                <article
                  key={session.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/50 bg-gradient-to-r from-background/60 to-background/80 p-5 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{session.date}</Badge>
                      <Badge variant="secondary" className="font-bold">{session.hours}h</Badge>
                      <Badge variant="secondary" className="font-bold">
                        {focusAreaLabels[session.focusArea]}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-bold leading-6 text-foreground">
                        {session.task}
                      </h3>
                      {session.outcome ? (
                        <p className="text-sm text-foreground/80 font-medium">
                          {session.outcome}
                        </p>
                      ) : null}
                      {session.notes ? (
                        <p className="text-sm text-muted-foreground italic">
                          {session.notes}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void onRemove(session.id)}
                    className="font-semibold"
                  >
                    Remove
                  </Button>
                </article>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}


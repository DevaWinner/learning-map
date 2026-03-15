import {
  focusAreaLabels,
  type StudySession,
} from "@/domain/entities/study-session";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";

interface SessionListProps {
  sessions: StudySession[];
  onRemove: (sessionId: string) => Promise<void>;
}

export function SessionList({ sessions, onRemove }: SessionListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Execution trail
          </p>
          <CardTitle className="text-xl">Recent sessions</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            No study sessions recorded for this week yet. Start with one
            concrete block.
          </p>
        ) : (
          <ScrollArea className="max-h-[30rem] pr-4">
            <div className="space-y-3">
              {sessions.map((session) => (
                <article
                  key={session.id}
                  className="flex flex-col gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-5 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{session.date}</Badge>
                      <Badge variant="secondary">{session.hours}h</Badge>
                      <Badge variant="default">
                        {focusAreaLabels[session.focusArea]}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold leading-6 text-foreground">
                        {session.task}
                      </h3>
                      {session.outcome ? (
                        <p className="text-sm text-foreground/70 font-medium">
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
                    variant="ghost"
                    size="sm"
                    onClick={() => void onRemove(session.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
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

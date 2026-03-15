import { useState } from "react";
import type { StudyWeek } from "@/domain/entities/study-week";
import type { LogStudySessionInput } from "@/application/use-cases/log-study-session";
import { PageIntro } from "@/presentation/components/page-intro";
import { FocusTimer } from "@/presentation/components/focus-timer";
import { SessionLogForm } from "@/presentation/components/session-log-form";

interface TimerPageProps {
  week: StudyWeek;
  onAddSession: (input: LogStudySessionInput) => Promise<void>;
}

export function TimerPage({ week, onAddSession }: TimerPageProps) {
  const [completedHours, setCompletedHours] = useState<number | null>(null);

  const handleTimerComplete = (hours: number) => {
    // If they tracked practically zero time, default them to 0.5 minimum in the form
    setCompletedHours(Math.max(0.5, hours));
  };

  const handleSubmit = async (input: LogStudySessionInput) => {
    await onAddSession(input);
    // Reset back to the timer view after saving
    setCompletedHours(null);
  };

  return (
    <section className="space-y-8 pt-4">
      <PageIntro
        title="Deep work"
        description="Execute your plan without distractions. The timer will automatically prepare a log entry upon completion."
      />

      {completedHours === null ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <FocusTimer onComplete={handleTimerComplete} />
        </div>
      ) : (
        <div className="mx-auto max-w-2xl w-full animate-in fade-in zoom-in-95 duration-500">
          <SessionLogForm
            weekNumber={week.weekNumber}
            initialHours={completedHours}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import type { StudyWeek } from "@/domain/entities/study-week";
import type { LogStudySessionInput } from "@/application/use-cases/log-study-session";
import type { RoadmapFocusOption } from "@/domain/services/get-week-roadmap-focus-options";
import { getWeekRoadmapFocusOptions } from "@/domain/services/get-week-roadmap-focus-options";
import { PageIntro } from "@/presentation/components/page-intro";
import { FocusTimer } from "@/presentation/components/focus-timer";
import { SessionLogForm } from "@/presentation/components/session-log-form";

interface TimerPageProps {
  week: StudyWeek;
  onAddSession: (input: LogStudySessionInput) => Promise<void>;
}

export function TimerPage({ week, onAddSession }: TimerPageProps) {
  const focusOptions = useMemo(() => getWeekRoadmapFocusOptions(week), [week]);
  const [selectedFocusId, setSelectedFocusId] = useState<RoadmapFocusOption["id"]>(
    focusOptions[0]?.id ?? "coursera",
  );
  const [completedDraft, setCompletedDraft] = useState<{
    hours: number;
    focusOption: RoadmapFocusOption;
  } | null>(null);

  useEffect(() => {
    if (!focusOptions.some((option) => option.id === selectedFocusId)) {
      setSelectedFocusId(focusOptions[0]?.id ?? "coursera");
    }
  }, [focusOptions, selectedFocusId]);

  const handleTimerComplete = (hours: number) => {
    const selectedFocusOption =
      focusOptions.find((option) => option.id === selectedFocusId) ??
      focusOptions[0];

    if (!selectedFocusOption) {
      return;
    }

    setCompletedDraft({
      hours,
      focusOption: selectedFocusOption,
    });
  };

  const handleSubmit = async (input: LogStudySessionInput) => {
    await onAddSession(input);
    // Reset back to the timer view after saving
    setCompletedDraft(null);
  };

  return (
    <section className="space-y-8 pt-4">
      <PageIntro
        title="Deep work"
        description="Execute your plan without distractions. The timer will automatically prepare a log entry upon completion."
      />

      {completedDraft === null ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <FocusTimer
            focusOptions={focusOptions}
            selectedFocusId={selectedFocusId}
            onSelectFocus={setSelectedFocusId}
            onComplete={handleTimerComplete}
          />
        </div>
      ) : (
        <div className="mx-auto max-w-2xl w-full animate-in fade-in zoom-in-95 duration-500">
          <SessionLogForm
            weekNumber={week.weekNumber}
            initialHours={completedDraft.hours}
            initialFocusArea={completedDraft.focusOption.focusArea}
            initialTask={completedDraft.focusOption.detail}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </section>
  );
}

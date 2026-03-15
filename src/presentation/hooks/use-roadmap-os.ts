import { useEffect, useMemo, useState } from "react";
import { buildWeeklySummary } from "@/application/use-cases/build-weekly-summary";
import { getCurrentWeek } from "@/application/use-cases/get-current-week";
import {
  logStudySession,
  type LogStudySessionInput,
} from "@/application/use-cases/log-study-session";
import {
  saveWeeklyCheckpoint,
  type SaveWeeklyCheckpointInput,
} from "@/application/use-cases/save-weekly-checkpoint";
import {
  updateProjectFocus,
  type UpdateProjectFocusInput,
} from "@/application/use-cases/update-project-focus";
import type { AppContext } from "@/app/create-app-context";
import type { ProjectFocus } from "@/domain/entities/project-focus";
import type { StudySession } from "@/domain/entities/study-session";
import type { StudyWeek } from "@/domain/entities/study-week";
import type { WeeklyCheckpoint } from "@/domain/entities/weekly-checkpoint";
import { buildWeeklyMarkdownReport } from "@/infrastructure/services/markdown-exporter";

interface DashboardState {
  weeks: StudyWeek[];
  selectedWeek: StudyWeek | null;
  currentWeekNumber: number;
  sessions: StudySession[];
  allSessions: StudySession[];
  checkpoint: WeeklyCheckpoint | null;
  projects: ProjectFocus[];
}

const EMPTY_STATE: DashboardState = {
  weeks: [],
  selectedWeek: null,
  currentWeekNumber: 1,
  sessions: [],
  allSessions: [],
  checkpoint: null,
  projects: [],
};

export function useRoadmapOs(appContext: AppContext) {
  const [state, setState] = useState<DashboardState>(EMPTY_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadWeek(weekNumber: number): Promise<void> {
    const [selectedWeek, sessions, allSessions, checkpoint] = await Promise.all(
      [
        appContext.scheduleRepository.getWeekByNumber(weekNumber),
        appContext.studySessionRepository.listByWeek(weekNumber),
        appContext.studySessionRepository.listAll(),
        appContext.weeklyCheckpointRepository.getByWeek(weekNumber),
      ],
    );

    setState((current) => ({
      ...current,
      selectedWeek,
      currentWeekNumber: weekNumber,
      sessions,
      allSessions,
      checkpoint,
    }));
  }

  async function refresh(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const weeks = await appContext.scheduleRepository.getAllWeeks();
      const currentWeek = await getCurrentWeek(
        appContext.scheduleRepository,
        new Date(),
      );
      const weekNumber = currentWeek?.weekNumber ?? weeks[0]?.weekNumber ?? 1;
      const projects = await appContext.projectFocusRepository.list();

      setState((current) => ({
        ...current,
        weeks,
        projects,
      }));

      await loadWeek(weekNumber);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load the dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const summary = useMemo(() => {
    if (!state.selectedWeek) {
      return null;
    }

    return buildWeeklySummary(
      state.selectedWeek,
      state.sessions,
      state.checkpoint,
      new Date(),
    );
  }, [state.checkpoint, state.selectedWeek, state.sessions]);

  async function selectWeek(weekNumber: number): Promise<void> {
    await loadWeek(weekNumber);
  }

  async function addSession(input: LogStudySessionInput): Promise<void> {
    await logStudySession(appContext.studySessionRepository, input);
    await loadWeek(input.weekNumber);
  }

  async function removeSession(sessionId: string): Promise<void> {
    await appContext.studySessionRepository.remove(sessionId);
    await loadWeek(state.currentWeekNumber);
  }

  async function saveCheckpoint(
    input: SaveWeeklyCheckpointInput,
  ): Promise<void> {
    await saveWeeklyCheckpoint(appContext.weeklyCheckpointRepository, input);
    await loadWeek(input.weekNumber);
  }

  async function saveProject(input: UpdateProjectFocusInput): Promise<void> {
    await updateProjectFocus(appContext.projectFocusRepository, input);
    const projects = await appContext.projectFocusRepository.list();
    setState((current) => ({
      ...current,
      projects,
    }));
  }

  function exportWeeklyReport(): void {
    if (!summary) {
      return;
    }

    const content = buildWeeklyMarkdownReport(summary);
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `week-${summary.week.weekNumber}-report.md`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return {
    ...state,
    isLoading,
    error,
    summary,
    refresh,
    selectWeek,
    addSession,
    removeSession,
    saveCheckpoint,
    saveProject,
    exportWeeklyReport,
  };
}

import { Navigate, Route, Routes } from 'react-router-dom';
import { createAppContext } from '@/app/create-app-context';
import { Header } from '@/presentation/components/header';
import { SectionNavigation } from '@/presentation/components/section-navigation';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { useRoadmapOs } from '@/presentation/hooks/use-roadmap-os';
import { OverviewPage } from '@/presentation/pages/overview-page';
import { ProjectsPage } from '@/presentation/pages/projects-page';
import { ReportingPage } from '@/presentation/pages/reporting-page';
import { SessionsPage } from '@/presentation/pages/sessions-page';

const appContext = createAppContext();

export default function App() {
  const {
    weeks,
    selectedWeek,
    currentWeekNumber,
    sessions,
    checkpoint,
    projects,
    summary,
    isLoading,
    error,
    selectWeek,
    addSession,
    removeSession,
    saveCheckpoint,
    saveProject,
    exportWeeklyReport,
  } = useRoadmapOs(appContext);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-5 sm:py-6">
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading Roadmap OS…
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error || !selectedWeek || !summary) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-5 sm:py-6">
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            {error || 'The selected roadmap week could not be loaded.'}
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-5 sm:py-6">
      <Header
        weeks={weeks}
        selectedWeekNumber={currentWeekNumber}
        onSelectWeek={(weekNumber) => void selectWeek(weekNumber)}
      />

      <SectionNavigation />

      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route
          path="/overview"
          element={
            <OverviewPage
              week={selectedWeek}
              summary={summary}
              onExport={exportWeeklyReport}
            />
          }
        />
        <Route
          path="/sessions"
          element={
            <SessionsPage
              week={selectedWeek}
              sessions={sessions}
              onAddSession={addSession}
              onRemoveSession={removeSession}
            />
          }
        />
        <Route
          path="/reporting"
          element={
            <ReportingPage
              week={selectedWeek}
              checkpoint={checkpoint}
              summary={summary}
              onSaveCheckpoint={saveCheckpoint}
              onExport={exportWeeklyReport}
            />
          }
        />
        <Route
          path="/projects"
          element={
            <ProjectsPage projects={projects} onSaveProject={saveProject} />
          }
        />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </main>
  );
}

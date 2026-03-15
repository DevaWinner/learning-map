import { useEffect, useState } from "react";
import type { StudySession } from "@/domain/entities/study-session";
import type { ProjectFocus } from "@/domain/entities/project-focus";
import { ConsistencyHeatmap } from "@/presentation/components/consistency-heatmap";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Activity } from "lucide-react";

export function PublicProfilePage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [projects, setProjects] = useState<ProjectFocus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublicData() {
      try {
        // Fallback to local API in dev, or relative in prod
        let url = "/api/public";
        // If VITE_SYNC_API_URL is defined (e.g., local dev testing the Edge function)
        if (import.meta.env.VITE_SYNC_API_URL) {
          url = import.meta.env.VITE_SYNC_API_URL.replace("/sync", "/public");
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to load profile data");
        const data = await response.json();

        setSessions(data.studySessions || []);
        setProjects(data.projectFocuses || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">
            Loading Public Profile…
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
          <CardContent className="p-6 text-center text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeProjects = projects.filter((p) => p.status === "building");
  const totalHours = sessions.reduce((acc, s) => acc + Number(s.hours), 0);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col space-y-12 px-4 py-8 sm:px-6 sm:py-16">
      <header className="space-y-6 text-center sm:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Activity className="size-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Roadmap OS
              </h1>
            </div>
            <p className="text-base font-medium text-muted-foreground sm:text-lg">
              Live proof of work and learning consistency ledger.
            </p>
          </div>
          <Badge
            variant="outline"
            className="w-fit mx-auto sm:mx-0 border-primary/20 bg-primary/10 text-primary px-4 py-2 text-sm sm:text-base"
          >
            {totalHours.toFixed(1)}h All-Time Logged
          </Badge>
        </div>
      </header>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
        <ConsistencyHeatmap sessions={sessions} />
      </section>

      {activeProjects.length > 0 && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          <h2 className="text-xl font-bold tracking-tight">Active Focus</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {activeProjects.map((project) => (
              <Card
                key={project.id}
                className="border-white/10 bg-white/[0.02]"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    {project.tagline}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

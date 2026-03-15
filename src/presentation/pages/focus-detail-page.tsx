import type { StudyWeek } from "@/domain/entities/study-week";
import { Link, useParams, Navigate } from "react-router-dom";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";

const RESOURCES = {
  "C-PY": {
    name: "Python for Everybody (U. Michigan)",
    url: "https://www.coursera.org/specializations/python",
  },
  "C-ML": {
    name: "Machine Learning Specialization (DeepLearning.AI)",
    url: "https://www.coursera.org/specializations/machine-learning-introduction",
  },
  "C-MATH": {
    name: "Mathematics for Machine Learning and Data Science (DeepLearning.AI)",
    url: "https://www.coursera.org/specializations/mathematics-for-machine-learning-and-data-science",
  },
  "C-DL": {
    name: "Deep Learning Specialization (DeepLearning.AI)",
    url: "https://www.coursera.org/specializations/deep-learning",
  },
  "C-CV": {
    name: "Computer Vision Specialization (Coursera)",
    url: "https://www.coursera.org/specializations/computer-vision-cu",
  },
  "C-NLP": {
    name: "Natural Language Processing Specialization (DeepLearning.AI)",
    url: "https://www.coursera.org/specializations/natural-language-processing",
  },
  "C-GEN": {
    name: "Generative AI with Large Language Models (AWS)",
    url: "https://www.coursera.org/learn/generative-ai-with-llms",
  },
  "C-PROD": {
    name: "Machine Learning in Production (DeepLearning.AI)",
    url: "https://www.coursera.org/learn/introduction-to-machine-learning-in-production",
  },
  "C-MLOPS": {
    name: "MLOps Specialization (Duke)",
    url: "https://www.coursera.org/specializations/mlops-machine-learning-duke",
  },
  "C-RL": {
    name: "Reinforcement Learning Specialization (U. Alberta)",
    url: "https://www.coursera.org/specializations/reinforcement-learning",
  },
  "KA-Pre": {
    name: "Pre-algebra (Khan Academy)",
    url: "https://www.khanacademy.org/math/pre-algebra",
  },
  "KA-A1": {
    name: "Algebra 1 (Khan Academy)",
    url: "https://www.khanacademy.org/math/algebra",
  },
  "KA-A2": {
    name: "Algebra 2 (Khan Academy)",
    url: "https://www.khanacademy.org/math/algebra2",
  },
  "KA-LA": {
    name: "Linear Algebra (Khan Academy)",
    url: "https://www.khanacademy.org/math/linear-algebra",
  },
  "KA-STAT": {
    name: "Statistics & Probability (Khan Academy)",
    url: "https://www.khanacademy.org/math/statistics-probability",
  },
  "KA-CALC1": {
    name: "Calculus 1 (Khan Academy)",
    url: "https://www.khanacademy.org/math/calculus-1",
  },
  "KA-MVC": {
    name: "Multivariable Calculus (Khan Academy)",
    url: "https://www.khanacademy.org/math/multivariable-calculus",
  },
};

function getResourceDetail(taskStr: string) {
  for (const [key, details] of Object.entries(RESOURCES)) {
    if (taskStr.includes(key)) {
      return details;
    }
  }
  return null;
}

interface FocusDetailPageProps {
  week: StudyWeek;
}

export function FocusDetailPage({ week }: FocusDetailPageProps) {
  const { area } = useParams<{ area: string }>();

  if (!area || !["coursera", "math", "deliverable"].includes(area)) {
    return <Navigate to="/overview" replace />;
  }

  const focusColors: Record<
    string,
    { border: string; bg: string; text: string; label: string }
  > = {
    coursera: {
      border: "border-blue-500/10",
      bg: "bg-blue-500/[0.04]",
      text: "text-blue-400",
      label: "Coursera Focus",
    },
    math: {
      border: "border-secondary/10",
      bg: "bg-secondary/[0.04]",
      text: "text-secondary",
      label: "Math Focus",
    },
    deliverable: {
      border: "border-primary/10",
      bg: "bg-primary/[0.04]",
      text: "text-primary",
      label: "Deliverable Focus",
    },
  };

  const style = focusColors[area];

  // The raw text from the roadmap markdown for the week
  let taskText = "";
  if (area === "coursera") taskText = week.coursera;
  if (area === "math") taskText = week.math;
  if (area === "deliverable") taskText = week.deliverable;

  const resourceDetail = getResourceDetail(taskText);

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="rounded-xl border-white/[0.08] bg-card/60 backdrop-blur-md"
        >
          <Link to="/overview">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Focus Detail</h2>
          <p className="text-sm text-muted-foreground tracking-wide">
            Week {week.weekNumber} · {week.dateRangeLabel}
          </p>
        </div>
      </div>

      <Card className="border-white/[0.06] bg-card/80 backdrop-blur-xl">
        <CardContent className="p-6 md:p-8 space-y-6">
          <article
            className={`space-y-4 rounded-xl border p-5 ${style.border} ${style.bg}`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-[0.18em] ${style.text}`}
            >
              {style.label}
            </span>
            <p className="text-lg font-medium leading-relaxed text-foreground/90">
              {taskText}
            </p>

            <div className="pt-2 text-sm text-muted-foreground border-t border-white/[0.06] mt-4">
              <span className="font-semibold block mb-1">
                Time Expectation:
              </span>
              <p>{week.timeSplit}</p>
            </div>
          </article>

          {resourceDetail && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Core Resource
              </h3>
              <a
                href={resourceDetail.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {resourceDetail.name}
                  </span>
                  <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {resourceDetail.url}
                </span>
              </a>
            </div>
          )}

          {area === "deliverable" && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Deliverable Instructions
              </h3>
              <p className="text-sm leading-6 text-foreground/80">
                You are expected to build and push this deliverable to your
                GitHub repository by the end of the week. This is where the
                practical learning happens. Ensure you log your session and mark
                the checkpoint once done.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

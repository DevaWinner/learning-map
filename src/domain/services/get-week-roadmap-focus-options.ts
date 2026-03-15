import type { FocusArea } from "@/domain/entities/study-session";
import type { StudyWeek } from "@/domain/entities/study-week";

export type RoadmapFocusOptionId = "coursera" | "math" | "deliverable";

export interface RoadmapFocusOption {
  id: RoadmapFocusOptionId;
  label: string;
  detail: string;
  focusArea: FocusArea;
}

function normalize(text: string) {
  return text.toLowerCase();
}

function includesAny(text: string, patterns: string[]) {
  return patterns.some((pattern) => text.includes(pattern));
}

function resolveFocusAreaFromText(text: string): FocusArea {
  const normalized = normalize(text);

  if (
    includesAny(normalized, [
      "c-mlops",
      "c-prod",
      "mlops",
      "fastapi",
      "docker",
      "deploy",
      "ci/cd",
      "model registry",
      "monitoring",
      "drift",
      "structured configs",
      "serving",
      "batching",
      "async jobs",
      "caching",
      "alert rules",
      "inference endpoint",
    ])
  ) {
    return "mlops";
  }

  if (
    includesAny(normalized, [
      "c-gen",
      "llm",
      "rag",
      "embeddings",
      "vector search",
      "prompting",
      "prompting patterns",
      "citations",
      "refusal modes",
      "safety",
      "evaluation harness",
    ])
  ) {
    return "genai";
  }

  if (
    includesAny(normalized, [
      "c-nlp",
      "bert",
      "tf-idf",
      "summarization",
      "q&a",
      "text classification",
      "embeddings comparison",
      "hugging face",
      "transformer",
    ])
  ) {
    return "nlp";
  }

  if (
    includesAny(normalized, [
      "c-dl",
      "c-cv",
      "fast.ai",
      "pytorch",
      "mnist",
      "cnn",
      "cifar",
      "resnet",
      "regularization",
      "batch norm",
      "rnn",
      "gru",
      "transfer learning",
      "custom images",
      "deep rl",
    ])
  ) {
    return "deep-learning";
  }

  if (
    includesAny(normalized, [
      "c-math",
      "ka-pre",
      "ka-a1",
      "ka-a2",
      "ka-la",
      "ka-stat",
      "ka-calc1",
      "ka-mvc",
      "pre basics",
      "algebra",
      "calculus",
      "statistics",
      "linear algebra",
      "vectors",
      "matrices",
      "gradient descent",
    ])
  ) {
    return "math";
  }

  if (
    includesAny(normalized, [
      "c-py",
      "kaggle learn python",
      "ibm",
      "python for data science",
      "python",
      "jupyter",
      "loops",
      "functions",
      "csv reader",
      "word counter",
      "file i/o",
      "scripts",
      "calculator",
      "unit converter",
    ])
  ) {
    return "python";
  }

  if (
    includesAny(normalized, [
      "c-ml",
      "kaggle intro to ml",
      "scikit-learn",
      "sklearn",
      "linear regression",
      "logistic regression",
      "classification",
      "clustering",
      "pca",
      "anomaly detection",
      "cross-validation",
      "feature engineering",
      "pipelines",
      "bandits",
      "q-learning",
      "policy evaluation",
      "machine learning",
    ])
  ) {
    return "ml";
  }

  if (
    includesAny(normalized, [
      "portfolio",
      "final wrap",
      "buffer",
      "catch-up",
      "polish",
      "resume",
      "case study",
      "ethics",
    ])
  ) {
    return "review";
  }

  return "projects";
}

export function getWeekRoadmapFocusOptions(
  week: StudyWeek,
): RoadmapFocusOption[] {
  return [
    {
      id: "coursera",
      label: "Coursera",
      detail: week.coursera,
      focusArea: resolveFocusAreaFromText(week.coursera),
    },
    {
      id: "math",
      label: "Math",
      detail: week.math,
      focusArea: "math",
    },
    {
      id: "deliverable",
      label: "Deliverable",
      detail: week.deliverable,
      focusArea: resolveFocusAreaFromText(
        `${week.deliverable} ${week.coursera} ${week.phase}`,
      ),
    },
  ];
}

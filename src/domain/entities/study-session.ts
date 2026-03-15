export type FocusArea =
  | "python"
  | "math"
  | "ml"
  | "deep-learning"
  | "nlp"
  | "genai"
  | "mlops"
  | "projects"
  | "review"
  | "other";

export interface StudySession {
  id: string;
  weekNumber: number;
  date: string;
  hours: number;
  focusArea: FocusArea;
  task: string;
  notes: string;
  outcome: string;
  createdAt: string;
  updatedAt: string;
}

export const focusAreaLabels: Record<FocusArea, string> = {
  python: "Python",
  math: "Math",
  ml: "ML",
  "deep-learning": "Deep Learning",
  nlp: "NLP",
  genai: "GenAI",
  mlops: "MLOps",
  projects: "Projects",
  review: "Review",
  other: "Other",
};

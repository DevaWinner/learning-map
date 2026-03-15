export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface StudySessionRow {
  id: string;
  week_number: number;
  date: string;
  hours: number;
  focus_area: string;
  task: string;
  notes: string;
  outcome: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyCheckpointRow {
  week_number: number;
  deliverable_status: string;
  blockers: string;
  next_action: string;
  summary_note: string;
  updated_at: string;
}

export interface ProjectFocusRow {
  id: string;
  name: string;
  tagline: string;
  desired_outcome: string;
  status: string;
  notes: string;
  updated_at: string;
}

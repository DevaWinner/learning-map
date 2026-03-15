export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      study_sessions: {
        Row: {
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
        };
        Insert: {
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
        };
        Update: {
          id?: string;
          week_number?: number;
          date?: string;
          hours?: number;
          focus_area?: string;
          task?: string;
          notes?: string;
          outcome?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      weekly_checkpoints: {
        Row: {
          week_number: number;
          deliverable_status: string;
          blockers: string;
          next_action: string;
          summary_note: string;
          updated_at: string;
        };
        Insert: {
          week_number: number;
          deliverable_status: string;
          blockers: string;
          next_action: string;
          summary_note: string;
          updated_at: string;
        };
        Update: {
          week_number?: number;
          deliverable_status?: string;
          blockers?: string;
          next_action?: string;
          summary_note?: string;
          updated_at?: string;
        };
      };
      project_focuses: {
        Row: {
          id: string;
          name: string;
          tagline: string;
          desired_outcome: string;
          status: string;
          notes: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          tagline: string;
          desired_outcome: string;
          status: string;
          notes: string;
          updated_at: string;
        };
        Update: {
          id?: string;
          name?: string;
          tagline?: string;
          desired_outcome?: string;
          status?: string;
          notes?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

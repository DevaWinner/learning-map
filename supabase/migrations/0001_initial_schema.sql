-- Supabase Migration: 0001_initial_schema.sql
-- Enables offline-first PWA sync for Roadmap OS

-- 1. Create study_sessions table
CREATE TABLE study_sessions (
    id TEXT PRIMARY KEY,
    week_number INTEGER NOT NULL,
    date TEXT NOT NULL,
    hours NUMERIC(4, 2) NOT NULL,
    focus_area TEXT NOT NULL,
    task TEXT NOT NULL,
    notes TEXT NOT NULL,
    outcome TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 2. Create weekly_checkpoints table
CREATE TABLE weekly_checkpoints (
    week_number INTEGER PRIMARY KEY,
    deliverable_status TEXT NOT NULL,
    blockers TEXT NOT NULL,
    next_action TEXT NOT NULL,
    summary_note TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 3. Create project_focuses table
CREATE TABLE project_focuses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    desired_outcome TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Enable RLS (Row Level Security) - currently set to allow all operations for development
-- Once auth is added, this will be restricted to authenticated users matching auth.uid()
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for development" ON study_sessions FOR ALL USING (true);

ALTER TABLE weekly_checkpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for development" ON weekly_checkpoints FOR ALL USING (true);

ALTER TABLE project_focuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for development" ON project_focuses FOR ALL USING (true);

-- Functions to auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trps_study_sessions BEFORE UPDATE ON study_sessions FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trps_weekly_checkpoints BEFORE UPDATE ON weekly_checkpoints FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER trps_project_focuses BEFORE UPDATE ON project_focuses FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

export const initialSchemaSQL = `
-- 1. Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
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
CREATE TABLE IF NOT EXISTS weekly_checkpoints (
    week_number INTEGER PRIMARY KEY,
    deliverable_status TEXT NOT NULL,
    blockers TEXT NOT NULL,
    next_action TEXT NOT NULL,
    summary_note TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 3. Create project_focuses table
CREATE TABLE IF NOT EXISTS project_focuses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    desired_outcome TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
`;

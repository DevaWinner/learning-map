import { neon } from "@neondatabase/serverless";

export const config = {
  runtime: "edge", // Use Vercel Edge Functions for fast global execution
};

export default async function handler(req: Request) {
  // 1. Basic CORS to allow the PWA to call this endpoint from anywhere
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // 2. Authentication using a strictly secure Vercel environment variable
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.SYNC_AUTH_TOKEN;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 3. Connect to Neon Database
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return new Response(JSON.stringify({ error: "DATABASE_URL is missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sql = neon(databaseUrl);

  try {
    if (req.method === "GET") {
      // PULL: Client is asking for the entire database state
      const [sessions, checkpoints, projects] = await Promise.all([
        sql`SELECT * FROM study_sessions`,
        sql`SELECT * FROM weekly_checkpoints`,
        sql`SELECT * FROM project_focuses`,
      ]);

      return new Response(
        JSON.stringify({
          studySessions: sessions,
          weeklyCheckpoints: checkpoints,
          projectFocuses: projects,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    if (req.method === "POST") {
      // PUSH: Client is uploading an array of queued Dexie mutations
      const { mutations } = await req.json();

      if (!Array.isArray(mutations)) {
        return new Response(JSON.stringify({ error: "Invalid payload" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // In a real production edge environment, you would use neon's transaction API (transaction())
      // or batch API (neonBatch()) but those depend on the specific WebSocket/HTTP configuration.
      // For Vercel Edge with HTTP, we use the standard query method consecutively.
      for (const mutation of mutations) {
        const p = mutation.payload;

        if (mutation.action === "UPSERT") {
          if (mutation.tableName === "study_sessions") {
            await sql`
              INSERT INTO study_sessions (id, week_number, date, hours, focus_area, task, notes, outcome, created_at, updated_at)
              VALUES (${p.id}, ${p.weekNumber}, ${p.date}, ${p.hours}, ${p.focusArea}, ${p.task}, ${p.notes ?? ""}, ${p.outcome ?? ""}, ${p.createdAt}, ${p.updatedAt})
              ON CONFLICT (id) DO UPDATE SET
                week_number = EXCLUDED.week_number,
                date = EXCLUDED.date,
                hours = EXCLUDED.hours,
                focus_area = EXCLUDED.focus_area,
                task = EXCLUDED.task,
                notes = EXCLUDED.notes,
                outcome = EXCLUDED.outcome,
                created_at = EXCLUDED.created_at,
                updated_at = EXCLUDED.updated_at
            `;
          } else if (mutation.tableName === "weekly_checkpoints") {
            await sql`
              INSERT INTO weekly_checkpoints (week_number, deliverable_status, blockers, next_action, summary_note, updated_at)
              VALUES (${p.weekNumber}, ${p.deliverableStatus}, ${p.blockers ?? ""}, ${p.nextAction ?? ""}, ${p.summaryNote ?? ""}, ${p.updatedAt})
              ON CONFLICT (week_number) DO UPDATE SET
                deliverable_status = EXCLUDED.deliverable_status,
                blockers = EXCLUDED.blockers,
                next_action = EXCLUDED.next_action,
                summary_note = EXCLUDED.summary_note,
                updated_at = EXCLUDED.updated_at
            `;
          } else if (mutation.tableName === "project_focuses") {
            await sql`
              INSERT INTO project_focuses (id, name, tagline, desired_outcome, status, notes, updated_at)
              VALUES (${p.id}, ${p.name}, ${p.tagline}, ${p.desiredOutcome}, ${p.status}, ${p.notes ?? ""}, ${p.updatedAt})
              ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                tagline = EXCLUDED.tagline,
                desired_outcome = EXCLUDED.desired_outcome,
                status = EXCLUDED.status,
                notes = EXCLUDED.notes,
                updated_at = EXCLUDED.updated_at
            `;
          }
        } else if (mutation.action === "DELETE") {
          if (mutation.tableName === "weekly_checkpoints") {
            await sql`DELETE FROM weekly_checkpoints WHERE week_number = ${parseInt(mutation.recordId)}`;
          } else {
            // For safety, construct the table query dynamically.
            // Neon accepts raw strings for table names but not via parameterized helpers safely without transaction bindings.
            // We do hardcoded matching to be secure against SQL injection on the table name string
            if (mutation.tableName === "study_sessions") {
              await sql`DELETE FROM study_sessions WHERE id = ${mutation.recordId}`;
            } else if (mutation.tableName === "project_focuses") {
              await sql`DELETE FROM project_focuses WHERE id = ${mutation.recordId}`;
            }
          }
        }
      }

      return new Response(
        JSON.stringify({ success: true, processed: mutations.length }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error("NeonDB Sync Error Details:", {
      message: err.message,
      name: err.name,
      stack: err.stack,
      cause: err.cause,
    });

    // Send back the exact error message so the PWA client can log it in the console
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: err.message,
        name: err.name,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

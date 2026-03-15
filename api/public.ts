import { neon } from "@neondatabase/serverless";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return new Response(JSON.stringify({ error: "DATABASE_URL is missing" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const sql = neon(databaseUrl);

  try {
    // Fetch data but we will sanitize it before sending
    const [sessions, projects] = await Promise.all([
      sql`SELECT id, week_number as "weekNumber", date, hours, focus_area as "focusArea", created_at as "createdAt", updated_at as "updatedAt" FROM study_sessions`,
      sql`SELECT id, name, tagline, status, updated_at as "updatedAt" FROM project_focuses`,
    ]);

    // Format the response, explicitly excluding notes, tasks, and outcomes from sessions
    // and excluding desired_outcome and notes from projects.
    return new Response(
      JSON.stringify({
        studySessions: sessions,
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
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
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

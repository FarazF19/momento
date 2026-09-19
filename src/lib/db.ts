import "server-only";
import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

let client: Sql | null | undefined;

export function getDb(): Sql | null {
  if (client !== undefined) return client;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    client = null;
    return client;
  }

  client = postgres(connectionString, {
    max: 5,
    idle_timeout: 20,
    prepare: false,
  });

  return client;
}

export function requireDb(): Sql {
  const sql = getDb();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  return sql;
}

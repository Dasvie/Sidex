import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  // drizzle-kit generate needs no connection; migrations are applied by src/db/migrate.ts
  dbCredentials: { url: process.env.DATABASE_URL || "postgres://local/placeholder" },
});

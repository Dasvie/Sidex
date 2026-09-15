/* Applies ./drizzle/*.sql to whichever database `db` points at. Run: npm run db:migrate */
import { db, isLocalDb } from "./index";

async function main() {
  if (isLocalDb) {
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    await migrate(db as unknown as Parameters<typeof migrate>[0], { migrationsFolder: "./drizzle" });
  } else {
    const { migrate } = await import("drizzle-orm/neon-http/migrator");
    await migrate(db as unknown as Parameters<typeof migrate>[0], { migrationsFolder: "./drizzle" });
  }
  console.log(isLocalDb ? "migrated: pglite (./.pglite)" : "migrated: neon");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });

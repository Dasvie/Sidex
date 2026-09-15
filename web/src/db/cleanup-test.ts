/* Removes the rows a login-flow check leaves behind: every review and comment whose body is
   tagged "(삭제 예정)", then rewrites the aggregates of the products touched.
   Run: npx tsx src/db/cleanup-test.ts (dev server stopped; PGlite is single-process). */
import { inArray, like, or } from "drizzle-orm";
import { db } from "./index";
import { comments, reviews } from "./schema";
import { refreshAggregates } from "../lib/rank";

async function main() {
  const tag = "%(삭제 예정)%";
  const rs = await db.delete(reviews).where(or(like(reviews.good, tag), like(reviews.bad, tag))).returning({ productId: reviews.productId });
  const cs = await db.delete(comments).where(like(comments.body, tag)).returning({ productId: comments.productId });
  const ids = [...new Set([...rs, ...cs].map((r) => r.productId))];
  for (const id of ids) await refreshAggregates(id);
  console.log(`removed reviews ${rs.length}, comments ${cs.length}; refreshed ${ids.length} product(s)`);
  void inArray;
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });

/* Hands a seeded builder profile to the real member who signed in.
   npx tsx src/db/claim.ts <seeded-handle> <member-email>
   e.g. npx tsx src/db/claim.ts sidex you@gmail.com
   Products, reviews and comments of the seeded profile move to the member's profile;
   the seeded profile and its placeholder user row are removed. */
import { eq } from "drizzle-orm";
import { db } from "./index";
import { comments, products, profiles, reviews, users } from "./schema";

async function main() {
  const [handle, email] = process.argv.slice(2);
  if (!handle || !email) throw new Error("usage: claim.ts <seeded-handle> <member-email>");
  const seeded = await db.query.profiles.findFirst({ where: eq(profiles.handle, handle) });
  if (!seeded) throw new Error(`no profile with handle ${handle}`);
  const member = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!member) throw new Error(`no signed-in member with email ${email}. Log in once first.`);
  const target = await db.query.profiles.findFirst({ where: eq(profiles.id, member.id) });
  if (!target) throw new Error("member has no profile row yet");
  if (target.id === seeded.id) throw new Error("already the same profile");

  await db.update(products).set({ ownerId: target.id }).where(eq(products.ownerId, seeded.id));
  await db.update(reviews).set({ authorId: target.id }).where(eq(reviews.authorId, seeded.id));
  await db.update(comments).set({ authorId: target.id }).where(eq(comments.authorId, seeded.id));
  // keep the builder's public name and bio, and the short handle
  await db.update(profiles).set({ handle: `${handle}_old_${Date.now().toString(36)}` }).where(eq(profiles.id, seeded.id));
  await db.update(profiles).set({ handle, displayName: seeded.displayName, bio: target.bio || seeded.bio, linkUrl: target.linkUrl || seeded.linkUrl }).where(eq(profiles.id, target.id));
  await db.delete(users).where(eq(users.id, seeded.id)); // cascades to the seeded profile
  console.log(`claimed: @${handle} now belongs to ${email}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e.message || e); process.exit(1); });

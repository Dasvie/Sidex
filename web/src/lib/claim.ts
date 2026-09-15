/* Hands a seeded builder profile (its products, reviews, comments, handle) to a real member.
   Used by the db:claim script and, once, automatically on the owner's first sign-in
   (OWNER_EMAIL), so the deployment never needs the database URL typed into a terminal. */
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { comments, products, profiles, reviews, users } from "@/db/schema";

export async function claimSeeded(handle: string, email: string): Promise<string> {
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
  return `claimed: @${handle} now belongs to ${email}`;
}

/** True while the seeded @sidex still belongs to its placeholder user. */
export async function seededUnclaimed(handle: string, userId: string): Promise<boolean> {
  const seeded = await db.query.profiles.findFirst({ where: eq(profiles.handle, handle), columns: { id: true } });
  return !!seeded && seeded.id !== userId;
}

/* Hands a seeded builder profile to the real member who signed in.
   npx tsx src/db/claim.ts <seeded-handle> <member-email>
   e.g. npx tsx src/db/claim.ts sidex you@gmail.com
   The same happens automatically on the first sign-in of OWNER_EMAIL (see src/auth.ts). */
import { claimSeeded } from "@/lib/claim";

async function main() {
  const [handle, email] = process.argv.slice(2);
  if (!handle || !email) throw new Error("usage: claim.ts <seeded-handle> <member-email>");
  console.log(await claimSeeded(handle, email));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e.message || e); process.exit(1); });

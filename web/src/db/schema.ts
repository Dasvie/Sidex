import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

/* ---------- Auth.js tables (shape required by @auth/drizzle-adapter) ---------- */
export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

/* ---------- Sidex ---------- */
export const profiles = pgTable("profile", {
  id: text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  handle: text("handle").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio").notNull().default(""),
  linkUrl: text("link_url").notNull().default(""),
  avatarUrl: text("avatar_url").notNull().default(""),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export type Dna = {
  palette: string[];
  fonts: string[];
  measuredAt: string;
};

export const products = pgTable(
  "product",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull(),
    // English copy for entries Sidex curates (the sources are English); members write once.
    taglineEn: text("tagline_en").notNull().default(""),
    descriptionEn: text("description_en").notNull().default(""),
    url: text("url").notNull(),
    logoUrl: text("logo_url").notNull().default(""),
    why: text("why").notNull().default(""),
    description: text("description").notNull().default(""),
    // Longer description shown above the screenshots; curated entries carry the product's own
    // homepage description (meta description), members write their own.
    detail: text("detail").notNull().default(""),
    detailEn: text("detail_en").notNull().default(""),
    stage: text("stage").notNull().default("launched"),
    categories: text("categories").array().notNull(),
    // Planning-map topics the maker picked under those categories, e.g. "productivity/notes-and-docs"
    topics: text("topics").array().notNull().default(sql`'{}'::text[]`),
    // null for curated entries Sidex introduces itself (Notion, Figma, Linear)
    ownerId: text("owner_id").references(() => profiles.id, { onDelete: "set null" }),
    source: text("source").notNull().default("member"), // member | curated
    stack: text("stack").notNull().default(""),
    tools: text("tools").notNull().default(""),
    buildDays: integer("build_days"),
    teamSize: integer("team_size"),
    dna: jsonb("dna").$type<Dna | null>(),
    // A DESIGN.md (front matter tokens + markdown body). Curated entries carry the published
    // analysis from getdesign.md; members may paste their own later.
    designMd: text("design_md").notNull().default(""),
    designMdSource: text("design_md_source").notNull().default(""),
    // Who actually made it, for entries without a Sidex builder account. Facts with a source URL.
    makerName: text("maker_name").notNull().default(""),
    makerDetail: text("maker_detail").notNull().default(""),
    makerDetailEn: text("maker_detail_en").notNull().default(""),
    makerUrl: text("maker_url").notNull().default(""),
    makerSource: text("maker_source").notNull().default(""),
    // aggregates, rewritten on every review/comment write (ranking sorts on these)
    ratingAvg: integer("rating_avg_x10").notNull().default(0), // stored x10 to stay integer
    reviewCount: integer("review_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    replyCount: integer("reply_count").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
);

export const screenshots = pgTable("screenshot", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: text("title").notNull().default(""),
  caption: text("caption").notNull().default(""),
  sort: integer("sort").notNull().default(0),
});

export const reviews = pgTable(
  "review",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    authorId: text("author_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    stars: integer("stars").notNull(),
    good: text("good").notNull(),
    bad: text("bad").notNull(),
    ux: integer("ux").notNull(),
    polish: integer("polish").notNull(),
    design: integer("design").notNull(),
    originality: integer("originality").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("review_one_per_author").on(t.productId, t.authorId)],
);

export const comments = pgTable("comment", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  parentId: integer("parent_id"), // one level: a reply points at a top-level comment
  body: text("body").notNull(),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

/* A maker's own answer at one node of the planning map. nodeId is the map path
   (e.g. "f/problem/pain-point"); one note per node per product. */
export const planNotes = pgTable(
  "plan_note",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    nodeId: text("node_id").notNull(),
    body: text("body").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("plan_note_one_per_node").on(t.productId, t.nodeId)],
);

/* A reader's vote on one maker's note: +1 agree, -1 disagree. One per person per node. */
export const planVotes = pgTable(
  "plan_vote",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    nodeId: text("node_id").notNull(),
    voterId: text("voter_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    value: integer("value").notNull(), // 1 | -1
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("plan_vote_one_per_voter").on(t.productId, t.nodeId, t.voterId)],
);

export type Product = typeof products.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Screenshot = typeof screenshots.$inferSelect;

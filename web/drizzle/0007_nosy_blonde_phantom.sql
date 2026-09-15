CREATE TABLE "plan_vote" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"node_id" text NOT NULL,
	"voter_id" text NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plan_vote" ADD CONSTRAINT "plan_vote_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_vote" ADD CONSTRAINT "plan_vote_voter_id_profile_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "plan_vote_one_per_voter" ON "plan_vote" USING btree ("product_id","node_id","voter_id");
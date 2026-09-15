CREATE TABLE "plan_note" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"node_id" text NOT NULL,
	"body" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plan_note" ADD CONSTRAINT "plan_note_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "plan_note_one_per_node" ON "plan_note" USING btree ("product_id","node_id");
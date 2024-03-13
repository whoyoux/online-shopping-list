CREATE TABLE IF NOT EXISTS "social-app_shopping_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "social-app_shopping_list_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "social-app_shopping_list_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"list_id" uuid NOT NULL,
	"label" text NOT NULL,
	"is_done" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "social-app_shopping_list_item_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "social-app_shopping_list_item" ADD CONSTRAINT "social-app_shopping_list_item_list_id_social-app_shopping_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "social-app_shopping_list"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

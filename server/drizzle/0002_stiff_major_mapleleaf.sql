CREATE TABLE "profile_pics" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" char(21) PRIMARY KEY NOT NULL,
	"selected" boolean NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" char(21) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_pics" ADD CONSTRAINT "profile_pics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
CREATE TABLE "direct_messages" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" char(21) PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_to_direct_messages" (
	"from_id" char(21) NOT NULL,
	"to_id" char(21) NOT NULL,
	CONSTRAINT "users_to_direct_messages_from_id_to_id_pk" PRIMARY KEY("from_id","to_id")
);
--> statement-breakpoint
ALTER TABLE "users_to_direct_messages" ADD CONSTRAINT "users_to_direct_messages_from_id_users_id_fk" FOREIGN KEY ("from_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_direct_messages" ADD CONSTRAINT "users_to_direct_messages_to_id_users_id_fk" FOREIGN KEY ("to_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
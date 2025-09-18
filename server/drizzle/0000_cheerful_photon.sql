CREATE TABLE "chats" (
	"author_id" char(26) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" char(26) PRIMARY KEY NOT NULL,
	"room_id" char(26) NOT NULL,
	"text" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "direct_messages" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" char(26) PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_pics" (
	"20" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" char(26) PRIMARY KEY NOT NULL,
	"selected" boolean NOT NULL,
	"success" boolean NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" char(26) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"id" char(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"id" char(26) PRIMARY KEY NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users_to_direct_messages" (
	"from_id" char(26) NOT NULL,
	"to_id" char(26) NOT NULL,
	CONSTRAINT "users_to_direct_messages_from_id_to_id_pk" PRIMARY KEY("from_id","to_id")
);
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_pics" ADD CONSTRAINT "profile_pics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_direct_messages" ADD CONSTRAINT "users_to_direct_messages_from_id_users_id_fk" FOREIGN KEY ("from_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_direct_messages" ADD CONSTRAINT "users_to_direct_messages_to_id_users_id_fk" FOREIGN KEY ("to_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
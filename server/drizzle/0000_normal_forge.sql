CREATE TABLE "users" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"displayName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

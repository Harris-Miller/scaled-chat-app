CREATE TABLE "canvas" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" char(26) PRIMARY KEY NOT NULL,
	"room_id" char(26) NOT NULL,
	"text" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "canvas" ADD CONSTRAINT "canvas_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "users_to_rooms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users_to_rooms" CASCADE;--> statement-breakpoint
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_admin_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "admin_id";
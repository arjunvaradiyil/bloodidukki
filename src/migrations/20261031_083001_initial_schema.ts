import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_donations_gender" AS ENUM('Male', 'Female', 'Other');
  CREATE TYPE "public"."enum_donations_blood_group" AS ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');
  CREATE TYPE "public"."enum_donations_donated_before" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_hospitals_kind" AS ENUM('hospital', 'blood-bank');
  CREATE TYPE "public"."enum_hospitals_block" AS ENUM('elappara', 'peerumade', 'vandanmedu', 'kattappana', 'idukki', 'nedumkandam', 'santhanpara', 'rajakkad', 'adimali', 'munnar', 'marayur', 'moolamattom', 'thodupuzha-west', 'thodupuzha-east', 'karimannoor');
  CREATE TYPE "public"."enum_blood_requests_blood_group" AS ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');
  CREATE TYPE "public"."enum_blood_requests_block" AS ENUM('elappara', 'peerumade', 'vandanmedu', 'kattappana', 'idukki', 'nedumkandam', 'santhanpara', 'rajakkad', 'adimali', 'munnar', 'marayur', 'moolamattom', 'thodupuzha-west', 'thodupuzha-east', 'karimannoor');
  CREATE TYPE "public"."enum_home_stats_icon" AS ENUM('drop', 'people', 'heart');
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "donations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"district" varchar DEFAULT 'Idukki' NOT NULL,
  	"block" varchar NOT NULL,
  	"mekhala" varchar NOT NULL,
  	"age" numeric NOT NULL,
  	"gender" "enum_donations_gender" NOT NULL,
  	"blood_group" "enum_donations_blood_group" NOT NULL,
  	"mobile" varchar NOT NULL,
  	"email" varchar,
  	"address" varchar NOT NULL,
  	"donated_before" "enum_donations_donated_before" NOT NULL,
  	"last_donation_date" timestamp(3) with time zone,
  	"preferred_date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "hospitals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"kind" "enum_hospitals_kind" DEFAULT 'hospital' NOT NULL,
  	"block" "enum_hospitals_block" NOT NULL,
  	"place" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"phone" varchar,
  	"notes" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blood_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"patient_name" varchar NOT NULL,
  	"blood_group" "enum_blood_requests_blood_group" NOT NULL,
  	"units" numeric NOT NULL,
  	"hospital" varchar NOT NULL,
  	"block" "enum_blood_requests_block" NOT NULL,
  	"needed_by" timestamp(3) with time zone NOT NULL,
  	"requester_name" varchar NOT NULL,
  	"mobile" varchar NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"mobile" varchar NOT NULL,
  	"email" varchar,
  	"message" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"donations_id" integer,
  	"hospitals_id" integer,
  	"blood_requests_id" integer,
  	"contact_messages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_text_primary" varchar DEFAULT 'Jeevanam' NOT NULL,
  	"logo_text_accent" varchar DEFAULT 'Idukki' NOT NULL,
  	"cta_label" varchar DEFAULT 'Donate Now' NOT NULL,
  	"cta_href" varchar DEFAULT '#donate' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_stats_icon" DEFAULT 'drop' NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "home_why_donate_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "home_eligibility_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_headline_primary" varchar DEFAULT 'One Donation.' NOT NULL,
  	"hero_headline_accent" varchar DEFAULT 'Countless Lives.' NOT NULL,
  	"hero_subheadline" varchar DEFAULT 'Your blood can be someone''s second chance.' NOT NULL,
  	"hero_description" varchar DEFAULT 'Every drop you donate helps save lives, supports families, and builds a stronger community.' NOT NULL,
  	"hero_background_image_id" integer,
  	"hero_background_video" varchar,
  	"hero_primary_cta_label" varchar DEFAULT 'Donate Blood' NOT NULL,
  	"hero_primary_cta_href" varchar DEFAULT '#donate' NOT NULL,
  	"hero_secondary_cta_label" varchar DEFAULT 'Contact Us' NOT NULL,
  	"hero_secondary_cta_href" varchar DEFAULT '#contact' NOT NULL,
  	"about_title" varchar DEFAULT 'About Us',
  	"about_body" varchar DEFAULT 'We connect willing donors with patients who need blood urgently across Idukki and beyond. Our camps, hospital partnerships, and volunteer network make donation simple, safe, and impactful.',
  	"why_donate_title" varchar DEFAULT 'Why Donate',
  	"eligibility_title" varchar DEFAULT 'Eligibility',
  	"faq_title" varchar DEFAULT 'FAQ',
  	"contact_title" varchar DEFAULT 'Contact',
  	"contact_body" varchar DEFAULT 'Ready to donate or host a camp? Reach out and we’ll help you get started.',
  	"contact_email" varchar DEFAULT 'hello@donateblood.org',
  	"contact_phone" varchar DEFAULT '+91 98765 43210',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donations_fk" FOREIGN KEY ("donations_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hospitals_fk" FOREIGN KEY ("hospitals_id") REFERENCES "public"."hospitals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blood_requests_fk" FOREIGN KEY ("blood_requests_id") REFERENCES "public"."blood_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_stats" ADD CONSTRAINT "home_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_why_donate_items" ADD CONSTRAINT "home_why_donate_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_eligibility_items" ADD CONSTRAINT "home_eligibility_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_faq_items" ADD CONSTRAINT "home_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_background_image_id_media_id_fk" FOREIGN KEY ("hero_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "donations_mobile_idx" ON "donations" USING btree ("mobile");
  CREATE INDEX "donations_updated_at_idx" ON "donations" USING btree ("updated_at");
  CREATE INDEX "donations_created_at_idx" ON "donations" USING btree ("created_at");
  CREATE INDEX "hospitals_updated_at_idx" ON "hospitals" USING btree ("updated_at");
  CREATE INDEX "hospitals_created_at_idx" ON "hospitals" USING btree ("created_at");
  CREATE INDEX "blood_requests_mobile_idx" ON "blood_requests" USING btree ("mobile");
  CREATE INDEX "blood_requests_updated_at_idx" ON "blood_requests" USING btree ("updated_at");
  CREATE INDEX "blood_requests_created_at_idx" ON "blood_requests" USING btree ("created_at");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_donations_id_idx" ON "payload_locked_documents_rels" USING btree ("donations_id");
  CREATE INDEX "payload_locked_documents_rels_hospitals_id_idx" ON "payload_locked_documents_rels" USING btree ("hospitals_id");
  CREATE INDEX "payload_locked_documents_rels_blood_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("blood_requests_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "home_stats_order_idx" ON "home_stats" USING btree ("_order");
  CREATE INDEX "home_stats_parent_id_idx" ON "home_stats" USING btree ("_parent_id");
  CREATE INDEX "home_why_donate_items_order_idx" ON "home_why_donate_items" USING btree ("_order");
  CREATE INDEX "home_why_donate_items_parent_id_idx" ON "home_why_donate_items" USING btree ("_parent_id");
  CREATE INDEX "home_eligibility_items_order_idx" ON "home_eligibility_items" USING btree ("_order");
  CREATE INDEX "home_eligibility_items_parent_id_idx" ON "home_eligibility_items" USING btree ("_parent_id");
  CREATE INDEX "home_faq_items_order_idx" ON "home_faq_items" USING btree ("_order");
  CREATE INDEX "home_faq_items_parent_id_idx" ON "home_faq_items" USING btree ("_parent_id");
  CREATE INDEX "home_hero_hero_background_image_idx" ON "home" USING btree ("hero_background_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "donations" CASCADE;
  DROP TABLE "hospitals" CASCADE;
  DROP TABLE "blood_requests" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "home_stats" CASCADE;
  DROP TABLE "home_why_donate_items" CASCADE;
  DROP TABLE "home_eligibility_items" CASCADE;
  DROP TABLE "home_faq_items" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TYPE "public"."enum_donations_gender";
  DROP TYPE "public"."enum_donations_blood_group";
  DROP TYPE "public"."enum_donations_donated_before";
  DROP TYPE "public"."enum_hospitals_kind";
  DROP TYPE "public"."enum_hospitals_block";
  DROP TYPE "public"."enum_blood_requests_blood_group";
  DROP TYPE "public"."enum_blood_requests_block";
  DROP TYPE "public"."enum_home_stats_icon";`)
}

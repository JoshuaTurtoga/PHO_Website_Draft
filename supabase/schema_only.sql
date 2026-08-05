


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_admin"() IS 'Returns true when the current authenticated user is a CMS admin.';



CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."contact_directory" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "phone" "text",
    "email" "text",
    "extra" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."contact_directory" OWNER TO "postgres";


COMMENT ON TABLE "public"."contact_directory" IS 'Repeating office and hospital contact entries used by the public contact directory.';



CREATE TABLE IF NOT EXISTS "public"."emailjs_config" (
    "id" integer DEFAULT 1 NOT NULL,
    "service_id" "text",
    "template_id" "text",
    "public_key" "text",
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "emailjs_config_id_check" CHECK (("id" = 1))
);


ALTER TABLE "public"."emailjs_config" OWNER TO "postgres";


COMMENT ON TABLE "public"."emailjs_config" IS 'Single-row EmailJS configuration read by the contact form and managed through the CMS.';



CREATE TABLE IF NOT EXISTS "public"."hospital_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hospital_slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "url" "text",
    "license_group" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "image_url" "text"
);


ALTER TABLE "public"."hospital_cards" OWNER TO "postgres";


COMMENT ON TABLE "public"."hospital_cards" IS 'Editable cards for the Hospitals landing page.';



CREATE TABLE IF NOT EXISTS "public"."hospital_programs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hospital_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "body" "text",
    "badge" "text",
    "is_covid" boolean DEFAULT false NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."hospital_programs" OWNER TO "postgres";


COMMENT ON TABLE "public"."hospital_programs" IS 'Repeating milestones and programs for hospital pages, including optional Covid-specific entries.';



CREATE TABLE IF NOT EXISTS "public"."hospital_services" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hospital_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "intro" "text",
    "items" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."hospital_services" OWNER TO "postgres";


COMMENT ON TABLE "public"."hospital_services" IS 'Repeating service groups for each hospital. The items JSON stores bullet lists or nested service rows.';



CREATE TABLE IF NOT EXISTS "public"."hospitals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "short_name" "text",
    "license_group" "text",
    "page_path" "text" NOT NULL,
    "hero_title" "text",
    "hero_subtitle" "text",
    "hero_image_url" "text",
    "overview_title" "text",
    "overview_body" "text",
    "quote" "text",
    "offer_heading" "text",
    "offer_title" "text",
    "offer_body" "text",
    "phone" "text",
    "email_primary" "text",
    "email_secondary" "text",
    "location_text" "text",
    "facebook_url" "text",
    "facebook_label" "text",
    "map_embed_url" "text",
    "map_link_url" "text",
    "card_description" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "is_featured" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."hospitals" OWNER TO "postgres";


COMMENT ON TABLE "public"."hospitals" IS 'Hospital directory and the main editable fields for each hospital detail page.';



CREATE TABLE IF NOT EXISTS "public"."lab_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "url" "text",
    "icon_key" "text",
    "image_url" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."lab_cards" OWNER TO "postgres";


COMMENT ON TABLE "public"."lab_cards" IS 'Repeating laboratory and facility cards shown on the Laboratory page.';



CREATE TABLE IF NOT EXISTS "public"."page_sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "page_name" "text" NOT NULL,
    "section_key" "text" NOT NULL,
    "title" "text",
    "content" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."page_sections" OWNER TO "postgres";


COMMENT ON TABLE "public"."page_sections" IS 'Generic JSON content for non-repeating sections rendered by the public site and CMS dashboard.';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "role" "text" DEFAULT 'admin'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "profiles_role_check" CHECK (("role" = 'admin'::"text"))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'Maps authenticated Supabase users to the PHO CMS admin role.';



CREATE TABLE IF NOT EXISTS "public"."promotive_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "url" "text",
    "icon_key" "text",
    "image_url" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."promotive_cards" OWNER TO "postgres";


COMMENT ON TABLE "public"."promotive_cards" IS 'Repeating promotive and preventive service cards shown on the Promotive page.';



ALTER TABLE ONLY "public"."contact_directory"
    ADD CONSTRAINT "contact_directory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."emailjs_config"
    ADD CONSTRAINT "emailjs_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hospital_cards"
    ADD CONSTRAINT "hospital_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hospital_programs"
    ADD CONSTRAINT "hospital_programs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hospital_services"
    ADD CONSTRAINT "hospital_services_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hospitals"
    ADD CONSTRAINT "hospitals_page_path_key" UNIQUE ("page_path");



ALTER TABLE ONLY "public"."hospitals"
    ADD CONSTRAINT "hospitals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hospitals"
    ADD CONSTRAINT "hospitals_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."lab_cards"
    ADD CONSTRAINT "lab_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."page_sections"
    ADD CONSTRAINT "page_sections_page_section_unique" UNIQUE ("page_name", "section_key");



ALTER TABLE ONLY "public"."page_sections"
    ADD CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promotive_cards"
    ADD CONSTRAINT "promotive_cards_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "trg_contact_directory_updated_at" BEFORE UPDATE ON "public"."contact_directory" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_emailjs_config_updated_at" BEFORE UPDATE ON "public"."emailjs_config" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_hospital_cards_updated_at" BEFORE UPDATE ON "public"."hospital_cards" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_hospital_programs_updated_at" BEFORE UPDATE ON "public"."hospital_programs" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_hospital_services_updated_at" BEFORE UPDATE ON "public"."hospital_services" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_hospitals_updated_at" BEFORE UPDATE ON "public"."hospitals" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_lab_cards_updated_at" BEFORE UPDATE ON "public"."lab_cards" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_page_sections_updated_at" BEFORE UPDATE ON "public"."page_sections" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_promotive_cards_updated_at" BEFORE UPDATE ON "public"."promotive_cards" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."hospital_cards"
    ADD CONSTRAINT "hospital_cards_slug_fk" FOREIGN KEY ("hospital_slug") REFERENCES "public"."hospitals"("slug") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hospital_programs"
    ADD CONSTRAINT "hospital_programs_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hospital_services"
    ADD CONSTRAINT "hospital_services_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admin write contact directory" ON "public"."contact_directory" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admin write emailjs config" ON "public"."emailjs_config" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admin write hospital cards" ON "public"."hospital_cards" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admin write hospital programs" ON "public"."hospital_programs" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admin write hospital services" ON "public"."hospital_services" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admin write hospitals" ON "public"."hospitals" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admin write lab cards" ON "public"."lab_cards" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admin write page sections" ON "public"."page_sections" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admin write promotive cards" ON "public"."promotive_cards" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Profiles read own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Public read contact directory" ON "public"."contact_directory" FOR SELECT USING (true);



CREATE POLICY "Public read emailjs config" ON "public"."emailjs_config" FOR SELECT USING (true);



CREATE POLICY "Public read hospital cards" ON "public"."hospital_cards" FOR SELECT USING (true);



CREATE POLICY "Public read hospital programs" ON "public"."hospital_programs" FOR SELECT USING (true);



CREATE POLICY "Public read hospital services" ON "public"."hospital_services" FOR SELECT USING (true);



CREATE POLICY "Public read hospitals" ON "public"."hospitals" FOR SELECT USING (true);



CREATE POLICY "Public read lab cards" ON "public"."lab_cards" FOR SELECT USING (true);



CREATE POLICY "Public read page sections" ON "public"."page_sections" FOR SELECT USING (true);



CREATE POLICY "Public read promotive cards" ON "public"."promotive_cards" FOR SELECT USING (true);



ALTER TABLE "public"."contact_directory" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."emailjs_config" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hospital_cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hospital_programs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hospital_services" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hospitals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lab_cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."page_sections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."promotive_cards" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."contact_directory" TO "anon";
GRANT ALL ON TABLE "public"."contact_directory" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_directory" TO "service_role";



GRANT ALL ON TABLE "public"."emailjs_config" TO "anon";
GRANT ALL ON TABLE "public"."emailjs_config" TO "authenticated";
GRANT ALL ON TABLE "public"."emailjs_config" TO "service_role";



GRANT ALL ON TABLE "public"."hospital_cards" TO "anon";
GRANT ALL ON TABLE "public"."hospital_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."hospital_cards" TO "service_role";



GRANT ALL ON TABLE "public"."hospital_programs" TO "anon";
GRANT ALL ON TABLE "public"."hospital_programs" TO "authenticated";
GRANT ALL ON TABLE "public"."hospital_programs" TO "service_role";



GRANT ALL ON TABLE "public"."hospital_services" TO "anon";
GRANT ALL ON TABLE "public"."hospital_services" TO "authenticated";
GRANT ALL ON TABLE "public"."hospital_services" TO "service_role";



GRANT ALL ON TABLE "public"."hospitals" TO "anon";
GRANT ALL ON TABLE "public"."hospitals" TO "authenticated";
GRANT ALL ON TABLE "public"."hospitals" TO "service_role";



GRANT ALL ON TABLE "public"."lab_cards" TO "anon";
GRANT ALL ON TABLE "public"."lab_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."lab_cards" TO "service_role";



GRANT ALL ON TABLE "public"."page_sections" TO "anon";
GRANT ALL ON TABLE "public"."page_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."page_sections" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."promotive_cards" TO "anon";
GRANT ALL ON TABLE "public"."promotive_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."promotive_cards" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
































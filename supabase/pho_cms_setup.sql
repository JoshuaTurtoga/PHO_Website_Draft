-- Bohol Provincial Health Office CMS bootstrap
-- -------------------------------------------
-- Apply this script in the Supabase SQL Editor for the PHO website project.
-- It creates the CMS tables, enables RLS, and grants:
--   - public read access for website content
--   - admin-only write access for CMS users
--
-- Notes:
-- 1. Create the first authenticated admin user in Supabase Auth manually.
-- 2. After creating that user, insert a matching row into public.profiles.
-- 3. Create a public storage bucket named exactly: cms-assets
-- 4. Public pages can safely keep their existing static HTML as fallback content.

begin;

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Profiles: single-role CMS admin authorization
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.profiles is
  'Maps authenticated Supabase users to the PHO CMS admin role.';

-- -----------------------------------------------------------------------------
-- Shared timestamp helper
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Admin role helper used in RLS policies
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

comment on function public.is_admin() is
  'Returns true when the current authenticated user is a CMS admin.';

-- -----------------------------------------------------------------------------
-- Generic JSON-backed page sections
-- page_name examples: shared, home, about, laboratory, promotive, hospitals, contact
-- section_key examples: navbar, footer, hero, history, about_block, vmg
-- -----------------------------------------------------------------------------
create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_name text not null,
  section_key text not null,
  title text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint page_sections_page_section_unique unique (page_name, section_key)
);

comment on table public.page_sections is
  'Generic JSON content for non-repeating sections rendered by the public site and CMS dashboard.';

create table if not exists public.hospitals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text,
  license_group text,
  page_path text not null unique,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  overview_title text,
  overview_body text,
  quote text,
  offer_heading text,
  offer_title text,
  offer_body text,
  phone text,
  email_primary text,
  email_secondary text,
  location_text text,
  facebook_url text,
  facebook_label text,
  map_embed_url text,
  map_link_url text,
  card_description text,
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.hospitals is
  'Hospital directory and the main editable fields for each hospital detail page.';

create table if not exists public.hospital_services (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals (id) on delete cascade,
  title text not null,
  intro text,
  items jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.hospital_services is
  'Repeating service groups for each hospital. The items JSON stores bullet lists or nested service rows.';

create table if not exists public.hospital_programs (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals (id) on delete cascade,
  title text not null,
  body text,
  badge text,
  is_covid boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.hospital_programs is
  'Repeating milestones and programs for hospital pages, including optional Covid-specific entries.';

create table if not exists public.lab_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  icon_key text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.lab_cards is
  'Repeating laboratory and facility cards shown on the Laboratory page.';

create table if not exists public.promotive_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  icon_key text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.promotive_cards is
  'Repeating promotive and preventive service cards shown on the Promotive page.';

create table if not exists public.hospital_cards (
  id uuid primary key default gen_random_uuid(),
  hospital_slug text not null,
  title text not null,
  description text,
  url text,
  image_url text,
  license_group text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint hospital_cards_slug_fk
    foreign key (hospital_slug) references public.hospitals (slug)
    on update cascade
    on delete cascade
);

comment on table public.hospital_cards is
  'Editable cards for the Hospitals landing page.';

create table if not exists public.contact_directory (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  phone text,
  email text,
  extra text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.contact_directory is
  'Repeating office and hospital contact entries used by the public contact directory.';

create table if not exists public.emailjs_config (
  id integer primary key default 1 check (id = 1),
  service_id text,
  template_id text,
  public_key text,
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.emailjs_config is
  'Single-row EmailJS configuration read by the contact form and managed through the CMS.';

insert into public.emailjs_config (id)
values (1)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_page_sections_updated_at on public.page_sections;
create trigger trg_page_sections_updated_at
before update on public.page_sections
for each row execute function public.set_updated_at();

drop trigger if exists trg_hospitals_updated_at on public.hospitals;
create trigger trg_hospitals_updated_at
before update on public.hospitals
for each row execute function public.set_updated_at();

drop trigger if exists trg_hospital_services_updated_at on public.hospital_services;
create trigger trg_hospital_services_updated_at
before update on public.hospital_services
for each row execute function public.set_updated_at();

drop trigger if exists trg_hospital_programs_updated_at on public.hospital_programs;
create trigger trg_hospital_programs_updated_at
before update on public.hospital_programs
for each row execute function public.set_updated_at();

drop trigger if exists trg_lab_cards_updated_at on public.lab_cards;
create trigger trg_lab_cards_updated_at
before update on public.lab_cards
for each row execute function public.set_updated_at();

drop trigger if exists trg_promotive_cards_updated_at on public.promotive_cards;
create trigger trg_promotive_cards_updated_at
before update on public.promotive_cards
for each row execute function public.set_updated_at();

drop trigger if exists trg_hospital_cards_updated_at on public.hospital_cards;
create trigger trg_hospital_cards_updated_at
before update on public.hospital_cards
for each row execute function public.set_updated_at();

drop trigger if exists trg_contact_directory_updated_at on public.contact_directory;
create trigger trg_contact_directory_updated_at
before update on public.contact_directory
for each row execute function public.set_updated_at();

drop trigger if exists trg_emailjs_config_updated_at on public.emailjs_config;
create trigger trg_emailjs_config_updated_at
before update on public.emailjs_config
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Hospital shell records
-- -----------------------------------------------------------------------------
insert into public.hospitals (
  slug, name, short_name, license_group, page_path, sort_order, is_featured
) values
  ('gmph', 'Garcia Memorial Provincial Hospital', 'GMPH', 'DOH-Licensed Level II Hospital', 'hospital-gmph.html', 10, true),
  ('cdh', 'Catigbian District Hospital', 'CDH', 'DOH-Licensed Level I Hospitals', 'hospital-cdh.html', 20, false),
  ('fdmh', 'Francisco Dagohoy Municipal Hospital', 'FDMH', 'DOH-Licensed Level I Hospitals', 'hospital-fdmh.html', 30, false),
  ('tbgdh', 'Teodoro B. Galagar District Hospital', 'TBGDH', 'DOH-Licensed Level I Hospitals', 'hospital-tbgdh.html', 40, false),
  ('csgtmh', 'Cong. Simeon G. Toribio Memorial Hospital', 'CSGTMH', 'DOH-Licensed Level I Hospitals', 'hospital-csgtmh.html', 50, false),
  ('canch', 'Candijay Community Hospital', 'CanCH', 'Infirmaries', 'hospital-canch.html', 60, false),
  ('cnpcmh', 'Cong. Natalio P. Castillo Memorial Hospital', 'CNPCMH', 'Infirmaries', 'hospital-cnpcmh.html', 70, false),
  ('clach', 'Clarin Community Hospital', 'ClaCH', 'Infirmaries', 'hospital-clach.html', 80, false),
  ('mch', 'Maribojoc Community Hospital', 'MCH', 'Infirmaries', 'hospital-mch.html', 90, false),
  ('cpgmh', 'Pres. Carlos P. Garcia Municipal Hospital', 'PCPGMH', 'Infirmaries', 'hospital-cpgmh.html', 100, false)
on conflict (slug) do nothing;

-- =============================================================================
-- DEFAULT SEED DATA — mirrors all hardcoded HTML content
-- All inserts use ON CONFLICT DO NOTHING so re-running is safe.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- shared / navbar
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'shared', 'navbar', 'Navbar',
  '{
    "title": "Bohol Provincial Health Office",
    "subtitle": "Province of Bohol, Philippines",
    "home_label": "Home",
    "home_href": "index.html",
    "about_label": "About",
    "about_href": "more-about-us.html",
    "services_label": "Services",
    "services_href": "index.html#services",
    "contact_label": "Contact Us",
    "contact_href": "contact-us.html"
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- shared / footer
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'shared', 'footer', 'Footer',
  '{
    "title": "Bohol Provincial Health Office",
    "subtitle": "Province of Bohol, Philippines",
    "description": "The frontline agency of the Provincial Government of Bohol mandated to deliver quality healthcare services to every Boholano.",
    "phone": "(038) 411 0138 · Local: 41107",
    "emails": ["pho_bohol@yahoo.com", "provincialhealthoffice@gmail.com"],
    "facebook_label": "Bohol Provincial Health Office",
    "facebook_url": "https://www.facebook.com/boholpho",
    "copyright": "© 2026 Bohol Provincial Health Office. All Rights Reserved.",
    "quick_links": [
      {"label": "Home", "url": "index.html"},
      {"label": "About", "url": "more-about-us.html"},
      {"label": "Services", "url": "index.html#services"},
      {"label": "Laboratory & Facilities", "url": "laboratory.html"},
      {"label": "Promotive & Preventive", "url": "promotive.html"},
      {"label": "Hospitals", "url": "hospitals.html"}
    ],
    "government_links": [
      {"label": "Province of Bohol", "url": "https://bohol.gov.ph"},
      {"label": "Dept. of Health", "url": "https://doh.gov.ph"},
      {"label": "GOV.PH", "url": "https://www.gov.ph"},
      {"label": "PhilHealth", "url": "https://philhealth.gov.ph"},
      {"label": "FDA Philippines", "url": "https://fda.gov.ph"}
    ]
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- home / hero
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'home', 'hero', 'Home Hero',
  '{
    "welcome": "Welcome To",
    "heading_html": "Bohol Provincial<br><em>Health Office</em>",
    "tagline": "Sa PHO, Una ang Serbisyo!",
    "slides": [
      {"image_url": "assets/hero/hero-1.jpg", "alt": "Bohol Provincial Health Office Building"},
      {"image_url": "assets/hero/hero-2.jpg", "alt": "Bohol Provincial Health Office"},
      {"image_url": "assets/hero/hero-3.jpg", "alt": "Water Testing Laboratory"},
      {"image_url": "assets/hero/hero-4.jpg", "alt": "Bohol Provincial Diagnostic and Ambulatory Care Center"}
    ]
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- home / services  (3 flip-cards)
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'home', 'services', 'Home Services',
  '{
    "cards": [
      {
        "theme": "lab",
        "icon_key": "lab",
        "url": "laboratory.html",
        "front_title_html": "Laboratory &amp; Other<br>Health Facilities",
        "back_title": "Laboratory & Health Facilities",
        "back_description": "Provincial diagnostic labs, cold chain facility, water bacteriology, drug testing, PCR laboratory, dialysis centers, and wellness centers serving the province.",
        "button_label": "VIEW DETAILS ->"
      },
      {
        "theme": "promo",
        "icon_key": "promo",
        "url": "promotive.html",
        "front_title_html": "Promotive &amp; Preventive<br>Health Services",
        "back_title": "Promotive & Preventive Services",
        "back_description": "Health education, epidemiology & surveillance, disaster risk reduction, nutrition, oral health, vaccination programs, and community-based health initiatives.",
        "button_label": "VIEW DETAILS ->"
      },
      {
        "theme": "hosp",
        "icon_key": "hospital",
        "url": "hospitals.html",
        "front_title_html": "Hospital<br>Services",
        "back_title": "Hospital Services",
        "back_description": "Nine provincial hospitals across Bohol providing comprehensive medical care — from general medicine to specialized services for every district.",
        "button_label": "VIEW DETAILS ->"
      }
    ]
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- home / about
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'home', 'about', 'Home About Block',
  '{
    "heading": "About Us",
    "body": "The Bohol Provincial Health Office (PHO) is the frontline agency of the Provincial Government of Bohol mandated to deliver quality healthcare services to every Boholano. Guided by our Vision, Mission, and Goals, we strive for a healthy and self-reliant community.",
    "button_label": "Explore More About Us →",
    "button_url": "more-about-us.html"
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- home / vmg  (Vision, Mission, Goals accordion)
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'home', 'vmg', 'Vision, Mission, Goals',
  '{
    "items": [
      {
        "title": "Vision",
        "body_html": "A responsive and dynamic health organization committed to provide the best quality services with skilled, competent and effective personnel geared towards healthy and self-reliant Boholano community."
      },
      {
        "title": "Mission",
        "body_html": "To ensure and safeguard the health of the Boholano community through effective and sustainable delivery of promotive, preventive, curative and rehabilitative health services in partnership with all stakeholders for a productive Boholano."
      },
      {
        "title": "Goals",
        "body_html": "<ul><li>To provide available, affordable and accessible basic health services</li><li>To reduce morbidity and mortality rate</li><li>To upgrade and strengthen hospital services</li><li>To modernize and maintain hospital equipment and facilities</li><li>To sustain high ethical standards among health personnel</li><li>To enhance the technical capability of health personnel</li><li>To provide technical assistance to other stakeholders</li><li>To strengthen the Health Information System(HIS)</li><li>To build sustainable networking with other community health providers</li><li>To enhance public enterprise to generate resources</li></ul>"
      }
    ]
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- about / hero
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'about', 'hero', 'About Hero',
  '{
    "title": "About Us",
    "subtitle": "Guided by our Vision, Mission, and Goals, we strive for a healthy and self-reliant Boholano community.",
    "background_image_url": "assets/about/hero.jpg"
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- about / history
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'about', 'history', 'About History',
  '{
    "paragraphs": [
      "The health services in the Province of Bohol were first introduced by the Department of Health in mid-1959 through the Maternal Child Health Care Program. The main thrust at the time was the Expanded Program on Immunization and Tuberculosis Program.",
      "In the early 1960s, the Provincial Government supplemented manpower by creating the Provincial Health Office. Personnel included Sanitary Inspectors, Medical Technologists, Dentists, and Administrative Staff. Over the following decades, operations transitioned from centralization to decentralization, culminating in the integration of health services in 1983.",
      "By 1991, through the Local Government Code, health services were devolved to the local government units. Despite initial financial struggles, the Provincial Government worked tirelessly to elevate devolved hospitals to competitive standards, procuring modern equipment and executing rehabilitation projects to deliver quality healthcare to every Boholano."
    ]
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- about / strategies  (PHO strategy carousel slides)
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'about', 'strategies', 'About Strategies',
  '{
    "slides": [
      {"title": "Capability-building",        "image_url": "assets/about/strat-capability.png"},
      {"title": "Networking & Linkaging",     "image_url": "assets/about/strat-networking.png"},
      {"title": "Social Marketing",           "image_url": "assets/about/strat-social.png"},
      {"title": "Upgrading Health Services",  "image_url": "assets/about/strat-upgrading.png"},
      {"title": "Innovative Health Programs", "image_url": "assets/about/strat-innovative.png"},
      {"title": "Enterprise Development",     "image_url": "assets/about/strat-enterprise.png"},
      {"title": "Health Information System",  "image_url": "assets/about/strat-infosystem.png"},
      {"title": "Income Retention Scheme",    "image_url": "assets/about/strat-retention.png"}
    ]
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- about / units  (Sections & Units flip-cards)
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'about', 'units', 'About Sections & Units',
  '{
    "cards": [
      {
        "title": "Budget & Finance",
        "back_title": "Budget & Finance",
        "description": "Manages financial allocations, budgets for health programs and hospitals, medical procurement, payroll, and auditing compliance to support frontline healthcare services.",
        "image_url": "assets/about/unit-finance.png"
      },
      {
        "title": "Human Resources Development",
        "back_title": "Human Resources",
        "description": "Recruits, trains, and supports our healthcare workforce. Manages personnel onboarding, continuous training, and evaluations to deliver quality public health services.",
        "image_url": "assets/about/unit-hr.png"
      },
      {
        "title": "Records & Communications",
        "back_title": "Records & Comm",
        "description": "Manages official documentation, inter-office correspondence, and public health records while ensuring data privacy compliance and efficient information flow.",
        "image_url": "assets/about/unit-records.png"
      },
      {
        "title": "Supplies & Gen. Services",
        "back_title": "Supplies & Services",
        "description": "Manages procurement, storage, and distribution of medical assets and supplies. Coordinates facility maintenance, security, and the ambulance/vehicle fleet.",
        "image_url": "assets/about/unit-supplies.png"
      }
    ]
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- about / org_structure  (13-page org chart carousel)
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'about', 'org_structure', 'Organizational Structure',
  '{
    "images": [
      {"image_url": "assets/about/org1.png",  "alt": "PHO Organizational Structure - Part 1",  "caption": "Page 1 of 13"},
      {"image_url": "assets/about/org2.png",  "alt": "PHO Organizational Structure - Part 2",  "caption": "Page 2 of 13"},
      {"image_url": "assets/about/org3.png",  "alt": "PHO Organizational Structure - Part 3",  "caption": "Page 3 of 13"},
      {"image_url": "assets/about/org4.png",  "alt": "PHO Organizational Structure - Part 4",  "caption": "Page 4 of 13"},
      {"image_url": "assets/about/org5.png",  "alt": "PHO Organizational Structure - Part 5",  "caption": "Page 5 of 13"},
      {"image_url": "assets/about/org6.png",  "alt": "PHO Organizational Structure - Part 6",  "caption": "Page 6 of 13"},
      {"image_url": "assets/about/org7.png",  "alt": "PHO Organizational Structure - Part 7",  "caption": "Page 7 of 13"},
      {"image_url": "assets/about/org8.png",  "alt": "PHO Organizational Structure - Part 8",  "caption": "Page 8 of 13"},
      {"image_url": "assets/about/org9.png",  "alt": "PHO Organizational Structure - Part 9",  "caption": "Page 9 of 13"},
      {"image_url": "assets/about/org10.png", "alt": "PHO Organizational Structure - Part 10", "caption": "Page 10 of 13"},
      {"image_url": "assets/about/org11.png", "alt": "PHO Organizational Structure - Part 11", "caption": "Page 11 of 13"},
      {"image_url": "assets/about/org12.png", "alt": "PHO Organizational Structure - Part 12", "caption": "Page 12 of 13"},
      {"image_url": "assets/about/org13.png", "alt": "PHO Organizational Structure - Part 13", "caption": "Page 13 of 13"}
    ]
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- laboratory / hero
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'laboratory', 'hero', 'Laboratory Hero',
  '{
    "title": "Laboratory & Other Health Facilities",
    "subtitle": "Provincial diagnostic laboratories, treatment centers, and specialized health facilities"
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- promotive / hero
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'promotive', 'hero', 'Promotive Hero',
  '{
    "title": "Promotive & Preventive Health Services",
    "subtitle": "Community health programs focused on disease prevention and wellness promotion"
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- hospitals / hero
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'hospitals', 'hero', 'Hospitals Hero',
  '{
    "title": "Our Hospitals",
    "subtitle": "Government-operated hospitals providing accessible, quality medical services in every district of Bohol."
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- contact / hero
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'contact', 'hero', 'Contact Hero',
  '{
    "title": "Contact Us",
    "subtitle": "We are here to assist you. Reach out to the Bohol Provincial Health Office through our dynamic channels, directory, or submit an online inquiry below."
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- contact / info
-- -----------------------------------------------------------------------------
insert into public.page_sections (page_name, section_key, title, content) values (
  'contact', 'info', 'Contact Info & Form',
  '{
    "location_heading": "Our Location",
    "address": "J.A. Clarin St., Tagbilaran City, Bohol 6300, Philippines",
    "phone_heading": "Phone Numbers",
    "phone_html": "Primary: (038) 411 0138<br>Local Admin: 41107<br>Local Health Office: 41034",
    "email_heading": "Email Address",
    "emails": ["pho_bohol@yahoo.com", "provincialhealthoffice@gmail.com"],
    "hours_heading": "Office Hours",
    "office_hours_html": "Monday \u2013 Friday: 8:00 AM \u2013 5:00 PM<br>(Except Weekends &amp; Holidays)",
    "form_title": "Send a Message",
    "form_subtitle": "Have a question or feedback? Complete this form to email us directly."
  }'::jsonb
) on conflict (page_name, section_key) do nothing;

-- -----------------------------------------------------------------------------
-- lab_cards  (Laboratory page facility cards)
-- -----------------------------------------------------------------------------
insert into public.lab_cards (title, description, url, sort_order) values
  ('Center for Drug Education and Counseling (CEDEC)',
   'Provides community-based drug education, counseling, and holistic rehabilitation services for Boholanos.',
   'https://pho.bohol.gov.ph/laboratory-other-health-facilities/cedec/', 10),
  ('Water Bacteriology Laboratory',
   'Tests water quality and safety for communities, ensuring potable water standards across Bohol.',
   null, 20),
  ('Wastewater Treatment Laboratory',
   'Monitors and processes wastewater to protect public health and the environment.',
   null, 30),
  ('Drug Testing Laboratory',
   'Conducts mandatory and voluntary drug testing in support of the national anti-drug campaign.',
   null, 40),
  ('TB / EQA Laboratory',
   'Tuberculosis diagnostic and external quality assurance laboratory for accurate sputum examination.',
   null, 50),
  ('PCR Laboratory',
   'Polymerase Chain Reaction testing for COVID-19 and other infectious disease molecular diagnostics.',
   null, 60),
  ('Provincial Diagnostic Center',
   'Full-service diagnostic facility offering blood chemistry, hematology, urinalysis, and imaging services.',
   null, 70),
  ('Dialysis Centers',
   'Hemodialysis services for patients with kidney disease across multiple provincial hospital sites.',
   null, 80),
  ('Isolation Center',
   'Dedicated isolation and quarantine facility for managing infectious disease outbreaks and epidemics.',
   null, 90),
  ('Amoma Wellness Center',
   'Holistic wellness and rehabilitation services promoting mental health and overall well-being.',
   null, 100),
  ('Emergency Operation Center',
   'Command hub for coordinating disaster health response, disease surveillance, and emergency operations.',
   null, 110)
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- promotive_cards  (Promotive page service cards)
-- -----------------------------------------------------------------------------
insert into public.promotive_cards (title, description, sort_order) values
  ('Health Education & Promotion',
   'Community health education campaigns, information dissemination, and public awareness programs.',
   10),
  ('Epidemiology & Surveillance',
   'Disease tracking, outbreak investigation, data analysis, and early warning systems for communicable diseases.',
   20),
  ('Disaster Risk Reduction',
   'Health emergency preparedness, response planning, and post-disaster health recovery programs.',
   30),
  ('Health Programs Management',
   'Coordination and management of national and local health programs at the provincial level.',
   40),
  ('Environmental Health & Sanitation',
   'Sanitation inspections, environmental monitoring, clean water programs, and waste management oversight.',
   50),
  ('Nutrition & Dietetics',
   'Nutritional assessment, supplementary feeding programs, and dietary counseling for vulnerable populations.',
   60),
  ('Oral Health Program',
   'Dental health services including community dental missions, school-based sealant programs, and oral hygiene education.',
   70),
  ('Vaccination Services',
   'Immunization programs for children and adults — routine vaccines, supplemental campaigns, and COVID-19 vaccinations.',
   80),
  ('Special Health Programs',
   'Targeted programs for TB-DOTS, malaria, HIV/AIDS, non-communicable diseases, and mental health initiatives.',
   90)
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- hospital_cards  (Hospitals landing page cards)
-- Each card links to the hospital detail page.
-- -----------------------------------------------------------------------------
insert into public.hospital_cards (hospital_slug, title, description, url, license_group, sort_order) values
  ('gmph',   'Garcia Memorial Provincial Hospital',          'A comprehensive provincial hospital serving Northern Bohol with a wide range of general and specialized medical services.',                 'hospital-gmph.html',   'DOH-Licensed Level II Hospital',    10),
  ('cdh',    'Catigbian District Hospital',                  'Serving the communities of Catigbian and nearby municipalities with accessible inpatient and outpatient care.',                             'hospital-cdh.html',    'DOH-Licensed Level I Hospitals',    20),
  ('fdmh',   'Francisco Dagohoy Municipal Hospital',         'Providing essential health services to the municipality of Inabanga and surrounding communities.',                                          'hospital-fdmh.html',   'DOH-Licensed Level I Hospitals',    30),
  ('tbgdh',  'Teodoro B. Galagar District Hospital',         'Located in Jagna, providing district-level comprehensive healthcare to Southern Bohol communities.',                                        'hospital-tbgdh.html',  'DOH-Licensed Level I Hospitals',    40),
  ('csgtmh', 'Cong. Simeon G. Toribio Memorial Hospital',   'Serving Carmen and surrounding municipalities in Central Bohol with comprehensive medical services.',                                       'hospital-csgtmh.html', 'DOH-Licensed Level I Hospitals',    50),
  ('canch',  'Candijay Community Hospital',                  'A community health facility delivering essential medical and public health services to Candijay and adjacent towns.',                        'hospital-canch.html',  'Infirmaries',                       60),
  ('cnpcmh', 'Cong. Natalio P. Castillo Memorial Hospital',  'Providing accessible health services and emergency care to the communities of Loon and nearby municipalities.',                             'hospital-cnpcmh.html', 'Infirmaries',                       70),
  ('clach',  'Clarin Community Hospital',                    'A community-level facility offering essential inpatient, outpatient, and emergency services in Western Bohol.',                             'hospital-clach.html',  'Infirmaries',                       80),
  ('mch',    'Maribojoc Community Hospital',                 'Serving Maribojoc and neighboring communities with primary care, emergency, and basic surgical services.',                                  'hospital-mch.html',    'Infirmaries',                       90),
  ('cpgmh',  'Pres. Carlos P. Garcia Municipal Hospital',    'Provides essential healthcare services to the municipality of President Carlos P. Garcia (Pitogo) and surrounding barangays.',              'hospital-cpgmh.html',  'Infirmaries',                      100)
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- contact_directory  (Contact page office & hospital directory)
-- -----------------------------------------------------------------------------
insert into public.contact_directory (title, subtitle, phone, email, sort_order) values
  ('PHO Administration',                          'Headquarters Office',      '(038) 411 0138 · Local: 41107', 'pho_bohol@yahoo.com',   10),
  ('PHO Head / OHO',                              'Executive Director Office', '(038) 411 0138 · Local: 41034', null,                    20),
  ('Cong. Maximino Garcia Mem. Provincial Hospital', 'Talibon, Bohol',        '(038) 515 5081 / (038) 515 0456', null,                  30),
  ('Teodoro B. Galagar District Hospital',        'Jagna, Bohol',             '(038) 531 8170 / (038) 531 8106', null,                  40),
  ('Cong. Simeon Toribio Mem. Hospital',          'Carmen, Bohol',            '(038) 525 9247 / (038) 525 9080', null,                  50),
  ('Cong. Natalio Castillo Mem. Hospital',        'Loon, Bohol',              '(038) 505 9170 / (038) 505 9246', null,                  60),
  ('Catigbian District Hospital',                 'Catigbian, Bohol',         '(038) 507 3106 / (038) 460 2585', null,                  70),
  ('Maribojoc Community Hospital',                'Maribojoc, Bohol',         '(038) 504 9621',                  null,                  80),
  ('Clarin Community Hospital',                   'Clarin, Bohol',            '(038) 509 9122',                  null,                  90),
  ('Francisco Dagohoy Municipal Hospital',        'Inabanga, Bohol',          '(038) 512 9013',                  null,                 100),
  ('Candijay Community Hospital',                 'Candijay, Bohol',          '(038) 510 8292',                  null,                 110),
  ('Pres. CP Garcia Municipal Hospital',          'PCPG (Pitogo), Bohol',     '(038) 510 1149',                  null,                 120)
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.page_sections enable row level security;
alter table public.hospitals enable row level security;
alter table public.hospital_services enable row level security;
alter table public.hospital_programs enable row level security;
alter table public.lab_cards enable row level security;
alter table public.promotive_cards enable row level security;
alter table public.hospital_cards enable row level security;
alter table public.contact_directory enable row level security;
alter table public.emailjs_config enable row level security;

drop policy if exists "Profiles read own or admin" on public.profiles;
drop policy if exists "Profiles read own profile" on public.profiles;
create policy "Profiles read own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Profiles write admin only" on public.profiles;

drop policy if exists "Public read page sections" on public.page_sections;
create policy "Public read page sections"
on public.page_sections
for select
using (true);

drop policy if exists "Admin write page sections" on public.page_sections;
create policy "Admin write page sections"
on public.page_sections
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read hospitals" on public.hospitals;
create policy "Public read hospitals"
on public.hospitals
for select
using (true);

drop policy if exists "Admin write hospitals" on public.hospitals;
create policy "Admin write hospitals"
on public.hospitals
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read hospital services" on public.hospital_services;
create policy "Public read hospital services"
on public.hospital_services
for select
using (true);

drop policy if exists "Admin write hospital services" on public.hospital_services;
create policy "Admin write hospital services"
on public.hospital_services
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read hospital programs" on public.hospital_programs;
create policy "Public read hospital programs"
on public.hospital_programs
for select
using (true);

drop policy if exists "Admin write hospital programs" on public.hospital_programs;
create policy "Admin write hospital programs"
on public.hospital_programs
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read lab cards" on public.lab_cards;
create policy "Public read lab cards"
on public.lab_cards
for select
using (true);

drop policy if exists "Admin write lab cards" on public.lab_cards;
create policy "Admin write lab cards"
on public.lab_cards
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read promotive cards" on public.promotive_cards;
create policy "Public read promotive cards"
on public.promotive_cards
for select
using (true);

drop policy if exists "Admin write promotive cards" on public.promotive_cards;
create policy "Admin write promotive cards"
on public.promotive_cards
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read hospital cards" on public.hospital_cards;
create policy "Public read hospital cards"
on public.hospital_cards
for select
using (true);

drop policy if exists "Admin write hospital cards" on public.hospital_cards;
create policy "Admin write hospital cards"
on public.hospital_cards
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read contact directory" on public.contact_directory;
create policy "Public read contact directory"
on public.contact_directory
for select
using (true);

drop policy if exists "Admin write contact directory" on public.contact_directory;
create policy "Admin write contact directory"
on public.contact_directory
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public read emailjs config" on public.emailjs_config;
create policy "Public read emailjs config"
on public.emailjs_config
for select
using (true);

drop policy if exists "Admin write emailjs config" on public.emailjs_config;
create policy "Admin write emailjs config"
on public.emailjs_config
for all
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Storage bucket and policies
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('cms-assets', 'cms-assets', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public read cms assets" on storage.objects;
create policy "Public read cms assets"
on storage.objects
for select
using (bucket_id = 'cms-assets');

drop policy if exists "Admin write cms assets" on storage.objects;
create policy "Admin write cms assets"
on storage.objects
for all
using (bucket_id = 'cms-assets' and public.is_admin())
with check (bucket_id = 'cms-assets' and public.is_admin());

commit;

-- -----------------------------------------------------------------------------
-- First admin user setup example
-- Replace the UUID/email with the user you created in Supabase Auth.
-- -----------------------------------------------------------------------------
-- insert into public.profiles (id, email, role)
-- values ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'admin')
-- on conflict (id) do update
-- set email = excluded.email,
--     role = excluded.role;

-- -----------------------------------------------------------------------------
-- Quick RLS smoke tests
-- 1. In the SQL editor, set the role to anon and run:
--      select * from public.page_sections;
--      insert into public.page_sections (page_name, section_key, content)
--      values ('home', 'hero', '{}'::jsonb);
--    The select should work; the insert should fail.
--
-- 2. In the app, log in as an admin and confirm insert/update/delete succeed.
-- -----------------------------------------------------------------------------

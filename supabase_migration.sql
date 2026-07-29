-- ================================================================
-- BOHOL PROVINCIAL HEALTH OFFICE
-- CMS Database Migration — Supabase (PostgreSQL)
-- ================================================================
--
-- HOW TO RUN THIS MIGRATION:
-- ─────────────────────────────────────────────────────────────────
-- 1. Log in to https://supabase.com
-- 2. Open your project (create one first if needed)
-- 3. Go to: SQL Editor (left sidebar icon that looks like a terminal)
-- 4. Click "New Query"
-- 5. Paste this entire file into the editor
-- 6. Click "Run" (or press Ctrl+Enter)
-- 7. You should see "Success. No rows returned." for each section.
--
-- AFTER RUNNING THIS MIGRATION:
-- ─────────────────────────────────────────────────────────────────
-- A. Create your admin user:
--    Go to: Authentication → Users → "Add User" button
--    Enter the admin email + password you want to use.
--    (This account will be used to log into /phoadmincmslogin.html)
--
-- B. Enable Supabase Storage (for image uploads):
--    Go to: Storage (left sidebar)
--    Click "New Bucket" → Name: "site-images" → Make it PUBLIC
--    Click "Create Bucket"
--
-- C. Update cms-config.js with your credentials:
--    Go to: Project Settings → API
--    Copy "Project URL" → paste as SUPABASE_URL in cms-config.js
--    Copy "anon public" key → paste as SUPABASE_ANON_KEY in cms-config.js
-- ================================================================


-- ================================================================
-- SECTION 1: CLEANUP (safe to re-run)
-- ================================================================
DROP TABLE IF EXISTS admin_audit_log CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;


-- ================================================================
-- SECTION 2: SITE CONTENT TABLE
-- Stores all editable content as key-value pairs.
-- content_key: unique identifier (e.g. "home.hero.tagline")
-- content_value: the actual text, URL, or image URL
-- content_type: 'text' | 'html' | 'image' | 'link' | 'phone' | 'email'
-- page_group: groups keys for the CMS dashboard tabs
-- label: human-readable label shown in the CMS dashboard
-- ================================================================
CREATE TABLE site_content (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key   TEXT UNIQUE NOT NULL,
  content_value TEXT NOT NULL DEFAULT '',
  content_type  TEXT NOT NULL DEFAULT 'text'
                  CHECK (content_type IN ('text','html','image','link','phone','email')),
  page_group    TEXT NOT NULL DEFAULT 'general',
  label         TEXT NOT NULL DEFAULT '',
  sort_order    INTEGER DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for fast page-group lookups from the dashboard
CREATE INDEX idx_site_content_page_group ON site_content(page_group);
CREATE INDEX idx_site_content_key ON site_content(content_key);


-- ================================================================
-- SECTION 3: AUDIT LOG TABLE
-- Tracks every change made through the CMS for accountability.
-- ================================================================
CREATE TABLE admin_audit_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL,
  old_value   TEXT,
  new_value   TEXT,
  changed_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at  TIMESTAMPTZ DEFAULT NOW(),
  user_email  TEXT
);

CREATE INDEX idx_audit_log_changed_at ON admin_audit_log(changed_at DESC);


-- ================================================================
-- SECTION 4: AUTO-UPDATE TIMESTAMP TRIGGER
-- Automatically updates "updated_at" on every row change.
-- ================================================================
CREATE OR REPLACE FUNCTION update_site_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_site_content_timestamp();


-- ================================================================
-- SECTION 5: ROW LEVEL SECURITY (RLS)
-- Public users can READ content (for cms.js hydration).
-- Only authenticated admins can WRITE content.
-- ================================================================
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can read site content
CREATE POLICY "Public read site_content"
  ON site_content FOR SELECT
  USING (true);

-- Only authenticated users (admins) can insert/update/delete
CREATE POLICY "Admins can write site_content"
  ON site_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can read audit logs
CREATE POLICY "Admins can read audit_log"
  ON admin_audit_log FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can insert audit logs
CREATE POLICY "Admins can insert audit_log"
  ON admin_audit_log FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');


-- ================================================================
-- SECTION 6: SEED DATA — Initial Content Values
-- These mirror the existing static HTML content.
-- The CMS will UPSERT on top of these defaults.
-- ================================================================

INSERT INTO site_content (content_key, content_value, content_type, page_group, label, sort_order) VALUES

  -- ── HOME PAGE ─────────────────────────────────────────────
  ('home.hero.welcome',         'Welcome To',                                                          'text',  'home', 'Hero Welcome Text',          10),
  ('home.hero.heading',         'Bohol Provincial Health Office',                                      'text',  'home', 'Hero Main Heading',          20),
  ('home.hero.tagline',         'Sa PHO, Una ang Serbisyo!',                                           'text',  'home', 'Hero Tagline',               30),
  ('home.services.eyebrow',     'What We Do',                                                          'text',  'home', 'Services Section Eyebrow',   40),
  ('home.services.title',       'Our Services',                                                        'text',  'home', 'Services Section Title',     50),
  ('home.services.subtitle',    'Delivering accessible, quality healthcare to every Boholano through our three core service pillars.', 'text', 'home', 'Services Section Subtitle', 60),
  ('home.about.eyebrow',        'Who We Are',                                                          'text',  'home', 'About Section Eyebrow',      70),
  ('home.about.heading',        'About Us',                                                            'text',  'home', 'About Section Heading',      80),
  ('home.about.body',           'The Bohol Provincial Health Office (PHO) is the frontline agency of the Provincial Government of Bohol mandated to deliver quality healthcare services to every Boholano. Guided by our Vision, Mission, and Goals, we strive for a healthy and self-reliant community.', 'text', 'home', 'About Section Body Text', 90),
  ('home.vision.text',          'A responsive and dynamic health organization committed to provide the best quality services with skilled, competent and effective personnel geared towards healthy and self-reliant Boholano community.', 'text', 'home', 'Vision Statement', 100),
  ('home.mission.text',         'To ensure and safeguard the health of the Boholano community through effective and sustainable delivery of promotive, preventive, curative and rehabilitative health services in partnership with all stakeholders for a productive Boholano.', 'text', 'home', 'Mission Statement', 110),
  ('home.footer.description',   'The frontline agency of the Provincial Government of Bohol mandated to deliver quality healthcare services to every Boholano.', 'text', 'home', 'Footer Brand Description', 120),

  -- ── CONTACT US PAGE ───────────────────────────────────────
  ('contact.hero.title',        'Contact Us',                                                          'text',  'contact', 'Hero Title',                  10),
  ('contact.hero.subtitle',     'We are here to assist you. Reach out to the Bohol Provincial Health Office through our dynamic channels, directory, or submit an online inquiry below.', 'text', 'contact', 'Hero Subtitle', 20),
  ('contact.info.address',      'J.A. Clarin St., Tagbilaran City, Bohol 6300, Philippines',           'text',  'contact', 'Office Address',               30),
  ('contact.info.phone',        'Primary: (038) 411 0138<br>Local Admin: 41107<br>Local Health Office: 41034', 'html', 'contact', 'Phone Numbers (HTML)', 40),
  ('contact.info.email1',       'pho_bohol@yahoo.com',                                                 'email', 'contact', 'Email Address 1',              50),
  ('contact.info.email2',       'provincialhealthoffice@gmail.com',                                    'email', 'contact', 'Email Address 2',              60),
  ('contact.info.hours',        'Monday – Friday: 8:00 AM – 5:00 PM<br>(Except Weekends & Holidays)',  'html',  'contact', 'Office Hours (HTML)',          70),
  ('contact.facebook.url',      'https://www.facebook.com/boholpho',                                   'link',  'contact', 'Facebook Page URL',            80),
  ('contact.footer.phone',      '(038) 411 0138 · Local: 41107',                                       'phone', 'contact', 'Footer Phone Number',          90),

  -- ── ABOUT US PAGE ─────────────────────────────────────────
  ('about.hero.subtitle',       'Guided by our Vision, Mission, and Goals, we strive for a healthy and self-reliant Boholano community.', 'text', 'about', 'Hero Subtitle', 10),
  ('about.history.p1',          'The health services in the Province of Bohol were first introduced by the Department of Health in mid-1959 through the Maternal Child Health Care Program. The main thrust at the time was the Expanded Program on Immunization and Tuberculosis Program.', 'text', 'about', 'History Paragraph 1', 20),
  ('about.history.p2',          'In the early 1960s, the Provincial Government supplemented manpower by creating the Provincial Health Office. Personnel included Sanitary Inspectors, Medical Technologists, Dentists, and Administrative Staff. Over the following decades, operations transitioned from centralization to decentralization, culminating in the integration of health services in 1983.', 'text', 'about', 'History Paragraph 2', 30),
  ('about.history.p3',          'By 1991, through the Local Government Code, health services were devolved to the local government units. Despite initial financial struggles, the Provincial Government worked tirelessly to elevate devolved hospitals to competitive standards, procuring modern equipment and executing rehabilitation projects to deliver quality healthcare to every Boholano.', 'text', 'about', 'History Paragraph 3', 40),

  -- ── HOSPITAL LISTING PAGE ─────────────────────────────────
  ('hospitals.hero.subtitle',   'Ten provincial hospitals delivering comprehensive medical care across Bohol', 'text', 'hospitals', 'Page Hero Subtitle', 10),
  ('hospitals.gmph.name',       'Garcia Memorial Provincial Hospital (GMPH)',                          'text',  'hospitals', 'GMPH Hospital Name',         20),
  ('hospitals.gmph.desc',       'Located in San Jose, Talibon, Bohol. A provincial hospital providing comprehensive secondary-level care to the northern and eastern parts of the province.', 'text', 'hospitals', 'GMPH Description', 30),
  ('hospitals.cdh.name',        'Catigbian District Hospital (CDH)',                                   'text',  'hospitals', 'CDH Hospital Name',          40),
  ('hospitals.cdh.desc',        'Located in Poblacion West, Catigbian, Bohol. A district hospital serving the municipality of Catigbian and neighboring towns.', 'text', 'hospitals', 'CDH Description', 50),
  ('hospitals.fdmh.name',       'Francisco Dagohoy Municipal Hospital (FDMH)',                         'text',  'hospitals', 'FDMH Hospital Name',         60),
  ('hospitals.fdmh.desc',       'Located in Inabanga, Bohol. A primary-level hospital serving the municipality of Inabanga and neighboring areas.', 'text', 'hospitals', 'FDMH Description', 70),
  ('hospitals.tbgdh.name',      'Teodoro B. Galagar District Hospital (TBGDH)',                        'text',  'hospitals', 'TBGDH Hospital Name',        80),
  ('hospitals.tbgdh.desc',      'Located in Poblacion, Jagna, Bohol. A district hospital serving Jagna and surrounding municipalities in the southeastern part of the province.', 'text', 'hospitals', 'TBGDH Description', 90),
  ('hospitals.csgtmh.name',     'Clarin-Sta. Genoveva Tio Memorial Hospital (CSGTMH)',                 'text',  'hospitals', 'CSGTMH Hospital Name',       100),
  ('hospitals.csgtmh.desc',     'Located in Clarin, Bohol. Serves Clarin and surrounding municipalities in the northwestern part of the province.', 'text', 'hospitals', 'CSGTMH Description', 110),
  ('hospitals.canch.name',      'Calape Antonia N. Chiong Hospital (CANCH)',                           'text',  'hospitals', 'CANCH Hospital Name',        120),
  ('hospitals.canch.desc',      'Located in Calape, Bohol. A district hospital providing healthcare services to Calape and neighboring municipalities.', 'text', 'hospitals', 'CANCH Description', 130),
  ('hospitals.clach.name',      'Carmen Ledesma Arcala Community Hospital (CLACH)',                    'text',  'hospitals', 'CLACH Hospital Name',        140),
  ('hospitals.clach.desc',      'Located in Carmen, Bohol. Community hospital serving the municipality of Carmen and surrounding areas.', 'text', 'hospitals', 'CLACH Description', 150),
  ('hospitals.mch.name',        'Maribojoc Community Hospital (MCH)',                                  'text',  'hospitals', 'MCH Hospital Name',          160),
  ('hospitals.mch.desc',        'Located in Maribojoc, Bohol. Community hospital serving the municipality of Maribojoc and nearby areas.', 'text', 'hospitals', 'MCH Description', 170),
  ('hospitals.cnpcmh.name',     'Claro M. Recto – Pilar Community Hospital (CNPCMH)',                  'text',  'hospitals', 'CNPCMH Hospital Name',       180),
  ('hospitals.cnpcmh.desc',     'Located in Pilar, Bohol. Community hospital providing health services to Pilar and surrounding municipalities.', 'text', 'hospitals', 'CNPCMH Description', 190),
  ('hospitals.cpgmh.name',      'Cong. P. Garcia Municipal Hospital (CPGMH)',                          'text',  'hospitals', 'CPGMH Hospital Name',        200),
  ('hospitals.cpgmh.desc',      'Located in Getafe, Bohol. Municipal hospital providing primary care services to Getafe and nearby municipalities.', 'text', 'hospitals', 'CPGMH Description', 210),

  -- ── LABORATORY PAGE ───────────────────────────────────────
  ('lab.hero.title',            'Laboratory & Other Health Facilities',                                'text',  'laboratory', 'Page Hero Title',             10),
  ('lab.hero.subtitle',         'Provincial diagnostic laboratories, treatment centers, and specialized health facilities', 'text', 'laboratory', 'Page Hero Subtitle', 20),
  ('lab.cedec.name',            'Center for Drug Education and Counseling (CEDEC)',                    'text',  'laboratory', 'CEDEC Facility Name',         30),
  ('lab.cedec.desc',            'Provides community-based drug education, counseling, and holistic rehabilitation services for Boholanos.', 'text', 'laboratory', 'CEDEC Description', 40),
  ('lab.cedec.url',             'https://pho.bohol.gov.ph/laboratory-other-health-facilities/cedec/', 'link',  'laboratory', 'CEDEC External Link',         50),
  ('lab.water.name',            'Water Bacteriology Laboratory',                                       'text',  'laboratory', 'Water Lab Name',              60),
  ('lab.water.desc',            'Tests water quality and safety for communities, ensuring potable water standards across Bohol.', 'text', 'laboratory', 'Water Lab Description', 70),
  ('lab.wastewater.name',       'Wastewater Treatment Laboratory',                                     'text',  'laboratory', 'Wastewater Lab Name',         80),
  ('lab.wastewater.desc',       'Analyzes wastewater treatment processes and monitors effluent quality standards for environmental compliance.', 'text', 'laboratory', 'Wastewater Lab Description', 90),

  -- ── PROMOTIVE PAGE ────────────────────────────────────────
  ('promo.hero.title',          'Promotive & Preventive Health Services',                              'text',  'promotive', 'Page Hero Title',             10),
  ('promo.hero.subtitle',       'Community health programs focused on disease prevention and wellness promotion', 'text', 'promotive', 'Page Hero Subtitle', 20),
  ('promo.health_edu.name',     'Health Education & Promotion',                                        'text',  'promotive', 'Health Education Name',       30),
  ('promo.health_edu.desc',     'Community health education campaigns, information dissemination, and public awareness programs.', 'text', 'promotive', 'Health Education Description', 40),
  ('promo.epi.name',            'Epidemiology & Surveillance',                                         'text',  'promotive', 'Epidemiology Name',           50),
  ('promo.epi.desc',            'Disease tracking, outbreak investigation, data analysis, and early warning systems for communicable diseases.', 'text', 'promotive', 'Epidemiology Description', 60),
  ('promo.drrm.name',           'Disaster Risk Reduction',                                             'text',  'promotive', 'DRRM Name',                   70),
  ('promo.drrm.desc',           'Emergency health response, disaster preparedness, and health risk reduction management programs.', 'text', 'promotive', 'DRRM Description', 80),
  ('promo.nutrition.name',      'Nutrition Program',                                                   'text',  'promotive', 'Nutrition Name',              90),
  ('promo.nutrition.desc',      'Nutrition assessment, supplementation programs, and community-based nutrition education initiatives.', 'text', 'promotive', 'Nutrition Description', 100),
  ('promo.oral.name',           'Oral Health Program',                                                 'text',  'promotive', 'Oral Health Name',            110),
  ('promo.oral.desc',           'Preventive dental services, oral health education, and fluoride supplementation programs for communities.', 'text', 'promotive', 'Oral Health Description', 120)

ON CONFLICT (content_key) DO NOTHING;


-- ================================================================
-- SECTION 7: STORAGE BUCKET INSTRUCTIONS
-- ================================================================
-- NOTE: Supabase Storage buckets cannot be created via SQL.
-- Follow these manual steps after running this migration:
--
-- 1. Go to: Supabase Dashboard → Storage (left sidebar)
-- 2. Click "New Bucket"
-- 3. Bucket Name: site-images
-- 4. Check: "Public bucket" ← IMPORTANT (so images are publicly visible)
-- 5. Click "Create Bucket"
--
-- The CMS dashboard will upload images to this bucket automatically.
-- Image URLs will be stored in the site_content table as 'image' type.
-- ================================================================


-- ================================================================
-- SECTION 8: USEFUL QUERIES FOR REFERENCE
-- ================================================================

-- View all content grouped by page:
-- SELECT page_group, content_key, label, content_type, LEFT(content_value, 60) as preview
-- FROM site_content ORDER BY page_group, sort_order;

-- View recent audit log entries:
-- SELECT content_key, LEFT(old_value,40), LEFT(new_value,40), user_email, changed_at
-- FROM admin_audit_log ORDER BY changed_at DESC LIMIT 20;

-- Reset a content value to default (example):
-- UPDATE site_content
-- SET content_value = 'Sa PHO, Una ang Serbisyo!'
-- WHERE content_key = 'home.hero.tagline';

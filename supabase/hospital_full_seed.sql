-- =============================================================================
-- PHO Hospital Complete Seed — Run this in the Supabase SQL Editor
-- This script upserts all hospital content (overview, services, programs)
-- Safe to re-run: uses ON CONFLICT / DELETE+INSERT pattern
-- =============================================================================

-- -----------------------------------------------------------------------
-- 1. UPSERT all hospital core fields (hero, overview, contact, map)
-- -----------------------------------------------------------------------
INSERT INTO public.hospitals (
  slug, name, short_name, license_group, page_path,
  hero_image_url, hero_title, hero_subtitle,
  overview_title, overview_body, quote,
  offer_heading, offer_title, offer_body,
  phone, email_primary, email_secondary, location_text,
  facebook_url, facebook_label,
  map_embed_url, map_link_url,
  sort_order, is_featured
) VALUES
(
  'gmph', 'Garcia Memorial Provincial Hospital', 'GMPH', 'DOH-Licensed Level II Hospital', 'hospital-gmph.html',
  'assets/hospitals/gmph/talibon.png', 'Garcia Memorial Provincial Hospital', 'Talibon, Bohol',
  'Welcome to GMPH',
  'Garcia Memorial Provincial Hospital (GMPH) is a secondary-level health facility dedicated to serving the communities of northern and eastern Bohol. Under the Bohol Provincial Health Office (PHO), GMPH operates with a commitment to providing accessible, high-quality, and patient-centered medical care to every individual.',
  '"Sa PHO, Una ang Serbisyo!"',
  'We Offer:', 'DOH-Licensed Level II Hospital',
  'A departmentalized hospital providing clinical services including medicine, pediatrics, OB-GYN, surgery, ICU, NICU, tertiary clinical laboratory, and 2nd level X-ray.',
  '+63 38 515-5081', 'gmph.bohol2012@gmail.com', 'provincialhealthoffice@gmail.com', 'San Jose, Talibon, Bohol',
  'https://www.facebook.com/gmph.talibon', 'Garcia Memorial Provincial Hospital',
  'https://maps.google.com/maps?q=10.131240,124.318849&t=&z=15&ie=UTF8&iwloc=&output=embed', '',
  10, true
),
(
  'cdh', 'Catigbian District Hospital', 'CDH', 'DOH-Licensed Level I Hospitals', 'hospital-cdh.html',
  'assets/hospitals/cdh/cdh_hero.png', 'Catigbian District Hospital', 'Catigbian, Bohol',
  'Welcome to CDH',
  'Catigbian District Hospital (CDH) is a DOH-Licensed Level I health facility dedicated to serving the municipality of Catigbian and its neighboring communities in Bohol. Operated under the Bohol Provincial Health Office (PHO), CDH is committed to delivering accessible, compassionate, and high-quality inpatient and outpatient healthcare services to all residents of the area.',
  '"Sa PHO, Una ang Serbisyo!"',
  'We Offer:', 'DOH-Licensed Level I Hospital',
  'Provides primary care including general medicine, pediatrics, OB-GYN, surgery, isolation facilities, maternity, secondary clinical laboratory, and 1st level X-ray.',
  '(038) 507-3106 / (038) 460-2585', 'pho_bohol@yahoo.com', 'provincialhealthoffice@gmail.com', 'Catigbian, Bohol',
  'https://www.facebook.com/CADISHOSP', 'Catigbian District Hospital',
  'https://maps.google.com/maps?q=9.851206,123.99599&t=&z=15&ie=UTF8&iwloc=&output=embed', '',
  20, false
),
(
  'fdmh', 'Francisco Dagohoy Municipal Hospital', 'FDMH', 'DOH-Licensed Level I Hospitals', 'hospital-fdmh.html',
  'assets/hospitals/fdmh/fdmh_hero.png', 'Francisco Dagohoy Municipal Hospital', 'Inabanga, Bohol',
  'Welcome to FDMH',
  'Francisco Dagohoy Municipal Hospital (FDMH) is a DOH-Licensed Level I health facility committed to delivering accessible and quality healthcare services to the people of Inabanga and its neighboring municipalities in Bohol. Operated under the Bohol Provincial Health Office (PHO), FDMH provides a comprehensive range of inpatient and outpatient medical services, from general consultations and surgical operations to laboratory diagnostics and maternal care.',
  '',
  'We Offer:', 'DOH-Licensed Level I Hospital',
  'Provides primary care including general medicine, pediatrics, OB-GYN, surgery, isolation facilities, maternity, secondary clinical laboratory, and 1st level X-ray.',
  '(038) 512-9013', 'fdmh85@yahoo.com', 'provincialhealthoffice@gmail.com', 'Cangmundo Rd., Inabanga, Bohol',
  '', '',
  'https://maps.google.com/maps?q=10.028500,124.063600&t=&z=15&ie=UTF8&iwloc=&output=embed', '',
  30, false
),
(
  'tbgdh', 'Teodoro B. Galagar District Hospital', 'TBGDH', 'DOH-Licensed Level I Hospitals', 'hospital-tbgdh.html',
  'assets/hospitals/tbgdh/jagna.png', 'Teodoro B. Galagar District Hospital', 'Jagna, Bohol',
  'Welcome to TBGDH',
  'Teodoro B. Galagar District Hospital (TBGDH) is a primary-level health facility dedicated to serving the communities of southeastern Bohol. Operated under the Bohol Provincial Health Office (PHO), TBGDH is committed to delivering accessible, efficient, and compassionate healthcare to all residents of Jagna and its surrounding municipalities.',
  '"Sa PHO, Una ang Serbisyo!"',
  'We Offer:', 'DOH-Licensed Level I Hospital',
  'Provides primary care including general medicine, pediatrics, OB-GYN, surgery, isolation facilities, maternity, secondary clinical laboratory, and 1st level X-ray.',
  '(038) 531-8107', 'pho_bohol@yahoo.com', 'provincialhealthoffice@gmail.com', 'Severo Salas St. Poblacion, Jagna, Bohol',
  'https://www.facebook.com/tbgdh', 'Teodoro B. Galagar Hospital',
  'https://maps.google.com/maps?q=9.6517557,124.3690621&t=&z=15&ie=UTF8&iwloc=&output=embed', '',
  40, false
),
(
  'csgtmh', 'Cong. Simeon G. Toribio Memorial Hospital', 'CSGTMH', 'DOH-Licensed Level I Hospitals', 'hospital-csgtmh.html',
  'assets/hospitals/csgtmh/carmen.png', 'Cong. Simeon G. Toribio Memorial Hospital', 'Carmen, Bohol',
  'Welcome to CSGTMH',
  'Cong. Simeon G. Toribio Memorial Hospital (CSGTMH) is a primary-level district health facility located in Poblacion, Carmen, Bohol. Managed and operated under the Bohol Provincial Health Office (PHO), CSGTMH is dedicated to providing high-quality, compassionate, and accessible inpatient and outpatient healthcare services to the communities of central Bohol.',
  '"Sa PHO, Una ang Serbisyo!"',
  'We Offer:', 'DOH-Licensed Level I Hospital',
  'Provides primary care including general medicine, pediatrics, OB-GYN, surgery, isolation facilities, maternity, secondary clinical laboratory, and 1st level X-ray.',
  '(038) 525-9247', 'carmenhospital68@yahoo.com', 'provincialhealthoffice@gmail.com', 'Poblacion, Carmen, Bohol',
  'https://www.facebook.com/profile.php?id=61583326373605', 'Simeon G. Toribio Hospital',
  'https://maps.google.com/maps?q=9.8201335,124.1934452&t=&z=15&ie=UTF8&iwloc=&output=embed', '',
  50, false
),
(
  'canch', 'Candijay Community Hospital', 'CanCH', 'Infirmaries', 'hospital-canch.html',
  'assets/hospitals/canch/canch_hero.png', 'Candijay Community Hospital', 'Poblacion, Candijay, Bohol',
  'Welcome to CanCH',
  'Candijay Community Hospital (CanCH) is an Infirmary Hospital committed to delivering accessible and quality primary healthcare services to the people of Candijay and its neighboring municipalities in eastern Bohol. Operated under the Bohol Provincial Health Office (PHO), CanCH provides essential inpatient and outpatient medical services, general consultations, and basic diagnostics.',
  '',
  'We Offer:', 'Infirmary Hospital',
  'Provides primary care including general medicine, pediatrics, OB-GYN, minor surgery, isolation facilities, maternity, and basic clinical laboratory.',
  '(038) 523-0022', 'candijayhospital2@gmail.com', 'provincialhealthoffice@gmail.com', 'Poblacion, Candijay, Bohol',
  '', '',
  'https://maps.google.com/maps?q=9.851900,124.577200&t=&z=15&ie=UTF8&iwloc=&output=embed', '',
  60, false
),
(
  'cnpcmh', 'Cong. Natalio P. Castillo Memorial Hospital', 'CNPCMH', 'Infirmaries', 'hospital-cnpcmh.html',
  'assets/hospitals/cnpcmh/cnpcmh_hero.png', 'Cong. Natalio P. Castillo Memorial Hospital', 'Basac, Loon, Bohol',
  'Welcome to CNPCMH',
  'Cong. Natalio P. Castillo Memorial Hospital (CNPCMH) is an Infirmary Hospital committed to delivering accessible and quality primary healthcare services to the people of Loon and its neighboring municipalities. Operated under the Bohol Provincial Health Office (PHO), CNPCMH provides essential inpatient and outpatient medical services, general consultations, and basic diagnostics.',
  '',
  'We Offer:', 'Infirmary Hospital',
  'Provides primary care including general medicine, pediatrics, OB-GYN, minor surgery, isolation facilities, maternity, and basic clinical laboratory.',
  '(038) 505-9011', 'cncmh_loon@yahoo.com.ph', 'provincialhealthoffice@gmail.com', 'Basac, Loon, Bohol',
  '', '',
  'https://maps.google.com/maps?q=9.799800,123.793800&t=&z=15&ie=UTF8&iwloc=&output=embed', '',
  70, false
),
(
  'clach', 'Clarin Community Hospital', 'ClaCH', 'Infirmaries', 'hospital-clach.html',
  'assets/hospitals/clach/clach_hero.png', 'Clarin Community Hospital', 'Poblacion Norte, Clarin, Bohol',
  'Welcome to ClaCH',
  'Clarin Community Hospital (ClaCH) is an Infirmary Hospital committed to delivering accessible and quality primary healthcare services to the people of Clarin and neighboring coastal towns in northwestern Bohol. Operated under the Bohol Provincial Health Office (PHO), ClaCH provides essential inpatient and outpatient medical services, general consultations, and basic diagnostics.',
  '',
  'We Offer:', 'Infirmary Hospital',
  'Provides primary care including general medicine, pediatrics, OB-GYN, minor surgery, isolation facilities, maternity, and basic clinical laboratory.',
  '(038) 509-9122', 'clachphilhealth@yahoo.com', 'provincialhealthoffice@gmail.com', 'Poblacion Norte, Clarin, Bohol',
  '', '',
  'https://maps.google.com/maps?q=9.962600,124.022900&t=&z=15&ie=UTF8&iwloc=&output=embed', '',
  80, false
),
(
  'mch', 'Maribojoc Community Hospital', 'MCH', 'Infirmaries', 'hospital-mch.html',
  'assets/hospitals/mch/mch_hero.png', 'Maribojoc Community Hospital', 'Saug, Bayacabac, Maribojoc, Bohol',
  'Welcome to MCH',
  'Maribojoc Community Hospital (MCH) is an Infirmary Hospital committed to delivering accessible and quality primary healthcare services to the people of Maribojoc and its neighboring municipalities. Operated under the Bohol Provincial Health Office (PHO), MCH provides essential inpatient and outpatient medical services, general consultations, and basic diagnostics.',
  '',
  'We Offer:', 'Infirmary Hospital',
  'Provides primary care including general medicine, pediatrics, OB-GYN, minor surgery, isolation facilities, maternity, and basic clinical laboratory.',
  '(038) 504-9621', 'maribojochospital@yahoo.com', 'provincialhealthoffice@gmail.com', 'Saug, Bayacabac, Maribojoc, Bohol',
  '', '',
  'https://maps.google.com/maps?q=9.742300,123.844100&t=&z=15&ie=UTF8&iwloc=&output=embed', '',
  90, false
),
(
  'cpgmh', 'Pres. Carlos P. Garcia Municipal Hospital', 'PCPGMH', 'Infirmaries', 'hospital-cpgmh.html',
  'assets/hospitals/cpgmh/cpgmh_hero.png', 'Pres. Carlos P. Garcia Municipal Hospital', 'Poblacion, Pres. Carlos P. Garcia (Pitogo), Bohol',
  'Welcome to PCPGMH',
  'Pres. Carlos P. Garcia Municipal Hospital (PCPGMH) is an Infirmary Hospital committed to delivering accessible and quality primary healthcare services to the island municipality of President Carlos P. Garcia (Pitogo) and its communities. Operated under the Bohol Provincial Health Office (PHO), PCPGMH provides essential inpatient and outpatient medical services, general consultations, and basic diagnostics.',
  '',
  'We Offer:', 'Infirmary Hospital',
  'Provides primary care including general medicine, pediatrics, OB-GYN, minor surgery, isolation facilities, maternity, and basic clinical laboratory.',
  '(038) 534-1234', 'pcpgmh1992@gmail.com', 'provincialhealthoffice@gmail.com', 'Poblacion, Pres. Carlos P. Garcia (Pitogo), Bohol',
  '', '',
  'https://maps.google.com/maps?q=10.117200,124.512600&t=&z=15&ie=UTF8&iwloc=&output=embed', '',
  100, false
)
ON CONFLICT (slug) DO UPDATE SET
  name               = EXCLUDED.name,
  short_name         = EXCLUDED.short_name,
  license_group      = EXCLUDED.license_group,
  page_path          = EXCLUDED.page_path,
  hero_image_url     = EXCLUDED.hero_image_url,
  hero_title         = EXCLUDED.hero_title,
  hero_subtitle      = EXCLUDED.hero_subtitle,
  overview_title     = EXCLUDED.overview_title,
  overview_body      = EXCLUDED.overview_body,
  quote              = EXCLUDED.quote,
  offer_heading      = EXCLUDED.offer_heading,
  offer_title        = EXCLUDED.offer_title,
  offer_body         = EXCLUDED.offer_body,
  phone              = EXCLUDED.phone,
  email_primary      = EXCLUDED.email_primary,
  email_secondary    = EXCLUDED.email_secondary,
  location_text      = EXCLUDED.location_text,
  facebook_url       = EXCLUDED.facebook_url,
  facebook_label     = EXCLUDED.facebook_label,
  map_embed_url      = EXCLUDED.map_embed_url,
  map_link_url       = EXCLUDED.map_link_url,
  sort_order         = EXCLUDED.sort_order,
  is_featured        = EXCLUDED.is_featured;


-- -----------------------------------------------------------------------
-- 2. SERVICES — clear and re-insert for all hospitals
-- -----------------------------------------------------------------------
DELETE FROM public.hospital_services;

-- === GMPH Services ===
INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Outpatient Department (OPD)', '',
'["General Medical Consultation","Minor surgery operations (excision of cyst/mass, incision and drainage, dilation & curettage)","OPD minor procedures (wound dressing, catheter insertion)","OPD Special Area (Heart Station, Electrocardiogram [ECG])","Animal Bite Treatment Center (ABTC)","TB DOTS Clinic (utilizing GeneXpert Machine for TB detection)","Dental Services (tooth extraction, dental cleaning, tooth filling) — Suspended due to covid pandemic","Family Planning and Prenatal Services","Newborn Hearing Screening","Anti-tetanus injections"]'::jsonb, 1
FROM public.hospitals WHERE slug = 'gmph';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Laboratory Section & Blood Bank', '',
'["Comprehensive Clinical Pathology Services",{"title":"Clinical Chemistry & Panels","items":["FBS / RBS","Blood Uric Acid","Creatinine","SGOT / SGPT","Lipid Panel (Total Cholesterol, Triglycerides, HDL, LDL, VLDL)","BUN","HBA1C","Alkaline Phosphatase","Electrolytes (Sodium / Potassium)","OGTT","Cardiac Panel & Troponin I"]},{"title":"Hematology & Coagulation","items":["Complete Blood Count (CBC)","Platelet Count","White Blood Count","Differential Count","Hematocrit & Hemoglobin","Red Blood Count","Clotting Time & Bleeding Time","Prothrombin Time & APTT"]},{"title":"Immunology, Serology & Microscopy","items":["Urinalysis & Stool Exam","Pregnancy Test","Spermatozoa Detection","HBsAG & Anti HCV","Dengue Check / Dengue Duo / NS1 Ag","Hepatitis A Virus Test (HAV IgG/IgM)","Salmonella Typhi & H-Pylori","HIV Antibody Test","NCov Rapid Test & Swab (RT-PCR)","Acid Fast Staining","Occult Blood","Syphilis Screen"]},{"title":"Blood Bank Services","items":["Blood Typing & RH Typing","Crossmatching","Newborn Screening"]}]'::jsonb, 2
FROM public.hospitals WHERE slug = 'gmph';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Imaging & Diagnostics', '',
'["Ultrasound Services","CT Scan Services","X-RAY Services (Chest, Extremities, Head, Spine, Pelvic, and Abdomen)",{"title":"Standard Chest & Abdomen X-Rays","items":["Chest X-ray (AP, PA, Lateral, Apicolordotic, Decubitus)","Abdomen X-ray (Flat, Upright)","K.U.B. AP"]},{"title":"Extremity & Joint X-Rays","items":["Hand (APL, APO)","Wrist (APL)","Forearm (APL) & Arm (APL)","Elbow (APL)","Shoulder (AP, Scapular Y)","Clavicle AP","Hip AP & Pelvis AP","Thigh (APL) & Leg (APL)","Knee (APL)","Ankle (APL, Mortise View)","Foot (APO, APL)"]},{"title":"Head, Neck & Spine X-Rays","items":["Skull (APL, Towne''s, Water''s, Caldwell''s View)","Cervical APL","Mandible Ribs (APO, AP, Lateral, Oblique)","Thoracic Spine (AP, Lateral)","Thoraco-Lumbar (AP, Lateral)","Lumbo-Sacral (AP, Lateral)","Nasal Bone Lateral & Paranasal Sinuses"]}]'::jsonb, 3
FROM public.hospitals WHERE slug = 'gmph';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Surgical Operations & Maternal Care', '',
'["Minor Surgery: Eye surgeries (Cataract, Pterygium extraction), excision of cyst/mass, incision and drainage","Major Surgery: Appendectomy, Caesarean Section (CS), and Orthopaedic cases surgery","Normal Labor & Delivery Management","Special Newborn Care Unit (SCANU) & Early Essential Newborn Care (EENC)","Certified Mother-Baby Friendly Hospital (includes Postpartum Breastfeeding Lectures on 10 Steps to Successful Breastfeeding)","Obstetrician Gynecologist Emergency Services (OB-ER) with Fetal Doppler & Cardiotocography Monitoring"]'::jsonb, 4
FROM public.hospitals WHERE slug = 'gmph';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Inpatient Wards & Nursing Wards', '',
'["Admissions & Multi-disciplinary Inpatient Care",{"title":"General & Specialized Wards","items":["Female Surgical Ward & Male Surgical Ward","General IM (Internal Medicine) Ward Male & Female","Cardio / Cardiovascular Disease Ward","Closely Monitored Patient (CMP) Ward","Gastro Ward for Male & Female","Adult Pulmo & Respiratory Therapy Room","Infectious Ward & Isolation Ward","Trans-Out Patient Ward","General ICU (License application pending)"]},{"title":"Pediatric Wards","items":["Pediatric Non-Infectious Ward","Pediatric Gastro Ward","Pediatric Pulmonary Ward","Pediatric CMP Ward & Pedia/Neonatal Ward","Burn Unit"]},{"title":"COVID-19 Ward Services","items":["Covid Emergency Room (Covid ER) & Covid OB-ER","COVID Ward (14-bed capacity, expanding to 22 beds)"]}]'::jsonb, 5
FROM public.hospitals WHERE slug = 'gmph';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Special Programs & Counseling', '',
'["Accredited Drug Testing Center",{"title":"Center for Drug Education & Counseling (CEDEC)","items":["Drug Dependency Evaluation","Community Based Rehabilitation Program Without Walls","Matrix Intensive Outpatient Program","Community Service & Tree Growing Initiatives","Physical & Spiritual Wellness Activities","Drug Test Administration","Aftercare and Social Support Group Sessions","Family Counseling Sessions","Drug Symposiums (Suspended due to pandemic)"]},{"title":"Medical Social Work Services","items":["Patient PhilHealth Classification Assessments","Medical Assistance to Indigent Patients (MAIP) Provision","No Balance Billing (NBB) Policy Implementations"]}]'::jsonb, 6
FROM public.hospitals WHERE slug = 'gmph';

-- === TBGDH Services ===
INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Outpatient Department (OPD)', '',
'["General Consultation","Minor surgery operations (excision of cyst/mass, incision and drainage, dilation and curettage)","OPD minor procedures (wound dressing, catheter insertion)","OPD special area (Heart Station, ECG)","Animal Bite Treatment Center (ABTC)","TB DOTS Clinic (utilizing GeneXpert Machine for TB detection)","Dental Services (tooth extraction, dental cleaning, tooth filling) — Suspended due to covid pandemic","Family Planning and Prenatal Services","Newborn Hearing Screening","Anti-tetanus injections"]'::jsonb, 1
FROM public.hospitals WHERE slug = 'tbgdh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Laboratory Section & Blood Bank', '',
'["Comprehensive Clinical Pathology Services",{"title":"Clinical Chemistry & Panels","items":["FBS / RBS","Blood Uric Acid","Creatinine","SGOT / SGPT","Lipid Panel (Total Cholesterol, Triglycerides, HDL, LDL, VLDL)","BUN","HBA1C","Alkaline Phosphatase","Electrolytes (Sodium / Potassium)","OGTT","Cardiac Panel & Troponin I"]},{"title":"Hematology & Coagulation","items":["Complete Blood Count (CBC)","Platelet Count","White Blood Count","Differential Count","Hematocrit & Hemoglobin","Red Blood Count","Clotting Time & Bleeding Time","Prothrombin Time & APTT"]},{"title":"Immunology, Serology & Microscopy","items":["Urinalysis & Stool Exam","Pregnancy Test","Spermatozoa Detection","HBsAG & Anti HCV","Dengue Check / Dengue Duo / NS1 Ag","Hepatitis A Virus Test (HAV IgG/IgM)","Salmonella Typhi & H-Pylori","HIV Antibody Test","NCov Rapid Test & Swab (RT-PCR)","Acid Fast Staining","Occult Blood","Syphilis Screen"]},{"title":"Blood Bank & Screening","items":["Blood Typing & RH Typing","Crossmatching","Newborn Screening","Accredited Drug Testing Center"]}]'::jsonb, 2
FROM public.hospitals WHERE slug = 'tbgdh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Imaging & Diagnostics', '',
'["Ultrasound Services","CT Scan Services","X-RAY Services (Chest, Extremities, Head, Spine, Pelvic, and Abdomen)",{"title":"Standard Chest & Abdomen X-Rays","items":["Chest X-ray (AP, PA, Lateral, Apicolordotic, Decubitus)","Abdomen X-ray (Flat, Upright)","K.U.B. AP"]},{"title":"Extremity & Joint X-Rays","items":["Hand (APL, APO)","Wrist APL","Forearm APL & Arm APL","Elbow APL","Shoulder (AP, Scapular Y)","Clavicle AP","Hip AP & Pelvis AP","Thigh APL & Leg APL","Knee APL","Ankle (APL, Mortise View)","Foot (APO, APL)"]},{"title":"Head, Neck & Spine X-Rays","items":["Skull (APL, Towne''s, Water''s, Caldwell''s View)","Cervical APL","Mandible Ribs (APO, AP, Lateral, Oblique)","Thoracic Spine (AP, Lateral)","Thoraco-Lumbar (AP, Lateral)","Lumbo-Sacral (AP, Lateral)","Nasal Bone Lateral & Paranasal Sinuses"]}]'::jsonb, 3
FROM public.hospitals WHERE slug = 'tbgdh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Surgical Operations & Maternal Care', '',
'["Minor Surgery: Eye surgeries (Cataract, Pterygium extraction), excision of cyst/mass, incision and drainage","Major Surgery: Appendectomy, Caesarean Section (CS), and Orthopaedic cases surgery","Normal Labor & Delivery Management","Special Newborn Care Unit (SCANU) & Early Essential Newborn Care (EENC)","Certified Mother-Baby Friendly Hospital (includes Postpartum Breastfeeding Lectures on 10 Steps to Successful Breastfeeding)","Obstetrician Gynecologist Emergency Services (OB-ER) with Fetal Doppler & Cardiotocography Monitoring"]'::jsonb, 4
FROM public.hospitals WHERE slug = 'tbgdh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Inpatient Wards & Nursing Wards', '',
'["Admissions & Multi-disciplinary Inpatient Care",{"title":"General & Specialized Wards","items":["Female Surgical Ward & Male Surgical Ward","General IM (Internal Medicine) Ward Male & Female","Cardio / Cardiovascular Disease Ward","Closely Monitored Patient (CMP) Ward","Gastro Ward for Male & Female","Adult Pulmo & Respiratory Therapy Room","Infectious Ward & Isolation Ward","Communicable Diseases Ward","Trans-Out Patient Ward","General ICU (License application pending)"]},{"title":"Pediatric Wards","items":["Pediatric Non-Infectious Ward","Pediatric Gastro Ward","Pediatric Pulmonary Ward","Pediatric CMP Ward & Pedia/Neonatal Ward","Burn Unit"]},{"title":"COVID-19 Ward Services","items":["Covid Emergency Room (Covid ER) & Covid OB-ER","COVID Ward (14-bed capacity, expanding to 22 beds)"]}]'::jsonb, 5
FROM public.hospitals WHERE slug = 'tbgdh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Special Programs & Counseling', '',
'[{"title":"Center for Drug Education & Counseling (CEDEC)","items":["Drug Dependency Evaluation","Community Based Rehabilitation Program Without Walls","Matrix Intensive Outpatient Program","Community Service & Tree Growing Initiatives","Physical & Spiritual Wellness Activities","Drug Test Administration","Aftercare and Social Support Group Sessions","Family Counseling Sessions","Drug Symposiums (Suspended due to pandemic)"]},{"title":"Medical Social Work Services","items":["Patient PhilHealth Classification Assessments","Medical Assistance to Indigent Patients (MAIP) Provision","No Balance Billing (NBB) Policy Implementations"]}]'::jsonb, 6
FROM public.hospitals WHERE slug = 'tbgdh';

-- === CDH Services ===
INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Outpatient Department (OPD)', '',
'["General Consultation","Minor surgery operations (excision of cyst/mass, incision and drainage, dilation and curettage)","OPD minor procedures (wound dressing and catheter insertion)","OPD Special Area — Heart Station, Electrocardiogram (ECG)","Animal Bite Treatment Center (ABTC)","TB DOTS Clinic (equipped with GeneXpert Machine for TB detection)","Dental Services (tooth extraction, dental cleaning, tooth filling) — Currently suspended due to COVID-19","Family Planning and Prenatal Services","Newborn Hearing Screening","Anti-tetanus injections"]'::jsonb, 1
FROM public.hospitals WHERE slug = 'cdh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Laboratory Section', '',
'["CBC, Urinalysis, Fecalysis, Blood Typing, Skin Smear (Sputum), Pregnancy Test","Hepatitis B Screening, Syphilis Screening, Dengue Duo, COVID-19 Antigen Test","Crossmatching",{"title":"Routine Clinical Chemistry","items":["FBS / RBS","Total Cholesterol","Triglycerides","HDL & LDL","Blood Uric Acid (BUA)","Creatinine","SGPT & SGOT","BUN"]}]'::jsonb, 2
FROM public.hospitals WHERE slug = 'cdh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Specialty Clinics (CEDEC)', '',
'["Diabetic Clinic — every Wednesday","Hypertension Clinic — every Thursday","Prenatal Check-up — every Tuesday and Friday"]'::jsonb, 3
FROM public.hospitals WHERE slug = 'cdh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Imaging & Diagnostics', '',
'[{"title":"X-Ray Services","items":["Chest X-ray (Adult & Pedia)","Extremities (Upper & Lower)","Skull","Pelvis","Spine (Cervical, Thoracic, Lumbar)"]},{"title":"Ultrasound Services","items":["OB/Gyne & Pelvic","Whole Abdomen","Upper & Lower Abdomen","Hepatobiliary Tree","Kidneys, Urinary Bladder & Prostate"]}]'::jsonb, 4
FROM public.hospitals WHERE slug = 'cdh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Surgical Operations & Maternal Care', '',
'["Minor Surgery: Eye surgeries (Cataract, Pterygium extraction)","Major Surgery: Appendectomy, Caesarean Section (CS), Orthopaedic cases surgery","Normal Labor & Delivery Management","Special Newborn Care Unit (SCANU) & Early Essential Newborn Care (EENC)","Certified Mother-Baby Friendly Hospital (10 Steps to Successful Breastfeeding for normal and CS deliveries)","OB-ER with Fetal Doppler & Cardiotocography (CTG) Monitoring"]'::jsonb, 5
FROM public.hospitals WHERE slug = 'cdh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Medical Social Work Services', '',
'["Intake interview for inpatient and outpatient","Assessment of patient classification through MSWD Eligibility form","Assist patients in availing medical assistance from various sources (Malasakit, MAIP-DOH, PCSO, LGU, etc.)","Psychosocial counseling and support to patients and relatives","Home visitation when necessary","Referrals to other agencies for further assistance"]'::jsonb, 6
FROM public.hospitals WHERE slug = 'cdh';

-- === FDMH Services ===
INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Outpatient Department (OPD)', '',
'["General Consultation and Medical Services","Minor surgery operations (excision of cyst/mass, incision and drainage, dilation and curettage)","OPD minor procedures (wound dressing and catheter insertion)","OPD Special Area — Heart Station, Electrocardiogram (ECG)","Animal Bite Treatment Center (ABTC)","TB DOTS Clinic (equipped with GeneXpert Machine for TB detection)","Dental Services (tooth extraction, dental cleaning, tooth filling) — Currently suspended due to COVID-19","Family Planning and Prenatal Services","Newborn Hearing Screening","Anti-Tetanus Injection"]'::jsonb, 1
FROM public.hospitals WHERE slug = 'fdmh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Laboratory Section', '',
'["CBC, Urinalysis, Fecalysis (Stool Exam), Blood Typing, Crossmatching","HBsAg, Dengue Duo/NS1 Ag, Hepatitis A & C Virus Tests, HIV Antibody, H-Pylori","Acid Fast Staining (AFB), Newborn Screening, Occult Blood Test","Prothrombin Time (PT), APTT, Troponin I, Cardiac Panel","OGTT, HbA1c, Electrolytes, Sodium/Potassium, Alkaline Phosphatase","Salmonella Typhi, COVID-19 Rapid Antigen Test","Drug Testing Center & Blood Bank"]'::jsonb, 2
FROM public.hospitals WHERE slug = 'fdmh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Imaging & Diagnostics', '',
'[{"title":"X-Ray Services","items":["Chest X-ray (AP, PA, Lateral, Apicolordotic)","Hand, Wrist, Forearm, Elbow, Arm (AP/Lateral)","Shoulder, Clavicle, Cervical Spine","Skull (APL, Towne''s, Water''s, Caldwell''s View)","Thoracic, Thoracolumbar, Lumbosacral Spine","Abdomen (Flat & Upright), KUB, Pelvis","Hip, Thigh, Knee, Leg, Ankle, Foot","Paranasal Sinuses, Nasal Bone, Ribs, Mandible"]},{"title":"Ultrasound Services","items":["OB/Gyne & Pelvic Ultrasound","Whole & Upper/Lower Abdomen"]},{"title":"CT Scan Services","items":["CT Scan available for advanced diagnostics"]}]'::jsonb, 3
FROM public.hospitals WHERE slug = 'fdmh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Surgical Operations & Maternal Care', '',
'["Minor Surgery: Eye surgeries (Cataract, Pterygium extraction)","Major Surgery: Appendectomy, Caesarean Section (CS), Orthopaedic surgery","Normal Labor & Delivery Management","Special Newborn Care Unit (SCANU) & Early Essential Newborn Care (EENC)","Certified Mother-Baby Friendly Hospital (10 Steps to Successful Breastfeeding for normal and CS deliveries)","OB-ER with Fetal Doppler & Cardiotocography (CTG) Monitoring"]'::jsonb, 4
FROM public.hospitals WHERE slug = 'fdmh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'CEDEC — Drug Education & Counseling', '',
'["Drug Dependency Evaluation","Community-Based Rehabilitation Program Without Walls","Matrix Intensive Outpatient Program (MIOP)","Aftercare & Social Support Group Sessions","Family Counselling Sessions","Drug Test & Drug Symposiums","Community Service & Physical/Spiritual Activities"]'::jsonb, 5
FROM public.hospitals WHERE slug = 'fdmh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Medical Social Work Services', '',
'["Patient PhilHealth classification assessment","Medical Assistance to Indigent Patients (MAIP — DOH)","No Balance Billing (NBB) Policy implementation"]'::jsonb, 6
FROM public.hospitals WHERE slug = 'fdmh';

-- === CSGTMH Services ===
INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Outpatient Department (OPD)', '',
'["General Consultation","Minor surgery operations (excision of cyst/mass, incision and drainage, dilation and curettage)","OPD minor procedures (wound dressing, catheter insertion/irrigation)","OPD special area — Heart Station (ECG diagnostics)","Animal Bite Treatment Center (ABTC)","TB DOTS Clinic (with GeneXpert machine molecular diagnostics)","Dental Services (extractions, cleaning, filling — subject to temporary COVID scheduling)","Family Planning & Prenatal consultation services","Newborn Hearing Screening & Anti-tetanus immunizations"]'::jsonb, 1
FROM public.hospitals WHERE slug = 'csgtmh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Laboratory & Blood Bank', '',
'["Hematology: CBC, Platelet Count, WBC with Differential, RBC, Hematocrit & Hemoglobin","Coagulation Studies: Clotting & Bleeding Time, Prothrombin Time, APTT","Clinical Microscopy: Urinalysis, Stool Exam, Occult Blood, Pregnancy Tests, Spermatozoa Detection","Chemistry Panel: FBS/RBS, Blood Uric Acid, Creatinine, SGOT/SGPT, BUN, HBA1C, Electrolytes (Na/K)","Lipid Panel: Total Cholesterol, Triglycerides, HDL, LDL, VLDL","Serology: HBsAg, Dengue Check/NS1 Ag, HAV IgG/IgM, Hepatitis C, HIV, Troponin I, NCov Rapid","Special Diagnostic: Newborn Screening, Acid Fast Staining (AFB), Crossmatching","Licensed Drug Testing Center & Blood Bank services"]'::jsonb, 2
FROM public.hospitals WHERE slug = 'csgtmh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Imaging & Diagnostics', '',
'["Ultrasound Services & CT Scan Diagnostics","Chest X-ray (AP, PA, Lateral, Apicolordotic, Decubitus)","Skull & Mandible X-ray (AP/Lateral, Towne''s, Water''s, Caldwell''s Views)","Upper Extremity X-ray (Hand APO/APL, Wrist, Forearm, Elbow, Arm, Shoulder, Clavicle)","Spinal Column X-ray (Cervical APL, Thoracic AP/Lateral, Thoraco-Lumbar, Lumbo-Sacral)","Abdominal & Pelvic Studies (K.U.B. AP, Flat/Upright Abdomen, Pelvis AP, Hip AP)","Lower Extremity X-ray (Thigh, Knee APL, Leg APL, Ankle Mortise, Foot APO/APL)","Nasal Bone Lateral & Paranasal Sinuses specialized views"]'::jsonb, 3
FROM public.hospitals WHERE slug = 'csgtmh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Surgical Operations & Maternal Care (OR-DR)', '',
'["Minor Ophthalmic Surgeries (Cataract extraction, Pterygium excision)","General Minor Procedures (excision of cysts, abscess incisions & drainages)","Major Surgical Interventions (Appendectomies, C-Sections, basic Orthopedic surgeries)","Normal Labor & Spontaneous Delivery management","Special Newborn Care Unit (SCANU) & Early Essential Newborn Care (EENC)","Fetal Doppler monitoring and Cardiotocography (CTG) machine diagnostics","Certified Mother-Baby Friendly Facility (Structured Postpartum Breastfeeding Lectures)"]'::jsonb, 4
FROM public.hospitals WHERE slug = 'csgtmh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Inpatient Wards & Nursing Wards', '',
'["Admissions & Multidisciplinary inpatient therapeutic care","General Adult Wards: Female Surgical, Male Surgical, General Medicine Wards","Specialized Adult Wards: Cardiovascular Ward, Closely Monitored Patient (CMP) unit, Gastroenterology Ward","Intensive Care Unit (ICU) and Adult Pulmo & Respiratory Therapy room","Isolation Wards, Infectious Wards, and Communicable Diseases unit","Pediatric Specialty Wards: Pediatric Non-Infectious, Pediatric Gastro, Pediatric Pulmonary, Pediatric CMP, Pedia Burn Unit","COVID-19 Inpatient Facilities: Covid Emergency Room, Covid OB-ER, and isolated Covid Ward"]'::jsonb, 5
FROM public.hospitals WHERE slug = 'csgtmh';

INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)
SELECT id, 'Special Programs & Social Work', '',
'["Center for Drug Education and Counseling (CEDEC) evaluations","Community-Based Rehabilitation Program (Program Without Walls) & Matrix Intensive Outpatient Program","Rehabilitation activities: Community services, tree growing, physical/spiritual therapies","Aftercare, Social Support, and Family Counselling Sessions","Medical Social Work: PhilHealth classification assessments & health teaching guidelines","Indigent Patient Care: Medical Assistance to Indigent Patients (MAIP) & No Balance Billing (NBB)"]'::jsonb, 6
FROM public.hospitals WHERE slug = 'csgtmh';

-- === Infirmary hospitals (CANCH, CLACH, CNPCMH, MCH, CPGMH) — shared service structure ===
DO $$
DECLARE
  infirmary_slugs TEXT[] := ARRAY['canch','clach','cnpcmh','mch','cpgmh'];
  v_slug TEXT;
  hosp_id UUID;
BEGIN
  FOREACH v_slug IN ARRAY infirmary_slugs LOOP
    SELECT id INTO hosp_id FROM public.hospitals WHERE hospitals.slug = v_slug;
    IF hosp_id IS NOT NULL THEN
      INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order) VALUES
        (hosp_id, 'Outpatient Department (OPD)', '',
         '["General Consultation and Medical Services","Minor surgery operations","OPD minor procedures (wound dressing)","Family Planning and Prenatal Services","Animal Bite Treatment Care","TB DOTS Clinic"]'::jsonb, 1),
        (hosp_id, 'Laboratory Section', '',
         '["CBC, Urinalysis, Fecalysis (Stool Exam)","Blood Typing, Crossmatching","Acid Fast Staining (AFB)","HBsAg, Dengue Rapid Tests","Drug Testing Center"]'::jsonb, 2),
        (hosp_id, 'Ward & Admissions', '',
         '["General Medicine Wards","Pediatric/Adult Care","OB-Gyne Wards","Isolation Facilities"]'::jsonb, 3),
        (hosp_id, 'Maternity & Deliveries', '',
         '["Normal Spontaneous Delivery","Early Essential Newborn Care (EENC)","Newborn Screening"]'::jsonb, 4),
        (hosp_id, 'Medical Social Work Services', '',
         '["Patient PhilHealth classification assessment","Medical Assistance to Indigent Patients (MAIP — DOH)","No Balance Billing (NBB) Policy implementation"]'::jsonb, 5);
    END IF;
  END LOOP;
END $$;


-- -----------------------------------------------------------------------
-- 3. PROGRAMS — clear and re-insert for all hospitals
-- -----------------------------------------------------------------------
DELETE FROM public.hospital_programs;

-- GMPH
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'Hospital Major Activities',
'["Successful ISO 9001:2015 Surveillance Audit maintenance.","Annual calibration of all medical equipment to guarantee accuracy and safety.","Enhanced staff capabilities through Basic Life Support (BLS) and Advanced Cardiovascular Life Support (ACLS) trainings.","3-month specialized training programs for Hemodialysis personnel (nurses, doctors, and technicians).","HDC Building expansions: procured new furniture, fixtures, office equipment, and IT networks.","Regular administrative upgrading, including purchasing air conditioning units and high-capacity copying systems.","Active environmental advocacy: Participated in local mangrove tree planting activities."]',
'', false, 1 FROM public.hospitals WHERE slug = 'gmph';

INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'COVID-19 Response & Safety',
'["COVID Ward capacity increased from 14 beds to 24 beds to accommodate surges.","Vigorous COVID-19 Vaccination Program, performing 4,221 shots.","Formal DOH Licensing obtained for the Covid isolation facility, making it fully operational.","Maintained isolated COVID Emergency Rooms (Covid ER) and dedicated COVID delivery units (Covid OB-ER)."]',
'', true, 2 FROM public.hospitals WHERE slug = 'gmph';

-- TBGDH
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'Hospital Major Activities',
'["Successful ISO 9001:2015 Surveillance Audit maintenance.","Annual calibration of all medical equipment.","Enhanced staff capabilities through BLS and ACLS trainings.","3-month specialized training programs for Hemodialysis personnel.","HDC Building expansions and procurement of new equipment and IT networks.","Regular administrative upgrading including AC units and high-capacity copying systems.","Active environmental advocacy including local mangrove tree planting activities."]',
'', false, 1 FROM public.hospitals WHERE slug = 'tbgdh';

INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'COVID-19 Response & Safety',
'["COVID Ward capacity expanded to accommodate patient surges.","Active COVID-19 Vaccination Program conducted.","Formal DOH Licensing obtained for the Covid isolation facility.","Maintained isolated COVID Emergency Rooms and dedicated COVID OB-ER."]',
'', true, 2 FROM public.hospitals WHERE slug = 'tbgdh';

-- CDH
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'Hospital Major Activities',
'["Successful ISO 9001:2015 Surveillance Audit maintenance.","Annual calibration of all medical equipment to guarantee accuracy and safety.","Enhanced staff capabilities through Basic Life Support (BLS) and Advanced Cardiovascular Life Support (ACLS) trainings.","Regular procurement of medical supplies and hospital infrastructure improvements.","Active implementation of public health programs (TB DOTS, Immunization, Family Planning).","Continuous Mother-Baby Friendly Hospital initiatives for safe maternal care."]',
'', false, 1 FROM public.hospitals WHERE slug = 'cdh';

INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'COVID-19 Response & Safety',
'["Established and maintained COVID isolation ward and COVID Emergency Room.","Active COVID-19 Vaccination Program.","Implementation of strict infection control protocols hospital-wide.","Maintained dedicated COVID OB-ER for maternity patients."]',
'', true, 2 FROM public.hospitals WHERE slug = 'cdh';

-- FDMH
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'Hospital Major Activities',
'["Successful ISO 9001:2015 Surveillance Audit maintenance.","Annual calibration of all medical equipment to guarantee accuracy and safety.","Enhanced staff capabilities through BLS and ACLS trainings.","Regular procurement of medical supplies and hospital infrastructure improvements.","Active implementation of public health programs (TB DOTS, Animal Bite Treatment, Immunization).","Continuous Mother-Baby Friendly Hospital initiatives for safe maternal care and deliveries."]',
'', false, 1 FROM public.hospitals WHERE slug = 'fdmh';

INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'COVID-19 Response & Safety',
'["Established and maintained COVID isolation ward and COVID Emergency Room.","Active COVID-19 Vaccination Program conducted for community and staff.","Implemented strict infection prevention and control protocols throughout the hospital.","Maintained dedicated COVID OB-ER for safe maternity services during the pandemic."]',
'', true, 2 FROM public.hospitals WHERE slug = 'fdmh';

-- CSGTMH
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'Key Infrastructure & Equipment Upgrades',
'["Construction of Perimeter Fence — 90% completed to guarantee safety and security.","Sewage Treatment Setup — 50% completed biological sewage treatment setup.","Construction of Hemodialysis Center — 15% ongoing infrastructure development.","Procurement of Medical Equipment — Fully functional diagnostic and surgical units including portable X-ray machine with digitalization, CTG machine, ECG machine, cardiac monitors, defibrillators with monitors, LED OR lights, OR/DR tables, hemoglobin/hematocrit machines, infusion pumps, desktop computers, air conditioning inverters, and CCTV systems."]',
'', false, 1 FROM public.hospitals WHERE slug = 'csgtmh';

-- CANCH
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'Recent Accomplishments',
'["Continuous provision of outpatient and inpatient services to the community.","Upgrading of isolation facilities and hospital wards for better patient care.","Implementation of public health programs including TB DOTS and Animal Bite Treatment.","Maintenance of Mother-Baby Friendly initiatives for safe maternal care and deliveries."]',
'', false, 1 FROM public.hospitals WHERE slug = 'canch';

-- CLACH
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'Recent Accomplishments',
'["Continuous provision of outpatient and inpatient services to the community.","Upgrading of isolation facilities and hospital wards for better patient care.","Implementation of public health programs including TB DOTS and Animal Bite Treatment.","Maintenance of Mother-Baby Friendly initiatives for safe maternal care and deliveries."]',
'', false, 1 FROM public.hospitals WHERE slug = 'clach';

-- CNPCMH
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'Recent Accomplishments',
'["Continuous provision of outpatient and inpatient services to the community.","Upgrading of isolation facilities and hospital wards for better patient care.","Implementation of public health programs including TB DOTS and Animal Bite Treatment.","Maintenance of Mother-Baby Friendly initiatives for safe maternal care and deliveries."]',
'', false, 1 FROM public.hospitals WHERE slug = 'cnpcmh';

-- MCH
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'Recent Accomplishments',
'["Continuous provision of outpatient and inpatient services to the community.","Upgrading of isolation facilities and hospital wards for better patient care.","Implementation of public health programs including TB DOTS and Animal Bite Treatment.","Maintenance of Mother-Baby Friendly initiatives for safe maternal care and deliveries."]',
'', false, 1 FROM public.hospitals WHERE slug = 'mch';

-- CPGMH
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)
SELECT id, 'Recent Accomplishments',
'["Continuous provision of outpatient and inpatient services to the island community.","Upgrading of isolation facilities and hospital wards for better patient care.","Implementation of public health programs including TB DOTS and Animal Bite Treatment.","Maintenance of Mother-Baby Friendly initiatives for safe maternal care and deliveries."]',
'', false, 1 FROM public.hospitals WHERE slug = 'cpgmh';

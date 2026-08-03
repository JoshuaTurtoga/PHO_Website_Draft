-- =============================================================================
-- Hospital Programs (Activities) Seed Data
-- Each record = one activity-card-box in the static HTML
-- body field = JSON array of activity list items
-- is_covid = true for the covid/shield box
-- =============================================================================

-- Clear existing programs first
DELETE FROM public.hospital_programs;

-- Fix garbled quote encoding in hospitals table
UPDATE public.hospitals SET quote = '"Sa PHO, Una ang Serbisyo!"' WHERE slug IN ('cdh', 'csgtmh', 'gmph', 'tbgdh') AND quote LIKE '%â€%';

-- ---- GMPH — 2 boxes ----
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'Hospital Major Activities',
  '["Successful ISO 9001:2015 Surveillance Audit maintenance.","Annual calibration of all medical equipment to guarantee accuracy and safety.","Enhanced staff capabilities through Basic Life Support (BLS) and Advanced Cardiovascular Life Support (ACLS) trainings.","3-month specialized training programs for Hemodialysis personnel (nurses, doctors, and technicians).","HDC Building expansions: procured new furniture, fixtures, office equipment, and IT networks.","Regular administrative upgrading, including purchasing air conditioning units and high-capacity copying systems.","Active environmental advocacy: Participated in local mangrove tree planting activities."]',
  '', false, 1 FROM public.hospitals WHERE slug = 'gmph';

INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'COVID-19 Response & Safety',
  '["COVID Ward capacity increased from 14 beds to 24 beds to accommodate surges.","Vigorous COVID-19 Vaccination Program, performing 4,221 shots.","Formal DOH Licensing obtained for the Covid isolation facility, making it fully operational.","Maintained isolated COVID Emergency Rooms (Covid ER) and dedicated COVID delivery units (Covid OB-ER)."]',
  '', true, 2 FROM public.hospitals WHERE slug = 'gmph';

-- ---- TBGDH — 2 boxes ----
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'Hospital Major Activities',
  '["Successful ISO 9001:2015 Surveillance Audit maintenance.","Annual calibration of all medical equipment.","Enhanced staff capabilities through BLS and ACLS trainings.","3-month specialized training programs for Hemodialysis personnel.","HDC Building expansions and procurement of new equipment and IT networks.","Regular administrative upgrading including AC units and high-capacity copying systems.","Active environmental advocacy including local mangrove tree planting activities."]',
  '', false, 1 FROM public.hospitals WHERE slug = 'tbgdh';

INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'COVID-19 Response & Safety',
  '["COVID Ward capacity expanded to accommodate patient surges.","Active COVID-19 Vaccination Program conducted.","Formal DOH Licensing obtained for the Covid isolation facility.","Maintained isolated COVID Emergency Rooms and dedicated COVID OB-ER."]',
  '', true, 2 FROM public.hospitals WHERE slug = 'tbgdh';

-- ---- CDH — 2 boxes ----
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'Hospital Major Activities',
  '["Successful ISO 9001:2015 Surveillance Audit maintenance.","Annual calibration of all medical equipment to guarantee accuracy and safety.","Enhanced staff capabilities through Basic Life Support (BLS) and Advanced Cardiovascular Life Support (ACLS) trainings.","Regular procurement of medical supplies and hospital infrastructure improvements.","Active implementation of public health programs (TB DOTS, Immunization, Family Planning).","Continuous Mother-Baby Friendly Hospital initiatives for safe maternal care."]',
  '', false, 1 FROM public.hospitals WHERE slug = 'cdh';

INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'COVID-19 Response & Safety',
  '["Established and maintained COVID isolation ward and COVID Emergency Room.","Active COVID-19 Vaccination Program.","Implementation of strict infection control protocols hospital-wide.","Maintained dedicated COVID OB-ER for maternity patients."]',
  '', true, 2 FROM public.hospitals WHERE slug = 'cdh';

-- ---- FDMH — 2 boxes ----
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'Hospital Major Activities',
  '["Successful ISO 9001:2015 Surveillance Audit maintenance.","Annual calibration of all medical equipment to guarantee accuracy and safety.","Enhanced staff capabilities through BLS and ACLS trainings.","Regular procurement of medical supplies and hospital infrastructure improvements.","Active implementation of public health programs (TB DOTS, Animal Bite Treatment, Immunization).","Continuous Mother-Baby Friendly Hospital initiatives for safe maternal care and deliveries."]',
  '', false, 1 FROM public.hospitals WHERE slug = 'fdmh';

INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'COVID-19 Response & Safety',
  '["Established and maintained COVID isolation ward and COVID Emergency Room.","Active COVID-19 Vaccination Program conducted for community and staff.","Implemented strict infection prevention and control protocols throughout the hospital.","Maintained dedicated COVID OB-ER for safe maternity services during the pandemic."]',
  '', true, 2 FROM public.hospitals WHERE slug = 'fdmh';

-- ---- CSGTMH — 1 box (uses .activities-single-layout class) ----
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'Key Infrastructure & Equipment Upgrades',
  '["Construction of Perimeter Fence – 90% completed to guarantee safety and security.","Sewage Treatment Setup – 50% completed biological sewage treatment setup.","Construction of Hemodialysis Center – 15% ongoing infrastructure development.","Procurement of Medical Equipment – Fully functional diagnostic and surgical units including portable X-ray machine with digitalization, CTG machine, ECG machine, cardiac monitors, defibrillators with monitors, LED OR lights, OR/DR tables, hemoglobin/hematocrit machines, infusion pumps, desktop computers, air conditioning inverters, and CCTV systems."]',
  '', false, 1 FROM public.hospitals WHERE slug = 'csgtmh';

-- ---- CANCH — 1 box ----
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'Recent Accomplishments',
  '["Continuous provision of outpatient and inpatient services to the community.","Upgrading of isolation facilities and hospital wards for better patient care.","Implementation of public health programs including TB DOTS and Animal Bite Treatment.","Maintenance of Mother-Baby Friendly initiatives for safe maternal care and deliveries."]',
  '', false, 1 FROM public.hospitals WHERE slug = 'canch';

-- ---- CLACH — 1 box ----
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'Recent Accomplishments',
  '["Continuous provision of outpatient and inpatient services to the community.","Upgrading of isolation facilities and hospital wards for better patient care.","Implementation of public health programs including TB DOTS and Animal Bite Treatment.","Maintenance of Mother-Baby Friendly initiatives for safe maternal care and deliveries."]',
  '', false, 1 FROM public.hospitals WHERE slug = 'clach';

-- ---- CNPCMH — 1 box ----
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'Recent Accomplishments',
  '["Continuous provision of outpatient and inpatient services to the community.","Upgrading of isolation facilities and hospital wards for better patient care.","Implementation of public health programs including TB DOTS and Animal Bite Treatment.","Maintenance of Mother-Baby Friendly initiatives for safe maternal care and deliveries."]',
  '', false, 1 FROM public.hospitals WHERE slug = 'cnpcmh';

-- ---- MCH — 1 box ----
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'Recent Accomplishments',
  '["Continuous provision of outpatient and inpatient services to the community.","Upgrading of isolation facilities and hospital wards for better patient care.","Implementation of public health programs including TB DOTS and Animal Bite Treatment.","Maintenance of Mother-Baby Friendly initiatives for safe maternal care and deliveries."]',
  '', false, 1 FROM public.hospitals WHERE slug = 'mch';

-- ---- CPGMH — 1 box ----
INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order) SELECT id,
  'Recent Accomplishments',
  '["Continuous provision of outpatient and inpatient services to the island community.","Upgrading of isolation facilities and hospital wards for better patient care.","Implementation of public health programs including TB DOTS and Animal Bite Treatment.","Maintenance of Mother-Baby Friendly initiatives for safe maternal care and deliveries."]',
  '', false, 1 FROM public.hospitals WHERE slug = 'cpgmh';

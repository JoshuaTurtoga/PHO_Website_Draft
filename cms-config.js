/* ============================================================
   cms-config.js — Supabase Configuration
   Bohol Provincial Health Office — CMS System
   ============================================================

   SETUP INSTRUCTIONS:
   1. Go to https://supabase.com and create a free account.
   2. Create a new project (name it "pho-website" or similar).
   3. Once the project is ready, go to:
        Project Settings → API
   4. Copy your "Project URL" and "anon public" key below.
   5. Run the supabase_migration.sql file in your Supabase SQL Editor.
   6. Create your first admin user in:
        Authentication → Users → "Add User" button.
   ============================================================ */

const SUPABASE_URL    = 'https://ooqysrsuwhuehoenusfz.supabase.co';   // ← Replace this
const SUPABASE_ANON_KEY = 'sb_publishable_J7YNn3TpqiTaqaoXl7O6NQ_Mvq1JhIy';                 // ← Replace this

/* ── Supabase JS SDK loaded via CDN in each HTML page ──────── */
function getSupabaseClient() {
  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.error('[CMS] Supabase SDK not loaded. Make sure the CDN script tag is present.');
    return null;
  }
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

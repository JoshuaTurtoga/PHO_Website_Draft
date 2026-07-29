/* ============================================================
   cms.js — Public Content Hydration Script
   Bohol Provincial Health Office — CMS System

   This script is loaded on every public-facing page.
   It fetches content from Supabase and replaces the static
   HTML fallback values with the latest database values.

   Elements with [data-cms-key] are hydrated automatically.
   Elements with [data-cms-img] have their src replaced.
   Elements with [data-cms-href] have their href replaced.
   ============================================================ */

(async function cmsHydrate() {
  // Wait for the Supabase SDK
  if (typeof supabase === 'undefined' || !supabase.createClient) return;
  if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('YOUR_PROJECT_ID')) return;

  const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const { data, error } = await client
      .from('site_content')
      .select('content_key, content_value, content_type');

    if (error || !data) return;

    // Build lookup map
    const contentMap = {};
    data.forEach(row => { contentMap[row.content_key] = row; });

    // ── Hydrate text content ────────────────────────────────
    document.querySelectorAll('[data-cms-key]').forEach(el => {
      const key = el.getAttribute('data-cms-key');
      if (contentMap[key]) {
        const val = contentMap[key].content_value;
        const type = contentMap[key].content_type;
        if (type === 'html') {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // ── Hydrate image src or background ─────────────────────
    document.querySelectorAll('[data-cms-img]').forEach(el => {
      const key = el.getAttribute('data-cms-img');
      if (contentMap[key] && contentMap[key].content_value) {
        const url = contentMap[key].content_value;
        if (el.tagName.toLowerCase() === 'img') {
          el.src = url;
        } else {
          el.style.backgroundImage = `url('${url}')`;
        }
      }
    });

    // ── Hydrate link href ───────────────────────────────────
    document.querySelectorAll('[data-cms-href]').forEach(el => {
      const key = el.getAttribute('data-cms-href');
      if (contentMap[key] && contentMap[key].content_value) {
        el.href = contentMap[key].content_value;
      }
    });

  } catch (e) {
    // Silently fail — static HTML fallback remains visible
  }
})();

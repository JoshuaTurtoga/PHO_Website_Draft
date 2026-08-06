(function initPhoCmsConfig() {
  const DEFAULT_SUPABASE_URL = 'YOUR_SUPABASE_URL';
  const DEFAULT_SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

  const existing = window.PHO_CMS_CONFIG || {};
  const config = {
    supabaseUrl: existing.supabaseUrl || window.PHO_SUPABASE_URL || localStorage.getItem('pho.supabase.url') || DEFAULT_SUPABASE_URL,
    supabaseAnonKey: existing.supabaseAnonKey || window.PHO_SUPABASE_ANON_KEY || localStorage.getItem('pho.supabase.anonKey') || DEFAULT_SUPABASE_ANON_KEY,
    mediaBucket: 'cms-assets',
    contentTimeoutMs: 8000,
    authTimeoutMs: 10000,
    authWatchdogMs: 15000,
    loginRoute: '/phoadmincmslogin',
    dashboardRoute: '/admin/dashboard',
    legacyDashboardRoute: '/phoadmincms-dashboard'
  };

  let client = null;

  function isPlaceholder(value) {
    return !value
      || /^YOUR_/i.test(value)
      || /your[-_\s]?supabase/i.test(value)
      || /example\.supabase\.co/i.test(value);
  }

  function isConfigured() {
    return Boolean(window.supabase && !isPlaceholder(config.supabaseUrl) && !isPlaceholder(config.supabaseAnonKey));
  }

  function getClient() {
    if (!isConfigured()) {
      return null;
    }

    if (!client) {
      client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }

    return client;
  }

  function resolveRoute(pathname) {
    try {
      return new URL(pathname, window.location.origin).toString();
    } catch (error) {
      return pathname;
    }
  }

  window.PHO_CMS_CONFIG = config;
  window.PHO_CMS = window.PHO_CMS || {};
  window.PHO_CMS.getClient = getClient;
  window.PHO_CMS.isConfigured = isConfigured;
  window.PHO_CMS.resolveRoute = resolveRoute;
})();

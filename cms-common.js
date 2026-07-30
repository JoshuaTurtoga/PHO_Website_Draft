(function initPhoCmsCommon() {
  const config = window.PHO_CMS_CONFIG || {};
  const cms = window.PHO_CMS || (window.PHO_CMS = {});

  function withTimeout(promise, ms, message) {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        window.setTimeout(() => reject(new Error(message || 'Request timed out.')), ms);
      })
    ]);
  }

  function getRateLimitState() {
    try {
      return JSON.parse(localStorage.getItem('pho.cms.loginRateLimit') || '{"attempts":[]}');
    } catch (error) {
      return { attempts: [] };
    }
  }

  function saveRateLimitState(state) {
    try {
      localStorage.setItem('pho.cms.loginRateLimit', JSON.stringify(state));
    } catch (error) {
      console.warn('Unable to save login rate limit state.', error);
    }
  }

  function pruneAttempts(attempts, windowMs) {
    const now = Date.now();
    return attempts.filter((timestamp) => now - timestamp < windowMs);
  }

  function getLoginThrottle() {
    const windowMs = 15 * 60 * 1000;
    const maxAttempts = 5;
    const state = getRateLimitState();
    const attempts = pruneAttempts(state.attempts || [], windowMs);
    return {
      attempts,
      windowMs,
      maxAttempts,
      remaining: Math.max(maxAttempts - attempts.length, 0),
      blockedUntil: attempts.length >= maxAttempts ? attempts[0] + windowMs : 0
    };
  }

  function registerLoginAttempt() {
    const state = getRateLimitState();
    const throttle = getLoginThrottle();
    const attempts = throttle.attempts.concat(Date.now());
    saveRateLimitState({ attempts });
  }

  function clearLoginAttempts() {
    saveRateLimitState({ attempts: [] });
  }

  async function getSession() {
    const client = cms.getClient?.();
    if (!client) {
      return null;
    }

    const result = await withTimeout(
      client.auth.getSession(),
      config.authTimeoutMs || 10000,
      'Timed out while checking your session.'
    );

    return result?.data?.session || null;
  }

  async function getProfile(userId) {
    const client = cms.getClient?.();
    if (!client || !userId) {
      return null;
    }

    const result = await withTimeout(
      client.from('profiles').select('id, email, role').eq('id', userId).maybeSingle(),
      config.authTimeoutMs || 10000,
      'Timed out while checking your admin profile.'
    );

    if (result?.error) {
      throw new Error(result.error.message || 'Unable to read the CMS admin profile.');
    }

    return result?.data || null;
  }

  async function requireAdmin() {
    const session = await getSession();
    if (!session?.user?.id) {
      return { session: null, profile: null, isAdmin: false };
    }

    const profile = await getProfile(session.user.id);
    return {
      session,
      profile,
      isAdmin: profile?.role === 'admin'
    };
  }

  async function login(email, password) {
    const client = cms.getClient?.();
    if (!client) {
      throw new Error('Supabase CMS configuration is missing.');
    }

    const throttle = getLoginThrottle();
    if (throttle.blockedUntil > Date.now()) {
      const waitSeconds = Math.ceil((throttle.blockedUntil - Date.now()) / 1000);
      throw new Error(`Too many login attempts. Please wait ${waitSeconds} seconds and try again.`);
    }

    try {
      const result = await withTimeout(
        client.auth.signInWithPassword({ email, password }),
        config.authTimeoutMs || 10000,
        'Timed out while signing in.'
      );

      if (result?.error) {
        throw result.error;
      }

      const auth = await requireAdmin();
      if (!auth.isAdmin) {
        await logout();
        if (!auth.profile) {
          throw new Error('This account signed in, but no matching CMS admin profile was found. Make sure public.profiles.id exactly matches the user id in auth.users.');
        }
        throw new Error('This account signed in, but its CMS profile is not marked with role = admin.');
      }

      clearLoginAttempts();
      return auth;
    } catch (error) {
      registerLoginAttempt();
      throw new Error(error?.message || 'Unable to sign in right now.');
    }
  }

  async function logout() {
    const client = cms.getClient?.();
    if (!client) {
      return;
    }

    try {
      await withTimeout(
        client.auth.signOut(),
        config.authTimeoutMs || 10000,
        'Timed out while signing out.'
      );
    } catch (error) {
      console.warn('Sign out failed.', error);
    }
  }

  function sanitizeFileName(name) {
    return String(name || 'file')
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async function uploadAsset(file, folder) {
    const client = cms.getClient?.();
    if (!client) {
      throw new Error('Supabase CMS configuration is missing.');
    }

    const safeName = sanitizeFileName(file?.name || 'asset');
    const path = `${folder || 'uploads'}/${Date.now()}-${safeName}`;
    const bucket = config.mediaBucket || 'cms-assets';

    const uploadResult = await withTimeout(
      client.storage.from(bucket).upload(path, file, { upsert: true }),
      config.authTimeoutMs || 10000,
      'Timed out while uploading the image.'
    );

    if (uploadResult?.error) {
      throw uploadResult.error;
    }

    const publicUrlResult = client.storage.from(bucket).getPublicUrl(path);
    return {
      path,
      publicUrl: publicUrlResult?.data?.publicUrl || ''
    };
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  cms.withTimeout = withTimeout;
  cms.getSession = getSession;
  cms.getProfile = getProfile;
  cms.requireAdmin = requireAdmin;
  cms.login = login;
  cms.logout = logout;
  cms.clearLoginAttempts = clearLoginAttempts;
  cms.uploadAsset = uploadAsset;
  cms.escapeHtml = escapeHtml;
  cms.getLoginThrottle = getLoginThrottle;
})();

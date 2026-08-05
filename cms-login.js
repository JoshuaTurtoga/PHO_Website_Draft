(function initPhoCmsLogin() {
  const cms = window.PHO_CMS || {};
  const config = window.PHO_CMS_CONFIG || {};

  function setLoader(active, message) {
    const loader = document.getElementById('login-loader');
    const loaderMessage = document.getElementById('login-loader-message');
    const submitButton = document.getElementById('login-submit');
    if (loader) {
      loader.classList.toggle('active', active);
    }
    if (loaderMessage && message) {
      loaderMessage.textContent = message;
    }
    if (submitButton) {
      submitButton.disabled = active;
    }
  }

  function setStatus(message, type) {
    const status = document.getElementById('login-status');
    if (!status) {
      return;
    }
    status.textContent = message || '';
    status.className = `cms-status${type ? ` ${type}` : ''}`;
  }

  async function bootstrap() {
    const form = document.getElementById('cms-login-form');
    if (!form) {
      return;
    }

    if (!cms.isConfigured?.()) {
      setStatus('Supabase is not configured yet. Add the project URL and anon key in cms-config.js.', 'error');
      return;
    }

    try {
      const auth = await cms.requireAdmin?.();
      if (auth?.isAdmin) {
        window.location.href = config.dashboardRoute || '/admin/dashboard';
        return;
      }
    } catch (error) {
      console.warn('Initial auth check failed.', error);
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value;
      if (!email || !password) {
        setStatus('Enter both your email address and password.', 'error');
        return;
      }

      setStatus('');
      setLoader(true, 'Signing you in...');

      const watchdog = window.setTimeout(() => {
        setLoader(false, 'Signing you in...');
        setStatus('The login request took too long. Please try again.', 'error');
      }, config.authWatchdogMs || 15000);

      try {
        await cms.login?.(email, password);
        window.location.href = config.dashboardRoute || '/admin/dashboard';
      } catch (error) {
        setStatus(error.message || 'Unable to sign in right now.', 'error');
      } finally {
        window.clearTimeout(watchdog);
        setLoader(false, 'Signing you in...');
      }
    });
  }

  if (document.body?.dataset?.cmsLogin === 'true') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
      bootstrap();
    }
  }
})();

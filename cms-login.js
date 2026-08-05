(function initPhoCmsLogin() {
  const cms = window.PHO_CMS || {};
  const config = window.PHO_CMS_CONFIG || {};

  const NOTICE_ICONS = {
    error: '<svg class="cms-notice-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>',
    warning: '<svg class="cms-notice-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>',
    info: '<svg class="cms-notice-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>'
  };

  const ERROR_MAP = [
    { pattern: /invalid login credentials/i, title: 'Invalid Credentials', message: 'The email address or password you entered is incorrect. Please double-check and try again.' },
    { pattern: /email not confirmed/i, title: 'Email Not Verified', message: 'Your email address has not been confirmed yet. Please check your inbox for a verification link.' },
    { pattern: /too many requests/i, title: 'Too Many Attempts', message: 'You have made too many login attempts. Please wait a few minutes before trying again.' },
    { pattern: /too many login attempts.*?(\d+)\s*seconds/i, title: 'Rate Limited', message: null, buildMessage: (match) => `You've exceeded the maximum login attempts. Please wait ${match[1]} seconds before trying again.` },
    { pattern: /user not found/i, title: 'Account Not Found', message: 'No account was found with that email address. Please verify your email or contact an administrator.' },
    { pattern: /network|fetch|failed to fetch|net::/i, title: 'Connection Error', message: 'Unable to reach the authentication server. Please check your internet connection and try again.' },
    { pattern: /timed?\s*out/i, title: 'Request Timed Out', message: 'The server took too long to respond. This may be due to a slow connection. Please try again.' },
    { pattern: /supabase.*not configured/i, title: 'Configuration Missing', message: 'The CMS backend (Supabase) is not configured yet. Contact the site administrator to set up the project URL and API key in cms-config.js.', type: 'warning' },
    { pattern: /no matching cms admin profile/i, title: 'Profile Not Found', message: 'You signed in successfully, but no CMS admin profile exists for this account. Ensure the profiles table has a matching entry with your user ID.', type: 'warning' },
    { pattern: /not marked with role\s*=\s*admin/i, title: 'Insufficient Permissions', message: 'Your account exists but does not have admin privileges. Contact an administrator to update your profile role to "admin".', type: 'warning' },
    { pattern: /disabled|banned|blocked/i, title: 'Account Disabled', message: 'This account has been disabled or blocked. Please contact an administrator for assistance.' }
  ];

  function classifyError(rawMessage) {
    if (!rawMessage) {
      return { type: 'error', title: 'Sign-In Failed', message: 'An unexpected error occurred. Please try again or contact an administrator.' };
    }

    for (const rule of ERROR_MAP) {
      const match = rawMessage.match(rule.pattern);
      if (match) {
        return {
          type: rule.type || 'error',
          title: rule.title,
          message: rule.buildMessage ? rule.buildMessage(match) : rule.message
        };
      }
    }

    return { type: 'error', title: 'Sign-In Failed', message: rawMessage };
  }

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

  function setStatus(rawMessage, type) {
    const container = document.getElementById('login-status');
    if (!container) {
      return;
    }

    if (!rawMessage) {
      container.innerHTML = '';
      container.className = 'cms-login-notice';
      return;
    }

    const classified = (type === 'error' || type === 'warning')
      ? classifyError(rawMessage)
      : { type: type || 'info', title: '', message: rawMessage };

    const icon = NOTICE_ICONS[classified.type] || NOTICE_ICONS.error;

    container.innerHTML = `
      ${icon}
      <div class="cms-notice-body">
        ${classified.title ? `<div class="cms-notice-title">${classified.title}</div>` : ''}
        <div class="cms-notice-message">${classified.message}</div>
      </div>
      <button type="button" class="cms-notice-dismiss" aria-label="Dismiss">&times;</button>
    `;

    container.className = `cms-login-notice visible ${classified.type}`;

    const dismissBtn = container.querySelector('.cms-notice-dismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        container.innerHTML = '';
        container.className = 'cms-login-notice';
      }, { once: true });
    }
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
        setStatus('Enter both your email address and password.', 'warning');
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

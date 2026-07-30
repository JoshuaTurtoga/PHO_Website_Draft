(function initPhoContactForm() {
  const cms = window.PHO_CMS || {};
  let emailConfig = null;

  function setStatus(message, isError) {
    const status = document.getElementById('form-status');
    if (!status) {
      return;
    }
    status.style.color = isError ? '#c62828' : 'var(--green-primary)';
    status.textContent = message || '';
  }

  async function resolveEmailConfig() {
    if (window.PHO_CMS_EMAILJS) {
      emailConfig = window.PHO_CMS_EMAILJS;
      return emailConfig;
    }

    if (!cms.isConfigured?.()) {
      return null;
    }

    try {
      const client = cms.getClient?.();
      const result = await client.from('emailjs_config').select('*').eq('id', 1).maybeSingle();
      emailConfig = result?.data || null;
      return emailConfig;
    } catch (error) {
      console.warn('Unable to load EmailJS config.', error);
      return null;
    }
  }

  async function init() {
    const form = document.getElementById('contact-email-form');
    const submitButton = document.getElementById('btn-submit');
    if (!form || !submitButton || !window.emailjs) {
      return;
    }

    const config = await resolveEmailConfig();
    if (!config?.public_key || !config?.service_id || !config?.template_id) {
      setStatus('Contact form email delivery is not configured yet.', true);
      return;
    }

    window.emailjs.init({ publicKey: config.public_key });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = document.getElementById('form-name');
      const email = document.getElementById('form-email');
      const message = document.getElementById('form-message');
      const spam = document.getElementById('spam-answer');
      const fields = [name, email, message, spam];

      let hasError = false;
      fields.forEach((field) => {
        field?.classList.remove('is-invalid');
        if (!field?.value.trim()) {
          field?.classList.add('is-invalid');
          hasError = true;
        }
      });

      if (hasError) {
        setStatus('Please fill in all required fields before sending.', true);
        return;
      }

      if (Number(spam.value.trim()) !== 7) {
        spam.classList.add('is-invalid');
        setStatus('Verification failed. Incorrect answer.', true);
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      setStatus('Sending your message...', false);

      try {
        await window.emailjs.send(config.service_id, config.template_id, {
          from_name: name.value.trim(),
          name: name.value.trim(),
          reply_to: email.value.trim(),
          message: message.value.trim()
        });

        form.reset();
        setStatus('Message sent successfully. We will get back to you soon.', false);
      } catch (error) {
        console.error('EmailJS error:', error);
        setStatus('Failed to send message. Please try again or call the office directly.', true);
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Send Email';
      }
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('pho-cms:content-applied', () => {
    resolveEmailConfig();
  });
})();

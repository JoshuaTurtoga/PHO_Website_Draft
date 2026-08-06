(function initPhoAdminDashboard() {
  const cms = window.PHO_CMS || {};
  const navigationGroups = [
    { title: 'Shared', items: ['shared/navbar', 'shared/footer'] },
    { title: 'Home', items: ['home/hero', 'home/services', 'home/about', 'home/vmg'] },
    { title: 'About', items: ['about/hero', 'about/history', 'about/strategies', 'about/units', 'about/org_structure'] },
    { title: 'Pages', items: ['laboratory/hero', 'promotive/hero', 'hospitals/hero', 'contact/hero', 'contact/info'] },
    { title: 'Repeating Lists', items: ['lab_cards', 'promotive_cards', 'hospital_cards', 'contact_directory', 'emailjs_config'] }
  ];

  const state = {
    auth: null,
    hospitals: [],
    currentViewId: null,
    currentGroup: 'Shared',
    currentSchema: null,
    currentData: null,
    currentMode: null,
    statusTimer: null,
    isDirty: false
  };

  const sectionSchemas = {
    'shared/navbar': {
      kind: 'section',
      pageName: 'shared',
      sectionKey: 'navbar',
      title: 'Navbar',
      description: 'Update the shared navigation brand, labels, and destination links.',
      fields: [
        { key: 'title', label: 'Office Title', type: 'text' },
        { key: 'subtitle', label: 'Office Subtitle', type: 'text' },
        { key: 'seal_url', label: 'Seal Image URL', type: 'image' },
        { key: 'logo_url', label: 'PHO Logo URL', type: 'image' },
        { key: 'home_label', label: 'Home Label', type: 'text' },
        { key: 'home_href', label: 'Home Link', type: 'url' },
        { key: 'about_label', label: 'About Label', type: 'text' },
        { key: 'about_href', label: 'About Link', type: 'url' },
        { key: 'services_label', label: 'Services Label', type: 'text' },
        { key: 'services_href', label: 'Services Link', type: 'url' },
        { key: 'contact_label', label: 'Contact Label', type: 'text' },
        { key: 'contact_href', label: 'Contact Link', type: 'url' }
      ]
    },
    'shared/footer': {
      kind: 'section',
      pageName: 'shared',
      sectionKey: 'footer',
      title: 'Footer',
      description: 'Manage shared footer branding, links, and contact details.',
      prepare(data) {
        return {
          ...data,
          emails: normalizeStringListForEditor(data.emails, 'value')
        };
      },
      normalize(data) {
        return {
          ...data,
          emails: normalizeObjectListToStrings(data.emails, 'value')
        };
      },
      fields: [
        { key: 'title', label: 'Footer Title', type: 'text' },
        { key: 'subtitle', label: 'Footer Subtitle', type: 'text' },
        { key: 'description', label: 'Brand Description', type: 'textarea' },
        { key: 'logo_url', label: 'Footer Logo URL', type: 'image' },
        { key: 'phone', label: 'Primary Phone', type: 'phone' },
        {
          key: 'emails',
          label: 'Footer Emails',
          type: 'repeater',
          addLabel: 'Add Email',
          itemLabel: 'Email',
          itemFields: [{ key: 'value', label: 'Email Address', type: 'text' }]
        },
        {
          key: 'quick_links',
          label: 'Quick Links',
          type: 'repeater',
          addLabel: 'Add Quick Link',
          itemLabel: 'Quick Link',
          itemFields: [
            { key: 'label', label: 'Label', type: 'text' },
            { key: 'url', label: 'URL', type: 'url' }
          ]
        },
        {
          key: 'government_links',
          label: 'Government Links',
          type: 'repeater',
          addLabel: 'Add Government Link',
          itemLabel: 'Government Link',
          itemFields: [
            { key: 'label', label: 'Label', type: 'text' },
            { key: 'url', label: 'URL', type: 'url' }
          ]
        },
        { key: 'facebook_label', label: 'Facebook Label', type: 'text' },
        { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
        { key: 'copyright', label: 'Copyright Line', type: 'text' }
      ]
    },
    'home/hero': {
      kind: 'section',
      pageName: 'home',
      sectionKey: 'hero',
      title: 'Home Hero',
      description: 'Main hero messaging and carousel slides for the landing page.',
      fields: [
        { key: 'welcome', label: 'Eyebrow Text', type: 'text' },
        { key: 'heading_html', label: 'Hero Heading HTML', type: 'richtext' },
        { key: 'tagline', label: 'Tagline', type: 'text' },
        {
          key: 'slides',
          label: 'Hero Slides',
          type: 'repeater',
          addLabel: 'Add Slide',
          itemLabel: 'Slide',
          itemFields: [
            { key: 'image_url', label: 'Image URL', type: 'image' },
            { key: 'alt', label: 'Alt Text', type: 'text' }
          ]
        }
      ]
    },
    'home/services': {
      kind: 'section',
      pageName: 'home',
      sectionKey: 'services',
      title: 'Home Services',
      description: 'Flip-card content for the three home service pillars.',
      fields: [
        {
          key: 'cards',
          label: 'Service Cards',
          type: 'repeater',
          addLabel: 'Add Service Card',
          itemLabel: 'Service Card',
          itemFields: [
            { key: 'theme', label: 'Theme Class (lab, promo, hosp, or hospital)', type: 'text', placeholder: 'lab, promo, or hosp' },
            { key: 'image_url', label: 'Icon Image', type: 'image' },
            { key: 'url', label: 'Destination URL', type: 'url', placeholder: '/laboratory' },
            { key: 'front_title_html', label: 'Front Title (HTML allowed e.g. Title<br>Subtitle)', type: 'richtext' },
            { key: 'back_title', label: 'Back Title', type: 'text' },
            { key: 'back_description', label: 'Back Description', type: 'textarea' },
            { key: 'button_label', label: 'Button Label', type: 'text', placeholder: 'VIEW DETAILS ->' }
          ]
        }
      ]
    },
    'home/about': {
      kind: 'section',
      pageName: 'home',
      sectionKey: 'about',
      title: 'Home About Block',
      description: 'Short about copy and CTA on the home page.',
      fields: [
        { key: 'heading', label: 'Heading', type: 'text' },
        { key: 'body', label: 'Body Text', type: 'textarea' },
        { key: 'button_label', label: 'Button Label', type: 'text' },
        { key: 'button_url', label: 'Button URL', type: 'url' }
      ]
    },
    'home/vmg': {
      kind: 'section',
      pageName: 'home',
      sectionKey: 'vmg',
      title: 'Vision, Mission, Goals',
      description: 'Accordion items for the home page VMG content.',
      fields: [
        {
          key: 'items',
          label: 'Accordion Items',
          type: 'repeater',
          addLabel: 'Add Accordion Item',
          itemLabel: 'Accordion Item',
          itemFields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'body_html', label: 'Body HTML', type: 'richtext' }
          ]
        }
      ]
    },
    'about/hero': {
      kind: 'section',
      pageName: 'about',
      sectionKey: 'hero',
      title: 'About Hero',
      description: 'Hero copy and image for the About Us page.',
      fields: [
        { key: 'title', label: 'Hero Title', type: 'text' },
        { key: 'subtitle', label: 'Hero Subtitle', type: 'textarea' },
        { key: 'background_image_url', label: 'Background Image URL', type: 'image' }
      ]
    },
    'about/history': {
      kind: 'section',
      pageName: 'about',
      sectionKey: 'history',
      title: 'About History',
      description: 'History section paragraphs.',
      prepare(data) {
        return {
          ...data,
          paragraphs: normalizeStringListForEditor(data.paragraphs, 'text')
        };
      },
      normalize(data) {
        return {
          ...data,
          paragraphs: normalizeObjectListToStrings(data.paragraphs, 'text')
        };
      },
      fields: [
        {
          key: 'paragraphs',
          label: 'History Paragraphs',
          type: 'repeater',
          addLabel: 'Add Paragraph',
          itemLabel: 'Paragraph',
          itemFields: [{ key: 'text', label: 'Paragraph', type: 'textarea' }]
        }
      ]
    },
    'about/strategies': {
      kind: 'section',
      pageName: 'about',
      sectionKey: 'strategies',
      title: 'About Strategies',
      description: 'Carousel slides for How We Achieve Our Goals.',
      fields: [
        {
          key: 'slides',
          label: 'Strategy Slides',
          type: 'repeater',
          addLabel: 'Add Strategy Slide',
          itemLabel: 'Strategy Slide',
          itemFields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'image_url', label: 'Image URL', type: 'image' }
          ]
        }
      ]
    },
    'about/units': {
      kind: 'section',
      pageName: 'about',
      sectionKey: 'units',
      title: 'About Sections & Units',
      description: 'Flip cards for the PHO departments section.',
      fields: [
        {
          key: 'cards',
          label: 'Unit Cards',
          type: 'repeater',
          addLabel: 'Add Unit Card',
          itemLabel: 'Unit Card',
          itemFields: [
            { key: 'title', label: 'Front Title', type: 'text' },
            { key: 'back_title', label: 'Back Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'image_url', label: 'Image URL', type: 'image' }
          ]
        }
      ]
    },
    'about/org_structure': {
      kind: 'section',
      pageName: 'about',
      sectionKey: 'org_structure',
      title: 'Organizational Structure',
      description: 'Scrollable image gallery for the organizational structure pages.',
      fields: [
        {
          key: 'images',
          label: 'Structure Images',
          type: 'repeater',
          addLabel: 'Add Image',
          itemLabel: 'Structure Image',
          itemFields: [
            { key: 'image_url', label: 'Image URL', type: 'image' },
            { key: 'alt', label: 'Alt Text', type: 'text' },
            { key: 'caption', label: 'Caption', type: 'text' }
          ]
        }
      ]
    },
    'laboratory/hero': {
      kind: 'section',
      pageName: 'laboratory',
      sectionKey: 'hero',
      title: 'Laboratory Hero',
      description: 'Hero content for the laboratory page.',
      fields: [
        { key: 'title', label: 'Hero Title', type: 'text' },
        { key: 'subtitle', label: 'Hero Subtitle', type: 'textarea' },
        { key: 'background_image_url', label: 'Background Image URL', type: 'image' }
      ]
    },
    'promotive/hero': {
      kind: 'section',
      pageName: 'promotive',
      sectionKey: 'hero',
      title: 'Promotive Hero',
      description: 'Hero content for the promotive and preventive page.',
      fields: [
        { key: 'title', label: 'Hero Title', type: 'text' },
        { key: 'subtitle', label: 'Hero Subtitle', type: 'textarea' },
        { key: 'background_image_url', label: 'Background Image URL', type: 'image' }
      ]
    },
    'hospitals/hero': {
      kind: 'section',
      pageName: 'hospitals',
      sectionKey: 'hero',
      title: 'Hospitals Hero',
      description: 'Hero content for the hospitals landing page.',
      fields: [
        { key: 'title', label: 'Hero Title', type: 'text' },
        { key: 'subtitle', label: 'Hero Subtitle', type: 'textarea' },
        { key: 'background_image_url', label: 'Background Image URL', type: 'image' }
      ]
    },
    'contact/hero': {
      kind: 'section',
      pageName: 'contact',
      sectionKey: 'hero',
      title: 'Contact Hero',
      description: 'Hero image and copy for the contact page.',
      fields: [
        { key: 'title', label: 'Hero Title', type: 'text' },
        { key: 'subtitle', label: 'Hero Subtitle', type: 'textarea' },
        { key: 'background_image_url', label: 'Background Image URL', type: 'image' }
      ]
    },
    'contact/info': {
      kind: 'section',
      pageName: 'contact',
      sectionKey: 'info',
      title: 'Contact Info & Form',
      description: 'Get in touch card, office hours, and form headings.',
      prepare(data) {
        return {
          ...data,
          emails: normalizeStringListForEditor(data.emails, 'value')
        };
      },
      normalize(data) {
        return {
          ...data,
          emails: normalizeObjectListToStrings(data.emails, 'value')
        };
      },
      fields: [
        { key: 'location_heading', label: 'Location Heading', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'phone_heading', label: 'Phone Heading', type: 'text' },
        { key: 'phone_html', label: 'Phone HTML', type: 'richtext' },
        { key: 'email_heading', label: 'Email Heading', type: 'text' },
        {
          key: 'emails',
          label: 'Email Addresses',
          type: 'repeater',
          addLabel: 'Add Email',
          itemLabel: 'Email',
          itemFields: [{ key: 'value', label: 'Email', type: 'text' }]
        },
        { key: 'hours_heading', label: 'Office Hours Heading', type: 'text' },
        { key: 'office_hours_html', label: 'Office Hours HTML', type: 'richtext' },
        { key: 'form_title', label: 'Form Title', type: 'text' },
        { key: 'form_subtitle', label: 'Form Subtitle', type: 'textarea' }
      ]
    }
  };

  const tableSchemas = {
    lab_cards: {
      kind: 'table',
      table: 'lab_cards',
      title: 'Laboratory Cards',
      description: 'Add, edit, delete, and reorder cards for the Laboratory page.',
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'url', label: 'URL', type: 'url' },
        { key: 'image_url', label: 'Icon Image', type: 'image' }
      ]
    },
    promotive_cards: {
      kind: 'table',
      table: 'promotive_cards',
      title: 'Promotive Cards',
      description: 'Manage repeating cards for the Promotive & Preventive page.',
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'url', label: 'URL', type: 'url' },
        { key: 'image_url', label: 'Icon Image', type: 'image' }
      ]
    },
    hospital_cards: {
      kind: 'table',
      table: 'hospital_cards',
      title: 'Hospital Cards',
      description: 'Manage grouped hospital cards for the hospitals landing page.',
      fields: [
        { key: 'hospital_slug', label: 'Hospital Slug', type: 'text' },
        { key: 'title', label: 'Card Title', type: 'text' },
        { key: 'description', label: 'Card Description', type: 'textarea' },
        { key: 'url', label: 'Destination URL', type: 'url' },
        { key: 'image_url', label: 'Icon Image', type: 'image' },
        { key: 'license_group', label: 'Group Label', type: 'select', options: ['Level I', 'Level II', 'Infirmaries'] }
      ]
    },
    contact_directory: {
      kind: 'table',
      table: 'contact_directory',
      title: 'Contact Directory',
      description: 'Repeating health directory entries shown on the contact page.',
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'phone', label: 'Phone (one per line)', type: 'textarea' },
        { key: 'email', label: 'Email (one per line)', type: 'textarea' },
        { key: 'extra', label: 'Extra Details', type: 'textarea' }
      ]
    },
    emailjs_config: {
      kind: 'single-table',
      table: 'emailjs_config',
      title: 'EmailJS Configuration',
      description: 'Single-row EmailJS credentials used by the public contact form.',
      fields: [
        { key: 'service_id', label: 'Service ID', type: 'text' },
        { key: 'template_id', label: 'Template ID', type: 'text' },
        { key: 'public_key', label: 'Public Key', type: 'text' }
      ]
    }
  };

  const hospitalFieldSchema = {
    title: 'Hospital Details',
    description: 'Core hospital fields, services, programs, and map details.',
    fields: [
      { key: 'name', label: 'Hospital Name', type: 'text' },
      { key: 'short_name', label: 'Short Name', type: 'text' },
      { key: 'license_group', label: 'Group Label', type: 'text' },
      { key: 'page_path', label: 'Page Path', type: 'text' },
      { key: 'hero_title', label: 'Hero Title', type: 'text' },
      { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
      { key: 'hero_image_url', label: 'Hero Image URL', type: 'image' },
      { key: 'overview_title', label: 'Overview Title', type: 'text' },
      { key: 'overview_body', label: 'Overview Body', type: 'textarea' },
      { key: 'quote', label: 'Quote', type: 'text' },
      { key: 'offer_heading', label: 'Offer Heading', type: 'text' },
      { key: 'offer_title', label: 'Offer Title', type: 'text' },
      { key: 'offer_body', label: 'Offer Description', type: 'textarea' },
      { key: 'card_description', label: 'Landing Card Description', type: 'textarea' },
      { key: 'phone', label: 'Phone', type: 'phone' },
      { key: 'email_primary', label: 'Primary Email', type: 'text' },
      { key: 'email_secondary', label: 'Secondary Email', type: 'text' },
      { key: 'location_text', label: 'Location Text', type: 'text' },
      { key: 'facebook_label', label: 'Facebook Label', type: 'text' },
      { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
      { key: 'map_embed_url', label: 'Map Embed URL', type: 'url' },
      { key: 'map_link_url', label: 'Map Link URL', type: 'url' }
    ],
    serviceFields: [
      { key: 'title', label: 'Service Group Title', type: 'text' },
      { key: 'intro', label: 'Short Intro', type: 'textarea' },
      {
        key: 'items',
        label: 'Service Rows',
        type: 'repeater',
        addLabel: 'Add Service Row',
        itemLabel: 'Service Row',
        itemFields: [
          { key: 'title', label: 'Sublist Title', type: 'text' },
          { key: 'items_text', label: 'Items (one per line)', type: 'textarea' },
          { key: 'single_text', label: 'Single Bullet (optional)', type: 'text' }
        ]
      }
    ],
    programFields: [
      { key: 'title', label: 'Program Title', type: 'text' },
      { key: 'body', label: 'Program Body', type: 'textarea' },
      { key: 'badge', label: 'Badge / Year', type: 'text' },
      { key: 'is_covid', label: 'Covid Highlight', type: 'checkbox' }
    ]
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeStringListForEditor(value, key) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((item) => (typeof item === 'string' ? { [key]: item } : item || {}));
  }

  function normalizeObjectListToStrings(value, key) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value
      .map((item) => (item?.[key] || '').trim())
      .filter(Boolean);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value ?? {}));
  }

  function pathParts(path) {
    return String(path || '')
      .split('.')
      .filter(Boolean)
      .map((part) => (/^\d+$/.test(part) ? Number(part) : part));
  }

  function getByPath(source, path) {
    return pathParts(path).reduce((acc, part) => (acc == null ? undefined : acc[part]), source);
  }

  function setByPath(source, path, value) {
    const parts = pathParts(path);
    if (!parts.length) {
      return;
    }

    let current = source;
    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const nextPart = parts[index + 1];

      if (isLast) {
        current[part] = value;
        return;
      }

      if (current[part] == null) {
        current[part] = typeof nextPart === 'number' ? [] : {};
      }
      current = current[part];
    });
  }

  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function createBlankItem(fields) {
    const item = { id: generateUUID() };
    (fields || []).forEach((field) => {
      if (field.type === 'repeater') {
        item[field.key] = [];
      } else if (field.type === 'checkbox') {
        item[field.key] = false;
      } else {
        item[field.key] = '';
      }
    });
    return item;
  }

  function showStatus(message, type) {
    const status = document.getElementById('cms-status');
    if (!status) {
      return;
    }
    status.textContent = message || '';
    status.className = `cms-status${type ? ` ${type}` : ''}`;

    if (state.statusTimer) {
      window.clearTimeout(state.statusTimer);
    }

    if (message) {
      status.classList.add('active');
      state.statusTimer = window.setTimeout(() => {
        status.classList.remove('active');
        window.setTimeout(() => {
          status.textContent = '';
          status.className = 'cms-status';
        }, 300);
      }, type === 'error' ? 9000 : 6000);
    }
  }

  function showConfirmModal({ title, message, confirmText, confirmClass, cancelText }) {
    return new Promise((resolve) => {
      let modal = document.getElementById('cms-confirm-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cms-confirm-modal';
        modal.className = 'cms-modal-overlay';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="cms-modal-card">
          <div class="cms-modal-header">
            <h3>${escapeHtml(title || 'Confirmation')}</h3>
          </div>
          <div class="cms-modal-body">
            <p>${escapeHtml(message || 'Are you sure?')}</p>
          </div>
          <div class="cms-modal-actions">
            <button type="button" class="cms-secondary-button" data-modal-btn="cancel">${escapeHtml(cancelText || 'Cancel')}</button>
            <button type="button" class="${confirmClass || 'cms-button'}" data-modal-btn="confirm">${escapeHtml(confirmText || 'Confirm')}</button>
          </div>
        </div>
      `;

      modal.classList.add('active');

      const cleanup = (result) => {
        modal.classList.remove('active');
        modal.removeEventListener('click', onClick);
        resolve(result);
      };

      const onClick = (event) => {
        const btn = event.target.closest('[data-modal-btn]');
        if (btn) {
          cleanup(btn.dataset.modalBtn === 'confirm');
        } else if (event.target === modal) {
          cleanup(false);
        }
      };

      modal.addEventListener('click', onClick);
    });
  }

  function setDirty(isDirty) {
    state.isDirty = Boolean(isDirty);
    updateDirtyState();
  }

  function updateDirtyState() {
    const saveBtns = document.querySelectorAll('[data-save-view]');
    const cancelBtns = document.querySelectorAll('[data-cancel-view]');
    const noticeEls = document.querySelectorAll('.cms-dirty-notice');

    saveBtns.forEach((btn) => {
      btn.disabled = !state.isDirty;
    });

    cancelBtns.forEach((btn) => {
      btn.disabled = !state.isDirty;
    });

    noticeEls.forEach((el) => {
      el.style.display = state.isDirty ? 'inline-flex' : 'none';
    });
  }

  function setLoading(active, message) {
    const loader = document.getElementById('cms-loader');
    const loaderMessage = document.getElementById('cms-loader-message');
    if (!loader) {
      return;
    }
    loader.classList.toggle('active', active);
    if (loaderMessage && message) {
      loaderMessage.textContent = message;
    }
  }

  function renderField(field, value, path) {
    if (field.type === 'repeater') {
      const items = Array.isArray(value) ? value : [];
      const listMarkup = items.length
        ? items.map((item, index) => `
            <div class="cms-repeater-item">
              <div class="cms-repeater-toolbar">
                <strong>${escapeHtml(field.itemLabel || `Item ${index + 1}`)} ${index + 1}</strong>
                <div class="cms-repeater-actions">
                  <button type="button" class="cms-secondary-button" data-repeater-move="up" data-field-path="${escapeHtml(path)}" data-index="${index}">Up</button>
                  <button type="button" class="cms-secondary-button" data-repeater-move="down" data-field-path="${escapeHtml(path)}" data-index="${index}">Down</button>
                  <button type="button" class="cms-danger-button" data-repeater-delete="true" data-field-path="${escapeHtml(path)}" data-index="${index}">Delete</button>
                </div>
              </div>
              <div class="cms-form-grid">
                ${(field.itemFields || []).map((childField) => renderField(childField, item?.[childField.key], `${path}.${index}.${childField.key}`)).join('')}
              </div>
            </div>
          `).join('')
        : '<div class="cms-empty-state">No entries yet.</div>';

      return `
        <div class="cms-field full">
          <div class="cms-fieldset-title">${escapeHtml(field.label)}</div>
          <div class="cms-repeater">
            <div class="cms-repeater-list">${listMarkup}</div>
            <div class="cms-actions-row" style="justify-content:flex-start;">
              <button type="button" class="cms-secondary-button" data-repeater-add="true" data-field-path="${escapeHtml(path)}">${escapeHtml(field.addLabel || 'Add Item')}</button>
            </div>
          </div>
        </div>
      `;
    }

    if (field.type === 'checkbox') {
      return `
        <div class="cms-field">
          <label>
            <input type="checkbox" data-field-path="${escapeHtml(path)}" ${value ? 'checked' : ''} />
            ${escapeHtml(field.label)}
          </label>
        </div>
      `;
    }

    const isTextArea = field.type === 'textarea' || field.type === 'richtext';
    const inputClass = isTextArea ? 'cms-textarea' : 'cms-input';
    const inputValue = escapeHtml(value || '');

    if (field.type === 'image') {
      return `
        <div class="cms-field full">
          <label>${escapeHtml(field.label)}</label>
          <div class="cms-inline-input">
            <input class="${inputClass}" type="text" data-field-path="${escapeHtml(path)}" value="${inputValue}" placeholder="https://..." />
            <input class="cms-input" type="file" accept="image/*" data-upload-path="${escapeHtml(path)}" />
          </div>
        </div>
      `;
    }

    if (isTextArea) {
      return `
        <div class="cms-field full">
          <label>${escapeHtml(field.label)}</label>
          <textarea class="${inputClass}" data-field-path="${escapeHtml(path)}" placeholder="${escapeHtml(field.placeholder || '')}">${inputValue}</textarea>
        </div>
      `;
    }

    if (field.type === 'select') {
      const options = field.options || [];
      let selectedLabel = 'Select Option'; // Placeholder
      const optionsMarkup = options.map(opt => {
        const optValue = typeof opt === 'object' ? opt.value : opt;
        const optLabel = typeof opt === 'object' ? opt.label : opt;
        const isSelected = String(value) === String(optValue);
        if (isSelected) selectedLabel = optLabel;
        return `<div class="cms-dropdown-option ${isSelected ? 'selected' : ''}" data-field-option-value="${escapeHtml(optValue)}">${escapeHtml(optLabel)}</div>`;
      }).join('');
      
      return `
        <div class="cms-field">
          <label>${escapeHtml(field.label)}</label>
          <div class="cms-custom-dropdown" data-custom-dropdown="true" style="margin-top:0.35rem;">
            <div class="cms-dropdown-trigger" data-dropdown-trigger="true" style="padding: 0.85rem 0.95rem; border: 1px solid rgba(27,94,32,0.18); border-radius: 14px; justify-content: space-between; background: #fff;">
              <span class="cms-dropdown-label">${escapeHtml(selectedLabel)}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div class="cms-dropdown-menu" style="top: calc(100% + 5px);">
              ${optionsMarkup}
            </div>
          </div>
          <input type="hidden" class="cms-input" data-field-path="${escapeHtml(path)}" value="${escapeHtml(value || '')}">
        </div>
      `;
    }

    const type = field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : 'text';
    return `
      <div class="cms-field">
        <label>${escapeHtml(field.label)}</label>
        <input class="${inputClass}" type="${type}" data-field-path="${escapeHtml(path)}" value="${inputValue}" placeholder="${escapeHtml(field.placeholder || '')}" />
      </div>
    `;
  }

  function renderSectionView(schema, data) {
    return `
      <div class="cms-panel">
        <div class="cms-panel-header">
          <div>
            <h2>${escapeHtml(schema.title)}</h2>
            <p>${escapeHtml(schema.description)}</p>
          </div>
        </div>
        <div class="cms-form-grid">
          ${schema.fields.map((field) => renderField(field, data?.[field.key], field.key)).join('')}
        </div>
      </div>
    `;
  }

  function renderTableView(schema, data) {
    return `
      <div class="cms-panel">
        <div class="cms-panel-header">
          <div>
            <h2>${escapeHtml(schema.title)}</h2>
            <p>${escapeHtml(schema.description)}</p>
          </div>
        </div>
        <div class="cms-form-grid">
          ${renderField(
            {
              key: 'records',
              label: schema.title,
              type: 'repeater',
              addLabel: `Add ${schema.title.replace(/s$/, '')}`,
              itemLabel: schema.title.replace(/s$/, ''),
              itemFields: schema.fields
            },
            data.records,
            'records'
          )}
        </div>
      </div>
    `;
  }

  function renderSingleTableView(schema, data) {
    return `
      <div class="cms-panel">
        <div class="cms-panel-header">
          <div>
            <h2>${escapeHtml(schema.title)}</h2>
            <p>${escapeHtml(schema.description)}</p>
          </div>
        </div>
        <div class="cms-form-grid">
          ${schema.fields.map((field) => renderField(field, data?.[field.key], field.key)).join('')}
        </div>
      </div>
    `;
  }

  function renderHospitalView(record) {
    return `
      <div class="cms-panel">
        <div class="cms-panel-header">
          <div>
            <h2>${escapeHtml(record.hospital?.name || 'Hospital')}</h2>
            <p>${escapeHtml(hospitalFieldSchema.description)}</p>
          </div>
          <div class="cms-meta">Slug: ${escapeHtml(record.hospital?.slug || '')}</div>
        </div>
        <div class="cms-form-grid">
          ${hospitalFieldSchema.fields.map((field) => renderField(field, record.hospital?.[field.key], `hospital.${field.key}`)).join('')}
        </div>
      </div>
      <div class="cms-panel">
        <div class="cms-panel-header">
          <div>
            <h2>Hospital Services</h2>
            <p>Grouped services rendered on the hospital detail page.</p>
          </div>
        </div>
        ${renderField(
          {
            key: 'services',
            label: 'Service Groups',
            type: 'repeater',
            addLabel: 'Add Service Group',
            itemLabel: 'Service Group',
            itemFields: hospitalFieldSchema.serviceFields
          },
          record.services,
          'services'
        )}
      </div>
      <div class="cms-panel">
        <div class="cms-panel-header">
          <div>
            <h2>Programs & Milestones</h2>
            <p>Highlights, milestones, and optional Covid-specific entries.</p>
          </div>
        </div>
        ${renderField(
          {
            key: 'programs',
            label: 'Programs',
            type: 'repeater',
            addLabel: 'Add Program',
            itemLabel: 'Program',
            itemFields: hospitalFieldSchema.programFields
          },
          record.programs,
          'programs'
        )}
      </div>
    `;
  }

  function renderCurrentView() {
    const view = document.getElementById('cms-view');
    const title = document.getElementById('cms-view-title');
    const subtitle = document.getElementById('cms-view-subtitle');
    if (!view || !state.currentSchema) {
      return;
    }

    title.textContent = state.currentSchema.title || 'CMS Editor';
    subtitle.textContent = state.currentSchema.description || '';

    if (state.currentMode === 'section') {
      view.innerHTML = renderSectionView(state.currentSchema, state.currentData);
    } else if (state.currentMode === 'table') {
      view.innerHTML = renderTableView(state.currentSchema, state.currentData);
    } else if (state.currentMode === 'single-table') {
      view.innerHTML = renderSingleTableView(state.currentSchema, state.currentData);
    } else if (state.currentMode === 'hospital') {
      view.innerHTML = renderHospitalView(state.currentData);
    }

    document.querySelectorAll('.cms-tab-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.viewId === state.currentViewId);
    });

    updateDirtyState();
  }

  async function loadSectionView(viewId) {
    const schema = sectionSchemas[viewId];
    const client = cms.getClient?.();
    const result = await client
      .from('page_sections')
      .select('*')
      .eq('page_name', schema.pageName)
      .eq('section_key', schema.sectionKey)
      .maybeSingle();

    const rawContent = result?.data?.content || {};
    state.currentSchema = schema;
    state.currentMode = 'section';
    state.currentViewId = viewId;
    state.currentData = schema.prepare ? schema.prepare(clone(rawContent)) : clone(rawContent);
    renderCurrentView();
  }

  async function loadTableView(viewId) {
    const schema = tableSchemas[viewId];
    const client = cms.getClient?.();
    const result = await client.from(schema.table).select('*').order('sort_order', { ascending: true });
    state.currentSchema = schema;
    state.currentMode = schema.kind;
    state.currentViewId = viewId;
    state.currentData = schema.kind === 'single-table'
      ? clone(result?.data?.[0] || { id: 1 })
      : { records: clone(result?.data || []) };
    renderCurrentView();
  }

  function formatHospitalServicesForEditor(rows) {
    return (rows || []).map((row) => ({
      ...row,
      items: Array.isArray(row.items)
        ? row.items.map((item) => {
            if (typeof item === 'string') {
              return { title: '', items_text: '', single_text: item };
            }
            return {
              title: item?.title || '',
              items_text: Array.isArray(item?.items) ? item.items.join('\n') : '',
              single_text: ''
            };
          })
        : []
    }));
  }

  function formatHospitalServicesForSave(rows) {
    return (rows || []).map((row, index) => ({
      ...row,
      sort_order: index + 1,
      items: (row.items || [])
        .map((item) => {
          const singleText = (item.single_text || '').trim();
          const subItems = String(item.items_text || '')
            .split(/\r?\n/)
            .map((entry) => entry.trim())
            .filter(Boolean);

          if (singleText) {
            return singleText;
          }

          return {
            title: item.title || '',
            items: subItems
          };
        })
        .filter((item) => (typeof item === 'string' ? item.trim() : item.title || item.items?.length))
    }));
  }

  async function loadHospitalView(slug) {
    const client = cms.getClient?.();
    const hospitalResult = await client.from('hospitals').select('*').eq('slug', slug).maybeSingle();
    const hospital = hospitalResult?.data;
    if (!hospital?.id) {
      throw new Error(`Hospital record for "${slug}" was not found.`);
    }

    const [servicesResult, programsResult] = await Promise.all([
      client.from('hospital_services').select('*').eq('hospital_id', hospital.id).order('sort_order', { ascending: true }),
      client.from('hospital_programs').select('*').eq('hospital_id', hospital.id).order('sort_order', { ascending: true })
    ]);

    state.currentSchema = {
      title: `${hospital.name} Editor`,
      description: 'Hospital-specific content and repeating service/program entries.'
    };
    state.currentMode = 'hospital';
    state.currentViewId = `hospital:${slug}`;
    state.currentData = {
      hospital: clone(hospital),
      services: formatHospitalServicesForEditor(clone(servicesResult?.data || [])),
      programs: clone(programsResult?.data || [])
    };
    renderCurrentView();
  }

  async function loadView(viewId) {
    setLoading(true, 'Loading editor...');
    try {
      showStatus('');
      if (viewId.startsWith('hospital:')) {
        await loadHospitalView(viewId.split(':')[1]);
      } else if (sectionSchemas[viewId]) {
        await loadSectionView(viewId);
      } else if (tableSchemas[viewId]) {
        await loadTableView(viewId);
      } else {
        throw new Error('That editor view is not available.');
      }
      setDirty(false);
    } catch (error) {
      showStatus(error.message || 'Unable to load this editor.', 'error');
    } finally {
      setLoading(false, 'Loading editor...');
    }
  }

  async function saveCurrentView() {
    const client = cms.getClient?.();
    if (!client || !state.currentSchema) {
      return;
    }

    setLoading(true, 'Saving changes...');
    try {
      if (state.currentMode === 'section') {
        const normalized = state.currentSchema.normalize
          ? state.currentSchema.normalize(clone(state.currentData))
          : clone(state.currentData);

        const payload = {
          page_name: state.currentSchema.pageName,
          section_key: state.currentSchema.sectionKey,
          title: state.currentSchema.title,
          content: normalized
        };

        const result = await client.from('page_sections').upsert(payload, {
          onConflict: 'page_name,section_key'
        });
        if (result.error) {
          throw result.error;
        }
      } else if (state.currentMode === 'table') {
        const schema = state.currentSchema;
        const existingRows = await client.from(schema.table).select('id');
        const existingIds = new Set((existingRows?.data || []).map((row) => row.id));
        const nextRecords = (state.currentData.records || []).map((record, index) => {
          const payload = { id: record.id, sort_order: index + 1 };
          schema.fields.forEach(f => {
            if (record[f.key] !== undefined) {
              payload[f.key] = record[f.key];
            }
          });
          return payload;
        });
        const keepIds = new Set(nextRecords.map((row) => row.id).filter(Boolean));
        const deleteIds = [...existingIds].filter((id) => !keepIds.has(id));

        if (deleteIds.length) {
          const deleteResult = await client.from(schema.table).delete().in('id', deleteIds);
          if (deleteResult.error) {
            throw deleteResult.error;
          }
        }

        if (nextRecords.length) {
          const upsertResult = await client.from(schema.table).upsert(nextRecords);
          if (upsertResult.error) {
            throw upsertResult.error;
          }
        }
      } else if (state.currentMode === 'single-table') {
        const result = await client.from(state.currentSchema.table).upsert({
          ...state.currentData,
          id: 1
        });
        if (result.error) {
          throw result.error;
        }
      } else if (state.currentMode === 'hospital') {
        const hospital = clone(state.currentData.hospital);
        const services = formatHospitalServicesForSave(clone(state.currentData.services || []));
        const programs = clone(state.currentData.programs || []).map((program, index) => ({
          ...program,
          is_covid: Boolean(program.is_covid),
          sort_order: index + 1
        }));

        const hospitalResult = await client.from('hospitals').upsert(hospital).select('*').single();
        if (hospitalResult.error) {
          throw hospitalResult.error;
        }

        const hospitalId = hospitalResult.data.id;
        const [existingServices, existingPrograms] = await Promise.all([
          client.from('hospital_services').select('id').eq('hospital_id', hospitalId),
          client.from('hospital_programs').select('id').eq('hospital_id', hospitalId)
        ]);

        const keepServiceIds = new Set(services.map((entry) => entry.id).filter(Boolean));
        const keepProgramIds = new Set(programs.map((entry) => entry.id).filter(Boolean));
        const deleteServiceIds = (existingServices.data || []).map((entry) => entry.id).filter((id) => !keepServiceIds.has(id));
        const deleteProgramIds = (existingPrograms.data || []).map((entry) => entry.id).filter((id) => !keepProgramIds.has(id));

        if (deleteServiceIds.length) {
          const result = await client.from('hospital_services').delete().in('id', deleteServiceIds);
          if (result.error) {
            throw result.error;
          }
        }

        if (deleteProgramIds.length) {
          const result = await client.from('hospital_programs').delete().in('id', deleteProgramIds);
          if (result.error) {
            throw result.error;
          }
        }

        if (services.length) {
          const result = await client.from('hospital_services').upsert(
            services.map((entry) => {
              const { created_at, updated_at, ...rest } = entry;
              return { ...rest, hospital_id: hospitalId };
            })
          );
          if (result.error) {
            throw result.error;
          }
        }

        if (programs.length) {
          const result = await client.from('hospital_programs').upsert(
            programs.map((entry) => {
              const { created_at, updated_at, ...rest } = entry;
              return { ...rest, hospital_id: hospitalId };
            })
          );
          if (result.error) {
            throw result.error;
          }
        }

        await loadHospitalList();
      }

      showStatus('Saved successfully.', 'success');
      setDirty(false);

      // Signal all open public-page tabs to reload their CMS content.
      try {
        localStorage.setItem('pho.cms.lastSave', String(Date.now()));
      } catch (_) {
        // localStorage may be unavailable in some private-browsing contexts.
      }
    } catch (error) {
      showStatus(error.message || 'Unable to save changes.', 'error');
    } finally {
      setLoading(false, 'Saving changes...');
    }
  }

  async function loadHospitalList() {
    const client = cms.getClient?.();
    const result = await client.from('hospitals').select('id, slug, name').order('sort_order', { ascending: true });
    state.hospitals = result?.data || [];
    renderSidebar();
  }

  function renderTabs() {
    const tabsContainer = document.getElementById('cms-tabs');
    if (!tabsContainer) return;

    const allGroups = [
      ...navigationGroups,
      {
        title: 'Hospitals',
        items: state.hospitals.map(h => `hospital:${h.slug}`)
      }
    ];

    const currentGroup = allGroups.find(g => g.title === state.currentGroup);
    if (!currentGroup || !currentGroup.items || !currentGroup.items.length) {
      if (state.currentGroup === 'Hospitals') {
        tabsContainer.innerHTML = `
          <div class="cms-empty-notice">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-3v3h-4v-3H7v-4h3V6h4v3h3v4z"/></svg>
            <span>No hospitals found in database. Please run the SQL setup script in your Supabase project first.</span>
          </div>
        `;
      } else {
        tabsContainer.innerHTML = '';
      }
      return;
    }

    if (state.currentGroup === 'Hospitals') {
      tabsContainer.classList.add('cms-tabs-dropdown-mode');
      
      const selectedViewId = state.currentViewId;
      let selectedTitle = 'Select Hospital...';

      const optionsHtml = currentGroup.items.map((viewId) => {
        const slug = viewId.split(':')[1];
        const hosp = state.hospitals.find(h => h.slug === slug);
        const title = hosp ? hosp.name : slug;
        if (selectedViewId === viewId) {
          selectedTitle = title;
        }
        return `
          <div class="cms-dropdown-option ${selectedViewId === viewId ? 'selected' : ''}" data-dropdown-value="${escapeHtml(viewId)}">
            ${escapeHtml(title)}
          </div>
        `;
      }).join('');

      tabsContainer.innerHTML = `
        <div class="cms-custom-dropdown" data-custom-dropdown="true">
          <div class="cms-dropdown-trigger" data-dropdown-trigger="true">
            <span class="cms-dropdown-label">${escapeHtml(selectedTitle)}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div class="cms-dropdown-menu">
            ${optionsHtml}
          </div>
        </div>
      `;
    } else {
      tabsContainer.classList.remove('cms-tabs-dropdown-mode');
      tabsContainer.innerHTML = currentGroup.items.map((viewId) => {
        let title = viewId;
        const schema = sectionSchemas[viewId] || tableSchemas[viewId];
        title = schema ? schema.title : viewId;
        return `
          <button type="button" class="cms-tab-button${state.currentViewId === viewId ? ' active' : ''}" data-view-id="${escapeHtml(viewId)}">
            ${escapeHtml(title)}
          </button>
        `;
      }).join('');
    }
  }

  function getGroupIcon(title) {
    switch(title) {
      case 'Shared':
        return '<svg viewBox="0 0 24 24"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>';
      case 'Home':
        return '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>';
      case 'About':
        return '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
      case 'Pages':
        return '<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>';
      case 'Repeating Lists':
        return '<svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>';
      case 'Hospitals':
        return '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-3v3h-4v-3H7v-4h3V6h4v3h3v4z"/></svg>';
      default:
        return '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
    }
  }

  function renderSidebar() {
    const sidebar = document.getElementById('cms-sidebar-nav');
    if (!sidebar) {
      return;
    }

    const allGroups = [
      ...navigationGroups,
      { title: 'Hospitals' }
    ];

    sidebar.innerHTML = `
      <div class="cms-nav-group">
        <div class="cms-nav-group-title">Workspaces</div>
        <ul class="cms-nav-list">
          ${allGroups.map((group) => `
            <li>
              <button type="button" class="cms-nav-button${state.currentGroup === group.title ? ' active' : ''}" data-group="${escapeHtml(group.title)}">
                ${getGroupIcon(group.title)}
                ${escapeHtml(group.title)}
              </button>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    renderTabs();
  }

  function attachEventHandlers() {
    document.addEventListener('click', async (event) => {
      const customDropdownTrigger = event.target.closest('[data-dropdown-trigger]');
      if (customDropdownTrigger) {
        const dropdown = customDropdownTrigger.closest('[data-custom-dropdown]');
        dropdown.classList.toggle('open');
        return;
      }
      
      const customDropdownOption = event.target.closest('[data-dropdown-value]');
      if (customDropdownOption) {
        const dropdown = customDropdownOption.closest('[data-custom-dropdown]');
        dropdown.classList.remove('open');
        
        const targetViewId = customDropdownOption.dataset.dropdownValue;
        if (targetViewId === state.currentViewId) {
          return;
        }

        if (state.isDirty) {
          const confirmed = await showConfirmModal({
            title: 'Unsaved Changes',
            message: 'You have unsaved changes on this page. Are you sure you want to switch tabs without saving?',
            confirmText: 'Discard & Switch',
            confirmClass: 'cms-danger-button',
            cancelText: 'Keep Editing'
          });
          if (!confirmed) {
            return;
          }
        }
        await loadView(targetViewId);
        return;
      }

      const fieldOption = event.target.closest('[data-field-option-value]');
      if (fieldOption) {
        const dropdown = fieldOption.closest('.cms-custom-dropdown');
        if (dropdown) dropdown.classList.remove('open');
        
        const value = fieldOption.dataset.fieldOptionValue;
        const label = fieldOption.textContent.trim();
        
        const triggerLabel = dropdown.querySelector('.cms-dropdown-label');
        if (triggerLabel) triggerLabel.textContent = label;
        
        const hiddenInput = dropdown.parentElement.querySelector('input[type="hidden"]');
        if (hiddenInput) {
           hiddenInput.value = value;
           hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        dropdown.querySelectorAll('.cms-dropdown-option').forEach(el => el.classList.remove('selected'));
        fieldOption.classList.add('selected');
        return;
      }

      const activeDropdown = document.querySelector('.cms-custom-dropdown.open');
      if (activeDropdown && !event.target.closest('[data-custom-dropdown]')) {
        activeDropdown.classList.remove('open');
      }

      const groupButton = event.target.closest('[data-group]');
      if (groupButton) {
        const targetGroup = groupButton.dataset.group;
        if (targetGroup === state.currentGroup) {
          return;
        }

        if (state.isDirty) {
          const confirmed = await showConfirmModal({
            title: 'Unsaved Changes',
            message: 'You have unsaved changes on this page. Are you sure you want to switch workspaces without saving?',
            confirmText: 'Discard & Switch',
            confirmClass: 'cms-danger-button',
            cancelText: 'Keep Editing'
          });
          if (!confirmed) {
            return;
          }
        }
        
        state.currentGroup = targetGroup;
        
        if (targetGroup === 'Hospitals') {
          renderSidebar();
          setLoading(true, 'Loading hospitals...');
          try {
            await loadHospitalList();
          } finally {
            setLoading(false, 'Loading hospitals...');
          }
          const firstHospital = state.hospitals[0];
          if (firstHospital) {
            await loadView(`hospital:${firstHospital.slug}`);
          }
          return;
        }

        const allGroups = [
          ...navigationGroups,
          { title: 'Hospitals', items: state.hospitals.map(h => `hospital:${h.slug}`) }
        ];
        const group = allGroups.find(g => g.title === targetGroup);
        if (group && group.items && group.items.length) {
           renderSidebar();
           await loadView(group.items[0]);
        }
        return;
      }

      const viewButton = event.target.closest('[data-view-id]');
      if (viewButton) {
        const targetViewId = viewButton.dataset.viewId;
        if (targetViewId === state.currentViewId) {
          return;
        }

        if (state.isDirty) {
          const confirmed = await showConfirmModal({
            title: 'Unsaved Changes',
            message: 'You have unsaved changes on this page. Are you sure you want to switch tabs without saving?',
            confirmText: 'Discard & Switch',
            confirmClass: 'cms-danger-button',
            cancelText: 'Keep Editing'
          });
          if (!confirmed) {
            return;
          }
        }
        await loadView(targetViewId);
        return;
      }

      const addButton = event.target.closest('[data-repeater-add]');
      if (addButton) {
        const path = addButton.dataset.fieldPath;
        const field = findFieldByPath(path);
        const list = getByPath(state.currentData, path) || [];
        list.push(createBlankItem(field.itemFields));
        setByPath(state.currentData, path, list);
        renderCurrentView();
        setDirty(true);
        return;
      }

      const deleteButton = event.target.closest('[data-repeater-delete]');
      if (deleteButton) {
        const path = deleteButton.dataset.fieldPath;
        const index = Number(deleteButton.dataset.index);
        const list = [...(getByPath(state.currentData, path) || [])];
        list.splice(index, 1);
        setByPath(state.currentData, path, list);
        renderCurrentView();
        setDirty(true);
        return;
      }

      const moveButton = event.target.closest('[data-repeater-move]');
      if (moveButton) {
        const path = moveButton.dataset.fieldPath;
        const direction = moveButton.dataset.repeaterMove;
        const index = Number(moveButton.dataset.index);
        const list = [...(getByPath(state.currentData, path) || [])];
        const nextIndex = direction === 'up' ? index - 1 : index + 1;
        if (nextIndex < 0 || nextIndex >= list.length) {
          return;
        }
        [list[index], list[nextIndex]] = [list[nextIndex], list[index]];
        setByPath(state.currentData, path, list);
        renderCurrentView();
        setDirty(true);
        return;
      }

      const saveButton = event.target.closest('[data-save-view]');
      if (saveButton) {
        if (!state.isDirty) {
          return;
        }
        const confirmed = await showConfirmModal({
          title: 'Save Changes',
          message: 'Are you sure you want to save these changes to the website?',
          confirmText: 'Yes, Save Changes',
          confirmClass: 'cms-button',
          cancelText: 'Keep Editing'
        });
        if (confirmed) {
          await saveCurrentView();
        }
        return;
      }

      const cancelButton = event.target.closest('[data-cancel-view]');
      if (cancelButton) {
        if (!state.isDirty) {
          return;
        }
        const confirmed = await showConfirmModal({
          title: 'Cancel Changes',
          message: 'Are you sure you want to cancel your changes? All unsaved modifications will be reset.',
          confirmText: 'Yes, Discard Changes',
          confirmClass: 'cms-danger-button',
          cancelText: 'Keep Editing'
        });
        if (confirmed && state.currentViewId) {
          await loadView(state.currentViewId);
          showStatus('Changes cancelled and reset.', 'success');
        }
        return;
      }

      const logoutButton = event.target.closest('[data-cms-logout]');
      if (logoutButton) {
        setLoading(true, 'Signing out...');
        await cms.logout?.();
        window.location.href = window.PHO_CMS_CONFIG?.loginRoute || '/phoadmincmslogin';
      }
    });

    document.addEventListener('input', (event) => {
      const field = event.target.closest('[data-field-path]');
      if (!field) {
        return;
      }

      const path = field.dataset.fieldPath;
      const value = field.type === 'checkbox' ? field.checked : field.value;
      setByPath(state.currentData, path, value);
      setDirty(true);
    });

    document.addEventListener('change', async (event) => {
      const uploadInput = event.target.closest('[data-upload-path]');
      if (!uploadInput?.files?.[0]) {
        return;
      }

      try {
        setLoading(true, 'Uploading image...');
        const upload = await cms.uploadAsset?.(uploadInput.files[0], 'cms');
        setByPath(state.currentData, uploadInput.dataset.uploadPath, upload.publicUrl);
        renderCurrentView();
        setDirty(true);
        showStatus('Image uploaded.', 'success');
      } catch (error) {
        showStatus(error.message || 'Image upload failed.', 'error');
      } finally {
        setLoading(false, 'Uploading image...');
      }
    });
  }

  function findFieldByPath(path) {
    let rootFields = [];
    if (state.currentMode === 'section' || state.currentMode === 'single-table') {
      rootFields = state.currentSchema.fields;
    } else if (state.currentMode === 'table') {
      rootFields = [
        { key: 'records', type: 'repeater', itemFields: state.currentSchema.fields }
      ];
    } else if (state.currentMode === 'hospital') {
      rootFields = [
        ...hospitalFieldSchema.fields,
        { key: 'services', type: 'repeater', itemFields: hospitalFieldSchema.serviceFields },
        { key: 'programs', type: 'repeater', itemFields: hospitalFieldSchema.programFields }
      ];
    }

    const schemaKeys = String(path).split('.').filter(p => isNaN(Number(p)));
    let currentFields = rootFields;
    let matchedField = null;

    for (const key of schemaKeys) {
      matchedField = currentFields?.find(f => f.key === key);
      if (!matchedField) return null;
      if (matchedField.type === 'repeater') {
        currentFields = matchedField.itemFields;
      } else {
        currentFields = [];
      }
    }

    return matchedField;
  }

  async function guardDashboard() {
    if (!cms.isConfigured?.()) {
      throw new Error('Supabase is not configured yet. Check cms-config.js or env.js for the project URL and anon key.');
    }

    const auth = await cms.requireAdmin?.();
    if (!auth?.isAdmin) {
      window.location.href = window.PHO_CMS_CONFIG?.loginRoute || '/phoadmincmslogin';
      return false;
    }

    state.auth = auth;
    return true;
  }

  async function bootstrap() {
    try {
      setLoading(true, 'Checking admin session...');
      const ok = await guardDashboard();
      if (!ok) {
        return;
      }

      document.getElementById('cms-user-email').textContent = state.auth?.profile?.email || state.auth?.session?.user?.email || 'Admin';
      attachEventHandlers();
      await loadHospitalList();
      await loadView('shared/navbar');
    } catch (error) {
      showStatus(error.message || 'Unable to open the dashboard.', 'error');
    } finally {
      setLoading(false, 'Checking admin session...');
    }
  }

  if (document.body?.dataset?.cmsDashboard === 'true') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
      bootstrap();
    }
  }
})();

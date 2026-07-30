(function initPhoContentLoader() {
  const cms = window.PHO_CMS || {};
  const config = window.PHO_CMS_CONFIG || {};
  const escapeHtml = cms.escapeHtml || ((value) => String(value ?? ''));

  const DEFAULT_ICON = {
    lab: '<svg viewBox="0 0 40 40" fill="none" stroke="#2e7d32" stroke-width="2"><path d="M14 5h12v12l7 14a3 3 0 0 1-2.68 4.33H9.68A3 3 0 0 1 7 31l7-14z"></path><path d="M14 24h12" stroke-dasharray="2 3"></path></svg>',
    promo: '<svg viewBox="0 0 40 40" fill="none" stroke="#b71c1c" stroke-width="2"><path d="M20 35s-12-7.2-12-16a6.8 6.8 0 0 1 12-4.26A6.8 6.8 0 0 1 32 19c0 8.8-12 16-12 16z"></path><path d="M16 19h8M20 15v8"></path></svg>',
    hospital: '<svg viewBox="0 0 40 40" fill="none" stroke="#1565c0" stroke-width="2"><rect x="6" y="10" width="28" height="24" rx="3"></rect><rect x="14" y="4" width="12" height="8" rx="2"></rect><path d="M18 22h4M20 20v4" stroke-linecap="round"></path><line x1="6" y1="16" x2="34" y2="16"></line></svg>',
    contact: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.68 2 2 0 0 1 3.59 1.5h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.33a2 2 0 0 1-.45 2.11L7.91 9.06a16 16 0 0 0 6.07 6.07l1.27-1.27a2 2 0 0 1 2.11-.45c.73.34 1.52.57 2.33.7A2 2 0 0 1 22 16.92z"></path></svg>'
  };

  function getCurrentPage() {
    const fileName = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const match = fileName.match(/^hospital-(.+)\.html$/);

    if (match) {
      return { key: 'hospital-detail', slug: match[1], fileName };
    }

    const pageMap = {
      '': { key: 'home', fileName: 'index.html' },
      'index.html': { key: 'home', fileName: 'index.html' },
      'more-about-us.html': { key: 'about', fileName },
      'laboratory.html': { key: 'laboratory', fileName },
      'promotive.html': { key: 'promotive', fileName },
      'hospitals.html': { key: 'hospitals', fileName },
      'contact-us.html': { key: 'contact', fileName }
    };

    return pageMap[fileName] || { key: 'unknown', fileName };
  }

  function toSectionMap(rows) {
    return (rows || []).reduce((acc, row) => {
      if (row?.page_name && row?.section_key) {
        acc[`${row.page_name}:${row.section_key}`] = row.content || {};
      }
      return acc;
    }, {});
  }

  function getSection(sections, pageName, sectionKey) {
    return sections[`${pageName}:${sectionKey}`] || null;
  }

  function setText(selector, value) {
    if (!value) {
      return;
    }
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function setHtml(selector, value) {
    if (!value) {
      return;
    }
    document.querySelectorAll(selector).forEach((node) => {
      node.innerHTML = value;
    });
  }

  function setImageSource(selector, value) {
    if (!value) {
      return;
    }

    document.querySelectorAll(selector).forEach((node) => {
      if (node.tagName === 'IMG') {
        node.src = value;
      } else {
        node.style.backgroundImage = `url('${value.replace(/'/g, "\\'")}')`;
      }
    });
  }

  function renderNavbar(navbar) {
    if (!navbar) {
      return;
    }

    setText('.nav-logo-title', navbar.title);
    setText('.nav-logo-sub', navbar.subtitle);

    if (navbar.logo_url) {
      const phoLogo = document.querySelector('.pho-logo-wrapper img');
      if (phoLogo) {
        phoLogo.src = navbar.logo_url;
      }
    }

    if (navbar.seal_url) {
      const sealLogo = document.querySelector('.nav-logo > .nav-logo-img');
      if (sealLogo?.tagName === 'IMG') {
        sealLogo.src = navbar.seal_url;
      }
    }

    const links = [
      { id: '#nav-home', label: navbar.home_label, href: navbar.home_href },
      { id: '#nav-about', label: navbar.about_label, href: navbar.about_href },
      { id: '#nav-services', label: navbar.services_label, href: navbar.services_href },
      { id: '#nav-contact', label: navbar.contact_label, href: navbar.contact_href }
    ];

    links.forEach((entry) => {
      const link = document.querySelector(entry.id);
      if (!link) {
        return;
      }
      if (entry.label) {
        link.textContent = entry.label;
      }
      if (entry.href) {
        link.setAttribute('href', entry.href);
      }
    });
  }

  function renderFooter(footer) {
    if (!footer) {
      return;
    }

    setText('.footer-logo-title', footer.title);
    setText('.footer-logo-sub', footer.subtitle);
    setText('.footer-brand-desc', footer.description);
    setText('.footer-bottom-inner', footer.copyright);

    if (footer.logo_url) {
      const logo = document.querySelector('.footer-logo-img');
      if (logo) {
        logo.src = footer.logo_url;
      }
    }

    if (Array.isArray(footer.quick_links)) {
      const list = document.querySelector('.footer-link-list');
      if (list) {
        list.innerHTML = footer.quick_links.map((link) => (
          `<li><a href="${escapeHtml(link.url || '#')}" class="footer-link-item">${escapeHtml(link.label || '')}</a></li>`
        )).join('');
      }
    }

    if (Array.isArray(footer.government_links)) {
      const list = document.querySelector('.footer-gov-links');
      if (list) {
        list.innerHTML = footer.government_links.map((link) => (
          `<a href="${escapeHtml(link.url || '#')}" target="_blank" rel="noreferrer" class="footer-gov-link">${escapeHtml(link.label || '')}</a>`
        )).join('');
      }
    }

    const contactItems = document.querySelectorAll('.footer-contact-item');
    if (contactItems[0] && footer.phone) {
      contactItems[0].querySelector('span')?.replaceChildren(document.createTextNode(footer.phone));
    }
    if (contactItems[1] && Array.isArray(footer.emails) && footer.emails.length) {
      contactItems[1].querySelector('span').innerHTML = footer.emails.map((email) => (
        `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`
      )).join('<br>');
    }
    if (contactItems[2] && footer.facebook_url && footer.facebook_label) {
      const link = contactItems[2].querySelector('a');
      if (link) {
        link.href = footer.facebook_url;
        link.textContent = footer.facebook_label;
      }
    }
  }

  function renderHome(sections) {
    const hero = getSection(sections, 'home', 'hero');
    if (hero) {
      setText('.hero-welcome', hero.welcome);
      const heading = document.querySelector('.hero-heading');
      if (heading && hero.heading_html) {
        heading.innerHTML = hero.heading_html;
      }
      setText('.hero-tagline', hero.tagline);

      if (Array.isArray(hero.slides) && hero.slides.length) {
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
          carousel.innerHTML = hero.slides.map((slide, index) => `
            <div class="hero-slide carousel-slide${index === 0 ? ' active' : ''}">
              <img src="${escapeHtml(slide.image_url || '')}" alt="${escapeHtml(slide.alt || '')}" />
            </div>
          `).join('');
          const container = carousel.closest('.carousel-container');
          if (container) {
            delete container.dataset.carouselReady;
          }
        }
      }
    }

    const services = getSection(sections, 'home', 'services');
    if (services && Array.isArray(services.cards) && services.cards.length) {
      const grid = document.querySelector('.services-grid');
      if (grid) {
        grid.innerHTML = services.cards.map((card) => {
          const theme = String(card.theme || 'lab').trim().toLowerCase();
          const iconContent = card.image_url ? `<img src="${escapeHtml(card.image_url)}" alt="${escapeHtml(card.front_title || '')}" style="width: 100%; height: 100%; object-fit: contain;">` : (DEFAULT_ICON[theme] || DEFAULT_ICON.lab);
          return `
            <a href="${escapeHtml(card.url || '#')}" class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <div class="flip-card-icon">${iconContent}</div>
                  <h3 class="flip-card-title">${card.front_title_html || escapeHtml(card.front_title || '')}</h3>
                  <div class="flip-card-color-bar ${escapeHtml(theme)}"></div>
                </div>
                <div class="flip-card-back ${escapeHtml(theme)}">
                  <h3 class="flip-card-back-title">${escapeHtml(card.back_title || '')}</h3>
                  <p class="flip-card-back-desc">${escapeHtml(card.back_description || '')}</p>
                  <span class="flip-card-back-btn">${escapeHtml(card.button_label || 'VIEW DETAILS ->')}</span>
                </div>
              </div>
            </a>
          `;
        }).join('');
      }
    }

    const about = getSection(sections, 'home', 'about');
    if (about) {
      setText('.about-heading', about.heading);
      setText('.about-body', about.body);
      const aboutButton = document.querySelector('#explore-about-btn');
      if (aboutButton) {
        if (about.button_label) {
          aboutButton.textContent = about.button_label;
        }
        if (about.button_url) {
          aboutButton.href = about.button_url;
        }
      }
    }

    const vmg = getSection(sections, 'home', 'vmg');
    if (vmg && Array.isArray(vmg.items) && vmg.items.length) {
      const accordion = document.querySelector('#accordion');
      if (accordion) {
        accordion.innerHTML = vmg.items.map((item, index) => `
          <div class="accordion-item${index === 0 ? ' open' : ''}">
            <div class="accordion-header">
              <span class="accordion-header-title">${escapeHtml(item.title || '')}</span>
              <span class="accordion-icon">+</span>
            </div>
            <div class="accordion-body">
              <div class="accordion-body-inner">${item.body_html || escapeHtml(item.body || '')}</div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  function renderAbout(sections) {
    const hero = getSection(sections, 'about', 'hero');
    if (hero) {
      setImageSource('.about-hero', hero.background_image_url);
      setText('.about-hero-title', hero.title);
      const subtitle = document.querySelector('.about-hero-content p');
      if (subtitle && hero.subtitle) {
        subtitle.textContent = hero.subtitle;
      }
    }

    const history = getSection(sections, 'about', 'history');
    if (history && Array.isArray(history.paragraphs) && history.paragraphs.length) {
      const content = document.querySelector('.history-content');
      if (content) {
        content.innerHTML = history.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');
      }
    }

    const strategies = getSection(sections, 'about', 'strategies');
    if (strategies && Array.isArray(strategies.slides) && strategies.slides.length) {
      const carousel = document.querySelector('.strategies-section .hero-carousel');
      const dots = document.querySelector('.strategies-section .hero-dots');
      if (carousel) {
        carousel.innerHTML = strategies.slides.map((slide, index) => `
          <div class="hero-slide carousel-slide${index === 0 ? ' active' : ''}" style="display:flex;align-items:center;justify-content:center;">
            <img style="position:absolute;inset:0;z-index:0;" src="${escapeHtml(slide.image_url || '')}" alt="${escapeHtml(slide.title || '')}" />
            <div class="hero-content" style="z-index:2;">
              <h1 class="hero-heading" style="font-size:clamp(2rem,4vw,3.5rem);">${escapeHtml(slide.title || '')}</h1>
            </div>
          </div>
        `).join('');
        const container = carousel.closest('.carousel-container');
        if (container) {
          delete container.dataset.carouselReady;
        }
      }
      if (dots) {
        dots.innerHTML = strategies.slides.map((_, index) => (
          `<button class="hero-dot carousel-dot${index === 0 ? ' active' : ''}" aria-label="Slide ${index + 1}"></button>`
        )).join('');
      }
    }

    const units = getSection(sections, 'about', 'units');
    if (units && Array.isArray(units.cards) && units.cards.length) {
      const grid = document.querySelector('.units-grid');
      if (grid) {
        grid.innerHTML = units.cards.map((card) => `
          <div class="unit-flip-card">
            <div class="unit-card-inner">
              <div class="unit-card-front">
                <img src="${escapeHtml(card.image_url || '')}" alt="${escapeHtml(card.title || '')}" />
                <h3 class="unit-title">${escapeHtml(card.title || '')}</h3>
              </div>
              <div class="unit-card-back">
                <h3 class="unit-title-back">${escapeHtml(card.back_title || card.title || '')}</h3>
                <p class="unit-desc">${escapeHtml(card.description || '')}</p>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    const orgStructure = getSection(sections, 'about', 'org_structure');
    if (orgStructure && Array.isArray(orgStructure.images) && orgStructure.images.length) {
      const track = document.querySelector('#org-carousel-track');
      if (track) {
        track.innerHTML = orgStructure.images.map((image, index) => `
          <div class="org-slide">
            <div class="org-slide-inner">
              <img src="${escapeHtml(image.image_url || '')}" alt="${escapeHtml(image.alt || `PHO Organizational Structure - Part ${index + 1}`)}" class="org-image" />
              <div class="org-slide-caption">${escapeHtml(image.caption || `Page ${index + 1}`)}</div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  function renderPageHero(section) {
    if (!section) {
      return;
    }
    setImageSource('.page-hero', section.background_image_url);
    setText('.page-hero-title', section.title);
    setText('.page-hero-subtitle', section.subtitle);
  }

  function renderCardList(selector, cards, themeKey) {
    const grid = document.querySelector(selector);
    if (!grid || !Array.isArray(cards) || !cards.length) {
      return;
    }

    grid.innerHTML = cards.map((card) => {
      const tag = card.url ? 'a' : 'div';
      const href = card.url ? ` href="${escapeHtml(card.url)}" target="${themeKey === 'lab' && /^https?:/.test(card.url) ? '_blank' : '_self'}"` : '';
      const rel = card.url && /^https?:/.test(card.url) ? ' rel="noreferrer"' : '';
      const iconContent = card.image_url ? `<img src="${escapeHtml(card.image_url)}" alt="${escapeHtml(card.title || '')}" style="width: 100%; height: 100%; object-fit: contain;">` : DEFAULT_ICON[themeKey === 'promo' ? 'promo' : themeKey === 'hospital' ? 'hospital' : 'lab'];
      return `
        <${tag}${href}${rel} class="facility-card${themeKey === 'hospital' ? ' hospital' : themeKey === 'promo' ? ' promo' : ''}" style="${card.url ? 'text-decoration:none;color:inherit;display:block;' : ''}">
          <div class="facility-icon-wrap">${iconContent}</div>
          <h3 class="facility-name">${escapeHtml(card.title || '')}</h3>
          <p class="facility-desc">${escapeHtml(card.description || '')}</p>
        </${tag}>
      `;
    }).join('');
  }

  function renderHospitalsLanding(cards, sections) {
    renderPageHero(getSection(sections, 'hospitals', 'hero'));
    if (!Array.isArray(cards) || !cards.length) {
      return;
    }

    const section = document.querySelector('.facilities-section .container');
    if (!section) {
      return;
    }

    const groups = cards.reduce((acc, card) => {
      const key = card.license_group || 'Other';
      acc[key] = acc[key] || [];
      acc[key].push(card);
      return acc;
    }, {});

    const header = `
      <div class="section-header center">
        <p class="section-eyebrow">Provincial Hospitals</p>
        <h2 class="section-title">Our Hospitals</h2>
        <p class="section-subtitle">Government-operated hospitals providing accessible, quality medical services in every district of Bohol.</p>
      </div>
    `;

    const groupDisplayNames = {
      'Level II': 'DOH-Licensed Level II Hospitals',
      'Level I': 'DOH-Licensed Level I Hospitals',
      'Infirmaries': 'Infirmaries'
    };

    const groupOrder = ['Level II', 'Level I', 'Infirmaries'];
    const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
      const indexA = groupOrder.indexOf(a);
      const indexB = groupOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const groupMarkup = sortedGroupKeys.map((groupKey) => {
      const groupCards = groups[groupKey];
      const displayName = groupDisplayNames[groupKey] || groupKey;
      return `
      <div class="hospital-group">
        <h3 class="hospital-group-title">${escapeHtml(displayName)}</h3>
        <div class="facilities-grid">
          ${groupCards.map((card) => {
            const iconContent = card.image_url ? `<img src="${escapeHtml(card.image_url)}" alt="${escapeHtml(card.title || '')}" style="width: 100%; height: 100%; object-fit: contain;">` : DEFAULT_ICON.hospital;
            return `
            <a href="${escapeHtml(card.url || '#')}" class="facility-card hospital" style="text-decoration:none;color:inherit;display:block;">
              <div class="facility-icon-wrap">${iconContent}</div>
              <h3 class="facility-name">${escapeHtml(card.title || '')}</h3>
              <p class="facility-desc">${escapeHtml(card.description || '')}</p>
            </a>
            `;
          }).join('')}
        </div>
      </div>
      `;
    }).join('');

    section.innerHTML = `${header}${groupMarkup}`;
  }

  function renderContact(sections, directory, emailConfig) {
    const hero = getSection(sections, 'contact', 'hero');
    if (hero) {
      setImageSource('.contact-hero', hero.background_image_url);
      setText('.contact-hero-title', hero.title);
      setText('.contact-hero-subtitle', hero.subtitle);
    }

    const info = getSection(sections, 'contact', 'info');
    if (info) {
      const headings = document.querySelectorAll('.contact-card-premium .contact-info-text h4');
      if (headings[0] && info.location_heading) headings[0].textContent = info.location_heading;
      if (headings[1] && info.phone_heading) headings[1].textContent = info.phone_heading;
      if (headings[2] && info.email_heading) headings[2].textContent = info.email_heading;
      if (headings[3] && info.hours_heading) headings[3].textContent = info.hours_heading;

      setHtml('[data-cms-key="contact.info.address"]', info.address_html || info.address);
      setHtml('[data-cms-key="contact.info.phone"]', info.phone_html || info.phone);

      const emailBlock = document.querySelector('.contact-info-item:nth-of-type(3) .contact-info-text p');
      if (emailBlock && Array.isArray(info.emails) && info.emails.length) {
        emailBlock.innerHTML = info.emails.map((email) => `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`).join('<br>');
      }

      const hoursBlock = document.querySelector('.contact-info-item:nth-of-type(4) .contact-info-text p');
      if (hoursBlock && info.office_hours_html) {
        hoursBlock.innerHTML = info.office_hours_html;
      }

      if (info.form_title) {
        setText('.form-title', info.form_title);
      }
      if (info.form_subtitle) {
        setText('.form-subtitle', info.form_subtitle);
      }
    }

    if (Array.isArray(directory) && directory.length) {
      const grid = document.querySelector('.directory-grid');
      if (grid) {
        grid.innerHTML = directory.map((item) => `
          <div class="directory-card">
            <div class="directory-card-header">
              <h3 class="directory-card-title">${escapeHtml(item.title || '')}</h3>
              <p class="directory-card-subtitle">${escapeHtml(item.subtitle || '')}</p>
            </div>
            <div class="directory-info-list">
              ${item.phone ? `
                <div class="directory-info-item">
                  ${DEFAULT_ICON.contact}
                  <span>${escapeHtml(item.phone)}</span>
                </div>
              ` : ''}
              ${item.email ? `
                <div class="directory-info-item">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a></span>
                </div>
              ` : ''}
              ${item.extra ? `<div class="directory-info-item"><span>${escapeHtml(item.extra)}</span></div>` : ''}
            </div>
          </div>
        `).join('');
      }
    }

    window.PHO_CMS_EMAILJS = emailConfig || null;
  }

  function renderHospitalDetail(hospital, services, programs) {
    if (!hospital) {
      return;
    }

    const main = document.querySelector('main');
    if (!main) {
      return;
    }

    const serviceMarkup = (services || []).map((service) => `
      <div class="service-detail-card">
        <div class="service-card-header">
          <div class="service-card-icon">${DEFAULT_ICON.hospital}</div>
          <h3 class="service-card-title">${escapeHtml(service.title || '')}</h3>
        </div>
        <div class="service-card-content-wrapper">
          ${service.intro ? `<p class="facility-desc" style="margin-bottom:1rem;">${escapeHtml(service.intro)}</p>` : ''}
          <div class="service-list">
            ${(Array.isArray(service.items) ? service.items : []).map((item) => {
              if (typeof item === 'string') {
                return `<div class="service-list-item"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${escapeHtml(item)}</span></div>`;
              }

              const children = Array.isArray(item.items) ? item.items : [];
              return `
                ${item.title ? `<div class="service-sublist-title">${escapeHtml(item.title)}</div>` : ''}
                <div class="service-sublist-scroll">
                  <div class="service-sublist-grid">
                    ${children.map((child) => `<div class="service-sub-item">${escapeHtml(child)}</div>`).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `).join('');

    const programMarkup = (programs || []).map((program) => `
      <div class="milestone-card${program.is_covid ? ' covid' : ''}">
        ${program.badge ? `<div class="milestone-year">${escapeHtml(program.badge)}</div>` : ''}
        <div class="milestone-content">
          <h3>${escapeHtml(program.title || '')}</h3>
          <span>${escapeHtml(program.body || '')}</span>
        </div>
      </div>
    `).join('');

    main.innerHTML = `
      <section class="hospital-hero" style="background-image: url('${escapeHtml(hospital.hero_image_url || '')}');">
        <div class="hospital-hero-content">
          <h1 class="hospital-hero-title">${escapeHtml(hospital.hero_title || hospital.name || '')}</h1>
          <p class="hospital-hero-subtitle">${escapeHtml(hospital.hero_subtitle || hospital.location_text || '')}</p>
        </div>
      </section>

      <section class="hospital-welcome-section">
        <div class="container">
          <div class="welcome-layout">
            <div class="welcome-main">
              <p class="section-eyebrow">Overview</p>
              <h2 class="section-title">${escapeHtml(hospital.overview_title || `Welcome to ${hospital.short_name || hospital.name || 'Our Hospital'}`)}</h2>
              ${hospital.quote ? `<blockquote class="hospital-quote">${escapeHtml(hospital.quote)}</blockquote>` : ''}
              <p class="welcome-text">${escapeHtml(hospital.overview_body || '')}</p>
              ${(hospital.offer_title || hospital.offer_body) ? `
                <div class="we-offer-container">
                  <h4 class="offer-heading">${escapeHtml(hospital.offer_heading || 'We Offer:')}</h4>
                  <div class="offer-grid">
                    <div class="offer-item">
                      <div class="offer-details">
                        <span class="offer-label">${escapeHtml(hospital.offer_title || '')}</span>
                        <span class="offer-value" style="font-size:0.85rem;font-weight:normal;margin-top:4px;display:block;line-height:1.4;">${escapeHtml(hospital.offer_body || '')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
            <div class="welcome-sidebar">
              <div class="contact-card">
                <h3>Contact Information</h3>
                ${hospital.phone ? `
                  <div class="contact-item">
                    ${DEFAULT_ICON.contact}
                    <div><span class="contact-label">Phone</span><a href="tel:${escapeHtml(hospital.phone.replace(/[^0-9+]/g, ''))}">${escapeHtml(hospital.phone)}</a></div>
                  </div>
                ` : ''}
                ${(hospital.email_primary || hospital.email_secondary) ? `
                  <div class="contact-item">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <div>
                      <span class="contact-label">Email</span>
                      <span style="display:flex;flex-direction:column;gap:0;">
                        ${hospital.email_primary ? `<a href="mailto:${escapeHtml(hospital.email_primary)}">${escapeHtml(hospital.email_primary)}</a>` : ''}
                        ${hospital.email_secondary ? `<a href="mailto:${escapeHtml(hospital.email_secondary)}">${escapeHtml(hospital.email_secondary)}</a>` : ''}
                      </span>
                    </div>
                  </div>
                ` : ''}
                ${hospital.location_text ? `
                  <div class="contact-item">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <div><span class="contact-label">Location</span><span>${escapeHtml(hospital.location_text)}</span></div>
                  </div>
                ` : ''}
                ${hospital.facebook_url ? `
                  <div class="contact-item">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    <div><span class="contact-label">Facebook</span><a href="${escapeHtml(hospital.facebook_url)}" target="_blank" rel="noreferrer">${escapeHtml(hospital.facebook_label || hospital.name || '')}</a></div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="hospital-services-section">
        <div class="container">
          <div class="section-header center">
            <p class="section-eyebrow">Medical Offerings</p>
            <h2 class="section-title">Our Services</h2>
            <p class="section-subtitle">We provide a wide array of specialized clinical diagnostic, surgical, and therapeutic services.</p>
          </div>
          <div class="hospital-services-grid">${serviceMarkup}</div>
        </div>
      </section>

      <section class="hospital-activities-section">
        <div class="container">
          <div class="section-header center">
            <p class="section-eyebrow">Programs & Milestones</p>
            <h2 class="section-title">Highlights</h2>
            <p class="section-subtitle">A look into the hospital programs, milestones, and major service updates.</p>
          </div>
          <div class="milestones-grid">${programMarkup}</div>
        </div>
      </section>

      ${(hospital.map_embed_url || hospital.map_link_url) ? `
        <section class="hospital-location-section">
          <div class="container">
            <div class="section-header center">
              <p class="section-eyebrow">Location</p>
              <h2 class="section-title">Find Us</h2>
            </div>
            ${hospital.map_embed_url ? `<iframe src="${escapeHtml(hospital.map_embed_url)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : ''}
            ${hospital.map_link_url ? `<p style="text-align:center;margin-top:1rem;"><a class="btn-primary" href="${escapeHtml(hospital.map_link_url)}" target="_blank" rel="noreferrer">Open In Maps</a></p>` : ''}
          </div>
        </section>
      ` : ''}
    `;
  }

  async function fetchPublicContent(page) {
    const client = cms.getClient?.();
    if (!client) {
      return null;
    }

    const pageNames = ['shared'];
    if (['home', 'about', 'laboratory', 'promotive', 'hospitals', 'contact'].includes(page.key)) {
      pageNames.push(page.key);
    }

    const tasks = [
      cms.withTimeout(
        client.from('page_sections').select('page_name, section_key, content').in('page_name', pageNames),
        config.contentTimeoutMs || 8000,
        'Timed out while loading page sections.'
      )
    ];

    if (page.key === 'laboratory') {
      tasks.push(cms.withTimeout(client.from('lab_cards').select('*').order('sort_order'), config.contentTimeoutMs || 8000, 'Timed out while loading laboratory cards.'));
    }
    if (page.key === 'promotive') {
      tasks.push(cms.withTimeout(client.from('promotive_cards').select('*').order('sort_order'), config.contentTimeoutMs || 8000, 'Timed out while loading promotive cards.'));
    }
    if (page.key === 'hospitals') {
      tasks.push(cms.withTimeout(client.from('hospital_cards').select('*').order('sort_order'), config.contentTimeoutMs || 8000, 'Timed out while loading hospital cards.'));
    }
    if (page.key === 'contact') {
      tasks.push(cms.withTimeout(client.from('contact_directory').select('*').order('sort_order'), config.contentTimeoutMs || 8000, 'Timed out while loading directory entries.'));
      tasks.push(cms.withTimeout(client.from('emailjs_config').select('*').eq('id', 1).maybeSingle(), config.contentTimeoutMs || 8000, 'Timed out while loading EmailJS config.'));
    }
    if (page.key === 'hospital-detail') {
      tasks.push(cms.withTimeout(client.from('hospitals').select('*').eq('slug', page.slug).maybeSingle(), config.contentTimeoutMs || 8000, 'Timed out while loading hospital details.'));
    }

    const results = await Promise.all(tasks);
    return results;
  }

  async function load() {
    if (!cms.isConfigured?.()) {
      return;
    }

    const page = getCurrentPage();
    if (page.key === 'unknown') {
      return;
    }

    try {
      const results = await fetchPublicContent(page);
      if (!results?.length) {
        return;
      }

      const sections = toSectionMap(results[0]?.data || []);
      renderNavbar(getSection(sections, 'shared', 'navbar'));
      renderFooter(getSection(sections, 'shared', 'footer'));

      if (page.key === 'home') {
        renderHome(sections);
      } else if (page.key === 'about') {
        renderAbout(sections);
      } else if (page.key === 'laboratory') {
        renderPageHero(getSection(sections, 'laboratory', 'hero'));
        renderCardList('.facilities-grid', results[1]?.data || [], 'lab');
      } else if (page.key === 'promotive') {
        renderPageHero(getSection(sections, 'promotive', 'hero'));
        renderCardList('.facilities-grid', results[1]?.data || [], 'promo');
      } else if (page.key === 'hospitals') {
        renderHospitalsLanding(results[1]?.data || [], sections);
      } else if (page.key === 'contact') {
        renderContact(sections, results[1]?.data || [], results[2]?.data || null);
      } else if (page.key === 'hospital-detail') {
        const hospitalResult = results[1];
        const hospital = hospitalResult?.data || null;
        if (hospital?.id) {
          const client = cms.getClient?.();
          const [servicesResult, programsResult] = await Promise.all([
            cms.withTimeout(client.from('hospital_services').select('*').eq('hospital_id', hospital.id).order('sort_order'), config.contentTimeoutMs || 8000, 'Timed out while loading hospital services.'),
            cms.withTimeout(client.from('hospital_programs').select('*').eq('hospital_id', hospital.id).order('sort_order'), config.contentTimeoutMs || 8000, 'Timed out while loading hospital programs.')
          ]);
          renderHospitalDetail(hospital, servicesResult?.data || [], programsResult?.data || []);
        }
      }

      if (typeof window.reinitInteractivity === 'function') {
        window.reinitInteractivity();
      }

      document.dispatchEvent(new CustomEvent('pho-cms:content-applied', { detail: { page } }));
    } catch (error) {
      console.warn('PHO CMS content loader fell back to static content.', error);
    }
  }

  window.PHO_CMS = window.PHO_CMS || {};
  window.PHO_CMS.reloadPublicContent = load;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }

  // ---------------------------------------------------------------------------
  // Live update: whenever the CMS dashboard saves content it writes
  // pho.cms.lastSave to localStorage.  The storage event fires in every
  // OTHER tab on the same origin, so public pages automatically reload their
  // CMS content without the visitor needing to refresh the page.
  // ---------------------------------------------------------------------------
  window.addEventListener('storage', function (event) {
    if (event.key === 'pho.cms.lastSave' && event.newValue) {
      load();
    }
  });
})();

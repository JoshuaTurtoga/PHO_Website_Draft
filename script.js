/* ============================================
   BOHOL PROVINCIAL HEALTH OFFICE — script.js
   Shared across all pages
   ============================================ */

(function initPhoSiteScript() {
  const globalState = {
    scrollBound: false,
    docClickBound: false,
    backToTopBound: false,
    orgDragBound: false,
    lightboxKeyBound: false
  };

  function bindOnce(element, key, eventName, handler, options) {
    if (!element || element.dataset[key] === 'true') {
      return;
    }

    element.addEventListener(eventName, handler, options);
    element.dataset[key] = 'true';
  }

  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (!globalState.scrollBound) {
      const onScroll = () => {
        document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
        document.getElementById('back-to-top')?.classList.toggle('visible', window.scrollY > 400);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      globalState.scrollBound = true;
      onScroll();
    }

    bindOnce(hamburger, 'phoHamburgerBound', 'click', (event) => {
      event.stopPropagation();
      const currentNavLinks = document.getElementById('nav-links');
      const currentHamburger = document.getElementById('hamburger-btn');
      const open = currentNavLinks?.classList.toggle('mobile-open');
      currentHamburger?.classList.toggle('open', Boolean(open));
    });

    if (!globalState.docClickBound) {
      document.addEventListener('click', (event) => {
        const currentNavLinks = document.getElementById('nav-links');
        const currentHamburger = document.getElementById('hamburger-btn');
        if (!currentNavLinks?.contains(event.target) && event.target !== currentHamburger) {
          currentNavLinks?.classList.remove('mobile-open');
          currentHamburger?.classList.remove('open');
        }
      });
      globalState.docClickBound = true;
    }

    if (navbar && !navbar.classList.contains('scrolled') && window.scrollY > 20) {
      navbar.classList.add('scrolled');
    }
  }

  function initCarousels(force) {
    document.querySelectorAll('.carousel-container').forEach((carousel) => {
      const slides = carousel.querySelectorAll('.carousel-slide');
      const dots = carousel.querySelectorAll('.carousel-dot');

      if (!slides.length) {
        return;
      }

      if (!force && carousel.dataset.carouselReady === 'true' && carousel._slides && carousel._slides[0] === slides[0]) {
        return;
      }

      if (carousel._autoPlayTimer) {
        window.clearInterval(carousel._autoPlayTimer);
        carousel._autoPlayTimer = null;
      }

      carousel._slides = slides;
      let current = 0;
      const total = slides.length;

      function goToSlide(nextIndex) {
        slides[current]?.classList.remove('active');
        dots[current]?.classList.remove('active');
        current = (nextIndex + total) % total;
        slides[current]?.classList.add('active');
        dots[current]?.classList.add('active');
      }

      if (total > 1) {
        carousel._autoPlayTimer = window.setInterval(() => goToSlide(current + 1), 5000);
      }

      dots.forEach((dot, index) => {
        dot.onclick = () => {
          if (carousel._autoPlayTimer) {
            window.clearInterval(carousel._autoPlayTimer);
          }
          goToSlide(index);
          if (total > 1) {
            carousel._autoPlayTimer = window.setInterval(() => goToSlide(current + 1), 5000);
          }
        };
      });

      slides.forEach((slide, index) => slide.classList.toggle('active', index === 0));
      dots.forEach((dot, index) => dot.classList.toggle('active', index === 0));
      carousel.dataset.carouselReady = 'true';
    });
  }

  function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach((header) => {
      bindOnce(header, 'phoAccordionBound', 'click', () => {
        const item = header.parentElement;
        const isOpen = item?.classList.contains('open');
        document.querySelectorAll('.accordion-item').forEach((accordionItem) => {
          accordionItem.classList.remove('open');
        });
        if (!isOpen) {
          item?.classList.add('open');
        }
      });
    });

    document.querySelector('.accordion-item')?.classList.add('open');
  }

  function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    bindOnce(backToTop, 'phoBackToTopBound', 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initRevealAnimations() {
    const revealEls = document.querySelectorAll(
      '.flip-card, .facility-card, .section-header, .about-left, .accordion, .footer-brand, .footer-col, .unit-flip-card, .directory-card, .service-detail-card, .milestone-card'
    );

    revealEls.forEach((element) => {
      if (!element.classList.contains('reveal')) {
        element.classList.add('reveal');
      }
    });

    if (!window.__phoRevealObserver) {
      window.__phoRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            window.__phoRevealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
    }

    revealEls.forEach((element, index) => {
      if (!element.dataset.revealDelayApplied) {
        element.style.transitionDelay = `${(index % 6) * 0.08}s`;
        element.dataset.revealDelayApplied = 'true';
      }

      if (element.dataset.revealObserved !== 'true') {
        window.__phoRevealObserver.observe(element);
        element.dataset.revealObserved = 'true';
      }
    });
  }

  function initServiceAccordions() {
    document.querySelectorAll('.service-detail-card').forEach((card) => {
      bindOnce(card, 'phoServiceCardBound', 'click', (event) => {
        const header = card.querySelector('.service-card-header');
        const wrapper = card.querySelector('.service-card-content-wrapper');
        if (!header || !wrapper) {
          return;
        }

        if (wrapper.contains(event.target) && !header.contains(event.target)) {
          return;
        }

        const serviceCards = [...document.querySelectorAll('.service-detail-card')];
        const isOpen = card.classList.contains('open');

        serviceCards.forEach((serviceCard) => {
          serviceCard.classList.remove('open');
          const contentWrapper = serviceCard.querySelector('.service-card-content-wrapper');
          if (contentWrapper) {
            contentWrapper.style.maxHeight = null;
          }
        });

        if (!isOpen) {
          card.classList.add('open');
          wrapper.style.maxHeight = `${wrapper.scrollHeight}px`;
        }
      });
    });
  }

  function initActiveNavHighlight() {
    const pathSegment = window.location.pathname.split('/').pop() || '';
    const currentPage = pathSegment.replace(/\.html$/, '');
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      const normalizedHref = (href || '').replace(/\.html$/, '').replace(/^\//, '');

      if (
        normalizedHref === currentPage ||
        normalizedHref === '/' + currentPage ||
        (currentPage === '' && (normalizedHref === '' || normalizedHref === '/')) ||
        (currentPage === 'index' && (normalizedHref === '' || normalizedHref === '/'))
      ) {
        link.classList.add('active');
      }

      if (
        [
          'laboratory',
          'promotive',
          'hospitals',
          'hospital-gmph',
          'hospital-cdh',
          'hospital-fdmh',
          'hospital-tbgdh',
          'hospital-csgtmh',
          'hospital-canch',
          'hospital-cnpcmh',
          'hospital-clach',
          'hospital-mch',
          'hospital-cpgmh'
        ].includes(currentPage) &&
        (href === '/#services' || href === '/#services')
      ) {
        link.classList.add('active');
      }

      if (currentPage === 'more-about-us' && (normalizedHref === 'more-about-us' || href === '/#about')) {
        link.classList.add('active');
      }

      if (currentPage === 'contact-us' && normalizedHref === 'contact-us') {
        link.classList.add('active');
      }
    });
  }

  function initOrgCarousel() {
    const orgTrack = document.getElementById('org-carousel-track');
    const orgLeftArrow = document.querySelector('.org-arrow-left');
    const orgRightArrow = document.querySelector('.org-arrow-right');
    const orgSlides = document.querySelectorAll('.org-slide');

    if (!orgTrack || !orgSlides.length) {
      return;
    }

    const getScrollAmount = () => {
      const firstSlide = document.querySelector('.org-slide');
      return firstSlide ? firstSlide.offsetWidth + 24 : orgTrack.clientWidth;
    };

    bindOnce(orgLeftArrow, 'phoOrgLeftBound', 'click', () => {
      document.getElementById('org-carousel-track')?.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    bindOnce(orgRightArrow, 'phoOrgRightBound', 'click', () => {
      document.getElementById('org-carousel-track')?.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    if (!globalState.orgDragBound) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      document.addEventListener('mousedown', (event) => {
        const track = event.target.closest('#org-carousel-track');
        if (!track) {
          return;
        }
        isDown = true;
        startX = event.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });

      document.addEventListener('mouseup', () => {
        isDown = false;
      });

      document.addEventListener('mouseleave', () => {
        isDown = false;
      });

      document.addEventListener('mousemove', (event) => {
        const track = document.getElementById('org-carousel-track');
        if (!isDown || !track) {
          return;
        }
        event.preventDefault();
        const x = event.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
      });

      globalState.orgDragBound = true;
    }
  }

  function initLightbox() {
    const lightbox = document.getElementById('org-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const orgSlides = document.querySelectorAll('.org-slide');

    if (!lightbox || !lightboxImg || !orgSlides.length) {
      return;
    }

    orgSlides.forEach((slide) => {
      bindOnce(slide, 'phoLightboxSlideBound', 'click', () => {
        const image = slide.querySelector('.org-image');
        if (!image) {
          return;
        }

        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightbox.style.display = 'flex';
        window.setTimeout(() => {
          lightbox.classList.add('active');
          lightbox.setAttribute('aria-hidden', 'false');
        }, 10);
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      window.setTimeout(() => {
        if (!lightbox.classList.contains('active')) {
          lightbox.style.display = 'none';
          lightboxImg.src = '';
        }
      }, 350);
    };

    bindOnce(lightboxClose, 'phoLightboxCloseBound', 'click', closeLightbox);
    bindOnce(lightbox, 'phoLightboxBackdropBound', 'click', (event) => {
      if (event.target === lightbox || event.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    if (!globalState.lightboxKeyBound) {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.getElementById('org-lightbox')?.classList.contains('active')) {
          document.getElementById('lightbox-close')?.click();
        }
      });
      globalState.lightboxKeyBound = true;
    }
  }

  function reinitInteractivity() {
    initNavbar();
    initCarousels();
    initAccordion();
    initBackToTop();
    initRevealAnimations();
    initServiceAccordions();
    initActiveNavHighlight();
    initOrgCarousel();
    initLightbox();
  }

  window.reinitInteractivity = reinitInteractivity;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reinitInteractivity);
  } else {
    reinitInteractivity();
  }
})();

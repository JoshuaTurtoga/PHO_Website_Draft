/* ============================================
   BOHOL PROVINCIAL HEALTH OFFICE — script.js
   Shared across all pages
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar scroll effect ─── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Hamburger toggle ─── */
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks  = document.getElementById('nav-links');
  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navLinks.classList.toggle('mobile-open');
    hamburger.classList.toggle('open', open);
  });
  document.addEventListener('click', (e) => {
    if (!navLinks?.contains(e.target) && e.target !== hamburger) {
      navLinks?.classList.remove('mobile-open');
      hamburger?.classList.remove('open');
    }
  });

  /* ─── Generic Carousel Logic ─── */
  const carousels = document.querySelectorAll('.carousel-container');
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots   = carousel.querySelectorAll('.carousel-dot');

    if (slides.length > 0) {
      let current = 0;
      const total = slides.length;

      function goToSlide(idx) {
        slides[current].classList.remove('active');
        if (dots[current]) dots[current].classList.remove('active');
        current = (idx + total) % total;
        slides[current].classList.add('active');
        if (dots[current]) dots[current].classList.add('active');
      }

      // Auto-play every 5s
      let autoPlay = setInterval(() => goToSlide(current + 1), 5000);

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          clearInterval(autoPlay);
          goToSlide(i);
          autoPlay = setInterval(() => goToSlide(current + 1), 5000);
        });
      });

      // Initialize first slide
      if (slides[0]) slides[0].classList.add('active');
      if (dots[0]) dots[0].classList.add('active');
    }
  });

  /* ─── Accordion (About section) ─── */
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all items first
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

      // Toggle the clicked one
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // Open the first accordion by default
  document.querySelector('.accordion-item')?.classList.add('open');

  /* ─── Back to top ─── */
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── Scroll reveal ─── */
  const revealEls = document.querySelectorAll(
    '.flip-card, .facility-card, .section-header, .about-left, .accordion, .footer-brand, .footer-col'
  );
  revealEls.forEach((el, i) => {
    const parent = el.parentElement;
    const siblings = parent ? [...parent.children].filter(c =>
      c.classList.contains(el.classList[0])
    ) : [];
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${idx * 0.08}s`;
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─── Active nav highlight ─── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')
        || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
    // Mark Services active for sub-pages
    if (['laboratory.html', 'promotive.html', 'hospitals.html'].includes(currentPage)
        && href === 'index.html#services') {
      link.classList.add('active');
    }
  });

  /* ─── Org Structure Carousel & Lightbox ─── */
  const orgTrack = document.getElementById('org-carousel-track');
  const orgLeftArrow = document.querySelector('.org-arrow-left');
  const orgRightArrow = document.querySelector('.org-arrow-right');
  const orgSlides = document.querySelectorAll('.org-slide');
  
  if (orgTrack && orgSlides.length > 0) {
    // Arrow Navigation
    const getScrollAmount = () => {
      if (orgSlides[0]) {
        return orgSlides[0].offsetWidth + 24; // slide width + gap (1.5rem = 24px)
      }
      return orgTrack.clientWidth;
    };

    orgLeftArrow?.addEventListener('click', () => {
      orgTrack.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    orgRightArrow?.addEventListener('click', () => {
      orgTrack.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    // Drag-to-Swipe on Desktop
    let isDown = false;
    let startX;
    let scrollLeft;

    orgTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - orgTrack.offsetLeft;
      scrollLeft = orgTrack.scrollLeft;
    });

    orgTrack.addEventListener('mouseleave', () => {
      isDown = false;
    });

    orgTrack.addEventListener('mouseup', () => {
      isDown = false;
    });

    orgTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - orgTrack.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed multiplier
      orgTrack.scrollLeft = scrollLeft - walk;
    });

    // Lightbox Modal Setup
    const lightbox = document.getElementById('org-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && lightboxImg) {
      // Open Lightbox on slide click
      orgSlides.forEach(slide => {
        const img = slide.querySelector('.org-image');
        slide.addEventListener('click', () => {
          if (img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = 'flex';
            // Trigger reflow for active transition
            setTimeout(() => {
              lightbox.classList.add('active');
              lightbox.setAttribute('aria-hidden', 'false');
            }, 10);
            document.body.style.overflow = 'hidden'; // Prevent page scroll
          }
        });
      });

      // Close Lightbox
      const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore page scroll
        // Wait for fade transition before hiding display
        setTimeout(() => {
          if (!lightbox.classList.contains('active')) {
            lightbox.style.display = 'none';
            lightboxImg.src = ''; // Clear image src
          }
        }, 350);
      };

      lightboxClose?.addEventListener('click', closeLightbox);
      
      // Close on clicking backdrop (outside image)
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
          closeLightbox();
        }
      });

      // Close on ESC key press
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
  }

  console.log('Bohol Provincial Health Office — website loaded');
});

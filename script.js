/* ============================================================
   PORTFOLIO — Main JavaScript
   Pure vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
     ---------------------------------------------------------- */

  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  // Track mouse position with smooth trailing effect
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows immediately
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Outline trails with requestAnimationFrame for performance
  function animateCursorOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursorOutline);
  }
  animateCursorOutline();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .filter-btn, .skill-badge, .project-card, input, textarea'
  );

  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('cursor-hover');
      cursorOutline.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('cursor-hover');
      cursorOutline.classList.remove('cursor-hover');
    });
  });


  /* ----------------------------------------------------------
     2. NAVBAR — Scroll state & mobile toggle
     ---------------------------------------------------------- */

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  // Add/remove scrolled class based on scroll position
  function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navItems.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ----------------------------------------------------------
     3. ACTIVE NAV LINK — Highlight based on scroll position
     ---------------------------------------------------------- */

  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (!navLink) return;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });


  /* ----------------------------------------------------------
     4. REVEAL ON SCROLL — Intersection Observer
     ---------------------------------------------------------- */

  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve after revealing to save resources
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));


  /* ----------------------------------------------------------
     5. PROJECT FILTER
     ---------------------------------------------------------- */

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const tags = card.dataset.tags.split(',').map((t) => t.trim().toLowerCase());
        const shouldShow = filter === 'all' || tags.includes(filter.toLowerCase());

        if (shouldShow) {
          card.classList.remove('hidden');
          // Staggered re-animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ----------------------------------------------------------
     6. CONTACT FORM — Validation & success state
     ---------------------------------------------------------- */

  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous errors
      contactForm.querySelectorAll('.form-group').forEach((g) => g.classList.remove('error'));

      let isValid = true;

      // Validate name
      const nameField = document.getElementById('contact-name');
      if (!nameField.value.trim()) {
        nameField.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate email
      const emailField = document.getElementById('contact-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
        emailField.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate message
      const messageField = document.getElementById('contact-message');
      if (!messageField.value.trim()) {
        messageField.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        // Hide form, show success
        contactForm.style.display = 'none';
        formSuccess.classList.add('visible');
      }
    });
  }


  /* ----------------------------------------------------------
     7. SCROLL-TO-TOP BUTTON
     ---------------------------------------------------------- */

  const scrollTopBtn = document.getElementById('scroll-top');

  function handleScrollTop() {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
  }

  window.addEventListener('scroll', handleScrollTop, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ----------------------------------------------------------
     8. CURRENT YEAR IN FOOTER
     ---------------------------------------------------------- */

  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();

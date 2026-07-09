/* ==========================================================================
   THE ROYAL SPICE — Interactions
   Vanilla JS, no dependencies.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 1. Loading Screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loaded'), 500);
  });
  // Fallback in case 'load' fires slowly on slow networks
  setTimeout(() => loader && loader.classList.add('loaded'), 3500);

  /* ---------- 2. Sticky Navbar + Scroll Progress + Active Link ---------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTop');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Scroll progress bar
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    // Scroll to top visibility
    scrollTopBtn.classList.toggle('show', scrollY > 500);

    // Active nav link (based on section in view)
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 3. Mobile Hamburger Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 4. Smooth Scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- 5. Cursor Glow ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

  /* ---------- 6. Floating Gold Particles ---------- */
  const particlesContainer = document.getElementById('particles');
  const PARTICLE_COUNT = window.innerWidth < 700 ? 14 : 28;

  function createParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
    const duration = Math.random() * 10 + 10;
    p.style.animationDuration = `${duration}s`;
    p.style.animationDelay = `${Math.random() * 10}s`;
    p.style.opacity = Math.random() * 0.5 + 0.2;
    particlesContainer.appendChild(p);
  }
  for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

  /* ---------- 7. Scroll Reveal (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 8. Animated Counters ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => statsObserver.observe(el));

  /* ---------- 9. Menu Filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      menuCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- 10. Testimonial Slider ---------- */
  const track = document.getElementById('testimonialTrack');
  const testiCards = track ? track.children : [];
  const dotsContainer = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  let testiIndex = 0;
  let testiTimer;

  if (track && testiCards.length) {
    for (let i = 0; i < testiCards.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToTesti(i));
      dotsContainer.appendChild(dot);
    }

    function updateTesti() {
      track.style.transform = `translateX(-${testiIndex * 100}%)`;
      [...dotsContainer.children].forEach((d, i) => d.classList.toggle('active', i === testiIndex));
    }

    function goToTesti(i) {
      testiIndex = (i + testiCards.length) % testiCards.length;
      updateTesti();
      resetAutoplay();
    }

    function resetAutoplay() {
      clearInterval(testiTimer);
      testiTimer = setInterval(() => goToTesti(testiIndex + 1), 5500);
    }

    nextBtn.addEventListener('click', () => goToTesti(testiIndex + 1));
    prevBtn.addEventListener('click', () => goToTesti(testiIndex - 1));

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 50) goToTesti(testiIndex - 1);
      else if (diff < -50) goToTesti(testiIndex + 1);
    }, { passive: true });

    updateTesti();
    resetAutoplay();
  }

  /* ---------- 11. Reservation Form Validation ---------- */
  const form = document.getElementById('reservationForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    // Prevent past dates
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    function showError(input, message) {
      input.classList.add('invalid');
      const errorEl = document.getElementById(`err-${input.id}`);
      if (errorEl) errorEl.textContent = message;
    }

    function clearError(input) {
      input.classList.remove('invalid');
      const errorEl = document.getElementById(`err-${input.id}`);
      if (errorEl) errorEl.textContent = '';
    }

    function validateField(input) {
      const value = input.value.trim();

      if (input.hasAttribute('required') && !value) {
        showError(input, 'This field is required.');
        return false;
      }

      if (input.type === 'email' && value) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(value)) {
          showError(input, 'Please enter a valid email address.');
          return false;
        }
      }

      if (input.type === 'tel' && value) {
        const phoneRe = /^[+]?[\d\s-]{7,15}$/;
        if (!phoneRe.test(value)) {
          showError(input, 'Please enter a valid phone number.');
          return false;
        }
      }

      clearError(input);
      return true;
    }

    // live validation
    form.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      form.querySelectorAll('input[required], select[required]').forEach(input => {
        if (!validateField(input)) isValid = false;
      });

      if (isValid) {
        formSuccess.classList.add('show');
        form.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      } else {
        formSuccess.classList.remove('show');
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  /* ---------- 12. Button Ripple Effect ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- 13. Card Tilt Effect (menu & feature cards) ---------- */
  const tiltCards = document.querySelectorAll('.menu-card, .feature-card, .special-card');
  if (window.matchMedia('(hover: hover)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / rect.height) * -6;
        const rotateY = ((x - rect.width / 2) / rect.width) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- 14. Typing Effect for Hero Eyebrow (subtle) ---------- */
  const eyebrow = document.querySelector('.hero .eyebrow');
  if (eyebrow) {
    const fullText = eyebrow.textContent;
    eyebrow.textContent = '';
    let i = 0;
    function typeChar() {
      if (i <= fullText.length) {
        eyebrow.textContent = fullText.slice(0, i);
        i++;
        setTimeout(typeChar, 35);
      }
    }
    setTimeout(typeChar, 600);
  }

  /* ---------- 15. Order Button Feedback ---------- */
  document.querySelectorAll('.btn-order').forEach(btn => {
    btn.addEventListener('click', function () {
      const original = this.textContent;
      this.textContent = 'Added ✓';
      this.style.background = 'var(--primary)';
      this.style.color = 'var(--bg)';
      setTimeout(() => {
        this.textContent = original;
        this.style.background = '';
        this.style.color = '';
      }, 1400);
    });
  });

});
/* ===========================
   GROW WELL AI — main.js
   =========================== */

// --- Nav scroll effect ---
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// --- Mobile hamburger ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  const setMenu = (open) => {
    navLinks.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    setMenu(!navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Close on Escape for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) setMenu(false);
  });
}

// --- Scroll animations ---
const fadeEls = document.querySelectorAll('.card--service, .step, .result-card, .about__content, .about__visual, .section__header');

fadeEls.forEach(el => el.classList.add('fade-up'));

// Stagger siblings
document.querySelectorAll('.services__grid, .results__grid').forEach(grid => {
  grid.querySelectorAll('.card--service, .result-card').forEach((card, i) => {
    card.classList.add(`fade-up-delay-${Math.min(i + 1, 3)}`);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// --- Contact form (Web3Forms) ---
const form = document.getElementById('contact-form');
if (form) {
  // Reusable status element for success/error feedback
  let status = form.querySelector('.form-success');
  if (!status) {
    status = document.createElement('div');
    status.className = 'form-success';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);
  }
  const showStatus = (message, ok) => {
    status.textContent = message;
    status.classList.toggle('form-success--error', !ok);
    status.style.display = 'block';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Let the browser's native validation surface required/format errors first.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('.btn__text');
    const originalText = label.textContent;

    btn.disabled = true;
    label.textContent = 'Sending...';
    status.style.display = 'none';

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        label.textContent = 'Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #1a7a40, #4dde8a)';
        showStatus('Thanks! Ammon will be in touch within one business day.', true);
        form.reset();
        setTimeout(() => {
          btn.disabled = false;
          label.textContent = originalText;
          btn.style.background = '';
          status.style.display = 'none';
        }, 5000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      btn.disabled = false;
      label.textContent = originalText;
      showStatus(
        "Something went wrong sending your message. Please email ammon@growwellai.com directly and we'll get right back to you.",
        false
      );
    }
  });
}

// --- Footer year ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Smooth scroll for all anchor links ---
// (CSS scroll-behavior is the fallback; this adds a fixed-nav offset and,
// for a11y, moves keyboard focus to the target — e.g. the skip link.)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });

      // Move keyboard focus to the destination so assistive tech follows along.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});

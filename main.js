/* ===========================
   GROW WELL AI — main.js
   =========================== */

// --- Nav scroll effect ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// --- Mobile hamburger ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

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

// --- Contact form ---
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.querySelector('.btn__text').textContent;

    btn.disabled = true;
    btn.querySelector('.btn__text').textContent = 'Sending...';

    // Simulate submission (replace with real endpoint)
    setTimeout(() => {
      btn.querySelector('.btn__text').textContent = 'Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #1a7a40, #4dde8a)';

      // Show success message
      let success = form.querySelector('.form-success');
      if (!success) {
        success = document.createElement('div');
        success.className = 'form-success';
        success.textContent = "Thanks! Ammon will be in touch within one business day.";
        form.appendChild(success);
      }
      success.style.display = 'block';

      // Reset after delay
      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.querySelector('.btn__text').textContent = originalText;
        btn.style.background = '';
        success.style.display = 'none';
      }, 4000);
    }, 1000);
  });
}

// --- Smooth scroll for all anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

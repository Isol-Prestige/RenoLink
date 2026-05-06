/* ═══════════════════════════════════════
   RENOLINK — main.js
   Scripts partagés sur toutes les pages
   ═══════════════════════════════════════ */

// ── Navbar scroll ──
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Reveal on scroll ──
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), i * 60);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

// ── Menu burger ──
function initBurger() {
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('navMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fermer si clic extérieur
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });

  // Fermer sur scroll
  window.addEventListener('scroll', () => {
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  }, { passive: true });

  // Fermer sur clic lien du menu
  menu.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Parcours tabs accueil ──
function switchTab(tab, el) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const client  = document.getElementById('tab-client');
  const artisan = document.getElementById('tab-artisan');
  if (client)  client.style.display  = tab === 'client'  ? 'block' : 'none';
  if (artisan) artisan.style.display = tab === 'artisan' ? 'block' : 'none';
}

// ── Hero type selector ──
function selectHcType(el) {
  document.querySelectorAll('.hc-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// ════════════════════════════════════════
// INIT UNIQUE — un seul DOMContentLoaded
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initBurger();
});

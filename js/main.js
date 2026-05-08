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
function openMobileMenu() {
  document.getElementById('navMenu')?.classList.add('open');
  document.getElementById('navOverlay')?.classList.add('open');
  document.getElementById('navBurger')?.classList.add('open');
  document.getElementById('navBurger')?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  document.getElementById('navMenu')?.classList.remove('open');
  document.getElementById('navOverlay')?.classList.remove('open');
  document.getElementById('navBurger')?.classList.remove('open');
  document.getElementById('navBurger')?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function toggleMobileMenu() {
  const menu = document.getElementById('navMenu');
  if (!menu) return;
  menu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
}

function initBurger() {
  const burger = document.getElementById('navBurger');
  if (!burger) return;

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Fermer liens du menu
  document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(el => {
    el.addEventListener('click', closeMobileMenu);
  });

  // Fermer sur scroll
  window.addEventListener('scroll', () => {
    if (document.getElementById('navMenu')?.classList.contains('open')) {
      closeMobileMenu();
    }
  }, { passive: true });
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
// INIT UNIQUE
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initBurger();
});

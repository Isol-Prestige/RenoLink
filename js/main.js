/* ═══════════════════════════════════════
   RENOLINK — main.js
   Scripts partagés sur toutes les pages
   ═══════════════════════════════════════ */

// ── Navbar scroll effect ──
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
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

// ── Parcours tabs (accueil) ──
function switchTab(tab, el) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const client  = document.getElementById('tab-client');
  const artisan = document.getElementById('tab-artisan');
  if (client)  client.style.display  = tab === 'client'  ? 'block' : 'none';
  if (artisan) artisan.style.display = tab === 'artisan' ? 'block' : 'none';
}

// ── Hero type selector (accueil) ──
function selectHcType(el) {
  document.querySelectorAll('.hc-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// ── Init global ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initNavigation(); // ← ICI

  function initNavigation() {
    document.querySelectorAll('[data-link]').forEach(el => {
      el.addEventListener('click', () => {
        const url = el.dataset.link;
        if (url) window.location.href = url;
      });
    });

    document.querySelectorAll('[data-scroll]').forEach(el => {
      el.addEventListener('click', () => {
        const target = document.querySelector(el.dataset.scroll);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
});
//-- Menu burger--//
function initBurger() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('navMenu');

  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initNavigation();
  initBurger(); // obligatoire
});

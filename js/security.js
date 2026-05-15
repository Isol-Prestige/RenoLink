/* ═══════════════════════════════════════════
   RENOLINK — security.js
   Sécurité, sanitisation, session, protection XSS
   ═══════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════
// DÉTECTION ENVIRONNEMENT
// ══════════════════════════════════════════
const IS_DEV = (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.includes('github.io') ||
  window.location.hostname.includes('netlify.app')
);

// ══════════════════════════════════════════
// PROTECTION CONSOLE EN PRODUCTION
// ══════════════════════════════════════════
if (!IS_DEV) {
  const noop = () => {};
  ['log', 'warn', 'info', 'debug', 'table', 'dir'].forEach(m => {
    if (console[m]) console[m] = noop;
  });
  // Garder console.error pour débogage critique silencieux
}

// ══════════════════════════════════════════
// PROTECTION INSPECTION EN PRODUCTION
// ══════════════════════════════════════════
if (!IS_DEV) {
  // Bloquer clic droit
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Bloquer raccourcis DevTools
  document.addEventListener('keydown', e => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === 'U')
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });
}

// ══════════════════════════════════════════
// ANTI-XSS — SANITISATION
// ══════════════════════════════════════════

/**
 * Échappe les caractères HTML dangereux
 * À utiliser pour tout texte inséré dans le DOM via innerHTML
 */
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Échappe pour usage dans attributs HTML (onclick, href, etc.)
 */
function escAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;');
}

/**
 * Sanitise une chaîne en supprimant les balises HTML et scripts
 * À utiliser pour les données saisies dans les formulaires
 */
function sanitize(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')         // supprimer toutes les balises
    .replace(/javascript:/gi, '')    // supprimer javascript:
    .replace(/on\w+\s*=/gi, '')      // supprimer les event handlers inline
    .replace(/data:/gi, '')          // supprimer data: URIs (sauf images après vérification)
    .trim();
}

/**
 * Valide qu'un dataURL est bien une image (pas un SVG avec script)
 * Utilisé avant d'afficher une image uploadée
 */
function isValidImageDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return false;
  // Accepter uniquement jpeg, png, webp, gif — pas svg (risque XSS)
  return /^data:image\/(jpeg|jpg|png|webp|gif);base64,/.test(dataUrl);
}

// ══════════════════════════════════════════
// SESSION SIMPLE (localStorage)
// ══════════════════════════════════════════
// En production → Firebase Auth
// Ici : protection basique MVP

const SESSION_KEY = 'rl_admin_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 heures

function setSession(email) {
  const session = {
    email:     maskEmail(email),
    loginAt:   Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
    token:     generateToken(),
  };
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    // sessionStorage indisponible (mode privé strict)
  }
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Vérifier expiration
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {}
}

function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = '/pages/connexion.html';
    return false;
  }
  return true;
}

// Renouveler la session à chaque interaction
function renewSession() {
  const session = getSession();
  if (session) {
    session.expiresAt = Date.now() + SESSION_DURATION_MS;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {}
  }
}

// ══════════════════════════════════════════
// UTILITAIRES SÉCURITÉ
// ══════════════════════════════════════════

/**
 * Génère un token simple (non cryptographique — pour MVP)
 * En production → Firebase Auth UID
 */
function generateToken() {
  const arr = new Uint32Array(4);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(arr);
  } else {
    // Fallback non sécurisé si crypto indisponible
    for (let i = 0; i < 4; i++) arr[i] = Math.floor(Math.random() * 0xFFFFFFFF);
  }
  return Array.from(arr).map(n => n.toString(16).padStart(8, '0')).join('');
}

/**
 * Masque une adresse email pour l'affichage
 * ex: jean.martin@email.fr → je***@email.fr
 */
function maskEmail(email) {
  if (!email || !email.includes('@')) return '***';
  const [user, domain] = email.split('@');
  const masked = user.substring(0, 2) + '***';
  return masked + '@' + domain;
}

/**
 * Masque un numéro de téléphone
 * ex: 0612345678 → 06 12 ** ** 78
 */
function maskPhone(tel) {
  if (!tel) return '—';
  const t = tel.replace(/\D/g, '');
  if (t.length >= 10) {
    return t.substring(0,2) + ' ' + t.substring(2,4) + ' ** ** ' + t.substring(8,10);
  }
  return tel;
}

// ══════════════════════════════════════════
// RATE LIMITING ACTIONS (anti-spam basique)
// ══════════════════════════════════════════
const actionCounts = {};
const ACTION_LIMIT = 20; // 20 actions max par minute
const ACTION_WINDOW_MS = 60 * 1000;

function checkRateLimit(action) {
  const now = Date.now();
  if (!actionCounts[action]) {
    actionCounts[action] = { count: 1, windowStart: now };
    return true;
  }
  const ac = actionCounts[action];
  if (now - ac.windowStart > ACTION_WINDOW_MS) {
    // Nouvelle fenêtre
    ac.count = 1;
    ac.windowStart = now;
    return true;
  }
  ac.count++;
  if (ac.count > ACTION_LIMIT) {
    console.warn('[RenoLink] Rate limit atteint pour :', action);
    return false;
  }
  return true;
}

// ══════════════════════════════════════════
// TOAST (partagé avec dashboard-admin.js)
// ══════════════════════════════════════════
function toast(msg, type = 'info') {
  // Anti-XSS : message en textContent, pas innerHTML
  const t = document.getElementById('toast');
  if (!t) return;
  const colors = {
    success: { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' },
    error:   { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
    info:    { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
  }[type] || { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' };

  t.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${colors.bg};color:${colors.color};
    border:1px solid ${colors.border};
    padding:12px 18px;border-radius:10px;
    font-size:.8rem;font-weight:600;
    box-shadow:0 8px 24px rgba(0,0,0,.12);
    max-width:340px;line-height:1.4;display:block;
    animation:slideUp .25s ease;`;
  t.textContent = msg; // textContent = pas de XSS

  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.display = 'none'; }, 4500);
}

// ══════════════════════════════════════════
// CALCUL COMMISSION
// ══════════════════════════════════════════
const COMMISSION_RATE = 0.08;

function calcCommission(montant) {
  if (typeof montant !== 'number' || montant < 0) return 0;
  return Math.round(montant * COMMISSION_RATE);
}

// ══════════════════════════════════════════
// RENOUVELLEMENT SESSION SUR ACTIVITÉ
// ══════════════════════════════════════════
document.addEventListener('click', renewSession, { passive: true });
document.addEventListener('keydown', renewSession, { passive: true });

// ══════════════════════════════════════════
// LOG D'ACTIONS (audit trail MVP)
// En production → Firestore collection "logs"
// ══════════════════════════════════════════
const auditLog = [];

function logAction(action, details = {}) {
  const entry = {
    action,
    details,
    timestamp: new Date().toISOString(),
    session:   getSession()?.token || 'anon',
  };
  auditLog.push(entry);
  // Max 200 entrées en mémoire
  if (auditLog.length > 200) auditLog.shift();
}

// Exporter le log (admin uniquement)
function exportAuditLog() {
  if (!getSession()) return;
  const blob = new Blob(
    [JSON.stringify(auditLog, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href    = url;
  a.download = 'renolink-audit-' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

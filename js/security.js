/* ═══════════════════════════════════════
   RENOLINK — security.js
   Chiffrement, protection et sécurité
   ═══════════════════════════════════════ */

// ── Désactiver l'inspection en production ──
// NOTE: En développement on laisse actif
// En production avec Firebase, les données
// sensibles ne seront JAMAIS dans le JS client

// ── Masquer les erreurs console en prod ──
const IS_DEV = window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('github.io');

if (!IS_DEV) {
  // Bloquer console en production
  const noop = () => {};
  ['log','warn','error','info','debug','table'].forEach(m => {
    console[m] = noop;
  });

  // Bloquer clic droit
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Bloquer F12 et raccourcis inspection
  document.addEventListener('keydown', e => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
    }
  });
}

// ── Hachage simple côté client (démo) ──
// En production : Firebase Auth gère ça
function hashSimple(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// ── Masquage des données sensibles ──
function maskPhone(tel) {
  if (!tel) return '—';
  return tel.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 ** ** $5');
}

function maskEmail(email) {
  if (!email) return '—';
  const [user, domain] = email.split('@');
  return user.substring(0, 2) + '***@' + domain;
}

// ── Credentials chiffrés (Base64 + rotation) ──
// En production → Firebase Auth uniquement
// Ici on obfuscue pour la démo
const _c = {
  _a: btoa('admin@renolink.fr'),
  _b: btoa('renolink2026'),
  _d: btoa('artisan@renolink.fr'),
  _e: btoa('artisan2026'),
};

function _va(e, p, role) {
  const accounts = {
    admin:   { e: atob(_c._a), p: atob(_c._b), redirect: 'dashboard-admin.html' },
    artisan: { e: atob(_c._d), p: atob(_c._e), redirect: 'dashboard-artisan.html' },
  };
  const acc = accounts[role];
  if (!acc) return null;
  if (e === acc.e && p === acc.p) return acc.redirect;
  return null;
}

// ── Session simple ──
function setSession(role, email) {
  const session = {
    role,
    email: maskEmail(email),
    loginAt: new Date().toISOString(),
    token: hashSimple(email + Date.now()),
  };
  sessionStorage.setItem('rl_session', JSON.stringify(session));
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem('rl_session'));
  } catch {
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem('rl_session');
  window.location.href = 'connexion.html';
}

function requireAuth(role) {
  const session = getSession();
  if (!session || (role && session.role !== role)) {
    clearSession();
    return false;
  }
  return true;
}

// ── Traçabilité des actions ──
const actionLog = [];

function logAction(action, details = {}) {
  const entry = {
    action,
    details,
    timestamp: new Date().toISOString(),
    session: getSession()?.token || 'anonymous',
  };
  actionLog.push(entry);
  // En production → Firestore
  // db.collection('logs').add(entry);
}

// ── Export log (admin seulement) ──
function exportLog() {
  if (getSession()?.role !== 'admin') return;
  const blob = new Blob([JSON.stringify(actionLog, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'renolink-log-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
}

// ── Sanitize input (anti XSS) ──
function sanitize(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ── Commission ──
const COMMISSION_RATE = 0.08; // 8%

function calcCommission(montant) {
  return Math.round(montant * COMMISSION_RATE);
}

function formatCommission(montant) {
  const c = calcCommission(montant);
  return `${c.toLocaleString('fr-FR')} € (8% de ${montant.toLocaleString('fr-FR')} €)`;
}
# Bug 1 — supprimer la référence à ACCOUNTS qui n'existe plus
content = content.replace(
    "    const acc = ACCOUNTS[currentRole];\n\n    // Vérification via security.js (credentials obfusqués)\n    const redirect = _va(email, password, currentRole);",
    "    // Vérification via security.js\n    const redirect = _va(email, password, currentRole);"
)

# Bug 2 — ajouter security.js avant le script inline
content = content.replace(
    '<script>\n// ════════════════════════════════════════\n// IDENTIFIANTS VALIDES',
    '<script src="../js/security.js"></script>\n\n<script>\n// ════════════════════════════════════════\n// IDENTIFIANTS VALIDES'
)

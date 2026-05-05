/* ═══════════════════════════════════════
   RENOLINK — dashboard-admin.js
   Logique du dashboard administrateur
   ═══════════════════════════════════════ */

// ════════════════════════════════════════
// DONNÉES DE DÉMONSTRATION
// ════════════════════════════════════════

const dossiers = [
  {
    id: 'RL-2026-047',
    type: 'Salle de bain complète',
    client: { nom: 'Martin Jean', tel: '06 12 34 56 78', email: 'jean.martin@email.fr', pref: 'Téléphone' },
    ville: 'Nancy', cp: '54000',
    budget: 11000, delai: 'Dans 1 à 3 mois',
    surface: '7,5 m²', typeBien: 'Appartement',
    description: 'Rénovation complète salle de bain 7,5m². Dépose baignoire, pose douche italienne, nouveau carrelage sol et murs, remplacement lavabo et robinetterie. 3ème étage sans ascenseur.',
    statut: 'nouveau', priorite: 'haute',
    date: '2026-04-28', heure: '14h32',
    photos: ['🛁', '🚿', '🪥'],
    notes: '',
    artisansContactes: [],
  },
  {
    id: 'RL-2026-046',
    type: 'Isolation thermique ITE',
    client: { nom: 'Dupont Marie', tel: '06 98 76 54 32', email: 'marie.dupont@email.fr', pref: 'Email' },
    ville: 'Metz', cp: '57000',
    budget: 18500, delai: 'Dans 3 à 6 mois',
    surface: '120 m²', typeBien: 'Maison individuelle',
    description: 'Isolation thermique par l\'extérieur sur maison de 120m² construite en 1972. Façades nord et sud prioritaires. Client éligible MaPrimeRénov\'. Cherche artisan RGE.',
    statut: 'en-cours', priorite: 'normale',
    date: '2026-04-27', heure: '09h15',
    photos: ['🏠', '🧱'],
    notes: 'Client appelé le 27/04 — budget confirmé. Cherche artisan RGE certifié ITE. À envoyer à Thermique Est et Müller Réno.',
    artisansContactes: ['THERMIQUE EST'],
  },
  {
    id: 'RL-2026-045',
    type: 'Rénovation cuisine',
    client: { nom: 'Bernard Sophie', tel: '07 11 22 33 44', email: 'sophie.bernard@email.fr', pref: 'SMS' },
    ville: 'Nancy', cp: '54000',
    budget: 9500, delai: 'Dans 1 à 3 mois',
    surface: '14 m²', typeBien: 'Maison individuelle',
    description: 'Rénovation complète cuisine 14m². Dépose ancienne cuisine, pose nouvelle cuisine fournie par client, carrelage sol, peinture, nouvelle hotte et électroménager encastré.',
    statut: 'valide', priorite: 'normale',
    date: '2026-04-26', heure: '16h48',
    photos: ['🍳', '🪟'],
    notes: 'Dossier complet. Budget réaliste. Client sérieux — propriétaire.',
    artisansContactes: [],
  },
  {
    id: 'RL-2026-044',
    type: 'Pompe à chaleur air/eau',
    client: { nom: 'Leroy Pierre', tel: '06 55 44 33 22', email: 'pierre.leroy@email.fr', pref: 'Téléphone' },
    ville: 'Épinal', cp: '88000',
    budget: 14000, delai: 'Dès que possible',
    surface: '160 m²', typeBien: 'Maison individuelle',
    description: 'Remplacement chaudière fioul par pompe à chaleur air/eau. Maison 160m² de 1985. Radiateurs existants à conserver. Client éligible CEE et MaPrimeRénov\'.',
    statut: 'envoye', priorite: 'haute',
    date: '2026-04-25', heure: '11h20',
    photos: ['🔥', '🏠'],
    notes: 'Envoyé à Thermique Est le 25/04. En attente de retour artisan.',
    artisansContactes: ['THERMIQUE EST', 'PAC PRO 88'],
  },
  {
    id: 'RL-2026-043',
    type: 'Toiture complète',
    client: { nom: 'Schmitt Alain', tel: '06 77 88 99 00', email: 'alain.schmitt@email.fr', pref: 'Téléphone' },
    ville: 'Metz', cp: '57000',
    budget: 22000, delai: 'Dans 1 à 3 mois',
    surface: '180 m²', typeBien: 'Maison individuelle',
    description: 'Réfection complète toiture tuile. 180m² de surface. Remplacement velux x3. Traitement charpente préventif. Maison de 1965.',
    statut: 'signe', priorite: 'normale',
    date: '2026-04-20', heure: '08h45',
    photos: ['🏠', '🏗️'],
    notes: 'Chantier signé avec Couverture Lorraine le 22/04. Commission 5% = 1 100€ à facturer.',
    artisansContactes: ['COUVERTURE LORRAINE'],
  },
  {
    id: 'RL-2026-042',
    type: 'Peinture intérieure',
    client: { nom: 'Morel Céline', tel: '07 33 44 55 66', email: 'celine.morel@email.fr', pref: 'Email' },
    ville: 'Verdun', cp: '55100',
    budget: 2800, delai: 'Dans le mois',
    surface: '80 m²', typeBien: 'Appartement',
    description: 'Peinture complète appartement T3 80m². 3 pièces + couloir. Murs et plafonds. Peinture fournie par le client.',
    statut: 'rejete', priorite: 'basse',
    date: '2026-04-18', heure: '15h10',
    photos: ['🎨'],
    notes: 'Budget trop serré pour la zone. Client informé que le budget est en dessous du marché.',
    artisansContactes: [],
  },
];

// ════════════════════════════════════════
// ÉTAT DU DASHBOARD
// ════════════════════════════════════════

const adminState = {
  currentPage:    'dossiers',
  filtreStatut:   'tous',
  filtrePriorite: 'tous',
  recherche:      '',
  dossierActif:   null,
};

// ════════════════════════════════════════
// NAVIGATION PAGES
// ════════════════════════════════════════

function showPage(page, el) {
  // Cacher toutes les pages
  document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));

  // Désactiver tous les nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Afficher la page
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.remove('hidden');

  // Activer le nav item
  if (el) el.classList.add('active');

  adminState.currentPage = page;

  // Mettre à jour le titre
  updateTopbar(page);
}

function updateTopbar(page) {
  const titles = {
    dossiers:  { title: 'Gestion des dossiers', sub: 'Tous les projets clients' },
    artisans:  { title: 'Réseau artisans', sub: 'Gestion et vérification' },
    commissions: { title: 'Commissions', sub: 'Suivi des revenus' },
    stats:     { title: 'Statistiques', sub: 'Performance de la plateforme' },
    parametres:{ title: 'Paramètres', sub: 'Configuration du compte' },
  };
  const t = titles[page] || titles.dossiers;
  const titleEl = document.getElementById('topbarTitle');
  const subEl   = document.getElementById('topbarSub');
  if (titleEl) titleEl.textContent = t.title;
  if (subEl)   subEl.textContent   = t.sub;
}

// ════════════════════════════════════════
// FILTRES DOSSIERS
// ════════════════════════════════════════

function setFiltreStatut(statut, el) {
  adminState.filtreStatut = statut;
  document.querySelectorAll('.filter-btn[data-statut]').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderDossiers();
}

function setFiltrePriorite(val) {
  adminState.filtrePriorite = val;
  renderDossiers();
}

function handleRecherche(val) {
  adminState.recherche = val.toLowerCase();
  renderDossiers();
}

function getDossiersFiltres() {
  return dossiers.filter(d => {
    const matchStatut    = adminState.filtreStatut === 'tous' || d.statut === adminState.filtreStatut;
    const matchPriorite  = adminState.filtrePriorite === 'tous' || d.priorite === adminState.filtrePriorite;
    const matchRecherche = !adminState.recherche ||
      d.id.toLowerCase().includes(adminState.recherche) ||
      d.type.toLowerCase().includes(adminState.recherche) ||
      d.client.nom.toLowerCase().includes(adminState.recherche) ||
      d.ville.toLowerCase().includes(adminState.recherche);
    return matchStatut && matchPriorite && matchRecherche;
  });
}

// ════════════════════════════════════════
// RENDU DOSSIERS
// ════════════════════════════════════════

function statutLabel(s) {
  const labels = {
    'nouveau':  { text: '🔵 Nouveau',   cls: 'statut-nouveau' },
    'en-cours': { text: '🟡 En cours',  cls: 'statut-en-cours' },
    'valide':   { text: '✅ Validé',    cls: 'statut-valide' },
    'envoye':   { text: '📤 Envoyé',    cls: 'statut-envoye' },
    'signe':    { text: '🤝 Signé',     cls: 'statut-signe' },
    'rejete':   { text: '❌ Rejeté',    cls: 'statut-rejete' },
    'expire':   { text: '⏰ Expiré',    cls: 'statut-expire' },
  };
  return labels[s] || { text: s, cls: '' };
}

function prioriteLabel(p) {
  const labels = {
    haute:   { text: '🔴 Haute',   cls: 'priorite-haute' },
    normale: { text: '🟡 Normale', cls: 'priorite-normale' },
    basse:   { text: '⚪ Basse',   cls: 'priorite-basse' },
  };
  return labels[p] || { text: p, cls: '' };
}

function renderDossiers() {
  const tbody   = document.getElementById('dossiersBody');
  const counter = document.getElementById('dossiersCount');
  if (!tbody) return;

  const filtered = getDossiersFiltres();
  if (counter) counter.textContent = filtered.length + ' dossier(s)';

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;padding:60px 20px;text-align:center;">
        <div style="font-size:2.5rem;margin-bottom:12px;">📭</div>
        <h3 style="font-size:1rem;font-weight:600;margin-bottom:6px;">Aucun dossier trouvé</h3>
        <p style="font-size:0.82rem;color:var(--muted);">Modifiez vos filtres pour voir plus de résultats</p>
      </div>`;
    return;
  }

  tbody.innerHTML = filtered.map(d => {
    const st = statutLabel(d.statut);
    const pr = prioriteLabel(d.priorite);
    return `
      <div class="table-row" onclick="openDossier('${d.id}')">
        <div class="table-cell dossier-ref">${d.id}</div>
        <div class="table-cell">
          <div class="dossier-info">
            <h4>${d.type}</h4>
            <p>${d.client.nom} · ${d.ville} (${d.cp})</p>
          </div>
        </div>
        <div class="table-cell">
          <span class="statut ${st.cls}">${st.text}</span>
        </div>
        <div class="table-cell">
          <span class="priorite ${pr.cls}">${pr.text}</span>
        </div>
        <div class="table-cell" style="font-weight:600;color:var(--gold);">
          ${d.budget.toLocaleString('fr-FR')} €
        </div>
        <div class="table-cell" style="color:var(--muted);font-size:0.75rem;">
          ${d.date}<br>${d.heure}
        </div>
        <div class="table-cell">
          <div class="row-actions" onclick="event.stopPropagation()">
            <button class="action-btn" title="Voir le dossier" onclick="openDossier('${d.id}')">👁️</button>
            <button class="action-btn" title="Appeler le client" onclick="callClient('${d.id}')">📞</button>
            <button class="action-btn" title="Envoyer à un artisan" onclick="sendToArtisan('${d.id}')">📤</button>
            <button class="action-btn danger" title="Rejeter" onclick="rejectDossier('${d.id}')">❌</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ════════════════════════════════════════
// MODAL DOSSIER
// ════════════════════════════════════════

function openDossier(id) {
  const d = dossiers.find(x => x.id === id);
  if (!d) return;

  adminState.dossierActif = d;
  const st = statutLabel(d.statut);

  // Remplir le modal
  document.getElementById('modalTitle').textContent = d.type;
  document.getElementById('modalRef').textContent   = d.id;

  // Informations client
  document.getElementById('mClientNom').textContent    = d.client.nom;
  document.getElementById('mClientTel').textContent    = d.client.tel;
  document.getElementById('mClientEmail').textContent  = d.client.email;
  document.getElementById('mClientPref').textContent   = d.client.pref;

  // Projet
  document.getElementById('mType').textContent    = d.type;
  document.getElementById('mVille').textContent   = d.ville + ' (' + d.cp + ')';
  document.getElementById('mSurface').textContent = d.surface;
  document.getElementById('mBien').textContent    = d.typeBien;
  document.getElementById('mBudget').textContent  = d.budget.toLocaleString('fr-FR') + ' €';
  document.getElementById('mDelai').textContent   = d.delai;
  document.getElementById('mDesc').textContent    = d.description;
  document.getElementById('mStatut').innerHTML    = `<span class="statut ${st.cls}">${st.text}</span>`;
  document.getElementById('mDate').textContent    = d.date + ' à ' + d.heure;

  // Photos
  const photosEl = document.getElementById('mPhotos');
  photosEl.innerHTML = d.photos.map(p =>
    `<div class="modal-photo">${p}</div>`
  ).join('');

  // Notes admin
  document.getElementById('mNotes').value = d.notes;

  // Artisans contactés
  const artisansEl = document.getElementById('mArtisans');
  if (d.artisansContactes.length > 0) {
    artisansEl.innerHTML = d.artisansContactes.map(a => `
      <div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid #F5F2ED;font-size:0.82rem;">
        <span>🔨</span>
        <span style="font-weight:600;">${a}</span>
        <span class="statut statut-envoye" style="margin-left:auto;">📤 Contacté</span>
      </div>
    `).join('');
  } else {
    artisansEl.innerHTML = `<p style="font-size:0.8rem;color:var(--muted);padding:10px 0;">Aucun artisan contacté pour ce dossier.</p>`;
  }

  // Timeline
  renderTimeline(d);

  // Ouvrir le modal
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';

  // Sauvegarder les notes
  if (adminState.dossierActif) {
    const notes = document.getElementById('mNotes').value;
    const d = dossiers.find(x => x.id === adminState.dossierActif.id);
    if (d) d.notes = notes;
  }
  adminState.dossierActif = null;
}

function renderTimeline(d) {
  const steps = [
    { label: 'Dossier reçu', desc: 'Client a déposé le projet', done: true, time: d.date + ' · ' + d.heure },
    { label: 'Qualification', desc: 'Analyse et validation du dossier', done: ['en-cours','valide','envoye','signe'].includes(d.statut), active: d.statut === 'nouveau' },
    { label: 'Validé & Enrichi', desc: 'Dossier complété et prêt', done: ['valide','envoye','signe'].includes(d.statut) },
    { label: 'Envoyé aux artisans', desc: 'Mise en relation déclenchée', done: ['envoye','signe'].includes(d.statut) },
    { label: 'Chantier signé', desc: 'Commission à facturer', done: d.statut === 'signe' },
  ];

  const tlEl = document.getElementById('mTimeline');
  tlEl.innerHTML = steps.map(s => `
    <div class="timeline-item">
      <div class="timeline-dot ${s.done ? 'done' : s.active ? 'active' : 'pending'}">
        ${s.done ? '✓' : s.active ? '●' : '○'}
      </div>
      <div class="timeline-content">
        <h5>${s.label}</h5>
        <p>${s.desc}</p>
        ${s.time ? `<div class="time">${s.time}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// ════════════════════════════════════════
// ACTIONS SUR DOSSIER
// ════════════════════════════════════════

function changeStatut(newStatut) {
  if (!adminState.dossierActif) return;
  const d = dossiers.find(x => x.id === adminState.dossierActif.id);
  if (!d) return;

  d.statut = newStatut;
  adminState.dossierActif.statut = newStatut;

  // Mettre à jour l'affichage dans le modal
  const st = statutLabel(newStatut);
  document.getElementById('mStatut').innerHTML = `<span class="statut ${st.cls}">${st.text}</span>`;

  // Mettre à jour la timeline
  renderTimeline(d);

  // Rafraîchir la liste
  renderDossiers();

  showNotif('Statut mis à jour : ' + st.text, 'success');
}

function callClient(id) {
  const d = dossiers.find(x => x.id === id);
  if (d) showNotif('📞 Appel de ' + d.client.nom + ' — ' + d.client.tel, 'info');
}

function sendToArtisan(id) {
  const d = dossiers.find(x => x.id === id);
  if (d) {
    openDossier(id);
    setTimeout(() => showNotif('📤 Utilisez les boutons dans le dossier pour envoyer aux artisans', 'info'), 500);
  }
}

function rejectDossier(id) {
  if (confirm('Confirmer le rejet du dossier ' + id + ' ?')) {
    const d = dossiers.find(x => x.id === id);
    if (d) {
      d.statut = 'rejete';
      renderDossiers();
      showNotif('Dossier rejeté : ' + id, 'error');
    }
  }
}

function validerDossier() {
  changeStatut('valide');
  showNotif('✅ Dossier validé — prêt à être envoyé aux artisans', 'success');
}

function envoyerArtisan() {
  if (!adminState.dossierActif) return;
  const d = dossiers.find(x => x.id === adminState.dossierActif.id);
  if (d) {
    d.statut = 'envoye';
    changeStatut('envoye');
    showNotif('📤 Dossier envoyé aux artisans sélectionnés', 'success');
  }
}

function marquerSigne() {
  if (!adminState.dossierActif) return;
  const commission = adminState.dossierActif.budget * 0.05;
  changeStatut('signe');
  showNotif('🤝 Chantier signé ! Commission à facturer : ' + commission.toLocaleString('fr-FR') + ' €', 'success');
}

function saveNotes() {
  if (!adminState.dossierActif) return;
  const notes = document.getElementById('mNotes').value;
  const d = dossiers.find(x => x.id === adminState.dossierActif.id);
  if (d) {
    d.notes = notes;
    showNotif('Notes sauvegardées', 'success');
  }
}

// ════════════════════════════════════════
// NOTIFICATIONS TOAST
// ════════════════════════════════════════

function showNotif(message, type = 'info') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const colors = {
    success: { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' },
    error:   { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
    info:    { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${c.bg};color:${c.color};border:1px solid ${c.border};
    padding:12px 20px;border-radius:10px;font-size:0.82rem;font-weight:600;
    box-shadow:0 8px 24px rgba(0,0,0,0.12);
    animation:slideUp 0.3s ease;
    max-width:360px;line-height:1.4;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ════════════════════════════════════════
// KPI CARDS
// ════════════════════════════════════════

function renderKPIs() {
  const total    = dossiers.length;
  const nouveau  = dossiers.filter(d => d.statut === 'nouveau').length;
  const signe    = dossiers.filter(d => d.statut === 'signe').length;
  const ca       = dossiers.filter(d => d.statut === 'signe').reduce((s, d) => s + d.budget * 0.05, 0);

  const kpiTotal  = document.getElementById('kpiTotal');
  const kpiNew    = document.getElementById('kpiNew');
  const kpiSigne  = document.getElementById('kpiSigne');
  const kpiCA     = document.getElementById('kpiCA');

  if (kpiTotal) kpiTotal.textContent = total;
  if (kpiNew)   kpiNew.textContent   = nouveau;
  if (kpiSigne) kpiSigne.textContent = signe;
  if (kpiCA)    kpiCA.textContent    = ca.toLocaleString('fr-FR') + ' €';
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  renderKPIs();
  renderDossiers();

  // Fermer modal en cliquant sur l'overlay
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  // Raccourci Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});

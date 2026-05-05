/* ═══════════════════════════════════════
   RENOLINK — dashboard-artisan.js
   Logique du tableau de bord artisan
   ═══════════════════════════════════════ */

// ════════════════════════════════════════
// DONNÉES DE DÉMONSTRATION
// ════════════════════════════════════════

const artisan = {
  nom: 'RENOV HABITAT',
  metier: 'Rénovation intérieure · Nancy',
  ville: 'Nancy (54)',
  note: 4.9,
  nbAvis: 27,
  certifications: ['RGE', 'Qualibat', 'ITE'],
  abonnement: { statut: 'fondateur', fin: '2027-04-01', prix: 0 },
};

const leadsDisponibles = [
  {
    id: 'RL-2026-047',
    type: 'urgent',
    titre: 'Rénovation salle de bain complète',
    ville: 'Nancy', cp: '54000',
    surface: '7,5 m²',
    budget: 11000,
    delai: 'Dans 1 à 3 mois',
    description: 'Dépose baignoire, pose douche italienne, carrelage sol/murs, lavabo. 3ème étage sans ascenseur.',
    slots: 1,
    slotsMax: 3,
    photos: ['🛁', '🚿'],
    statut: 'disponible',
  },
  {
    id: 'RL-2026-045',
    type: 'nouveau',
    titre: 'Rénovation cuisine complète',
    ville: 'Nancy', cp: '54000',
    surface: '14 m²',
    budget: 9500,
    delai: 'Dans 1 à 3 mois',
    description: 'Dépose ancienne cuisine, pose nouvelle cuisine fournie, carrelage sol, peinture, hotte encastrée.',
    slots: 0,
    slotsMax: 3,
    photos: ['🍳'],
    statut: 'disponible',
  },
  {
    id: 'RL-2026-042',
    type: 'standard',
    titre: 'Peinture intérieure appartement T3',
    ville: 'Verdun', cp: '55100',
    surface: '80 m²',
    budget: 2800,
    delai: 'Dans le mois',
    description: '3 pièces + couloir. Murs et plafonds. Peinture fournie par le client.',
    slots: 2,
    slotsMax: 3,
    photos: ['🎨'],
    statut: 'disponible',
  },
];

const mesDossiers = [
  {
    id: 'RL-2026-044',
    titre: 'Pompe à chaleur air/eau',
    ville: 'Épinal (88)',
    budget: 14000,
    statut: 'en-contact',
    date: '25/04/2026',
  },
  {
    id: 'RL-2026-040',
    titre: 'Isolation thermique ITE',
    ville: 'Metz (57)',
    budget: 18500,
    statut: 'devis-envoye',
    date: '18/04/2026',
  },
  {
    id: 'RL-2026-038',
    titre: 'Rénovation salle de bain',
    ville: 'Nancy (54)',
    budget: 8200,
    statut: 'signe',
    date: '10/04/2026',
  },
];

// ════════════════════════════════════════
// ÉTAT
// ════════════════════════════════════════

const artisanState = {
  currentPage: 'leads',
  filtreLeads: 'tous',
  leadsStatuts: {}, // id → 'accepte' | 'passe'
};

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════

function showPage(page, el) {
  document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.remove('hidden');
  if (el) el.classList.add('active');

  artisanState.currentPage = page;
  updateTopbar(page);
}

function updateTopbar(page) {
  const map = {
    leads:    { title: 'Leads disponibles', sub: 'Projets qualifiés dans votre zone' },
    dossiers: { title: 'Mes dossiers', sub: 'Leads acceptés et en cours' },
    avis:     { title: 'Mes avis clients', sub: 'Réputation et retours' },
    profil:   { title: 'Mon profil', sub: 'Informations et documents' },
    parametres: { title: 'Paramètres', sub: 'Compte et notifications' },
  };
  const t = map[page] || map.leads;
  const titleEl = document.getElementById('topbarTitle');
  const subEl   = document.getElementById('topbarSub');
  if (titleEl) titleEl.textContent = t.title;
  if (subEl)   subEl.textContent   = t.sub;
}

// ════════════════════════════════════════
// LEADS
// ════════════════════════════════════════

function setFiltreLeads(filtre, el) {
  artisanState.filtreLeads = filtre;
  document.querySelectorAll('.lf-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderLeads();
}

function renderLeads() {
  const container = document.getElementById('leadsList');
  if (!container) return;

  const filtre  = artisanState.filtreLeads;
  const statuts = artisanState.leadsStatuts;

  let leads = leadsDisponibles.filter(l => {
    if (filtre === 'tous')     return true;
    if (filtre === 'urgent')   return l.type === 'urgent';
    if (filtre === 'nouveau')  return l.type === 'nouveau';
    if (filtre === 'acceptes') return statuts[l.id] === 'accepte';
    return true;
  });

  if (leads.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="ei">📭</div>
        <h3>Aucun lead dans cette catégorie</h3>
        <p>Revenez bientôt — de nouveaux projets arrivent chaque jour</p>
      </div>`;
    return;
  }

  container.innerHTML = leads.map(lead => {
    const statut = statuts[lead.id] || 'disponible';
    const isAccepte = statut === 'accepte';
    const isPasse   = statut === 'passe';

    const typeLabels = {
      urgent:   { text: '🔴 URGENT', cls: 'urgent' },
      nouveau:  { text: '🟢 NOUVEAU', cls: 'nouveau' },
      standard: { text: '🟡 STANDARD', cls: 'standard' },
    };
    const tl = typeLabels[lead.type] || typeLabels.standard;

    const slotsRestants = lead.slotsMax - lead.slots - (isAccepte ? 1 : 0);

    return `
      <div class="lead-card ${isPasse ? 'passe' : isAccepte ? 'accepte' : tl.cls}">
        <div class="lead-card-inner">
          <div>
            <div class="lead-type-badge ${tl.cls}">${tl.text}</div>
            <div class="lead-title">${lead.titre}</div>
            <div class="lead-metas">
              <div class="lead-meta">📍 ${lead.ville} (${lead.cp})</div>
              <div class="lead-meta">📐 ${lead.surface}</div>
              <div class="lead-meta">📅 ${lead.delai}</div>
              ${lead.photos.map(p => `<div class="lead-meta">${p}</div>`).join('')}
            </div>
            <div style="font-size:0.75rem;color:var(--muted);margin-top:8px;line-height:1.5;">
              ${lead.description.substring(0, 100)}${lead.description.length > 100 ? '...' : ''}
            </div>
          </div>

          <div class="lead-right">
            <div>
              <div class="lead-budget">${lead.budget.toLocaleString('fr-FR')} €</div>
              <div class="lead-budget-lbl">Budget estimé</div>
            </div>
            <div class="lead-slots">
              <span>${slotsRestants > 0 ? slotsRestants : 0}</span>/${lead.slotsMax} places restantes
            </div>
            <div class="lead-actions">
              ${isPasse ? `
                <span style="font-size:0.75rem;color:var(--muted);font-style:italic;">Passé</span>
              ` : isAccepte ? `
                <button class="btn-accepter" style="background:#3B82F6;cursor:default;">✅ Accepté</button>
              ` : slotsRestants <= 0 ? `
                <button class="btn-accepter" style="background:var(--muted);cursor:not-allowed;" disabled>Complet</button>
              ` : `
                <button class="btn-accepter" onclick="accepterLead('${lead.id}')">Accepter ce lead</button>
                <button class="btn-passer" onclick="passerLead('${lead.id}')">Passer</button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ════════════════════════════════════════
// ACTIONS LEADS
// ════════════════════════════════════════

function accepterLead(id) {
  const lead = leadsDisponibles.find(l => l.id === id);
  if (!lead) return;

  // Confirmer
  const budget = lead.budget.toLocaleString('fr-FR');
  if (!confirm(`Confirmer l'acceptation du lead ${id} ?\n\nProjet : ${lead.titre}\nBudget : ${budget} €\n\nEn acceptant, vous vous engagez à contacter le client rapidement.`)) return;

  // Marquer comme accepté
  artisanState.leadsStatuts[id] = 'accepte';
  lead.slots += 1;

  renderLeads();
  updateKPIs();
  showToast('✅ Lead accepté ! Le client va vous être mis en relation sous peu.', 'success');

  // Ajouter dans mes dossiers
  if (!mesDossiers.find(d => d.id === id)) {
    mesDossiers.unshift({
      id: id,
      titre: lead.titre,
      ville: lead.ville + ' (' + lead.cp + ')',
      budget: lead.budget,
      statut: 'en-contact',
      date: new Date().toLocaleDateString('fr-FR'),
    });
    renderDossiers();
  }
}

function passerLead(id) {
  artisanState.leadsStatuts[id] = 'passe';
  renderLeads();
  showToast('Lead passé — il ne vous sera plus proposé.', 'info');
}

// ════════════════════════════════════════
// MES DOSSIERS
// ════════════════════════════════════════

function renderDossiers() {
  const container = document.getElementById('mesDossiersList');
  if (!container) return;

  if (mesDossiers.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="ei">📁</div>
        <h3>Aucun dossier en cours</h3>
        <p>Acceptez des leads pour voir vos dossiers ici</p>
      </div>`;
    return;
  }

  const statutLabels = {
    'en-contact':   { text: '📞 En contact',   color: '#1D4ED8' },
    'devis-envoye': { text: '📄 Devis envoyé', color: var_gold() },
    'signe':        { text: '🤝 Signé',         color: '#15803D' },
    'perdu':        { text: '❌ Perdu',          color: '#DC2626' },
  };

  container.innerHTML = mesDossiers.map(d => {
    const sl = statutLabels[d.statut] || { text: d.statut, color: '#888' };
    return `
      <div class="dossier-row">
        <div>
          <div class="dossier-ref">${d.id}</div>
          <div class="dossier-titre">${d.titre}</div>
          <div class="dossier-meta">📍 ${d.ville} · Reçu le ${d.date}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
          <div style="font-family:'Fraunces',serif;font-size:1.1rem;font-weight:700;color:var(--gold);">${d.budget.toLocaleString('fr-FR')} €</div>
          <span style="font-size:0.7rem;font-weight:700;color:${sl.color};background:${sl.color}18;border:1px solid ${sl.color}30;padding:3px 10px;border-radius:100px;white-space:nowrap;">${sl.text}</span>
          ${d.statut === 'signe' ? `
            <div style="font-size:0.72rem;color:var(--success);font-weight:600;">
              Commission : ${(d.budget * 0.05).toLocaleString('fr-FR')} € à verser
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function var_gold() { return '#B8820A'; }

// ════════════════════════════════════════
// KPIs
// ════════════════════════════════════════

function updateKPIs() {
  const nbAcceptes = Object.values(artisanState.leadsStatuts).filter(s => s === 'accepte').length;
  const nbSignes   = mesDossiers.filter(d => d.statut === 'signe').length;
  const caGenere   = mesDossiers.filter(d => d.statut === 'signe').reduce((s,d) => s + d.budget, 0);

  const kpiLeads  = document.getElementById('kpiLeads');
  const kpiAcc    = document.getElementById('kpiAcceptes');
  const kpiSigne  = document.getElementById('kpiSignes');
  const kpiCA     = document.getElementById('kpiCA');

  if (kpiLeads) kpiLeads.textContent = leadsDisponibles.length;
  if (kpiAcc)   kpiAcc.textContent   = nbAcceptes;
  if (kpiSigne) kpiSigne.textContent = nbSignes;
  if (kpiCA)    kpiCA.textContent    = caGenere.toLocaleString('fr-FR') + ' €';
}

// ════════════════════════════════════════
// TOAST
// ════════════════════════════════════════

function showToast(msg, type = 'info') {
  const old = document.getElementById('toast');
  if (old) old.remove();

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
    box-shadow:0 8px 24px rgba(0,0,0,0.12);max-width:360px;line-height:1.4;
    animation:slideUp 0.3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  updateKPIs();
  renderLeads();
  renderDossiers();
});

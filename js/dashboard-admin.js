/* ═══════════════════════════════════════
   RENOLINK — dashboard-admin.js v2
   Dashboard admin complet
   ═══════════════════════════════════════ */

// ════════════════════════════════════════
// DONNÉES DÉMO
// ════════════════════════════════════════
const dossiers = [
  {
    id:'RL-2026-047', type:'Salle de bain complète',
    client:{ nom:'Martin Jean', tel:'06 12 34 56 78', email:'jean.martin@email.fr', pref:'Téléphone' },
    ville:'Nancy', cp:'54000', budget:11000, delai:'Dans 1 à 3 mois',
    surface:'7,5 m²', typeBien:'Appartement', annee:'Après 2000', etage:'3ème étage', ascenseur:'Non',
    description:'Rénovation complète salle de bain. Dépose baignoire, pose douche italienne, carrelage sol/murs, lavabo et robinetterie.',
    statut:'nouveau', priorite:'haute', publie:false,
    date:'2026-04-28', heure:'14h32', photos:['🛁','🚿','🪥'],
    notes:'', artisansContactes:[], artisansPropositions:[],
    historique:[{ action:'Dossier reçu', date:'2026-04-28 14:32', user:'Système' }]
  },
  {
    id:'RL-2026-046', type:'Isolation thermique ITE',
    client:{ nom:'Dupont Marie', tel:'06 98 76 54 32', email:'marie.dupont@email.fr', pref:'Email' },
    ville:'Metz', cp:'57000', budget:18500, delai:'Dans 3 à 6 mois',
    surface:'120 m²', typeBien:'Maison individuelle', annee:'1950 – 1975', etage:'N/A', ascenseur:'Non',
    description:'ITE sur maison de 120m² construite en 1972. Façades nord et sud. Client éligible MaPrimeRénov\'.',
    statut:'en-cours', priorite:'normale', publie:true,
    date:'2026-04-27', heure:'09h15', photos:['🏠','🧱'],
    notes:'Budget confirmé. Cherche RGE ITE.',
    artisansContactes:['THERMIQUE EST'], artisansPropositions:[],
    historique:[
      { action:'Dossier reçu', date:'2026-04-27 09:15', user:'Système' },
      { action:'Qualification démarrée', date:'2026-04-27 10:00', user:'Admin' },
      { action:'Publié dans le réseau', date:'2026-04-27 11:30', user:'Admin' }
    ]
  },
  {
    id:'RL-2026-045', type:'Rénovation cuisine',
    client:{ nom:'Bernard Sophie', tel:'07 11 22 33 44', email:'sophie.bernard@email.fr', pref:'SMS' },
    ville:'Nancy', cp:'54000', budget:9500, delai:'Dans 1 à 3 mois',
    surface:'14 m²', typeBien:'Maison individuelle', annee:'Après 2000', etage:'RDC', ascenseur:'N/A',
    description:'Rénovation complète cuisine 14m². Dépose ancienne cuisine, pose nouvelle fournie, carrelage, peinture.',
    statut:'valide', priorite:'normale', publie:true,
    date:'2026-04-26', heure:'16h48', photos:['🍳','🪟'],
    notes:'Dossier complet. Budget réaliste.',
    artisansContactes:[], artisansPropositions:['RENOV HABITAT'],
    historique:[
      { action:'Dossier reçu', date:'2026-04-26 16:48', user:'Système' },
      { action:'Validé', date:'2026-04-26 18:00', user:'Admin' }
    ]
  },
  {
    id:'RL-2026-044', type:'Pompe à chaleur air/eau',
    client:{ nom:'Leroy Pierre', tel:'06 55 44 33 22', email:'pierre.leroy@email.fr', pref:'Téléphone' },
    ville:'Épinal', cp:'88000', budget:14000, delai:'Dès que possible',
    surface:'160 m²', typeBien:'Maison individuelle', annee:'1975 – 2000', etage:'N/A', ascenseur:'N/A',
    description:'Remplacement chaudière fioul par PAC air/eau. Maison 160m² de 1985. Radiateurs existants.',
    statut:'envoye', priorite:'haute', publie:true,
    date:'2026-04-25', heure:'11h20', photos:['🔥','🏠'],
    notes:'Envoyé le 25/04. En attente retour.',
    artisansContactes:['THERMIQUE EST'], artisansPropositions:[],
    historique:[
      { action:'Dossier reçu', date:'2026-04-25 11:20', user:'Système' },
      { action:'Validé', date:'2026-04-25 12:00', user:'Admin' },
      { action:'Envoyé à THERMIQUE EST', date:'2026-04-25 14:00', user:'Admin' }
    ]
  },
  {
    id:'RL-2026-043', type:'Toiture complète',
    client:{ nom:'Schmitt Alain', tel:'06 77 88 99 00', email:'alain.schmitt@email.fr', pref:'Téléphone' },
    ville:'Metz', cp:'57000', budget:22000, delai:'Dans 1 à 3 mois',
    surface:'180 m²', typeBien:'Maison individuelle', annee:'1950 – 1975', etage:'N/A', ascenseur:'N/A',
    description:'Réfection complète toiture tuile 180m². Velux x3. Traitement charpente préventif.',
    statut:'signe', priorite:'normale', publie:true,
    date:'2026-04-20', heure:'08h45', photos:['🏠','🏗️'],
    notes:'Signé avec Couverture Lorraine le 22/04. Commission 8% = 1 760 € à facturer.',
    artisansContactes:['COUVERTURE LORRAINE'], artisansPropositions:[],
    historique:[
      { action:'Dossier reçu', date:'2026-04-20 08:45', user:'Système' },
      { action:'Validé', date:'2026-04-20 10:00', user:'Admin' },
      { action:'Envoyé à COUVERTURE LORRAINE', date:'2026-04-21 09:00', user:'Admin' },
      { action:'Chantier signé — commission 8%', date:'2026-04-22 14:00', user:'Admin' }
    ]
  },
  {
    id:'RL-2026-042', type:'Peinture intérieure',
    client:{ nom:'Morel Céline', tel:'07 33 44 55 66', email:'celine.morel@email.fr', pref:'Email' },
    ville:'Verdun', cp:'55100', budget:2800, delai:'Dans le mois',
    surface:'80 m²', typeBien:'Appartement', annee:'Après 2000', etage:'2ème étage', ascenseur:'Oui',
    description:'Peinture T3 80m². 3 pièces + couloir. Murs et plafonds. Peinture fournie.',
    statut:'rejete', priorite:'basse', publie:false,
    date:'2026-04-18', heure:'15h10', photos:['🎨'],
    notes:'Budget sous le seuil minimum de 1500€ acceptable pour ce type.',
    artisansContactes:[], artisansPropositions:[],
    historique:[
      { action:'Dossier reçu', date:'2026-04-18 15:10', user:'Système' },
      { action:'Rejeté — budget insuffisant', date:'2026-04-18 16:00', user:'Admin' }
    ]
  },
];

const artisansReseau = [
  { id:'A001', nom:'RENOV HABITAT', metier:'Rénovation intérieure', ville:'Nancy', tel:'06 10 20 30 40', email:'contact@renovhabitat.fr', note:4.9, avis:27, certifs:['RGE','Qualibat','ITE'], statut:'actif', docs:'ok' },
  { id:'A002', nom:'BATI EXPERT', metier:'Électricité, Rénovation', ville:'Metz', tel:'06 20 30 40 50', email:'contact@batiexpert.fr', note:4.7, avis:11, certifs:['Qualifelec','RGE'], statut:'actif', docs:'ok' },
  { id:'A003', nom:'THERMIQUE EST', metier:'Chauffage, PAC, Isolation', ville:'Nancy', tel:'06 30 40 50 60', email:'contact@thermiqueest.fr', note:4.8, avis:19, certifs:['RGE','QualiPAC','CEE'], statut:'attente', docs:'ok' },
  { id:'A004', nom:'PLOMBERIE MARTIN', metier:'Plomberie, Sanitaire', ville:'Metz', tel:'06 40 50 60 70', email:'contact@plomberiemartin.fr', note:5.0, avis:38, certifs:['Qualibat'], statut:'alerte', docs:'expire' },
];

// ════════════════════════════════════════
// ÉTAT
// ════════════════════════════════════════
const adminState = {
  currentPage:'dossiers', filtreStatut:'tous',
  filtrePriorite:'tous', recherche:'', dossierActif:null,
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
  adminState.currentPage = page;
  const titles = {
    dossiers:   { title:'Gestion des dossiers',   sub:'Validation, publication et suivi' },
    artisans:   { title:'Réseau artisans',         sub:'Vérification et gestion' },
    commissions:{ title:'Commissions — 8%',        sub:'Suivi des revenus et facturation' },
    stats:      { title:'Statistiques',            sub:'Performance de la plateforme' },
    parametres: { title:'Paramètres',              sub:'Configuration du compte' },
  };
  const t = titles[page] || titles.dossiers;
  document.getElementById('topbarTitle').textContent = t.title;
  document.getElementById('topbarSub').textContent   = t.sub;
}

// ════════════════════════════════════════
// FILTRES
// ════════════════════════════════════════
function setFiltreStatut(statut, el) {
  adminState.filtreStatut = statut;
  document.querySelectorAll('.filter-btn[data-statut]').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderDossiers();
}
function setFiltrePriorite(val) { adminState.filtrePriorite = val; renderDossiers(); }
function handleRecherche(val)   { adminState.recherche = val.toLowerCase(); renderDossiers(); }

function getDossiersFiltres() {
  return dossiers.filter(d => {
    const ms = adminState.filtreStatut === 'tous'    || d.statut   === adminState.filtreStatut;
    const mp = adminState.filtrePriorite === 'tous'  || d.priorite === adminState.filtrePriorite;
    const mr = !adminState.recherche ||
      d.id.toLowerCase().includes(adminState.recherche) ||
      d.type.toLowerCase().includes(adminState.recherche) ||
      d.client.nom.toLowerCase().includes(adminState.recherche) ||
      d.ville.toLowerCase().includes(adminState.recherche);
    return ms && mp && mr;
  });
}

// ════════════════════════════════════════
// LABELS
// ════════════════════════════════════════
function statutLabel(s) {
  return {
    nouveau:  { text:'🔵 Nouveau',  cls:'statut-nouveau' },
    'en-cours':{ text:'🟡 En cours', cls:'statut-en-cours' },
    valide:   { text:'✅ Validé',   cls:'statut-valide' },
    envoye:   { text:'📤 Envoyé',   cls:'statut-envoye' },
    signe:    { text:'🤝 Signé',    cls:'statut-signe' },
    rejete:   { text:'❌ Rejeté',   cls:'statut-rejete' },
  }[s] || { text:s, cls:'' };
}
function prioriteLabel(p) {
  return {
    haute:   { text:'🔴 Haute',   cls:'priorite-haute' },
    normale: { text:'🟡 Normale', cls:'priorite-normale' },
    basse:   { text:'⚪ Basse',   cls:'priorite-basse' },
  }[p] || { text:p, cls:'' };
}

// ════════════════════════════════════════
// RENDU TABLE DOSSIERS
// ════════════════════════════════════════
function renderDossiers() {
  const tbody   = document.getElementById('dossiersBody');
  const counter = document.getElementById('dossiersCount');
  if (!tbody) return;
  const filtered = getDossiersFiltres();
  if (counter) counter.textContent = filtered.length + ' dossier(s)';

  if (!filtered.length) {
    tbody.innerHTML = `<div style="padding:48px;text-align:center;color:var(--muted);">
      <div style="font-size:2rem;margin-bottom:8px;">📭</div>
      <div style="font-weight:600;">Aucun dossier</div>
    </div>`;
    return;
  }

  tbody.innerHTML = filtered.map(d => {
    const st = statutLabel(d.statut);
    const pr = prioriteLabel(d.priorite);
    const pub = d.publie
      ? '<span style="font-size:0.65rem;background:#D1FAE5;color:#065F46;border:1px solid #6EE7B7;padding:2px 7px;border-radius:100px;font-weight:700;">✓ Publié</span>'
      : '<span style="font-size:0.65rem;background:#F3F4F6;color:#6B7280;border:1px solid #E5E7EB;padding:2px 7px;border-radius:100px;font-weight:700;">○ Hors ligne</span>';
    return `
      <div class="table-row" onclick="openDossier('${d.id}')">
        <div class="table-cell dossier-ref">${d.id}</div>
        <div class="table-cell">
          <div class="dossier-info">
            <h4>${d.type}</h4>
            <p>${d.client.nom} · ${d.ville} (${d.cp})</p>
          </div>
        </div>
        <div class="table-cell"><span class="statut ${st.cls}">${st.text}</span></div>
        <div class="table-cell">${pub}</div>
        <div class="table-cell" style="font-weight:700;color:var(--gold);">${d.budget.toLocaleString('fr-FR')} €</div>
        <div class="table-cell" style="color:var(--muted);font-size:0.72rem;">${d.date}</div>
        <div class="table-cell">
          <div class="row-actions" onclick="event.stopPropagation()">
            <button class="action-btn" title="Ouvrir" onclick="openDossier('${d.id}')">👁️</button>
            <button class="action-btn" title="${d.publie ? 'Dépublier' : 'Publier'}" onclick="togglePublier('${d.id}', event)">${d.publie ? '🔴' : '🟢'}</button>
            <button class="action-btn" title="Exporter PDF" onclick="exportDossierPDF('${d.id}', event)">📄</button>
            <button class="action-btn danger" title="Rejeter" onclick="rejectDossier('${d.id}', event)">❌</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ════════════════════════════════════════
// PUBLIER / DÉPUBLIER
// ════════════════════════════════════════
function togglePublier(id, e) {
  if (e) e.stopPropagation();
  const d = dossiers.find(x => x.id === id);
  if (!d) return;
  d.publie = !d.publie;
  d.historique.push({ action: d.publie ? 'Publié dans le réseau' : 'Retiré du réseau', date: new Date().toLocaleString('fr-FR'), user:'Admin' });
  renderDossiers();
  showNotif(d.publie ? '🟢 Dossier publié — visible par les artisans' : '🔴 Dossier retiré du réseau', d.publie ? 'success' : 'info');
}

// ════════════════════════════════════════
// EXPORT PDF DOSSIER
// ════════════════════════════════════════
function exportDossierPDF(id, e) {
  if (e) e.stopPropagation();
  const d = dossiers.find(x => x.id === id);
  if (!d) return;

  const commission = Math.round(d.budget * 0.08);
  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<title>Dossier ${d.id} — RenoLink</title>
<style>
  body{font-family:Arial,sans-serif;margin:40px;color:#1A1714;font-size:13px;}
  h1{font-size:22px;margin-bottom:4px;}
  .ref{color:#B8820A;font-size:14px;font-weight:bold;margin-bottom:24px;}
  .section{margin-bottom:20px;padding:16px;border:1px solid #E4DDD0;border-radius:8px;}
  .section h2{font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.06em;color:#7A736A;margin-bottom:12px;}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F5F2ED;font-size:12px;}
  .row:last-child{border-bottom:none;}
  .label{color:#7A736A;}
  .value{font-weight:600;}
  .gold{color:#B8820A;}
  .commission-box{background:#FEF3E2;border:2px solid #B8820A;border-radius:8px;padding:16px;text-align:center;margin:20px 0;}
  .commission-box h3{color:#B8820A;margin-bottom:8px;}
  .commission-amount{font-size:28px;font-weight:900;color:#B8820A;}
  .historique{font-size:11px;}
  .hist-item{padding:5px 0;border-bottom:1px solid #F5F2ED;display:flex;gap:12px;}
  .hist-date{color:#7A736A;min-width:140px;}
  footer{margin-top:32px;padding-top:16px;border-top:1px solid #E4DDD0;font-size:11px;color:#7A736A;text-align:center;}
  @media print{body{margin:20px;}}
</style></head>
<body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">
  <div>
    <h1>Dossier Projet — RenoLink</h1>
    <div class="ref">${d.id}</div>
    <div style="font-size:11px;color:#7A736A;">Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</div>
  </div>
  <div style="text-align:right;">
    <div style="font-size:20px;font-weight:900;color:#0F0E0C;">Reno<span style="color:#B8820A;">Link</span></div>
    <div style="font-size:11px;color:#7A736A;">Lorraine — Plateforme artisans vérifiés</div>
    <div style="margin-top:6px;">
      <span style="font-size:11px;font-weight:700;background:${d.publie?'#D1FAE5':'#F3F4F6'};color:${d.publie?'#065F46':'#6B7280'};padding:2px 8px;border-radius:100px;">
        ${d.publie ? '✓ Publié' : '○ Hors ligne'}
      </span>
    </div>
  </div>
</div>

<div class="section">
  <h2>👤 Informations client</h2>
  <div class="row"><span class="label">Nom</span><span class="value">${d.client.nom}</span></div>
  <div class="row"><span class="label">Téléphone</span><span class="value">${d.client.tel}</span></div>
  <div class="row"><span class="label">Email</span><span class="value">${d.client.email}</span></div>
  <div class="row"><span class="label">Préférence contact</span><span class="value">${d.client.pref}</span></div>
</div>

<div class="section">
  <h2>🏗️ Détails du projet</h2>
  <div class="row"><span class="label">Type de travaux</span><span class="value">${d.type}</span></div>
  <div class="row"><span class="label">Localisation</span><span class="value">${d.ville} (${d.cp})</span></div>
  <div class="row"><span class="label">Surface</span><span class="value">${d.surface}</span></div>
  <div class="row"><span class="label">Type de bien</span><span class="value">${d.typeBien}</span></div>
  <div class="row"><span class="label">Étage</span><span class="value">${d.etage}</span></div>
  <div class="row"><span class="label">Ascenseur</span><span class="value">${d.ascenseur}</span></div>
  <div class="row"><span class="label">Année construction</span><span class="value">${d.annee}</span></div>
  <div class="row"><span class="label">Délai souhaité</span><span class="value">${d.delai}</span></div>
  <div class="row"><span class="label">Budget estimé</span><span class="value gold">${d.budget.toLocaleString('fr-FR')} €</span></div>
  <div class="row"><span class="label">Statut</span><span class="value">${statutLabel(d.statut).text}</span></div>
  <div style="margin-top:12px;padding-top:12px;border-top:1px solid #F5F2ED;">
    <div class="label" style="margin-bottom:6px;">Description complète :</div>
    <div style="line-height:1.6;">${d.description}</div>
  </div>
</div>

<div class="commission-box">
  <h3>💶 Commission RenoLink — 8%</h3>
  <div class="commission-amount">${commission.toLocaleString('fr-FR')} €</div>
  <div style="font-size:11px;color:#7A736A;margin-top:4px;">Sur un budget de ${d.budget.toLocaleString('fr-FR')} €</div>
  <div style="font-size:11px;color:#92400E;margin-top:8px;font-weight:600;">
    En acceptant ce dossier, l'artisan s'engage à verser 8% du montant signé à RenoLink.
  </div>
</div>

<div class="section">
  <h2>🔨 Artisans contactés</h2>
  ${d.artisansContactes.length ? d.artisansContactes.map(a => `<div class="row"><span class="label">Contacté</span><span class="value">${a}</span></div>`).join('') : '<div style="color:#7A736A;font-size:12px;">Aucun artisan contacté pour ce dossier.</div>'}
</div>

<div class="section">
  <h2>📅 Historique complet</h2>
  <div class="historique">
    ${d.historique.map(h => `<div class="hist-item"><span class="hist-date">${h.date}</span><span>${h.action}</span><span style="color:#7A736A;margin-left:auto;">${h.user}</span></div>`).join('')}
  </div>
</div>

${d.notes ? `<div class="section"><h2>📝 Notes internes</h2><div style="line-height:1.6;">${d.notes}</div></div>` : ''}

<footer>
  RenoLink — Plateforme de mise en relation artisans BTP — Lorraine<br>
  Ce document est confidentiel et destiné uniquement à l'usage interne ou à l'artisan désigné.
</footer>
</body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 500);
  showNotif('📄 PDF du dossier ' + id + ' ouvert', 'success');
}

// ════════════════════════════════════════
// MODAL DOSSIER
// ════════════════════════════════════════
function openDossier(id) {
  const d = dossiers.find(x => x.id === id);
  if (!d) return;
  adminState.dossierActif = d;

  const st = statutLabel(d.statut);
  document.getElementById('modalTitle').textContent = d.type;
  document.getElementById('modalRef').textContent   = d.id;
  document.getElementById('mStatut').innerHTML = `<span class="statut ${st.cls}">${st.text}</span>`;

  // Publié badge
  const pubEl = document.getElementById('mPublie');
  if (pubEl) pubEl.innerHTML = d.publie
    ? '<span style="font-size:0.72rem;background:#D1FAE5;color:#065F46;border:1px solid #6EE7B7;padding:3px 10px;border-radius:100px;font-weight:700;">✓ Publié</span>'
    : '<span style="font-size:0.72rem;background:#F3F4F6;color:#6B7280;border:1px solid #E5E7EB;padding:3px 10px;border-radius:100px;font-weight:700;">○ Hors ligne</span>';

  // Client (affiché complet pour admin)
  document.getElementById('mClientNom').textContent   = d.client.nom;
  document.getElementById('mClientTel').textContent   = d.client.tel;
  document.getElementById('mClientEmail').textContent = d.client.email;
  document.getElementById('mClientPref').textContent  = d.client.pref;

  // Projet
  document.getElementById('mType').textContent    = d.type;
  document.getElementById('mVille').textContent   = d.ville + ' (' + d.cp + ')';
  document.getElementById('mSurface').textContent = d.surface;
  document.getElementById('mBien').textContent    = d.typeBien;
  document.getElementById('mBudget').textContent  = d.budget.toLocaleString('fr-FR') + ' €';
  document.getElementById('mDelai').textContent   = d.delai;
  document.getElementById('mDesc').textContent    = d.description;
  document.getElementById('mDate').textContent    = 'Reçu le ' + d.date + ' à ' + d.heure;

  // Commission
  const commEl = document.getElementById('mCommission');
  if (commEl) commEl.textContent = Math.round(d.budget * 0.08).toLocaleString('fr-FR') + ' €';

  // Photos
  document.getElementById('mPhotos').innerHTML = d.photos.map(p =>
    `<div class="modal-photo">${p}</div>`).join('');

  // Notes
  document.getElementById('mNotes').value = d.notes;

  // Artisans contactés
  const artisansEl = document.getElementById('mArtisans');
  artisansEl.innerHTML = d.artisansContactes.length
    ? d.artisansContactes.map(a => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F5F2ED;">
          <span style="font-size:1rem;">🔨</span>
          <span style="font-size:0.84rem;font-weight:600;">${a}</span>
          <span class="statut statut-envoye" style="margin-left:auto;">📤 Proposé</span>
        </div>`).join('')
    : '<p style="font-size:0.8rem;color:var(--muted);padding:10px 0;">Aucun artisan contacté.</p>';

  // Timeline
  renderTimeline(d);

  // Bouton publier
  const btnPub = document.getElementById('btnPublier');
  if (btnPub) {
    btnPub.textContent = d.publie ? '🔴 Dépublier' : '🟢 Publier';
    btnPub.className   = 'modal-btn ' + (d.publie ? '' : 'success');
  }

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  if (adminState.dossierActif) {
    const notes = document.getElementById('mNotes').value;
    const d = dossiers.find(x => x.id === adminState.dossierActif.id);
    if (d) d.notes = notes;
  }
  adminState.dossierActif = null;
}

function renderTimeline(d) {
  const tlEl = document.getElementById('mTimeline');
  if (!tlEl) return;
  tlEl.innerHTML = d.historique.map(h => `
    <div class="timeline-item">
      <div class="timeline-dot done">✓</div>
      <div class="timeline-content">
        <h5>${h.action}</h5>
        <div class="time">${h.date} · ${h.user}</div>
      </div>
    </div>`).join('');
}

// ════════════════════════════════════════
// ACTIONS MODAL
// ════════════════════════════════════════
function addHistorique(d, action) {
  d.historique.push({ action, date: new Date().toLocaleString('fr-FR'), user:'Admin' });
  renderTimeline(d);
}

function changeStatut(newStatut) {
  if (!adminState.dossierActif) return;
  const d = dossiers.find(x => x.id === adminState.dossierActif.id);
  if (!d) return;
  d.statut = newStatut;
  adminState.dossierActif.statut = newStatut;
  const st = statutLabel(newStatut);
  document.getElementById('mStatut').innerHTML = `<span class="statut ${st.cls}">${st.text}</span>`;
  addHistorique(d, 'Statut → ' + st.text.replace(/^[^ ]+ /, ''));
  renderDossiers();
  renderKPIs();
  showNotif('Statut mis à jour : ' + st.text, 'success');
}

function togglePublierModal() {
  if (!adminState.dossierActif) return;
  togglePublier(adminState.dossierActif.id, null);
  const d = dossiers.find(x => x.id === adminState.dossierActif.id);
  const pubEl = document.getElementById('mPublie');
  if (pubEl) pubEl.innerHTML = d.publie
    ? '<span style="font-size:0.72rem;background:#D1FAE5;color:#065F46;border:1px solid #6EE7B7;padding:3px 10px;border-radius:100px;font-weight:700;">✓ Publié</span>'
    : '<span style="font-size:0.72rem;background:#F3F4F6;color:#6B7280;border:1px solid #E5E7EB;padding:3px 10px;border-radius:100px;font-weight:700;">○ Hors ligne</span>';
  const btnPub = document.getElementById('btnPublier');
  if (btnPub) { btnPub.textContent = d.publie ? '🔴 Dépublier' : '🟢 Publier'; }
}

function validerDossier() {
  if (!adminState.dossierActif) return;
  changeStatut('valide');
  const d = dossiers.find(x => x.id === adminState.dossierActif.id);
  if (d && !d.publie) { d.publie = true; showNotif('✅ Validé et publié dans le réseau', 'success'); }
}

function proposerArtisan(nom) {
  if (!adminState.dossierActif) return;
  const d = dossiers.find(x => x.id === adminState.dossierActif.id);
  if (!d) return;
  if (!d.artisansContactes.includes(nom)) {
    d.artisansContactes.push(nom);
    addHistorique(d, 'Dossier proposé à ' + nom);
  }
  const artisansEl = document.getElementById('mArtisans');
  artisansEl.innerHTML = d.artisansContactes.map(a => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F5F2ED;">
      <span>🔨</span><span style="font-size:0.84rem;font-weight:600;">${a}</span>
      <span class="statut statut-envoye" style="margin-left:auto;">📤 Proposé</span>
    </div>`).join('');
  showNotif('📤 Dossier proposé à ' + nom + ' — En attente de réponse', 'success');
}

function marquerSigne() {
  if (!adminState.dossierActif) return;
  const d = dossiers.find(x => x.id === adminState.dossierActif.id);
  const commission = Math.round(d.budget * 0.08);
  changeStatut('signe');
  addHistorique(d, `Chantier signé — Commission 8% = ${commission.toLocaleString('fr-FR')} €`);
  showNotif(`🤝 Signé ! Commission 8% = ${commission.toLocaleString('fr-FR')} € à facturer`, 'success');
  renderKPIs();
}

function rejectDossier(id, e) {
  if (e) e.stopPropagation();
  if (!confirm('Confirmer le rejet du dossier ' + id + ' ?')) return;
  const d = dossiers.find(x => x.id === id);
  if (d) {
    d.statut = 'rejete'; d.publie = false;
    d.historique.push({ action:'Rejeté', date:new Date().toLocaleString('fr-FR'), user:'Admin' });
    renderDossiers(); renderKPIs();
    showNotif('Dossier rejeté : ' + id, 'error');
    if (adminState.dossierActif?.id === id) closeModal();
  }
}

function saveNotes() {
  if (!adminState.dossierActif) return;
  const notes = document.getElementById('mNotes').value;
  const d = dossiers.find(x => x.id === adminState.dossierActif.id);
  if (d) { d.notes = notes; showNotif('Notes sauvegardées', 'success'); }
}

function exportModalPDF() {
  if (adminState.dossierActif) exportDossierPDF(adminState.dossierActif.id, null);
}

// ════════════════════════════════════════
// AJOUT MANUEL DOSSIER
// ════════════════════════════════════════
function openNouveauDossier() {
  document.getElementById('modalNouveauDossier').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNouveauDossier() {
  document.getElementById('modalNouveauDossier').classList.remove('open');
  document.body.style.overflow = '';
}

function submitNouveauDossier() {
  const type    = document.getElementById('nd-type').value;
  const nom     = document.getElementById('nd-nom').value;
  const tel     = document.getElementById('nd-tel').value;
  const email   = document.getElementById('nd-email').value;
  const ville   = document.getElementById('nd-ville').value;
  const cp      = document.getElementById('nd-cp').value;
  const budget  = parseInt(document.getElementById('nd-budget').value) || 0;
  const desc    = document.getElementById('nd-desc').value;

  if (!type || !nom || !tel || !ville || !budget) {
    showNotif('⚠️ Remplissez les champs obligatoires', 'error'); return;
  }

  const newId = 'RL-2026-' + (dossiers.length + 48).toString().padStart(3,'0');
  const now   = new Date();
  dossiers.unshift({
    id:newId, type, client:{nom, tel, email, pref:'Téléphone'},
    ville, cp, budget, delai:'À définir', surface:'N/A', typeBien:'N/A',
    annee:'N/A', etage:'N/A', ascenseur:'N/A', description:desc,
    statut:'nouveau', priorite:'normale', publie:false,
    date:now.toLocaleDateString('fr-FR'), heure:now.toLocaleTimeString('fr-FR'),
    photos:[], notes:'Ajouté manuellement par l\'admin.', artisansContactes:[],
    artisansPropositions:[],
    historique:[{ action:'Dossier créé manuellement', date:now.toLocaleString('fr-FR'), user:'Admin' }]
  });

  closeNouveauDossier();
  renderDossiers();
  renderKPIs();
  showNotif('✅ Dossier ' + newId + ' créé', 'success');

  // Reset form
  ['nd-type','nd-nom','nd-tel','nd-email','nd-ville','nd-cp','nd-budget','nd-desc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ════════════════════════════════════════
// KPIs
// ════════════════════════════════════════
function renderKPIs() {
  const total  = dossiers.length;
  const nvx    = dossiers.filter(d => d.statut === 'nouveau').length;
  const signes = dossiers.filter(d => d.statut === 'signe').length;
  const ca     = dossiers.filter(d => d.statut === 'signe').reduce((s,d) => s + Math.round(d.budget * 0.08), 0);

  const el = id => document.getElementById(id);
  if (el('kpiTotal')) el('kpiTotal').textContent = total;
  if (el('kpiNew'))   el('kpiNew').textContent   = nvx;
  if (el('kpiSigne')) el('kpiSigne').textContent = signes;
  if (el('kpiCA'))    el('kpiCA').textContent    = ca.toLocaleString('fr-FR') + ' €';
}

// ════════════════════════════════════════
// TOAST
// ════════════════════════════════════════
function showNotif(msg, type = 'info') {
  const old = document.getElementById('rl-toast');
  if (old) old.remove();
  const c = { success:{bg:'#D1FAE5',color:'#065F46',border:'#6EE7B7'}, error:{bg:'#FEF2F2',color:'#991B1B',border:'#FECACA'}, info:{bg:'#EFF6FF',color:'#1E40AF',border:'#BFDBFE'} }[type] || { bg:'#EFF6FF',color:'#1E40AF',border:'#BFDBFE' };
  const t = document.createElement('div');
  t.id = 'rl-toast';
  t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:${c.bg};color:${c.color};border:1px solid ${c.border};padding:12px 20px;border-radius:10px;font-size:0.82rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.12);max-width:360px;line-height:1.4;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  renderKPIs();
  renderDossiers();
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeNouveauDossier(); } });
});

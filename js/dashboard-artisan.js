/* ═══════════════════════════════════════
   RENOLINK — dashboard-artisan.js v2
   Flux complet : proposition → acceptation → PDF
   ═══════════════════════════════════════ */

// ════════════════════════════════════════
// DONNÉES DÉMO
// ════════════════════════════════════════
const artisanInfo = {
  nom: 'RENOV HABITAT', metier: 'Rénovation intérieure',
  ville: 'Nancy (54)', note: 4.9, avis: 27,
  certifs: ['RGE','Qualibat','ITE'],
  abo: { statut:'fondateur', fin:'01/04/2027', prix:0 },
};

// Leads proposés par l'admin — l'artisan ne voit PAS les coordonnées client
const leadsProposés = [
  {
    id:'RL-2026-047', type:'urgent',
    titre:'Rénovation salle de bain complète',
    ville:'Nancy', cp:'54000',
    surface:'7,5 m²', budget:11000,
    delai:'Dans 1 à 3 mois',
    description:'Dépose baignoire, pose douche italienne, carrelage sol/murs, lavabo. 3ème étage sans ascenseur.',
    slots:1, slotsMax:3, photos:['🛁','🚿','🪥'],
    statut:'proposition', // proposition = en attente réponse artisan
    dateProposition:'28/04/2026 14h32',
  },
  {
    id:'RL-2026-045', type:'nouveau',
    titre:'Rénovation cuisine complète',
    ville:'Nancy', cp:'54000',
    surface:'14 m²', budget:9500,
    delai:'Dans 1 à 3 mois',
    description:'Dépose ancienne cuisine, pose nouvelle cuisine fournie, carrelage sol, peinture, hotte encastrée.',
    slots:0, slotsMax:3, photos:['🍳','🪟'],
    statut:'disponible',
    dateProposition:'27/04/2026 09h15',
  },
  {
    id:'RL-2026-042', type:'standard',
    titre:'Peinture intérieure appartement T3',
    ville:'Verdun', cp:'55100',
    surface:'80 m²', budget:2800,
    delai:'Dans le mois',
    description:'3 pièces + couloir. Murs et plafonds. Peinture fournie par le client.',
    slots:2, slotsMax:3, photos:['🎨'],
    statut:'disponible',
    dateProposition:'26/04/2026 16h00',
  },
];

// Dossiers acceptés — contiennent les VRAIES infos client
const dossierAcceptés = [
  {
    id:'RL-2026-044',
    titre:'Pompe à chaleur air/eau',
    client:{ nom:'Leroy Pierre', tel:'06 55 44 33 22', email:'pierre.leroy@email.fr', pref:'Téléphone' },
    ville:'Épinal (88)', budget:14000,
    surface:'160 m²', typeBien:'Maison individuelle',
    delai:'Dès que possible',
    description:'Remplacement chaudière fioul par PAC air/eau. Maison 160m² de 1985. Radiateurs existants à conserver. Client éligible CEE et MaPrimeRénov\'.',
    photos:['🔥','🏠'],
    statut:'en-contact', date:'25/04/2026',
    commission: Math.round(14000 * 0.08),
    historique:[
      { action:'Dossier proposé par RenoLink', date:'25/04/2026 11h20' },
      { action:'Accepté par l\'artisan', date:'25/04/2026 14h00' },
      { action:'Coordonnées client transmises', date:'25/04/2026 14h01' },
    ]
  },
  {
    id:'RL-2026-040',
    titre:'Isolation thermique ITE',
    client:{ nom:'Dupont Marie', tel:'06 98 76 54 32', email:'marie.dupont@email.fr', pref:'Email' },
    ville:'Metz (57)', budget:18500,
    surface:'120 m²', typeBien:'Maison individuelle',
    delai:'Dans 3 à 6 mois',
    description:'ITE maison 120m² de 1972. Façades nord et sud. Éligible MaPrimeRénov\'.',
    photos:['🏠','🧱'],
    statut:'devis-envoye', date:'18/04/2026',
    commission: Math.round(18500 * 0.08),
    historique:[
      { action:'Dossier proposé par RenoLink', date:'18/04/2026 09h00' },
      { action:'Accepté par l\'artisan', date:'18/04/2026 10h30' },
      { action:'Devis envoyé au client', date:'20/04/2026 14h00' },
    ]
  },
  {
    id:'RL-2026-038',
    titre:'Rénovation salle de bain',
    client:{ nom:'Bernard Sophie', tel:'07 11 22 33 44', email:'sophie.bernard@email.fr', pref:'SMS' },
    ville:'Nancy (54)', budget:8200,
    surface:'6 m²', typeBien:'Appartement',
    delai:'Dans 1 à 3 mois',
    description:'Réfection complète salle de bain 6m². Douche, lavabo, WC. Carrelage inclus.',
    photos:['🛁'],
    statut:'signe', date:'10/04/2026',
    commission: Math.round(8200 * 0.08),
    historique:[
      { action:'Dossier proposé par RenoLink', date:'10/04/2026 08h00' },
      { action:'Accepté par l\'artisan', date:'10/04/2026 09h00' },
      { action:'Chantier signé', date:'12/04/2026 15h00' },
      { action:'Commission 8% déclarée — 656 €', date:'12/04/2026 15h30' },
    ]
  },
];

// ════════════════════════════════════════
// ÉTAT
// ════════════════════════════════════════
const artisanState = {
  currentPage:'leads',
  leadStatuts:{}, // id → 'accepte' | 'refuse' | 'vu'
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
  const map = {
    leads:    { title:'Dossiers proposés',  sub:'Projets sélectionnés par RenoLink pour vous' },
    dossiers: { title:'Mes dossiers',       sub:'Leads acceptés — coordonnées client disponibles' },
    avis:     { title:'Mes avis',           sub:'Réputation et retours clients' },
    profil:   { title:'Mon profil',         sub:'Informations et documents' },
    parametres:{ title:'Paramètres',        sub:'Compte et notifications' },
  };
  const t = map[page] || map.leads;
  const titleEl = document.getElementById('topbarTitle');
  const subEl   = document.getElementById('topbarSub');
  if (titleEl) titleEl.textContent = t.title;
  if (subEl)   subEl.textContent   = t.sub;
}

// ════════════════════════════════════════
// LEADS PROPOSÉS
// ════════════════════════════════════════
function setFiltreLeads(filtre, el) {
  document.querySelectorAll('.lf-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderLeads(filtre);
}

function renderLeads(filtre = 'tous') {
  const container = document.getElementById('leadsList');
  if (!container) return;

  let leads = leadsProposés.filter(l => {
    if (filtre === 'tous')        return true;
    if (filtre === 'proposition') return l.statut === 'proposition';
    if (filtre === 'disponible')  return l.statut === 'disponible';
    if (filtre === 'acceptes')    return artisanState.leadStatuts[l.id] === 'accepte';
    return true;
  });

  const nbProp = leadsProposés.filter(l => l.statut === 'proposition' && !artisanState.leadStatuts[l.id]).length;
  const badge  = document.getElementById('navLeadsBadge');
  if (badge) badge.textContent = nbProp || '';

  if (!leads.length) {
    container.innerHTML = `<div class="empty-state"><div class="ei">📭</div><h3>Aucun dossier</h3><p>RenoLink vous proposera des projets dès qu'ils correspondent à votre profil</p></div>`;
    return;
  }

  const typeLabels = {
    urgent:   { text:'🔴 URGENT',   cls:'urgent' },
    nouveau:  { text:'🟢 NOUVEAU',  cls:'nouveau' },
    standard: { text:'🟡 STANDARD', cls:'standard' },
    proposition: { text:'📬 PROPOSÉ PAR RENOLINK', cls:'nouveau' },
  };

  container.innerHTML = leads.map(lead => {
    const statut    = artisanState.leadStatuts[lead.id] || lead.statut;
    const isAccepte = statut === 'accepte';
    const isRefuse  = statut === 'refuse';
    const isProp    = lead.statut === 'proposition';
    const tl        = typeLabels[isProp ? 'proposition' : lead.type] || typeLabels.standard;
    const commission= Math.round(lead.budget * 0.08);

    return `
      <div class="lead-card ${isRefuse ? 'passe' : isAccepte ? 'accepte' : isProp ? 'proposition' : tl.cls}"
           style="${isProp && !isAccepte && !isRefuse ? 'border-color:var(--gold);box-shadow:0 0 0 2px rgba(184,130,10,0.15);' : ''}">
        ${isProp && !isAccepte && !isRefuse ? '<div style="background:var(--gold);color:white;font-size:0.65rem;font-weight:700;padding:5px 16px;letter-spacing:0.08em;text-transform:uppercase;">📬 RenoLink vous propose ce dossier — Votre réponse est attendue</div>' : ''}
        <div class="lead-card-inner">
          <div style="flex:1;">
            <div class="lead-type-badge ${tl.cls}">${tl.text}</div>
            <div class="lead-title">${lead.titre}</div>
            <div class="lead-metas">
              <div class="lead-meta">📍 ${lead.ville} (${lead.cp})</div>
              <div class="lead-meta">📐 ${lead.surface}</div>
              <div class="lead-meta">📅 ${lead.delai}</div>
              <div class="lead-meta">📸 ${lead.photos.length} photo(s)</div>
            </div>
            <div style="font-size:0.78rem;color:var(--muted);margin-top:8px;line-height:1.55;border-left:3px solid var(--border);padding-left:10px;">
              ${lead.description.substring(0,120)}${lead.description.length > 120 ? '...' : ''}
            </div>
            <div style="font-size:0.7rem;color:var(--muted);margin-top:8px;">
              Proposé le ${lead.dateProposition} · ${lead.slotsMax - lead.slots} place(s) restante(s)
            </div>
          </div>
          <div class="lead-right">
            <div>
              <div class="lead-budget">${lead.budget.toLocaleString('fr-FR')} €</div>
              <div class="lead-budget-lbl">Budget estimé</div>
            </div>
            <div style="background:#FEF3E2;border:1px solid rgba(184,130,10,0.25);border-radius:8px;padding:6px 10px;text-align:center;">
              <div style="font-size:0.65rem;color:#92400E;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Commission 8%</div>
              <div style="font-size:0.95rem;font-weight:700;color:var(--gold);">${commission.toLocaleString('fr-FR')} €</div>
            </div>
            <div class="lead-actions">
              ${isRefuse ? '<span style="font-size:0.75rem;color:var(--muted);font-style:italic;">Refusé</span>' :
                isAccepte ? '<button class="btn-accepter" style="background:#3B82F6;cursor:default;" onclick="ouvrirDossierAccepte(\''+lead.id+'\')">✅ Voir mon dossier →</button>' :
                `<div style="display:flex;flex-direction:column;gap:6px;">
                   <button class="btn-accepter" onclick="accepterLead('${lead.id}')">✅ Accepter ce dossier</button>
                   <button class="btn-passer" onclick="refuserLead('${lead.id}')">✕ Refuser</button>
                 </div>`
              }
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ════════════════════════════════════════
// ACCEPTATION LEAD
// ════════════════════════════════════════
function accepterLead(id) {
  const lead = leadsProposés.find(l => l.id === id);
  if (!lead) return;

  const commission = Math.round(lead.budget * 0.08);
  const msg = `Confirmer l'acceptation du dossier ${id} ?\n\n` +
    `📋 Projet : ${lead.titre}\n` +
    `📍 Lieu : ${lead.ville} (${lead.cp})\n` +
    `💶 Budget : ${lead.budget.toLocaleString('fr-FR')} €\n` +
    `📊 Commission RenoLink 8% : ${commission.toLocaleString('fr-FR')} €\n\n` +
    `En acceptant ce dossier :\n` +
    `✓ Vous recevez les coordonnées complètes du client\n` +
    `✓ Vous vous engagez à le contacter sous 48h\n` +
    `✓ En cas de signature, vous versez 8% à RenoLink\n\n` +
    `Confirmer ?`;

  if (!confirm(msg)) return;

  artisanState.leadStatuts[id] = 'accepte';
  lead.statut = 'accepte';

  // Simuler réception dossier complet
  if (!dossierAcceptés.find(d => d.id === id)) {
    dossierAcceptés.unshift({
      id, titre:lead.titre,
      client:{ nom:'Client confirmé', tel:'06 XX XX XX XX', email:'client@email.fr', pref:lead.type === 'urgent' ? 'Téléphone' : 'Email' },
      ville:lead.ville + ' (' + lead.cp + ')',
      budget:lead.budget, surface:lead.surface,
      typeBien:'Voir description', delai:lead.delai,
      description:lead.description, photos:lead.photos,
      statut:'en-contact', date:new Date().toLocaleDateString('fr-FR'),
      commission:Math.round(lead.budget * 0.08),
      historique:[
        { action:'Dossier proposé par RenoLink', date:lead.dateProposition },
        { action:'Accepté — Coordonnées client transmises', date:new Date().toLocaleString('fr-FR') },
      ]
    });
  }

  renderLeads();
  renderDossiers();
  updateKPIs();

  showToast('✅ Dossier accepté ! Les coordonnées du client sont maintenant disponibles dans "Mes dossiers".', 'success');

  // Ouvrir le modal dossier complet
  setTimeout(() => {
    showPage('dossiers', document.querySelector('.nav-item[onclick*="dossiers"]'));
    ouvrirDossierAccepte(id);
  }, 1500);
}

function refuserLead(id) {
  if (!confirm('Refuser ce dossier ? Il ne vous sera plus proposé.')) return;
  artisanState.leadStatuts[id] = 'refuse';
  renderLeads();
  showToast('Dossier refusé — RenoLink en sera informé.', 'info');
}

// ════════════════════════════════════════
// MES DOSSIERS — avec coordonnées client
// ════════════════════════════════════════
function renderDossiers() {
  const container = document.getElementById('mesDossiersList');
  if (!container) return;

  if (!dossierAcceptés.length) {
    container.innerHTML = `<div class="empty-state"><div class="ei">📁</div><h3>Aucun dossier en cours</h3><p>Acceptez des propositions pour voir les dossiers complets ici</p></div>`;
    return;
  }

  const statutLabels = {
    'en-contact':   { text:'📞 En contact',   color:'#1D4ED8' },
    'devis-envoye': { text:'📄 Devis envoyé', color:'#B8820A' },
    'signe':        { text:'🤝 Signé',         color:'#15803D' },
    'perdu':        { text:'❌ Perdu',          color:'#DC2626' },
  };

  container.innerHTML = dossierAcceptés.map(d => {
    const sl = statutLabels[d.statut] || { text:d.statut, color:'#888' };
    return `
      <div class="dossier-row" onclick="ouvrirDossierAccepte('${d.id}')" style="cursor:pointer;">
        <div>
          <div class="dossier-ref">${d.id}</div>
          <div class="dossier-titre">${d.titre}</div>
          <div class="dossier-meta">📍 ${d.ville} · Accepté le ${d.date}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
          <div style="font-family:'Fraunces',serif;font-size:1.1rem;font-weight:700;color:var(--gold);">${d.budget.toLocaleString('fr-FR')} €</div>
          <span style="font-size:0.7rem;font-weight:700;color:${sl.color};background:${sl.color}18;border:1px solid ${sl.color}30;padding:3px 10px;border-radius:100px;white-space:nowrap;">${sl.text}</span>
          ${d.statut === 'signe' ? `<div style="font-size:0.72rem;color:var(--success);font-weight:600;">Commission due : ${d.commission.toLocaleString('fr-FR')} €</div>` : ''}
          <button class="btn-accepter" style="background:var(--dark);padding:8px 14px;font-size:0.78rem;" onclick="event.stopPropagation();ouvrirDossierAccepte('${d.id}')">📂 Ouvrir</button>
          <button class="btn-passer" style="padding:8px 14px;font-size:0.78rem;" onclick="event.stopPropagation();exportDossierPDFArtisan('${d.id}')">📄 PDF</button>
        </div>
      </div>`;
  }).join('');
}

// ════════════════════════════════════════
// MODAL DOSSIER COMPLET ARTISAN
// ════════════════════════════════════════
function ouvrirDossierAccepte(id) {
  const d = dossierAcceptés.find(x => x.id === id);
  if (!d) return;

  document.getElementById('modalDossierTitre').textContent   = d.titre;
  document.getElementById('modalDossierRef').textContent     = d.id;
  document.getElementById('modalClientNom').textContent      = d.client.nom;
  document.getElementById('modalClientTel').textContent      = d.client.tel;
  document.getElementById('modalClientEmail').textContent    = d.client.email;
  document.getElementById('modalClientPref').textContent     = d.client.pref;
  document.getElementById('modalDossierVille').textContent   = d.ville;
  document.getElementById('modalDossierBudget').textContent  = d.budget.toLocaleString('fr-FR') + ' €';
  document.getElementById('modalDossierSurface').textContent = d.surface;
  document.getElementById('modalDossierDelai').textContent   = d.delai;
  document.getElementById('modalDossierDesc').textContent    = d.description;
  document.getElementById('modalDossierComm').textContent    = d.commission.toLocaleString('fr-FR') + ' €';
  document.getElementById('modalDossierPhotos').innerHTML    = d.photos.map(p => `<div class="modal-photo">${p}</div>`).join('');

  // Historique
  document.getElementById('modalDossierHisto').innerHTML = d.historique.map(h => `
    <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #F5F2ED;font-size:0.78rem;">
      <span style="color:var(--muted);min-width:150px;">${h.date}</span>
      <span>${h.action}</span>
    </div>`).join('');

  // Statut select
  const sel = document.getElementById('modalStatutSelect');
  if (sel) sel.value = d.statut;

  // Stocker l'ID actif
  document.getElementById('modalDossierArtisan').dataset.id = id;

  document.getElementById('modalDossierArtisan').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fermerDossierModal() {
  document.getElementById('modalDossierArtisan').classList.remove('open');
  document.body.style.overflow = '';
}

function mettreAJourStatut() {
  const id  = document.getElementById('modalDossierArtisan').dataset.id;
  const sel = document.getElementById('modalStatutSelect');
  const d   = dossierAcceptés.find(x => x.id === id);
  if (!d || !sel) return;
  d.statut = sel.value;
  d.historique.push({ action:'Statut mis à jour : ' + sel.options[sel.selectedIndex].text, date:new Date().toLocaleString('fr-FR') });
  renderDossiers();
  showToast('✅ Statut mis à jour', 'success');
  if (d.statut === 'signe') {
    showToast(`🤝 Chantier signé ! Commission RenoLink 8% = ${d.commission.toLocaleString('fr-FR')} € à verser.`, 'info');
  }
}

// ════════════════════════════════════════
// EXPORT PDF ARTISAN — dossier complet client
// ════════════════════════════════════════
function exportDossierPDFArtisan(id) {
  const d = dossierAcceptés.find(x => x.id === id);
  if (!d) return;

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<title>Dossier ${d.id} — RenoLink</title>
<style>
  body{font-family:Arial,sans-serif;margin:40px;color:#1A1714;font-size:13px;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #B8820A;}
  .logo{font-size:22px;font-weight:900;} .logo span{color:#B8820A;}
  h1{font-size:20px;margin:0 0 4px;} .ref{color:#B8820A;font-weight:700;font-size:14px;}
  .section{margin-bottom:20px;padding:16px;border:1px solid #E4DDD0;border-radius:8px;}
  .section h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7A736A;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #F5F2ED;}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F5F2ED;font-size:12px;}
  .row:last-child{border-bottom:none;}
  .label{color:#7A736A;} .value{font-weight:600;}
  .gold{color:#B8820A;}
  .commission-box{background:#FEF3E2;border:2px solid #B8820A;border-radius:10px;padding:20px;text-align:center;margin:20px 0;}
  .commission-title{font-size:13px;font-weight:700;color:#92400E;margin-bottom:8px;}
  .commission-amount{font-size:32px;font-weight:900;color:#B8820A;margin-bottom:4px;}
  .commission-note{font-size:11px;color:#92400E;line-height:1.5;}
  .clause-box{background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:14px;margin:16px 0;font-size:11px;color:#991B1B;line-height:1.6;}
  .histo-item{display:flex;gap:12px;padding:5px 0;border-bottom:1px solid #F5F2ED;font-size:11px;}
  .histo-date{color:#7A736A;min-width:150px;}
  .photos{display:flex;gap:10px;margin-top:8px;}
  .photo{width:60px;height:60px;border:1px solid #E4DDD0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;}
  footer{margin-top:32px;padding-top:16px;border-top:1px solid #E4DDD0;font-size:11px;color:#7A736A;text-align:center;line-height:1.8;}
  @media print{body{margin:20px;}}
</style></head>
<body>

<div class="header">
  <div>
    <div class="logo">Reno<span>Link</span></div>
    <div style="font-size:11px;color:#7A736A;">Lorraine — Mise en relation artisans vérifiés</div>
  </div>
  <div style="text-align:right;">
    <div style="font-size:11px;color:#7A736A;margin-bottom:4px;">DOSSIER CONFIDENTIEL</div>
    <div style="font-size:11px;color:#7A736A;">Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</div>
    <div style="margin-top:6px;background:#D1FAE5;color:#065F46;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;display:inline-block;">✓ Dossier validé par RenoLink</div>
  </div>
</div>

<h1>${d.titre}</h1>
<div class="ref">${d.id}</div>

<div class="section">
  <h2>👤 Coordonnées client — CONFIDENTIELLES</h2>
  <div style="background:#FEF9F0;border:1px solid rgba(184,130,10,0.2);border-radius:6px;padding:12px;margin-bottom:12px;font-size:11px;color:#92400E;">
    ⚠️ Ces coordonnées sont transmises uniquement après validation par RenoLink. Usage strictement limité à ce projet.
  </div>
  <div class="row"><span class="label">Nom complet</span><span class="value">${d.client.nom}</span></div>
  <div class="row"><span class="label">Téléphone</span><span class="value" style="color:#1D4ED8;">${d.client.tel}</span></div>
  <div class="row"><span class="label">Email</span><span class="value" style="color:#1D4ED8;">${d.client.email}</span></div>
  <div class="row"><span class="label">Préférence contact</span><span class="value">${d.client.pref}</span></div>
</div>

<div class="section">
  <h2>🏗️ Détails du projet</h2>
  <div class="row"><span class="label">Type de travaux</span><span class="value">${d.titre}</span></div>
  <div class="row"><span class="label">Localisation</span><span class="value">${d.ville}</span></div>
  <div class="row"><span class="label">Surface</span><span class="value">${d.surface}</span></div>
  <div class="row"><span class="label">Type de bien</span><span class="value">${d.typeBien}</span></div>
  <div class="row"><span class="label">Délai souhaité</span><span class="value">${d.delai}</span></div>
  <div class="row"><span class="label">Budget estimé</span><span class="value gold">${d.budget.toLocaleString('fr-FR')} €</span></div>
  <div style="margin-top:12px;padding-top:10px;border-top:1px solid #F5F2ED;">
    <div style="font-size:11px;color:#7A736A;margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Description complète :</div>
    <div style="line-height:1.7;">${d.description}</div>
  </div>
  ${d.photos.length ? `
  <div style="margin-top:12px;padding-top:10px;border-top:1px solid #F5F2ED;">
    <div style="font-size:11px;color:#7A736A;margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Photos du chantier :</div>
    <div class="photos">${d.photos.map(p => `<div class="photo">${p}</div>`).join('')}</div>
  </div>` : ''}
</div>

<div class="commission-box">
  <div class="commission-title">💶 COMMISSION RENOLINK — 8%</div>
  <div class="commission-amount">${d.commission.toLocaleString('fr-FR')} €</div>
  <div style="font-size:12px;color:#92400E;margin-bottom:8px;">Sur budget de ${d.budget.toLocaleString('fr-FR')} €</div>
  <div class="commission-note">
    En acceptant ce dossier, vous vous êtes engagé à verser <strong>${d.commission.toLocaleString('fr-FR')} €</strong><br>
    à RenoLink en cas de signature du devis avec ce client.<br>
    Cette commission est due indépendamment du montant final du chantier signé.
  </div>
</div>

<div class="clause-box">
  <strong>⚖️ Rappel clause commission :</strong> Tout artisan inscrit sur RenoLink s'engage, lors de son inscription, à reverser 8% du montant HT de chaque chantier signé via la plateforme. Le non-respect de cette clause entraîne la suspension du compte et des poursuites pour inexécution contractuelle.
</div>

<div class="section">
  <h2>📅 Historique de la mise en relation</h2>
  ${d.historique.map(h => `<div class="histo-item"><span class="histo-date">${h.date}</span><span>${h.action}</span></div>`).join('')}
</div>

<footer>
  <strong>RenoLink</strong> — Plateforme de mise en relation artisans BTP — Lorraine<br>
  Ce document est strictement confidentiel. Les coordonnées client ne peuvent être utilisées qu'à des fins de réalisation de ce projet.<br>
  Contact : contact@renolink.fr — renolink.fr
</footer>

</body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 600);
  showToast('📄 Dossier PDF ouvert — impression disponible', 'success');
}

// ════════════════════════════════════════
// KPIs
// ════════════════════════════════════════
function updateKPIs() {
  const nbAcceptes = Object.values(artisanState.leadStatuts).filter(s => s === 'accepte').length + dossierAcceptés.length;
  const nbSignes   = dossierAcceptés.filter(d => d.statut === 'signe').length;
  const caGenere   = dossierAcceptés.filter(d => d.statut === 'signe').reduce((s,d) => s + d.budget, 0);
  const commDues   = dossierAcceptés.filter(d => d.statut === 'signe').reduce((s,d) => s + d.commission, 0);

  const el = id => document.getElementById(id);
  if (el('kpiLeads'))    el('kpiLeads').textContent    = leadsProposés.length;
  if (el('kpiAcceptes')) el('kpiAcceptes').textContent = dossierAcceptés.length;
  if (el('kpiSignes'))   el('kpiSignes').textContent   = nbSignes;
  if (el('kpiCA'))       el('kpiCA').textContent       = caGenere.toLocaleString('fr-FR') + ' €';
  if (el('kpiComm'))     el('kpiComm').textContent     = commDues.toLocaleString('fr-FR') + ' €';
}

// ════════════════════════════════════════
// TOAST
// ════════════════════════════════════════
function showToast(msg, type = 'info') {
  const old = document.getElementById('rl-toast');
  if (old) old.remove();
  const c = {success:{bg:'#D1FAE5',color:'#065F46',border:'#6EE7B7'},error:{bg:'#FEF2F2',color:'#991B1B',border:'#FECACA'},info:{bg:'#EFF6FF',color:'#1E40AF',border:'#BFDBFE'}}[type]||{bg:'#EFF6FF',color:'#1E40AF',border:'#BFDBFE'};
  const t = document.createElement('div');
  t.id = 'rl-toast';
  t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:${c.bg};color:${c.color};border:1px solid ${c.border};padding:14px 20px;border-radius:10px;font-size:0.82rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.12);max-width:380px;line-height:1.5;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 5000);
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  updateKPIs();
  renderLeads();
  renderDossiers();
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fermerDossierModal();
  });
});

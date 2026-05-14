/* ═══════════════════════════════════════
   RENOLINK — dashboard-admin.js v2
   Dashboard admin complet
   ═══════════════════════════════════════ */
// ══════════════════════════════════════════
// DONNÉES DEMO
// ══════════════════════════════════════════
let projects = [
  { id:'RL-2026-047', type:'Rénovation salle de bain', client:{nom:'Martin Jean',tel:'06 12 34 56 78',email:'jean.martin@email.fr',pref:'Téléphone'}, ville:'Nancy', cp:'54000', surface:'7,5 m²', budget:11000, delai:'Dans 1 à 3 mois', desc:'Dépose baignoire, pose douche italienne, carrelage sol/murs. 3e étage sans ascenseur.', statut:'nouveau', date:'2026-04-28', artisanAssigne:null, notes:'', montantSigne:0, historique:[{a:'Dossier reçu',d:'28/04/2026 14:32'}] },
  { id:'RL-2026-046', type:'Isolation ITE', client:{nom:'Dupont Marie',tel:'06 98 76 54 32',email:'marie.dupont@email.fr',pref:'Email'}, ville:'Metz', cp:'57000', surface:'120 m²', budget:18500, delai:'Dans 3 à 6 mois', desc:'ITE maison 120m² de 1972. Façades nord et sud. Éligible MaPrimeRénov\'.',statut:'valide', date:'2026-04-27', artisanAssigne:'THERMIQUE EST', notes:'Budget confirmé. Client sérieux.', montantSigne:0, historique:[{a:'Dossier reçu',d:'27/04 09:15'},{a:'Validé par admin',d:'27/04 11:00'},{a:'Proposé à THERMIQUE EST',d:'27/04 14:00'}] },
  { id:'RL-2026-045', type:'Rénovation cuisine', client:{nom:'Bernard Sophie',tel:'07 11 22 33 44',email:'sophie.bernard@email.fr',pref:'SMS'}, ville:'Nancy', cp:'54000', surface:'14 m²', budget:9500, delai:'Dans 1 à 3 mois', desc:'Dépose ancienne cuisine, pose nouvelle fournie, carrelage, peinture.', statut:'visite', date:'2026-04-26', artisanAssigne:'RENOV HABITAT', notes:'Visite prévue le 02/05.', montantSigne:0, historique:[{a:'Dossier reçu',d:'26/04'},{a:'Artisan assigné',d:'26/04'},{a:'Visite planifiée 02/05',d:'27/04'}] },
  { id:'RL-2026-043', type:'Réfection toiture', client:{nom:'Schmitt Alain',tel:'06 77 88 99 00',email:'alain.schmitt@email.fr',pref:'Téléphone'}, ville:'Metz', cp:'57000', surface:'180 m²', budget:22000, delai:'Dans 1 à 3 mois', desc:'Toiture tuile 180m². Velux x3. Traitement charpente préventif.', statut:'signe', date:'2026-04-20', artisanAssigne:'COUVERTURE LORRAINE', notes:'Signé 22/04. Commission à facturer.', montantSigne:22000, historique:[{a:'Dossier reçu',d:'20/04'},{a:'Artisan assigné',d:'21/04'},{a:'Visite chantier',d:'22/04'},{a:'Chantier signé — 22 000 €',d:'22/04'}] },
  { id:'RL-2026-042', type:'Peinture intérieure', client:{nom:'Morel Céline',tel:'07 33 44 55 66',email:'celine.morel@email.fr',pref:'Email'}, ville:'Verdun', cp:'55100', surface:'80 m²', budget:2800, delai:'Dans le mois', desc:'T3 80m². Murs et plafonds. Peinture fournie.', statut:'perdu', date:'2026-04-18', artisanAssigne:null, notes:'Artisan non disponible sur la période.', montantSigne:0, historique:[{a:'Dossier reçu',d:'18/04'},{a:'Aucun artisan disponible — Perdu',d:'20/04'}] },
];

let artisans = [
  { id:'A001', rs:'RENOV HABITAT', metier:'Rénovation intérieure', ville:'Nancy', tel:'06 10 20 30 40', email:'contact@renovhabitat.fr', zone:'Nancy, Meurthe-et-Moselle', kbis:true, decennale:true, rcpro:true, rge:true, qualibat:true, qualipac:false, statut:'actif', notes:'Artisan fondateur. Très réactif.' },
  { id:'A002', rs:'THERMIQUE EST', metier:'Chauffage, PAC, Isolation', ville:'Nancy', tel:'06 30 40 50 60', email:'contact@thermiqueest.fr', zone:'Grand Est', kbis:true, decennale:true, rcpro:true, rge:true, qualibat:false, qualipac:true, statut:'actif', notes:'' },
  { id:'A003', rs:'BATI EXPERT', metier:'Électricité', ville:'Metz', tel:'06 20 30 40 50', email:'contact@batiexpert.fr', zone:'Metz, Moselle', kbis:true, decennale:false, rcpro:true, rge:false, qualibat:false, qualipac:false, statut:'attente', notes:'Décennale à confirmer.' },
];

// ══════════════════════════════════════════
// STATE
// ══════════════════════════════════════════
let activeFilter = 'tous';
let searchTerm = '';
let activeProject = null;

// ══════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════
const pageTitles = {
  projets:    { title:'Projets clients', sub:'Qualification et suivi des dossiers' },
  artisans:   { title:'Réseau artisans', sub:'Gérez vos artisans partenaires' },
  commissions:{ title:'Commissions 8%', sub:'Suivi des revenus' },
  parametres: { title:'Paramètres', sub:'Configuration du compte' },
};
function showPage(name, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  if(el) el.classList.add('active');
  const t = pageTitles[name];
  document.getElementById('page-title').textContent = t.title;
  document.getElementById('page-sub').textContent = t.sub;
  // topbar actions
  const ta = document.getElementById('topbar-actions');
  if(name==='projets') ta.innerHTML = `<button class="tbtn" onclick="exportCSV()">📥 Exporter CSV</button><button class="tbtn gold" onclick="openAddProject()">+ Nouveau projet</button>`;
  else if(name==='artisans') ta.innerHTML = `<button class="tbtn gold" onclick="openAddArtisan()">+ Ajouter artisan</button>`;
  else ta.innerHTML = '';
  if(name==='commissions') renderCommissions();
  if(name==='artisans') renderArtisans();
}

// ══════════════════════════════════════════
// KPIs
// ══════════════════════════════════════════
function renderKPIs() {
  const total = projects.length;
  const nvx   = projects.filter(p => p.statut==='nouveau').length;
  const sign  = projects.filter(p => p.statut==='signe').length;
  const comm  = projects.filter(p => p.statut==='signe').reduce((s,p) => s + Math.round((p.montantSigne||p.budget)*0.08), 0);
  document.getElementById('k-total').textContent = total;
  document.getElementById('k-new').textContent   = nvx;
  document.getElementById('k-signe').textContent = sign;
  document.getElementById('k-comm').textContent  = comm.toLocaleString('fr-FR') + ' €';
  document.getElementById('nb-new').textContent  = nvx || '';
  // artisan KPIs
  document.getElementById('nb-art').textContent  = artisans.length;
  document.getElementById('k-art-actif').textContent  = artisans.filter(a=>a.statut==='actif').length;
  document.getElementById('k-art-att').textContent    = artisans.filter(a=>a.statut==='attente').length;
  document.getElementById('k-art-total').textContent  = artisans.length;
  document.getElementById('k-art-rge').textContent    = artisans.filter(a=>a.rge).length;
}

// ══════════════════════════════════════════
// FILTER & SEARCH
// ══════════════════════════════════════════
function setFilter(f, el) {
  activeFilter = f;
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  if(el) el.classList.add('active');
  renderProjects();
}
function filterProjects(val) {
  searchTerm = val.toLowerCase();
  renderProjects();
}
function getFiltered() {
  return projects.filter(p => {
    const ms = activeFilter==='tous' || p.statut===activeFilter;
    const mr = !searchTerm || p.id.toLowerCase().includes(searchTerm) ||
      p.type.toLowerCase().includes(searchTerm) ||
      p.client.nom.toLowerCase().includes(searchTerm) ||
      p.ville.toLowerCase().includes(searchTerm);
    return ms && mr;
  });
}

// ══════════════════════════════════════════
// RENDER PROJECTS
// ══════════════════════════════════════════
const statutCfg = {
  nouveau:   { text:'🔵 Nouveau',  cls:'s-new' },
  valide:    { text:'✅ Validé',   cls:'s-valide' },
  'en-cours':{ text:'🟡 En cours', cls:'s-cours' },
  visite:    { text:'📍 Visite',   cls:'s-visite' },
  devis:     { text:'📄 Devis',    cls:'s-devis' },
  signe:     { text:'🤝 Signé',    cls:'s-signe' },
  perdu:     { text:'❌ Perdu',    cls:'s-perdu' },
  rejete:    { text:'🚫 Rejeté',   cls:'s-rejete' },
};

function renderProjects() {
  const filtered = getFiltered();
  document.getElementById('count-label').textContent = filtered.length + ' projet(s)';
  const body = document.getElementById('projects-body');
  if(!filtered.length) {
    body.innerHTML = '<div class="empty"><div class="ei">📭</div><h3>Aucun projet</h3><p>Modifiez les filtres ou ajoutez un projet</p></div>';
    return;
  }
  body.innerHTML = filtered.map(p => {
    const st = statutCfg[p.statut] || { text:p.statut, cls:'' };
    return `
    <div class="table-row" onclick="openProject('${p.id}')">
      <div class="dref">${p.id}</div>
      <div>
        <div class="dname">${p.type}</div>
        <div class="dmeta">${p.client.nom} · ${p.ville} (${p.cp})</div>
      </div>
      <div><span class="statut ${st.cls}">${st.text}</span></div>
      <div style="font-weight:700;color:var(--gold);font-size:.82rem;">${p.budget.toLocaleString('fr-FR')} €</div>
      <div style="font-size:.72rem;color:var(--muted);">${p.date}</div>
      <div class="actions" onclick="event.stopPropagation()">
        <button class="abtn" title="Ouvrir" onclick="openProject('${p.id}')">👁️</button>
        <button class="abtn" title="PDF" onclick="exportPDF('${p.id}')">📄</button>
        <button class="abtn" title="WhatsApp" onclick="sendWA('${p.id}')">💬</button>
        <button class="abtn danger" title="Rejeter" onclick="reject('${p.id}')">🚫</button>
      </div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════
// OPEN / CLOSE MODAL PROJET
// ══════════════════════════════════════════
function openProject(id) {
  const p = projects.find(x=>x.id===id);
  if(!p) return;
  activeProject = p;

  const st = statutCfg[p.statut] || { text:p.statut, cls:'' };
  document.getElementById('m-title').textContent = p.type;
  document.getElementById('m-ref').textContent   = p.id;
  document.getElementById('m-statut-badge').innerHTML = `<span class="statut ${st.cls}">${st.text}</span>`;

  document.getElementById('m-nom').textContent    = p.client.nom;
  document.getElementById('m-tel').textContent    = p.client.tel;
  document.getElementById('m-email').textContent  = p.client.email;
  document.getElementById('m-pref').textContent   = p.client.pref;
  document.getElementById('m-type').textContent   = p.type;
  document.getElementById('m-ville').textContent  = p.ville + ' (' + p.cp + ')';
  document.getElementById('m-surface').textContent= p.surface;
  document.getElementById('m-budget').textContent = p.budget.toLocaleString('fr-FR') + ' €';
  document.getElementById('m-delai').textContent  = p.delai;
  document.getElementById('m-date').textContent   = 'Reçu le ' + p.date;
  document.getElementById('m-desc').textContent   = p.desc;
  document.getElementById('m-comm').textContent   = Math.round((p.montantSigne||p.budget)*0.08).toLocaleString('fr-FR') + ' €';
  document.getElementById('m-notes').value        = p.notes;
  document.getElementById('m-statut-select').value= p.statut;
  document.getElementById('m-montant-signe').value= p.montantSigne || '';

  // Artisan assigné
  const aEl = document.getElementById('m-artisan-assigned');
  aEl.innerHTML = p.artisanAssigne
    ? `<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#FFFBF5;border:1px solid rgba(184,130,10,.2);border-radius:8px;font-size:.8rem;"><span>🔨</span><span style="font-weight:600;">${p.artisanAssigne}</span><span class="statut s-envoye" style="margin-left:auto;">📤 Proposé</span></div>`
    : `<div style="font-size:.78rem;color:var(--muted);padding:6px 0;">Aucun artisan assigné pour le moment</div>`;

  // Boutons artisans
  document.getElementById('m-artisan-btns').innerHTML = artisans
    .filter(a=>a.statut==='actif')
    .map(a=>`<button class="mfbtn" onclick="assignArtisan('${a.id}')">🔨 ${a.rs}</button>`)
    .join('');

  // Timeline
  document.getElementById('m-timeline').innerHTML = p.historique.map(h=>`
    <div class="tl-item">
      <div class="tl-dot done">✓</div>
      <div class="tl-content"><h5>${h.a}</h5><p>${h.d}</p></div>
    </div>`).join('');

  openModal('modal-projet');
}

function updateStatut() {
  if(!activeProject) return;
  const newS = document.getElementById('m-statut-select').value;
  const p = projects.find(x=>x.id===activeProject.id);
  if(!p) return;
  p.statut = newS;
  const st = statutCfg[newS] || { text:newS, cls:'' };
  document.getElementById('m-statut-badge').innerHTML = `<span class="statut ${st.cls}">${st.text}</span>`;
  p.historique.push({ a:'Statut → ' + st.text.replace(/^[^ ]+ /,''), d: now() });
  document.getElementById('m-timeline').innerHTML += `<div class="tl-item"><div class="tl-dot active">→</div><div class="tl-content"><h5>Statut mis à jour : ${st.text}</h5><p>${now()}</p></div></div>`;
  renderProjects();
  renderKPIs();
  toast('Statut mis à jour : ' + st.text, 'success');
}

function updateMontantSigne() {
  if(!activeProject) return;
  const p = projects.find(x=>x.id===activeProject.id);
  if(!p) return;
  p.montantSigne = parseInt(document.getElementById('m-montant-signe').value) || 0;
  const comm = Math.round(p.montantSigne * 0.08);
  document.getElementById('m-comm').textContent = comm.toLocaleString('fr-FR') + ' €';
  renderKPIs();
}

function assignArtisan(artisanId) {
  if(!activeProject) return;
  const p = projects.find(x=>x.id===activeProject.id);
  const a = artisans.find(x=>x.id===artisanId);
  if(!p||!a) return;
  p.artisanAssigne = a.rs;
  p.historique.push({ a:'Dossier proposé à ' + a.rs, d: now() });
  openProject(p.id);
  renderProjects();
  toast('📤 Dossier proposé à ' + a.rs, 'success');
}

function saveNotes() {
  if(!activeProject) return;
  const p = projects.find(x=>x.id===activeProject.id);
  if(p) { p.notes = document.getElementById('m-notes').value; toast('Notes sauvegardées','success'); }
}

function rejectProject() {
  if(!activeProject) return;
  if(!confirm('Rejeter le projet ' + activeProject.id + ' ?')) return;
  const p = projects.find(x=>x.id===activeProject.id);
  if(p) { p.statut='rejete'; p.historique.push({a:'Rejeté par admin',d:now()}); }
  closeModal('modal-projet');
  renderProjects();
  renderKPIs();
  toast('Projet rejeté','error');
}

// Actions rapides depuis table
function reject(id) {
  if(!confirm('Rejeter ' + id + ' ?')) return;
  const p = projects.find(x=>x.id===id);
  if(p) { p.statut='rejete'; renderProjects(); renderKPIs(); toast('Rejeté','error'); }
}

// ══════════════════════════════════════════
// AJOUTER PROJET
// ══════════════════════════════════════════
function openAddProject() { openModal('modal-add-project'); }
function submitAddProject() {
  const type   = document.getElementById('add-type').value.trim();
  const nom    = document.getElementById('add-nom').value.trim();
  const tel    = document.getElementById('add-tel').value.trim();
  const email  = document.getElementById('add-email').value.trim();
  const ville  = document.getElementById('add-ville').value.trim();
  const cp     = document.getElementById('add-cp').value.trim();
  const budget = parseInt(document.getElementById('add-budget').value)||0;
  const surface= document.getElementById('add-surface').value.trim();
  const desc   = document.getElementById('add-desc').value.trim();
  const delai  = document.getElementById('add-delai').value;
  const pref   = document.getElementById('add-pref').value;

  if(!type||!nom||!tel||!ville||budget<1500) {
    toast('⚠️ Remplissez les champs obligatoires (budget min. 1 500 €)','error'); return;
  }
  const newId = 'RL-2026-' + String(projects.length + 48).padStart(3,'0');
  projects.unshift({
    id:newId, type, client:{nom,tel,email,pref},
    ville, cp, surface:surface||'N/A', budget, delai, desc,
    statut:'nouveau', date:today(), artisanAssigne:null,
    notes:'Ajouté manuellement.', montantSigne:0,
    historique:[{a:'Créé manuellement par admin',d:now()}]
  });
  closeModal('modal-add-project');
  renderProjects();
  renderKPIs();
  toast('✅ Projet ' + newId + ' créé','success');
  // reset
  ['add-type','add-nom','add-tel','add-email','add-ville','add-cp','add-budget','add-surface','add-desc'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
}

// ══════════════════════════════════════════
// AJOUTER ARTISAN
// ══════════════════════════════════════════
function openAddArtisan() { openModal('modal-add-artisan'); }
function submitAddArtisan() {
  const rs     = document.getElementById('art-rs').value.trim();
  const tel    = document.getElementById('art-tel').value.trim();
  const email  = document.getElementById('art-email').value.trim();
  const metier = document.getElementById('art-metier').value.trim();
  const ville  = document.getElementById('art-ville').value.trim();
  const siret  = document.getElementById('art-siret').value.trim();

  if(!rs||!tel||!metier||!ville) {
    toast('⚠️ Remplissez les champs obligatoires','error'); return;
  }
  artisans.push({
    id:'A'+String(artisans.length+10).padStart(3,'0'),
    rs, siret, metier, ville, tel, email,
    zone:document.getElementById('art-zone').value.trim(),
    kbis:document.getElementById('art-kbis').checked,
    decennale:document.getElementById('art-decennale').checked,
    rcpro:document.getElementById('art-rcpro').checked,
    rge:document.getElementById('art-rge').checked,
    qualibat:document.getElementById('art-qualibat').checked,
    qualipac:document.getElementById('art-qualipac').checked,
    statut:'attente',
    notes:document.getElementById('art-notes').value
  });
  closeModal('modal-add-artisan');
  renderArtisans();
  renderKPIs();
  toast('✅ Artisan ' + rs + ' ajouté — en attente de validation','success');
}

// ══════════════════════════════════════════
// RENDER ARTISANS
// ══════════════════════════════════════════
function renderArtisans() {
  const body = document.getElementById('artisans-body');
  if(!artisans.length) {
    body.innerHTML = '<div class="empty"><div class="ei">🔨</div><h3>Aucun artisan</h3><p>Ajoutez votre premier artisan</p></div>';
    return;
  }
  body.innerHTML = artisans.map(a => {
    const tags = [
      a.kbis && '<span class="art-tag">KBIS</span>',
      a.decennale && '<span class="art-tag">Décennale</span>',
      a.rge && '<span class="art-tag rge">RGE</span>',
      a.qualibat && '<span class="art-tag">Qualibat</span>',
      a.qualipac && '<span class="art-tag rge">QualiPAC</span>',
    ].filter(Boolean).join('');
    const stBadge = a.statut==='actif'
      ? '<span class="statut s-signe">✅ Actif</span>'
      : '<span class="statut s-cours">⏳ En attente</span>';
    return `
    <div class="artisan-row">
      <div class="art-av">🔨</div>
      <div class="art-info">
        <h4>${a.rs}</h4>
        <p>📍 ${a.ville} · ${a.metier}</p>
        <p style="font-size:.68rem;color:var(--muted);margin-top:2px;">Zone : ${a.zone||'N/R'}</p>
      </div>
      <div class="art-tags">${tags}</div>
      ${stBadge}
      <div class="actions" style="margin-left:12px;">
        <button class="abtn" title="Appeler" onclick="toast('📞 ${a.tel}','info')">📞</button>
        <button class="abtn" title="Email" onclick="toast('✉️ ${a.email}','info')">✉️</button>
        <button class="abtn" title="WhatsApp" onclick="window.open('https://wa.me/33${a.tel.replace(/\s/g,'').replace(/^0/,'')}','_blank')">💬</button>
        ${a.statut==='attente'
          ? `<button class="abtn" title="Valider" onclick="validateArtisan('${a.id}')">✅</button>`
          : `<button class="abtn danger" title="Suspendre" onclick="suspendArtisan('${a.id}')">⏸️</button>`}
      </div>
    </div>`;
  }).join('');
}

function validateArtisan(id) {
  const a = artisans.find(x=>x.id===id);
  if(a) { a.statut='actif'; renderArtisans(); renderKPIs(); toast('✅ '+a.rs+' validé et actif','success'); }
}
function suspendArtisan(id) {
  const a = artisans.find(x=>x.id===id);
  if(a && confirm('Suspendre '+a.rs+' ?')) { a.statut='attente'; renderArtisans(); renderKPIs(); toast('⏸️ Artisan suspendu','error'); }
}

// ══════════════════════════════════════════
// COMMISSIONS
// ══════════════════════════════════════════
function renderCommissions() {
  const signed = projects.filter(p=>p.statut==='signe');
  const ca = signed.reduce((s,p)=>s+(p.montantSigne||p.budget),0);
  const comm = signed.reduce((s,p)=>s+Math.round((p.montantSigne||p.budget)*0.08),0);
  document.getElementById('k-ca').textContent    = ca.toLocaleString('fr-FR') + ' €';
  document.getElementById('k-comm2').textContent = comm.toLocaleString('fr-FR') + ' €';
  document.getElementById('k-nb-sign').textContent = signed.length;

  const t = document.getElementById('comm-table');
  if(!signed.length) {
    t.innerHTML = '<div class="empty"><div class="ei">💶</div><h3>Aucun chantier signé</h3><p>Les chantiers signés apparaîtront ici</p></div>';
    return;
  }
  t.innerHTML = `
    <div style="display:grid;grid-template-columns:100px 1fr 130px 110px 120px;padding:10px 18px;background:#F9F6F1;border-bottom:1px solid var(--border);font-size:.65rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;">
      <div>Réf.</div><div>Chantier</div><div>Artisan</div><div>Montant HT</div><div>Commission 8%</div>
    </div>
    ${signed.map(p=>`
    <div style="display:grid;grid-template-columns:100px 1fr 130px 110px 120px;padding:14px 18px;border-bottom:1px solid #F5F2ED;align-items:center;">
      <div class="dref">${p.id}</div>
      <div><div class="dname">${p.type}</div><div class="dmeta">${p.client.nom} · ${p.ville}</div></div>
      <div style="font-size:.78rem;font-weight:600;">${p.artisanAssigne||'—'}</div>
      <div style="font-weight:700;">${(p.montantSigne||p.budget).toLocaleString('fr-FR')} €</div>
      <div style="font-weight:700;color:var(--gold);">${Math.round((p.montantSigne||p.budget)*0.08).toLocaleString('fr-FR')} €
        <span class="statut s-cours" style="display:block;width:fit-content;margin-top:4px;font-size:.6rem;">À encaisser</span>
      </div>
    </div>`).join('')}`;
}

// ══════════════════════════════════════════
// EXPORT CSV
// ══════════════════════════════════════════
function exportCSV() {
  const header = ['Référence','Type','Client','Téléphone','Email','Ville','CP','Budget','Statut','Artisan','Date','Commission 8%'].join(';');
  const rows = projects.map(p=>[
    p.id, p.type, p.client.nom, p.client.tel, p.client.email,
    p.ville, p.cp, p.budget, p.statut, p.artisanAssigne||'—', p.date,
    Math.round((p.montantSigne||p.budget)*0.08)
  ].join(';'));
  const csv = [header,...rows].join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'renolink-projets-'+today()+'.csv';
  a.click();
  toast('📥 Export CSV téléchargé','success');
}

// ══════════════════════════════════════════
// EXPORT PDF
// ══════════════════════════════════════════
function exportProjectPDF() {
  if(activeProject) exportPDF(activeProject.id);
}
function exportPDF(id) {
  const p = projects.find(x=>x.id===id);
  if(!p) return;
  const comm = Math.round((p.montantSigne||p.budget)*0.08);
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Dossier ${p.id}</title>
<style>body{font-family:Arial,sans-serif;margin:40px;color:#1A1714;font-size:13px;}
h1{font-size:20px;margin-bottom:4px;}.ref{color:#B8820A;font-weight:700;margin-bottom:20px;font-size:13px;}
.section{margin-bottom:18px;padding:14px;border:1px solid #E4DDD0;border-radius:8px;}
.section h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#7A736A;margin-bottom:10px;}
.row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #F5F2ED;font-size:12px;}
.row:last-child{border-bottom:none;}.label{color:#7A736A;}.value{font-weight:600;}
.comm{background:#FEF3E2;border:2px solid #B8820A;border-radius:8px;padding:14px;text-align:center;margin:16px 0;}
.comm h3{color:#92400E;font-size:13px;margin-bottom:6px;}.comm .amount{font-size:26px;font-weight:700;color:#B8820A;}
footer{margin-top:28px;padding-top:12px;border-top:1px solid #E4DDD0;font-size:11px;color:#7A736A;text-align:center;}
@media print{body{margin:20px;}}</style></head><body>
<div style="display:flex;justify-content:space-between;margin-bottom:20px;">
  <div><h1>Dossier Projet — RenoLink</h1><div class="ref">${p.id}</div><div style="font-size:11px;color:#7A736A;">Généré le ${now()}</div></div>
  <div style="text-align:right;"><div style="font-size:18px;font-weight:900;">Reno<span style="color:#B8820A;">Link</span></div><div style="font-size:11px;color:#7A736A;">Lorraine — Artisans vérifiés</div></div>
</div>
<div class="section"><h2>👤 Client</h2>
<div class="row"><span class="label">Nom</span><span class="value">${p.client.nom}</span></div>
<div class="row"><span class="label">Téléphone</span><span class="value">${p.client.tel}</span></div>
<div class="row"><span class="label">Email</span><span class="value">${p.client.email}</span></div>
<div class="row"><span class="label">Préférence</span><span class="value">${p.client.pref}</span></div></div>
<div class="section"><h2>🏗️ Projet</h2>
<div class="row"><span class="label">Type</span><span class="value">${p.type}</span></div>
<div class="row"><span class="label">Localisation</span><span class="value">${p.ville} (${p.cp})</span></div>
<div class="row"><span class="label">Surface</span><span class="value">${p.surface}</span></div>
<div class="row"><span class="label">Budget estimé</span><span class="value" style="color:#B8820A;">${p.budget.toLocaleString('fr-FR')} €</span></div>
<div class="row"><span class="label">Délai</span><span class="value">${p.delai}</span></div>
<div class="row"><span class="label">Statut</span><span class="value">${p.statut}</span></div>
<div style="margin-top:10px;"><div class="label" style="margin-bottom:5px;">Description :</div><div style="line-height:1.6;">${p.desc}</div></div></div>
<div class="comm"><h3>💶 Commission RenoLink — 8%</h3><div class="amount">${comm.toLocaleString('fr-FR')} €</div>
<div style="font-size:11px;color:#92400E;margin-top:6px;">En cas de signature, l'artisan s'engage à verser ${comm.toLocaleString('fr-FR')} € à RenoLink.</div></div>
${p.artisanAssigne ? `<div class="section"><h2>🔨 Artisan assigné</h2><div class="row"><span class="label">Artisan</span><span class="value">${p.artisanAssigne}</span></div></div>` : ''}
<div class="section"><h2>📅 Historique</h2>${p.historique.map(h=>`<div class="row"><span class="label">${h.d}</span><span class="value">${h.a}</span></div>`).join('')}</div>
${p.notes ? `<div class="section"><h2>📝 Notes internes</h2><div style="line-height:1.6;">${p.notes}</div></div>` : ''}
<footer>RenoLink — Lorraine · Ce document est confidentiel.</footer></body></html>`;
  const win = window.open('','_blank');
  win.document.write(html);
  win.document.close();
  setTimeout(()=>win.print(),500);
  toast('📄 PDF ouvert — impression disponible','success');
}

// ══════════════════════════════════════════
// WHATSAPP / EMAIL / APPEL
// ══════════════════════════════════════════
function sendWA(id, customPhone = null) {

  const p = projects.find(x => x.id === id);

  if (!p) return;

  // numéro choisi
  const phone = customPhone || p.client.tel;

  // nettoyage du numéro
  const cleanPhone = phone
    .replace(/\s/g, '')
    .replace(/^0/, '');

  // message WhatsApp
  const msg = encodeURIComponent(
`Bonjour,

Nous avons bien reçu votre projet RenoLink (${p.id}).

Type : ${p.type}
Ville : ${p.ville}

Nous revenons vers vous sous 48h.

L'équipe RenoLink`
  );

  // ouverture WhatsApp
  window.open(
    `https://wa.me/33${cleanPhone}?text=${msg}`,
    '_blank'
  );
}

function sendWhatsApp() {
  if (activeProject) {
    sendWA(activeProject.id);
  }
}

function emailClient() {

  if (!activeProject) return;

  const p = activeProject;

  window.location.href =
`mailto:${p.client.email}?subject=Votre projet RenoLink ${p.id}&body=Bonjour ${p.client.nom.split(' ')[0]},

Merci pour votre dossier RenoLink (${p.id}) concernant : ${p.type}.

Nous revenons vers vous prochainement.

Cordialement,
L'équipe RenoLink`;
}

function sendEmail() {
  emailClient();
}

function callClient() {

  if (!activeProject) return;

  window.location.href =
    `tel:${activeProject.client.tel.replace(/\s/g,'')}`;
}

function whatsappClient() {

  if (!activeProject) return;

  const assignedPhone = activeProject.client.tel;

  // choix utilisateur
  const useAssigned = confirm(
`Envoyer au numéro du client ?

${assignedPhone}

OK = numéro du client
Annuler = autre numéro`
  );

  if (useAssigned) {

    // numéro du client
    sendWA(activeProject.id);

  } else {

    // autre numéro
    const otherPhone = prompt(
      "Entrez un autre numéro WhatsApp :"
    );

    if (!otherPhone) return;

    sendWA(activeProject.id, otherPhone);
  }
}
// ══════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow='';
  activeProject = null;
}
function now() {
  return new Date().toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
}
function today() {
  return new Date().toISOString().split('T')[0];
}
function toast(msg, type='info') {
  const t = document.getElementById('toast');
  const colors = {
    success:{bg:'#D1FAE5',color:'#065F46',border:'#6EE7B7'},
    error:  {bg:'#FEF2F2',color:'#991B1B',border:'#FECACA'},
    info:   {bg:'#EFF6FF',color:'#1E40AF',border:'#BFDBFE'},
  }[type]||{bg:'#EFF6FF',color:'#1E40AF',border:'#BFDBFE'};
  t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:${colors.bg};color:${colors.color};border:1px solid ${colors.border};padding:12px 18px;border-radius:10px;font-size:.8rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.12);max-width:340px;line-height:1.4;display:block;animation:slideUp .25s ease;`;
  t.textContent = msg;
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.style.display='none', 4000);
}

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  renderKPIs();
  renderProjects();

  // Fermer modals sur overlay click
  document.querySelectorAll('.overlay').forEach(ov => {
    ov.addEventListener('click', e => { if(e.target===ov) closeModal(ov.id); });
  });

  // ESC
  document.addEventListener('keydown', e => {
    if(e.key==='Escape') document.querySelectorAll('.overlay.open').forEach(ov=>closeModal(ov.id));
  });
});


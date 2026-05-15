/* ═══════════════════════════════════════════
   RENOLINK — dashboard-admin.js
   Logique principale du dashboard admin MVP
   ═══════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════
const pageTitles = {
  projets:     { title: 'Projets clients',   sub: 'Qualification et suivi des dossiers' },
  artisans:    { title: 'Réseau artisans',   sub: 'Gérez vos artisans partenaires' },
  commissions: { title: 'Commissions 8%',    sub: 'Suivi des revenus et facturation' },
  parametres:  { title: 'Paramètres',        sub: 'Configuration du compte admin' },
};

function showPage(name, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById('page-' + name);
  if (pageEl) pageEl.classList.remove('active') || pageEl.classList.add('active');
  if (el) el.classList.add('active');

  const t = pageTitles[name] || pageTitles.projets;
  document.getElementById('page-title').textContent = t.title;
  document.getElementById('page-sub').textContent   = t.sub;

  // Topbar actions selon page
  const ta = document.getElementById('topbar-actions');
  if (name === 'projets') {
    ta.innerHTML = `
      <button class="tbtn" onclick="exportCSV()">📥 CSV</button>
      <button class="tbtn gold" onclick="openAddProject()">+ Nouveau projet</button>`;
  } else if (name === 'artisans') {
    ta.innerHTML = `<button class="tbtn gold" onclick="openAddArtisan()">+ Ajouter artisan</button>`;
  } else {
    ta.innerHTML = '';
  }

  if (name === 'commissions') renderCommissions();
  if (name === 'artisans')    renderArtisans();
  if (name === 'projets')     renderProjects();
}

// ══════════════════════════════════════════
// KPIs
// ══════════════════════════════════════════
function renderKPIs() {
  const total = projects.length;
  const nvx   = projects.filter(p => p.statut === 'nouveau').length;
  const sign  = projects.filter(p => p.statut === 'signe').length;
  const comm  = projects
    .filter(p => p.statut === 'signe')
    .reduce((s, p) => s + Math.round((p.montantSigne || p.budget) * 0.08), 0);

  setEl('k-total', total);
  setEl('k-new',   nvx);
  setEl('k-signe', sign);
  setEl('k-comm',  comm.toLocaleString('fr-FR') + ' €');
  setEl('nb-new',  nvx || '');

  // Artisans KPIs
  setEl('nb-art',       artisans.length);
  setEl('k-art-actif',  artisans.filter(a => a.statut === 'actif').length);
  setEl('k-art-att',    artisans.filter(a => a.statut === 'attente').length);
  setEl('k-art-total',  artisans.length);
  setEl('k-art-rge',    artisans.filter(a => a.rge).length);
}

// ══════════════════════════════════════════
// FILTRES & RECHERCHE
// ══════════════════════════════════════════
function setFilter(f, el) {
  AppState.activeFilter = f;
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderProjects();
}

function filterProjects(val) {
  AppState.searchTerm = sanitize(val).toLowerCase();
  renderProjects();
}

function getFiltered() {
  return projects.filter(p => {
    const matchStatut  = AppState.activeFilter === 'tous' || p.statut === AppState.activeFilter;
    const matchSearch  = !AppState.searchTerm ||
      p.id.toLowerCase().includes(AppState.searchTerm) ||
      p.type.toLowerCase().includes(AppState.searchTerm) ||
      p.client.nom.toLowerCase().includes(AppState.searchTerm) ||
      p.ville.toLowerCase().includes(AppState.searchTerm);
    return matchStatut && matchSearch;
  });
}

// ══════════════════════════════════════════
// RENDER PROJETS
// ══════════════════════════════════════════
const statutCfg = {
  nouveau:    { text: '🔵 Nouveau',  cls: 's-new' },
  valide:     { text: '✅ Validé',   cls: 's-valide' },
  'en-cours': { text: '🟡 En cours', cls: 's-cours' },
  visite:     { text: '📍 Visite',   cls: 's-visite' },
  devis:      { text: '📄 Devis',    cls: 's-devis' },
  signe:      { text: '🤝 Signé',    cls: 's-signe' },
  perdu:      { text: '❌ Perdu',    cls: 's-perdu' },
  rejete:     { text: '🚫 Rejeté',   cls: 's-rejete' },
};

function renderProjects() {
  const filtered = getFiltered();
  setEl('count-label', filtered.length + ' projet(s)');
  const body = document.getElementById('projects-body');
  if (!body) return;

  if (!filtered.length) {
    body.innerHTML = `<div class="empty"><div class="ei">📭</div><h3>Aucun projet</h3><p>Modifiez les filtres ou ajoutez un projet manuellement</p></div>`;
    return;
  }

  body.innerHTML = filtered.map(p => {
    const st       = statutCfg[p.statut] || { text: p.statut, cls: '' };
    const nbPhotos = p.photos ? p.photos.length : 0;
    return `
    <div class="table-row" onclick="openProject('${escAttr(p.id)}')">
      <div class="dref">${escHtml(p.id)}</div>
      <div>
        <div class="dname">${escHtml(p.type)}</div>
        <div class="dmeta">${escHtml(p.client.nom)} · ${escHtml(p.ville)} (${escHtml(p.cp)})
          ${nbPhotos > 0 ? `<span style="margin-left:6px;font-size:.65rem;color:var(--gold);">📸 ${nbPhotos}</span>` : ''}
        </div>
      </div>
      <div><span class="statut ${st.cls}">${st.text}</span></div>
      <div style="font-weight:700;color:var(--gold);font-size:.82rem;">${p.budget.toLocaleString('fr-FR')} €</div>
      <div style="font-size:.72rem;color:var(--muted);">${escHtml(p.date)}</div>
      <div class="actions" onclick="event.stopPropagation()">
        <button class="abtn" title="Ouvrir" onclick="openProject('${escAttr(p.id)}')">👁️</button>
        <button class="abtn" title="Export PDF" onclick="exportPDF('${escAttr(p.id)}')">📄</button>
        <button class="abtn" title="WhatsApp client" onclick="sendWA('${escAttr(p.id)}')">💬</button>
        <button class="abtn danger" title="Rejeter" onclick="rejectFromTable('${escAttr(p.id)}')">🚫</button>
      </div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════
// OUVRIR MODAL PROJET
// ══════════════════════════════════════════
function openProject(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  AppState.activeProject = p;

  const st = statutCfg[p.statut] || { text: p.statut, cls: '' };

  setEl('m-title',  p.type);
  setEl('m-ref',    p.id);
  document.getElementById('m-statut-badge').innerHTML =
    `<span class="statut ${st.cls}">${st.text}</span>`;

  // Client
  setEl('m-nom',   p.client.nom);
  setEl('m-tel',   formatTel(p.client.tel));
  setEl('m-email', p.client.email);
  setEl('m-pref',  p.client.pref);

  // Projet
  setEl('m-type',    p.type);
  setEl('m-ville',   p.ville + ' (' + p.cp + ')');
  setEl('m-surface', p.surface);
  setEl('m-budget',  p.budget.toLocaleString('fr-FR') + ' €');
  setEl('m-delai',   p.delai);
  setEl('m-date',    'Reçu le ' + p.date);
  setEl('m-desc',    p.desc);
  setEl('m-comm',    Math.round((p.montantSigne || p.budget) * 0.08).toLocaleString('fr-FR') + ' €');

  // Notes
  document.getElementById('m-notes').value = p.notes || '';

  // Statut select
  document.getElementById('m-statut-select').value = p.statut;

  // Montant signé
  document.getElementById('m-montant-signe').value = p.montantSigne || '';

  // Artisan assigné
  renderAssignedArtisan(p);

  // Boutons proposition artisans
  renderArtisanButtons(p);

  // Photos
  renderModalPhotos(p);

  // Timeline
  renderTimeline(p);

  openModal('modal-projet');
}

// ══════════════════════════════════════════
// ARTISAN ASSIGNÉ DANS MODAL
// ══════════════════════════════════════════
function renderAssignedArtisan(p) {
  const el = document.getElementById('m-artisan-assigned');
  if (!el) return;
  if (p.artisanAssigne) {
    const art = artisans.find(a => a.rs === p.artisanAssigne);
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#FFFBF5;
                  border:1px solid rgba(184,130,10,.25);border-radius:8px;margin-bottom:10px;">
        <span>🔨</span>
        <div style="flex:1;">
          <div style="font-size:.84rem;font-weight:600;">${escHtml(p.artisanAssigne)}</div>
          ${art ? `<div style="font-size:.7rem;color:var(--muted);">${escHtml(art.metier)} · ${escHtml(art.ville)}</div>` : ''}
        </div>
        <span class="statut s-envoye">📤 Proposé</span>
        ${art ? `
        <button class="abtn" title="Appeler artisan" onclick="window.location.href='tel:${escAttr(art.tel)}'">📞</button>
        <button class="abtn" title="WhatsApp artisan" onclick="waArtisan('${escAttr(art.id)}')">💬</button>` : ''}
      </div>`;
  } else {
    el.innerHTML = `<p style="font-size:.78rem;color:var(--muted);padding:6px 0 10px;">Aucun artisan assigné pour le moment.</p>`;
  }
}

function renderArtisanButtons(p) {
  const el = document.getElementById('m-artisan-btns');
  if (!el) return;
  const actifs = artisans.filter(a => a.statut === 'actif');
  if (!actifs.length) {
    el.innerHTML = `<p style="font-size:.75rem;color:var(--muted);">Aucun artisan actif disponible.</p>`;
    return;
  }
  el.innerHTML = actifs.map(a =>
    `<button class="mfbtn ${p.artisanAssigne === a.rs ? 'gold' : ''}"
      onclick="assignArtisan('${escAttr(a.id)}')">
      🔨 ${escHtml(a.rs)}
      ${p.artisanAssigne === a.rs ? ' ✓' : ''}
    </button>`
  ).join('');
}

function assignArtisan(artisanId) {
  const p = AppState.activeProject;
  if (!p) return;
  const a = artisans.find(x => x.id === artisanId);
  if (!a) return;

  const proj = projects.find(x => x.id === p.id);
  proj.artisanAssigne = a.rs;
  proj.historique.push({ a: 'Dossier proposé à ' + a.rs, d: nowStr(), user: 'Admin' });
  AppState.activeProject = proj;

  renderAssignedArtisan(proj);
  renderArtisanButtons(proj);
  renderTimeline(proj);
  renderProjects();
  toast('📤 Dossier proposé à ' + a.rs + ' — Envoyez-lui le PDF par email ou WhatsApp', 'success');
}

// ══════════════════════════════════════════
// PHOTOS — GESTION COMPLÈTE
// ══════════════════════════════════════════
function renderModalPhotos(p) {
  const grid  = document.getElementById('m-photos-grid');
  const count = document.getElementById('m-photos-count');
  if (!grid) return;

  const photos = p.photos || [];
  setEl('m-photos-count', photos.length > 0
    ? `${photos.length} photo(s) — cliquez pour agrandir`
    : 'Aucune photo — ajoutez-en ci-dessous');

  if (!photos.length) {
    grid.innerHTML = `<div style="font-size:.75rem;color:var(--muted);padding:12px 0;">Aucune photo pour ce projet.</div>`;
    return;
  }

  grid.innerHTML = photos.map((ph, i) => `
    <div class="photo-thumb" onclick="openLightbox(${i})" title="${escAttr(ph.name)}">
      <img src="${ph.dataUrl}" alt="${escAttr(ph.name)}" loading="lazy">
      <button class="photo-remove" onclick="event.stopPropagation();removePhoto(${i})" title="Supprimer">✕</button>
      <div class="photo-name">${escHtml(ph.name.length > 16 ? ph.name.substring(0,14)+'…' : ph.name)}</div>
    </div>`
  ).join('');
}

// Upload photos depuis modal
function handlePhotoUpload(input) {
  const p = AppState.activeProject;
  if (!p) return;
  const proj = projects.find(x => x.id === p.id);
  if (!proj.photos) proj.photos = [];

  const files = Array.from(input.files);
  if (proj.photos.length + files.length > 10) {
    toast('⚠️ Maximum 10 photos par projet', 'error');
    return;
  }

  let loaded = 0;
  files.forEach(file => {
    // Sécurité : vérification type MIME réel
    if (!['image/jpeg','image/png','image/webp','image/gif','image/heic'].includes(file.type.toLowerCase())) {
      toast('⚠️ Format non supporté : ' + file.name, 'error');
      return;
    }
    // Limite taille 10 Mo
    if (file.size > 10 * 1024 * 1024) {
      toast('⚠️ Fichier trop lourd (max 10 Mo) : ' + file.name, 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      proj.photos.push({
        name:    sanitize(file.name),
        dataUrl: e.target.result, // base64 — en prod : upload Cloudinary
        size:    file.size,
        type:    file.type,
        addedAt: nowStr()
      });
      loaded++;
      if (loaded === files.length) {
        AppState.activeProject = proj;
        renderModalPhotos(proj);
        renderProjects(); // MAJ badge nb photos dans table
        proj.historique.push({ a: `${loaded} photo(s) ajoutée(s)`, d: nowStr(), user: 'Admin' });
        renderTimeline(proj);
        toast(`📸 ${loaded} photo(s) ajoutée(s)`, 'success');
        input.value = ''; // reset input
      }
    };
    reader.readAsDataURL(file);
  });
}

function removePhoto(index) {
  const p = AppState.activeProject;
  if (!p) return;
  if (!confirm('Supprimer cette photo ?')) return;
  const proj = projects.find(x => x.id === p.id);
  proj.photos.splice(index, 1);
  AppState.activeProject = proj;
  renderModalPhotos(proj);
  renderProjects();
  toast('Photo supprimée', 'info');
}

// Lightbox
function openLightbox(index) {
  const p = AppState.activeProject;
  if (!p || !p.photos[index]) return;

  const existing = document.getElementById('lightbox');
  if (existing) existing.remove();

  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;display:flex;
    align-items:center;justify-content:center;padding:20px;cursor:pointer;`;
  lb.innerHTML = `
    <div style="position:relative;max-width:90vw;max-height:88vh;display:flex;flex-direction:column;align-items:center;gap:12px;">
      <img src="${p.photos[index].dataUrl}" alt="${escAttr(p.photos[index].name)}"
        style="max-width:100%;max-height:80vh;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.6);">
      <div style="color:rgba(255,255,255,.6);font-size:.78rem;">${escHtml(p.photos[index].name)}
        — ${(p.photos[index].size / 1024).toFixed(0)} Ko</div>
      ${p.photos.length > 1 ? `
      <div style="display:flex;gap:12px;">
        <button onclick="event.stopPropagation();openLightbox(${index > 0 ? index-1 : p.photos.length-1})"
          style="background:rgba(255,255,255,.15);border:none;color:#fff;padding:8px 18px;border-radius:8px;cursor:pointer;font-size:.85rem;">← Précédente</button>
        <button onclick="event.stopPropagation();openLightbox(${index < p.photos.length-1 ? index+1 : 0})"
          style="background:rgba(255,255,255,.15);border:none;color:#fff;padding:8px 18px;border-radius:8px;cursor:pointer;font-size:.85rem;">Suivante →</button>
      </div>` : ''}
      <button onclick="document.getElementById('lightbox').remove()"
        style="position:absolute;top:-16px;right:-16px;width:32px;height:32px;border-radius:50%;
               background:#fff;border:none;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>`;
  lb.addEventListener('click', e => { if (e.target === lb) lb.remove(); });
  document.body.appendChild(lb);
}

// ══════════════════════════════════════════
// STATUT — CHANGEMENT + EMAIL AUTO
// ══════════════════════════════════════════
function updateStatut() {
  const p = AppState.activeProject;
  if (!p) return;
  const newStatut = document.getElementById('m-statut-select').value;
  const proj = projects.find(x => x.id === p.id);
  if (!proj) return;

  const oldStatut = proj.statut;
  proj.statut = newStatut;
  AppState.activeProject = proj;

  const st = statutCfg[newStatut] || { text: newStatut, cls: '' };
  document.getElementById('m-statut-badge').innerHTML =
    `<span class="statut ${st.cls}">${st.text}</span>`;

  proj.historique.push({
    a: 'Statut → ' + st.text.replace(/^[^\s]+ /, ''),
    d: nowStr(),
    user: 'Admin'
  });
  renderTimeline(proj);
  renderProjects();
  renderKPIs();

  // Proposer envoi email si template disponible
  if (EmailTemplates[newStatut]) {
    const tpl = EmailTemplates[newStatut](proj);
    proposerEmail(proj.client.email, tpl.sujet, tpl.corps, newStatut);
  }

  toast('Statut mis à jour : ' + st.text, 'success');
}

function updateMontantSigne() {
  const p = AppState.activeProject;
  if (!p) return;
  const proj = projects.find(x => x.id === p.id);
  if (!proj) return;
  const val = parseInt(document.getElementById('m-montant-signe').value) || 0;
  proj.montantSigne = val;
  AppState.activeProject = proj;
  const comm = Math.round(val * 0.08);
  setEl('m-comm', comm.toLocaleString('fr-FR') + ' €');
  renderKPIs();
  toast(`Commission calculée : ${comm.toLocaleString('fr-FR')} €`, 'success');
}

// ══════════════════════════════════════════
// TIMELINE
// ══════════════════════════════════════════
function renderTimeline(p) {
  const el = document.getElementById('m-timeline');
  if (!el) return;
  el.innerHTML = (p.historique || []).map((h, i) => `
    <div class="tl-item">
      <div class="tl-dot ${i === p.historique.length - 1 ? 'active' : 'done'}">
        ${i === p.historique.length - 1 ? '→' : '✓'}
      </div>
      <div class="tl-content">
        <h5>${escHtml(h.a)}</h5>
        <p>${escHtml(h.d)}${h.user ? ' · ' + escHtml(h.user) : ''}</p>
      </div>
    </div>`
  ).join('');
}

// ══════════════════════════════════════════
// NOTES
// ══════════════════════════════════════════
function saveNotes() {
  const p = AppState.activeProject;
  if (!p) return;
  const proj = projects.find(x => x.id === p.id);
  if (!proj) return;
  const val = document.getElementById('m-notes').value;
  // Limite longueur notes
  if (val.length > 2000) {
    toast('⚠️ Notes trop longues (max 2000 caractères)', 'error'); return;
  }
  proj.notes = sanitize(val);
  AppState.activeProject = proj;
  toast('📝 Notes sauvegardées', 'success');
}

// ══════════════════════════════════════════
// REJETER / SUPPRIMER
// ══════════════════════════════════════════
function rejectFromModal() {
  const p = AppState.activeProject;
  if (!p) return;
  if (!confirm('Rejeter le projet ' + p.id + ' ?\nLe client sera notifié.')) return;
  const proj = projects.find(x => x.id === p.id);
  if (!proj) return;
  proj.statut = 'rejete';
  proj.historique.push({ a: 'Rejeté par admin', d: nowStr(), user: 'Admin' });

  // Proposer email de rejet
  const tpl = EmailTemplates.rejete(proj);
  proposerEmail(proj.client.email, tpl.sujet, tpl.corps, 'rejete');

  closeModal('modal-projet');
  renderProjects();
  renderKPIs();
  toast('Projet rejeté : ' + p.id, 'error');
}

function rejectFromTable(id) {
  if (!confirm('Rejeter le projet ' + id + ' ?')) return;
  const p = projects.find(x => x.id === id);
  if (!p) return;
  p.statut = 'rejete';
  p.historique.push({ a: 'Rejeté depuis la liste', d: nowStr(), user: 'Admin' });
  renderProjects();
  renderKPIs();
  toast('Rejeté : ' + id, 'error');
}

// ══════════════════════════════════════════
// AJOUTER PROJET (MANUEL)
// ══════════════════════════════════════════
function openAddProject() { openModal('modal-add-project'); }

function submitAddProject() {
  // Récupération et sanitisation
  const type   = sanitize(document.getElementById('add-type').value.trim());
  const nom    = sanitize(document.getElementById('add-nom').value.trim());
  const tel    = sanitize(document.getElementById('add-tel').value.trim().replace(/\s/g, ''));
  const email  = sanitize(document.getElementById('add-email').value.trim());
  const ville  = sanitize(document.getElementById('add-ville').value.trim());
  const cp     = sanitize(document.getElementById('add-cp').value.trim());
  const budget = parseInt(document.getElementById('add-budget').value) || 0;
  const surface= sanitize(document.getElementById('add-surface').value.trim());
  const desc   = sanitize(document.getElementById('add-desc').value.trim());
  const delai  = document.getElementById('add-delai').value;
  const pref   = document.getElementById('add-pref').value;

  // Validations
  if (!type || !nom || !tel || !ville) {
    toast('⚠️ Remplissez les champs obligatoires', 'error'); return;
  }
  if (budget < 1500) {
    toast('⚠️ Budget minimum requis : 1 500 €', 'error'); return;
  }
  if (tel.length < 10 || !/^[0-9+\s]+$/.test(tel)) {
    toast('⚠️ Numéro de téléphone invalide', 'error'); return;
  }
  if (email && !isValidEmail(email)) {
    toast('⚠️ Adresse email invalide', 'error'); return;
  }
  if (cp && (cp.length !== 5 || isNaN(cp))) {
    toast('⚠️ Code postal invalide', 'error'); return;
  }

  const newId = 'RL-' + new Date().getFullYear() + '-' + String(projects.length + 48).padStart(3, '0');
  projects.unshift({
    id: newId, type,
    client: { nom, tel, email, pref },
    ville, cp, surface: surface || 'N/A', budget, delai, desc,
    statut: 'nouveau', date: todayStr(),
    artisanAssigne: null, notes: 'Ajouté manuellement par admin.',
    montantSigne: 0, photos: [],
    historique: [{ a: 'Créé manuellement par admin', d: nowStr(), user: 'Admin' }]
  });

  closeModal('modal-add-project');
  renderProjects();
  renderKPIs();
  toast('✅ Projet ' + newId + ' créé', 'success');

  // Reset formulaire
  ['add-type','add-nom','add-tel','add-email','add-ville','add-cp','add-budget','add-surface','add-desc']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

// ══════════════════════════════════════════
// ARTISANS
// ══════════════════════════════════════════
function openAddArtisan() { openModal('modal-add-artisan'); }

function submitAddArtisan() {
  const rs     = sanitize(document.getElementById('art-rs').value.trim());
  const tel    = sanitize(document.getElementById('art-tel').value.trim().replace(/\s/g, ''));
  const email  = sanitize(document.getElementById('art-email').value.trim());
  const metier = sanitize(document.getElementById('art-metier').value.trim());
  const ville  = sanitize(document.getElementById('art-ville').value.trim());
  const siret  = sanitize(document.getElementById('art-siret').value.trim().replace(/\s/g, ''));

  if (!rs || !tel || !metier || !ville) {
    toast('⚠️ Raison sociale, téléphone, métier et ville sont obligatoires', 'error'); return;
  }
  if (tel.length < 10) {
    toast('⚠️ Téléphone invalide', 'error'); return;
  }
  if (email && !isValidEmail(email)) {
    toast('⚠️ Email invalide', 'error'); return;
  }
  if (siret && (siret.length !== 14 || isNaN(siret))) {
    toast('⚠️ SIRET invalide (14 chiffres)', 'error'); return;
  }

  artisans.push({
    id:        'A' + String(artisans.length + 10).padStart(3, '0'),
    rs, siret, metier, ville, tel, email,
    zone:      sanitize(document.getElementById('art-zone').value.trim()),
    kbis:      document.getElementById('art-kbis').checked,
    decennale: document.getElementById('art-decennale').checked,
    rcpro:     document.getElementById('art-rcpro').checked,
    rge:       document.getElementById('art-rge').checked,
    qualibat:  document.getElementById('art-qualibat').checked,
    qualipac:  document.getElementById('art-qualipac').checked,
    statut:    'attente',
    notes:     sanitize(document.getElementById('art-notes').value)
  });

  closeModal('modal-add-artisan');
  renderArtisans();
  renderKPIs();
  toast('✅ ' + rs + ' ajouté — en attente de validation', 'success');

  // Reset
  ['art-rs','art-siret','art-tel','art-email','art-metier','art-ville','art-zone','art-notes']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  ['art-kbis','art-decennale','art-rcpro','art-rge','art-qualibat','art-qualipac']
    .forEach(id => { const el = document.getElementById(id); if (el) el.checked = false; });
}

function renderArtisans() {
  const body = document.getElementById('artisans-body');
  if (!body) return;
  if (!artisans.length) {
    body.innerHTML = `<div class="empty"><div class="ei">🔨</div><h3>Aucun artisan</h3><p>Ajoutez votre premier artisan partenaire</p></div>`;
    return;
  }
  body.innerHTML = artisans.map(a => {
    const tags = [
      a.kbis      && `<span class="art-tag">KBIS ✓</span>`,
      a.decennale && `<span class="art-tag">Décennale ✓</span>`,
      a.rcpro     && `<span class="art-tag">RC Pro ✓</span>`,
      a.rge       && `<span class="art-tag rge">RGE ✓</span>`,
      a.qualibat  && `<span class="art-tag">Qualibat</span>`,
      a.qualipac  && `<span class="art-tag rge">QualiPAC</span>`,
    ].filter(Boolean).join('');

    const badge = a.statut === 'actif'
      ? `<span class="statut s-signe">✅ Actif</span>`
      : `<span class="statut s-cours">⏳ Attente</span>`;

    return `
    <div class="artisan-row">
      <div class="art-av">🔨</div>
      <div class="art-info">
        <h4>${escHtml(a.rs)}</h4>
        <p>📍 ${escHtml(a.ville)} · ${escHtml(a.metier)}</p>
        <p style="font-size:.68rem;color:var(--muted);margin-top:2px;">Zone : ${escHtml(a.zone || 'N/R')}</p>
      </div>
      <div class="art-tags">${tags || '<span style="font-size:.7rem;color:var(--muted);">Aucune certification déclarée</span>'}</div>
      ${badge}
      <div class="actions" style="margin-left:12px;">
        <button class="abtn" title="Appeler" onclick="window.location.href='tel:${escAttr(a.tel)}'">📞</button>
        <button class="abtn" title="Email" onclick="window.location.href='mailto:${escAttr(a.email)}'">✉️</button>
        <button class="abtn" title="WhatsApp" onclick="waArtisan('${escAttr(a.id)}')">💬</button>
        ${a.statut === 'attente'
          ? `<button class="abtn" title="Valider artisan" onclick="validateArtisan('${escAttr(a.id)}')">✅</button>`
          : `<button class="abtn danger" title="Suspendre" onclick="suspendArtisan('${escAttr(a.id)}')">⏸️</button>`}
      </div>
    </div>`;
  }).join('');
}

function validateArtisan(id) {
  const a = artisans.find(x => x.id === id);
  if (!a) return;
  a.statut = 'actif';
  renderArtisans();
  renderKPIs();
  toast('✅ ' + a.rs + ' validé et actif', 'success');
}

function suspendArtisan(id) {
  const a = artisans.find(x => x.id === id);
  if (!a) return;
  if (!confirm('Suspendre ' + a.rs + ' ?')) return;
  a.statut = 'attente';
  renderArtisans();
  renderKPIs();
  toast('⏸️ ' + a.rs + ' suspendu', 'error');
}

function waArtisan(id) {
  const a = artisans.find(x => x.id === id);
  if (!a) return;
  const p = AppState.activeProject;
  let msg = 'Bonjour ' + a.rs + ',\n\nL\'équipe RenoLink.';
  if (p) {
    const tpl = EmailTemplates.propositionArtisan(p, a);
    msg = tpl.corps;
  }
  const tel = a.tel.replace(/\D/g, '').replace(/^0/, '33');
  window.open('https://wa.me/' + tel + '?text=' + encodeURIComponent(msg), '_blank');
}

// ══════════════════════════════════════════
// COMMISSIONS
// ══════════════════════════════════════════
function renderCommissions() {
  const signed = projects.filter(p => p.statut === 'signe');
  const ca     = signed.reduce((s, p) => s + (p.montantSigne || p.budget), 0);
  const comm   = signed.reduce((s, p) => s + Math.round((p.montantSigne || p.budget) * 0.08), 0);

  setEl('k-ca',      ca.toLocaleString('fr-FR') + ' €');
  setEl('k-comm2',   comm.toLocaleString('fr-FR') + ' €');
  setEl('k-nb-sign', signed.length);

  const wrap = document.getElementById('comm-table');
  if (!wrap) return;

  if (!signed.length) {
    wrap.innerHTML = `<div class="empty"><div class="ei">💶</div><h3>Aucun chantier signé</h3><p>Les commissions apparaîtront ici après signature</p></div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="comm-head">
      <div>Réf.</div><div>Chantier</div><div>Artisan</div><div>Montant HT</div><div>Commission 8%</div>
    </div>
    ${signed.map(p => `
    <div class="comm-row">
      <div class="dref">${escHtml(p.id)}</div>
      <div>
        <div class="dname">${escHtml(p.type)}</div>
        <div class="dmeta">${escHtml(p.client.nom)} · ${escHtml(p.ville)}</div>
      </div>
      <div style="font-size:.78rem;font-weight:600;">${escHtml(p.artisanAssigne || '—')}</div>
      <div style="font-weight:700;">${(p.montantSigne || p.budget).toLocaleString('fr-FR')} €</div>
      <div>
        <div style="font-weight:700;color:var(--gold);">${Math.round((p.montantSigne || p.budget) * 0.08).toLocaleString('fr-FR')} €</div>
        <button class="abtn" style="margin-top:4px;width:auto;padding:2px 8px;font-size:.65rem;"
          onclick="sendRelanceSignature('${escAttr(p.id)}')">✉️ Relance</button>
      </div>
    </div>`).join('')}`;
}

// Relance client pour confirmer signature
function sendRelanceSignature(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  const tpl = EmailTemplates.relanceSignature(p);
  proposerEmail(p.client.email, tpl.sujet, tpl.corps, 'relance');
}

// ══════════════════════════════════════════
// EXPORT CSV
// ══════════════════════════════════════════
function exportCSV() {
  const BOM    = '\uFEFF'; // UTF-8 BOM pour Excel
  const header = ['Référence','Type travaux','Client','Téléphone','Email','Ville','CP','Surface',
                  'Budget estimé','Montant signé','Statut','Artisan assigné','Date','Commission 8%',
                  'Nb photos','Notes'].join(';');
  const rows = projects.map(p => [
    p.id, p.type, p.client.nom, p.client.tel, p.client.email,
    p.ville, p.cp, p.surface, p.budget, p.montantSigne || 0,
    p.statut, p.artisanAssigne || '', p.date,
    Math.round((p.montantSigne || p.budget) * 0.08),
    (p.photos || []).length,
    (p.notes || '').replace(/\n/g, ' ').substring(0, 200)
  ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';'));

  const csv  = BOM + [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'renolink-projets-' + todayStr() + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('📥 Export CSV téléchargé', 'success');
}

// ══════════════════════════════════════════
// EXPORT PDF
// ══════════════════════════════════════════
function exportPDFFromModal() {
  if (AppState.activeProject) exportPDF(AppState.activeProject.id);
}

function exportPDF(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  const comm = Math.round((p.montantSigne || p.budget) * 0.08);

  // Photos en base64 pour le PDF
  const photosHtml = (p.photos || []).slice(0, 6).map(ph =>
    `<img src="${ph.dataUrl}" style="width:120px;height:90px;object-fit:cover;border-radius:6px;border:1px solid #E4DDD0;">`
  ).join('');

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Dossier ${escHtml(p.id)} — RenoLink</title>
<style>
  body{font-family:Arial,sans-serif;margin:36px;color:#1A1714;font-size:13px;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #B8820A;}
  .logo{font-size:20px;font-weight:900;} .logo span{color:#B8820A;}
  h1{font-size:18px;margin:0 0 3px;} .ref{color:#B8820A;font-weight:700;}
  .section{margin-bottom:16px;padding:14px;border:1px solid #E4DDD0;border-radius:8px;}
  .section h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#7A736A;margin-bottom:10px;}
  .row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #F5F2ED;font-size:12px;}
  .row:last-child{border-bottom:none;}.label{color:#7A736A;}.value{font-weight:600;}
  .gold{color:#B8820A;}
  .comm-box{background:#FEF3E2;border:2px solid #B8820A;border-radius:8px;padding:14px;text-align:center;margin:14px 0;}
  .comm-box h3{color:#92400E;font-size:13px;margin-bottom:6px;}
  .comm-amount{font-size:26px;font-weight:700;color:#B8820A;}
  .clause{background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;padding:10px;font-size:11px;color:#991B1B;line-height:1.5;margin:12px 0;}
  .photos-grid{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
  .histo-item{display:flex;gap:10px;padding:4px 0;border-bottom:1px solid #F5F2ED;font-size:11px;}
  .histo-date{color:#7A736A;min-width:140px;flex-shrink:0;}
  footer{margin-top:24px;padding-top:12px;border-top:1px solid #E4DDD0;font-size:11px;color:#7A736A;text-align:center;line-height:1.7;}
  @media print{body{margin:18px;}}
</style></head><body>
<div class="header">
  <div>
    <div class="logo">Reno<span>Link</span></div>
    <div style="font-size:11px;color:#7A736A;">Lorraine — Artisans vérifiés</div>
  </div>
  <div style="text-align:right;">
    <h1>${escHtml(p.type)}</h1>
    <div class="ref">${escHtml(p.id)}</div>
    <div style="font-size:11px;color:#7A736A;margin-top:4px;">Généré le ${nowStr()}</div>
    <div style="margin-top:6px;background:${p.statut==='signe'?'#D1FAE5':'#EFF6FF'};color:${p.statut==='signe'?'#065F46':'#1D4ED8'};font-size:11px;font-weight:700;padding:2px 10px;border-radius:100px;display:inline-block;">
      ${(statutCfg[p.statut]||{text:p.statut}).text}
    </div>
  </div>
</div>

<div class="section">
  <h2>👤 Coordonnées client — CONFIDENTIEL</h2>
  <div class="row"><span class="label">Nom</span><span class="value">${escHtml(p.client.nom)}</span></div>
  <div class="row"><span class="label">Téléphone</span><span class="value" style="color:#1D4ED8;">${escHtml(formatTel(p.client.tel))}</span></div>
  <div class="row"><span class="label">Email</span><span class="value" style="color:#1D4ED8;">${escHtml(p.client.email)}</span></div>
  <div class="row"><span class="label">Préférence contact</span><span class="value">${escHtml(p.client.pref)}</span></div>
</div>

<div class="section">
  <h2>🏗️ Détails du projet</h2>
  <div class="row"><span class="label">Type de travaux</span><span class="value">${escHtml(p.type)}</span></div>
  <div class="row"><span class="label">Localisation</span><span class="value">${escHtml(p.ville)} (${escHtml(p.cp)})</span></div>
  <div class="row"><span class="label">Surface</span><span class="value">${escHtml(p.surface)}</span></div>
  <div class="row"><span class="label">Budget estimé</span><span class="value gold">${p.budget.toLocaleString('fr-FR')} €</span></div>
  ${p.montantSigne ? `<div class="row"><span class="label">Montant signé</span><span class="value gold">${p.montantSigne.toLocaleString('fr-FR')} €</span></div>` : ''}
  <div class="row"><span class="label">Délai souhaité</span><span class="value">${escHtml(p.delai)}</span></div>
  <div class="row"><span class="label">Date réception</span><span class="value">${escHtml(p.date)}</span></div>
  <div style="margin-top:10px;padding-top:8px;border-top:1px solid #F5F2ED;">
    <div style="font-size:11px;color:#7A736A;margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;">Description :</div>
    <div style="line-height:1.65;">${escHtml(p.desc)}</div>
  </div>
  ${photosHtml ? `<div style="margin-top:10px;padding-top:8px;border-top:1px solid #F5F2ED;">
    <div style="font-size:11px;color:#7A736A;margin-bottom:8px;font-weight:600;text-transform:uppercase;">Photos du chantier (${(p.photos||[]).length}) :</div>
    <div class="photos-grid">${photosHtml}</div>
  </div>` : ''}
</div>

<div class="comm-box">
  <h3>💶 COMMISSION RENOLINK — 8%</h3>
  <div class="comm-amount">${comm.toLocaleString('fr-FR')} €</div>
  <div style="font-size:12px;color:#92400E;margin-top:4px;">Sur budget de ${p.budget.toLocaleString('fr-FR')} €</div>
</div>

<div class="clause">
  <strong>⚖️ Engagement commission :</strong> En acceptant ce dossier, l'artisan s'engage à verser
  ${comm.toLocaleString('fr-FR')} € (8% HT) à RenoLink en cas de signature du devis client.
  Le non-respect entraîne la suspension du compte et des poursuites.
</div>

${p.artisanAssigne ? `<div class="section"><h2>🔨 Artisan assigné</h2>
  <div class="row"><span class="label">Artisan</span><span class="value">${escHtml(p.artisanAssigne)}</span></div>
</div>` : ''}

<div class="section">
  <h2>📅 Historique complet</h2>
  ${(p.historique || []).map(h => `
  <div class="histo-item">
    <span class="histo-date">${escHtml(h.d)}</span>
    <span>${escHtml(h.a)}</span>
    ${h.user ? `<span style="margin-left:auto;color:#7A736A;">${escHtml(h.user)}</span>` : ''}
  </div>`).join('')}
</div>

${p.notes ? `<div class="section"><h2>📝 Notes internes (confidentiel)</h2><div style="line-height:1.65;">${escHtml(p.notes)}</div></div>` : ''}

<footer>
  <strong>RenoLink</strong> — Plateforme artisans BTP vérifiés — Lorraine<br>
  Document confidentiel — Usage strictement interne ou réservé à l'artisan désigné.<br>
  contact@renolink.fr · renolink.fr
</footer>
</body></html>`;

  const win = window.open('', '_blank');
  if (!win) { toast('⚠️ Autorisez les popups pour l\'export PDF', 'error'); return; }
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 600);
  toast('📄 PDF prêt à imprimer', 'success');
}

// ══════════════════════════════════════════
// COMMUNICATIONS
// ══════════════════════════════════════════

// WhatsApp client
function sendWA(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  const msg = `Bonjour ${p.client.nom.split(' ')[0]},\n\nNous avons bien reçu votre projet RenoLink (${p.id}).\n📋 ${p.type} — ${p.ville}\n\nNous revenons vers vous sous 48h ouvrées.\n\nL'équipe RenoLink`;
  const tel = p.client.tel.replace(/\D/g, '').replace(/^0/, '33');
  window.open('https://wa.me/' + tel + '?text=' + encodeURIComponent(msg), '_blank');
}
function sendWhatsAppModal() {
  if (AppState.activeProject) sendWA(AppState.activeProject.id);
}

// Email via client mail natif (mailto)
// En prod : remplacer par API Brevo
function proposerEmail(to, sujet, corps, contexte) {
  // Afficher une preview dans un mini modal de confirmation
  const preview = document.getElementById('email-preview-modal');
  if (preview) {
    document.getElementById('ep-to').textContent      = to;
    document.getElementById('ep-sujet').textContent   = sujet;
    document.getElementById('ep-corps').textContent   = corps;
    document.getElementById('ep-send-btn').onclick    = () => {
      sendEmailViaMailto(to, sujet, corps);
      closeModal('email-preview-modal');
    };
    openModal('email-preview-modal');
  } else {
    // Fallback direct
    sendEmailViaMailto(to, sujet, corps);
  }
}

function sendEmailViaMailto(to, sujet, corps) {
  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
  window.location.href = mailto;
  toast('✉️ Client email ouvert', 'success');
}

function sendEmailModal() {
  const p = AppState.activeProject;
  if (!p) return;
  // Email générique depuis la modal
  const tpl = EmailTemplates[p.statut] ? EmailTemplates[p.statut](p) : {
    sujet: `Votre projet RenoLink ${p.id}`,
    corps: `Bonjour ${p.client.nom.split(' ')[0]},\n\nMise à jour concernant votre projet.\n\n${EmailConfig.signature}`
  };
  proposerEmail(p.client.email, tpl.sujet, tpl.corps, p.statut);
}

function callClient() {
  const p = AppState.activeProject;
  if (!p) return;
  window.location.href = 'tel:' + p.client.tel.replace(/\s/g, '');
}

// ══════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  // Ne pas reset activeProject si on ferme la preview email
  if (id === 'modal-projet') {
    // Sauvegarder les notes avant fermeture
    if (AppState.activeProject) {
      const notes = document.getElementById('m-notes');
      if (notes) {
        const proj = projects.find(x => x.id === AppState.activeProject.id);
        if (proj) proj.notes = sanitize(notes.value);
      }
    }
    AppState.activeProject = null;
  }
  // Rétablir scroll uniquement si plus aucun modal ouvert
  if (!document.querySelector('.overlay.open')) {
    document.body.style.overflow = '';
  }
}

// ══════════════════════════════════════════
// UTILITAIRES
// ══════════════════════════════════════════
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function nowStr() {
  return new Date().toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function formatTel(tel) {
  if (!tel) return '—';
  const t = tel.replace(/\D/g, '');
  if (t.length === 10) return t.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  return tel;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  renderKPIs();
  renderProjects();

  // Fermer modals sur clic overlay
  document.querySelectorAll('.overlay').forEach(ov => {
    ov.addEventListener('click', e => {
      if (e.target === ov) closeModal(ov.id);
    });
  });

  // ESC ferme le modal du dessus
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const opened = [...document.querySelectorAll('.overlay.open')];
      if (opened.length) closeModal(opened[opened.length - 1].id);
    }
  });

  // Activer le premier nav-item
  const firstNav = document.querySelector('.nav-item');
  if (firstNav) firstNav.classList.add('active');
});

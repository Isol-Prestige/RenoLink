/* ═══════════════════════════════════════
   RENOLINK — inscription.js
   Logique inscription artisan multi-étapes
   ═══════════════════════════════════════ */

// ── État ──
const inscState = {
  currentStep:   1,
  totalSteps:    4,
  metiers:       [],
  certifications:[],
  zones:         [],
  documents:     {},
};

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════

function nextEtape(n) {
  if (!validateEtape(n)) return;

  // Marquer progression
  const prog = document.getElementById('prog' + n);
  if (prog) { prog.classList.remove('active'); prog.classList.add('done'); }

  if (n < inscState.totalSteps) {
    inscState.currentStep = n + 1;
    showEtape(n, n + 1);
    updateSidebar(n + 1);
  }

  // Mettre à jour le récap à l'étape 4
  if (n === 3) updateRecap();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateRecap() {
  const rs = document.getElementById('raisonSociale');
  const recapEnt = document.getElementById('recap-entreprise');
  if (recapEnt && rs) recapEnt.textContent = rs.value || '—';

  const recapMet = document.getElementById('recap-metiers');
  if (recapMet) recapMet.textContent = inscState.metiers.length > 0 ? inscState.metiers.join(', ') : '—';

  const recapCert = document.getElementById('recap-certifs');
  if (recapCert) recapCert.textContent = inscState.certifications.length > 0 ? inscState.certifications.join(', ') : 'Aucune';

  const recapZones = document.getElementById('recap-zones');
  if (recapZones) recapZones.textContent = inscState.zones.length > 0 ? inscState.zones.join(', ') : '—';

  const docs = Object.keys(inscState.documents).length;
  const recapDocs = document.getElementById('recap-docs');
  if (recapDocs) recapDocs.textContent = docs + ' document(s) fourni(s)';
}

function prevEtape(n) {
  const prog = document.getElementById('prog' + n);
  if (prog) { prog.classList.remove('active'); prog.classList.remove('done'); }

  inscState.currentStep = n - 1;
  const prevProg = document.getElementById('prog' + (n - 1));
  if (prevProg) { prevProg.classList.remove('done'); prevProg.classList.add('active'); }

  showEtape(n, n - 1);
  updateSidebar(n - 1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showEtape(from, to) {
  document.getElementById('etape' + from).classList.remove('active');
  document.getElementById('etape' + to).classList.add('active');
}

// ════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════

function updateSidebar(step) {
  for (let i = 1; i <= inscState.totalSteps; i++) {
    const el = document.getElementById('sidebar-step-' + i);
    if (!el) continue;
    el.classList.remove('active', 'done');
    if (i < step)  el.classList.add('done');
    if (i === step) el.classList.add('active');
  }
}

// ════════════════════════════════════════
// VALIDATION
// ════════════════════════════════════════

function validateEtape(n) {
  let valid = true;

  if (n === 1) {
    // Raison sociale
    const rs    = document.getElementById('raisonSociale');
    const rsErr = document.getElementById('raisonSocialeError');
    if (!rs.value.trim()) {
      rsErr.classList.add('show'); rs.classList.add('error'); valid = false;
    } else {
      rsErr.classList.remove('show'); rs.classList.remove('error');
    }

    // SIRET
    const siret    = document.getElementById('siret');
    const siretErr = document.getElementById('siretError');
    const siretClean = siret.value.replace(/\s/g, '');
    if (siretClean.length !== 14 || isNaN(siretClean)) {
      siretErr.classList.add('show'); siret.classList.add('error'); valid = false;
    } else {
      siretErr.classList.remove('show'); siret.classList.remove('error');
    }

    // Téléphone
    const tel    = document.getElementById('telephone');
    const telErr = document.getElementById('telError');
    if (tel.value.trim().replace(/\s/g,'').length < 10) {
      telErr.classList.add('show'); tel.classList.add('error'); valid = false;
    } else {
      telErr.classList.remove('show'); tel.classList.remove('error');
    }

    // Email
    const email    = document.getElementById('email');
    const emailErr = document.getElementById('emailError');
    if (!email.value.includes('@') || !email.value.includes('.')) {
      emailErr.classList.add('show'); email.classList.add('error'); valid = false;
    } else {
      emailErr.classList.remove('show'); email.classList.remove('error');
    }
  }

  if (n === 2) {
    // Métier
    const metierErr = document.getElementById('metierError');
    if (inscState.metiers.length === 0) {
      metierErr.classList.add('show'); valid = false;
    } else {
      metierErr.classList.remove('show');
    }

    // Zone
    const zoneErr = document.getElementById('zoneError');
    if (inscState.zones.length === 0) {
      zoneErr.classList.add('show'); valid = false;
    } else {
      zoneErr.classList.remove('show');
    }
  }

  if (n === 3) {
    // Documents obligatoires
    const required = ['kbis', 'decennale', 'rcpro'];
    let missingDocs = false;
    required.forEach(doc => {
      const item = document.getElementById('doc-' + doc);
      if (!inscState.documents[doc]) {
        if (item) item.classList.add('required-missing');
        missingDocs = true;
      } else {
        if (item) item.classList.remove('required-missing');
      }
    });
    const docErr = document.getElementById('docError');
    if (missingDocs) {
      docErr.classList.add('show'); valid = false;
    } else {
      docErr.classList.remove('show');
    }
  }

  if (n === 4) {
    // CGU
    const cgu    = document.getElementById('cguCheck');
    const cguErr = document.getElementById('cguError');
    if (!cgu.checked) {
      cguErr.classList.add('show'); valid = false;
    } else {
      cguErr.classList.remove('show');
    }
  }

  return valid;
}

// ════════════════════════════════════════
// SOUMISSION
// ════════════════════════════════════════

function submitInscription() {
  if (!validateEtape(4)) return;

  const ref = 'ART-2026-' + String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
  const refEl = document.getElementById('successRef');
  if (refEl) refEl.textContent = 'Réf. ' + ref;

  // Cacher le layout
  const layout = document.querySelector('.inscription-layout');
  if (layout) layout.style.display = 'none';

  // Afficher succès
  const success = document.getElementById('successInscription');
  if (success) success.classList.add('show');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════
// MÉTIERS — Multi-sélection
// ════════════════════════════════════════

function toggleMetier(el, label) {
  const idx = inscState.metiers.indexOf(label);
  if (idx === -1) {
    inscState.metiers.push(label);
    el.classList.add('selected');
  } else {
    inscState.metiers.splice(idx, 1);
    el.classList.remove('selected');
  }

  const count = document.getElementById('metierCount');
  if (count) {
    count.style.display = inscState.metiers.length > 0 ? 'block' : 'none';
    count.textContent   = inscState.metiers.length + ' sélectionné(s)';
  }

  const err = document.getElementById('metierError');
  if (err && inscState.metiers.length > 0) err.classList.remove('show');
}

// ════════════════════════════════════════
// CERTIFICATIONS
// ════════════════════════════════════════

function toggleCert(el, label) {
  const idx = inscState.certifications.indexOf(label);
  if (idx === -1) {
    inscState.certifications.push(label);
    el.classList.add('selected');
  } else {
    inscState.certifications.splice(idx, 1);
    el.classList.remove('selected');
  }
}

// ════════════════════════════════════════
// ZONES D'INTERVENTION
// ════════════════════════════════════════

function addZone() {
  const input = document.getElementById('zoneInput');
  const val   = input.value.trim();
  if (!val || inscState.zones.includes(val)) return;

  inscState.zones.push(val);
  input.value = '';
  renderZones();

  const err = document.getElementById('zoneError');
  if (err) err.classList.remove('show');
}

function removeZone(zone) {
  inscState.zones = inscState.zones.filter(z => z !== zone);
  renderZones();
}

function renderZones() {
  const container = document.getElementById('zoneTags');
  if (!container) return;

  container.innerHTML = '';
  inscState.zones.forEach(zone => {
    const div = document.createElement('div');
    div.className = 'zone-tag';
    div.innerHTML = `
      ${zone}
      <button class="zone-tag-remove" onclick="removeZone('${zone}')">✕</button>
    `;
    container.appendChild(div);
  });
}

// Suggestions de zones Lorraine
function addZoneSuggestion(zone) {
  if (!inscState.zones.includes(zone)) {
    inscState.zones.push(zone);
    renderZones();
    const err = document.getElementById('zoneError');
    if (err) err.classList.remove('show');
  }
}

// Entrée clavier pour ajouter zone
function handleZoneKeydown(e) {
  if (e.key === 'Enter') { e.preventDefault(); addZone(); }
}

// ════════════════════════════════════════
// DOCUMENTS
// ════════════════════════════════════════

function handleDocUpload(docId, input) {
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  inscState.documents[docId] = file.name;

  const item      = document.getElementById('doc-' + docId);
  const statusEl  = item?.querySelector('.doc-status');
  const actionEl  = item?.querySelector('.doc-action');

  if (item)     { item.classList.add('uploaded'); item.classList.remove('required-missing'); }
  if (statusEl) { statusEl.className = 'doc-status uploaded'; statusEl.textContent = '✓ ' + file.name; }
  if (actionEl) { actionEl.textContent = 'Modifier'; }

  // Vérifier si tous les docs obligatoires sont là
  checkDocProgress();
}

function checkDocProgress() {
  const required = ['kbis', 'decennale', 'rcpro'];
  const allDone  = required.every(doc => inscState.documents[doc]);
  const progress = document.getElementById('docProgress');
  const count    = required.filter(doc => inscState.documents[doc]).length;

  if (progress) {
    progress.textContent = count + '/' + required.length + ' documents obligatoires fournis';
    progress.style.color = allDone ? 'var(--success)' : 'var(--muted)';
  }
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  updateSidebar(1);

  // Progress bar étape 1 active
  const prog1 = document.getElementById('prog1');
  if (prog1) prog1.classList.add('active');
});

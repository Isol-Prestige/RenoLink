/* ═══════════════════════════════════════
   RENOLINK — formulaire.js
   Logique du formulaire client multi-étapes
   ═══════════════════════════════════════ */

// ── État global ──
const state = {
  currentStep:    1,
  totalSteps:     6,
  selectedTypes:  [],
  selectedSurface:'',
  photos:         [],
  budgetValue:    10000,
};

// ════════════════════════════════════════
// NAVIGATION ENTRE ÉTAPES
// ════════════════════════════════════════

function nextStep(n) {
  if (!validateStep(n)) return;

  // Marquer l'étape actuelle comme terminée
  const ps = document.getElementById('ps' + n);
  ps.classList.remove('active');
  ps.classList.add('done');

  if (n < state.totalSteps) {
    const pl = document.getElementById('pl' + n);
    if (pl) pl.classList.add('done');
    state.currentStep = n + 1;
    showStep(n, n + 1);
  }

  if (n === 5) updateRecap();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(n) {
  const ps = document.getElementById('ps' + n);
  ps.classList.remove('active');

  state.currentStep = n - 1;

  const prevPs = document.getElementById('ps' + state.currentStep);
  prevPs.classList.remove('done');
  prevPs.classList.add('active');

  if (n > 1) {
    const pl = document.getElementById('pl' + state.currentStep);
    if (pl) pl.classList.remove('done');
  }

  showStep(n, state.currentStep);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep(n) {
  const current = document.querySelector('.step.active');
  if (current) current.classList.remove('active');
  document.getElementById('step' + n).classList.add('active');
  state.currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showStep(from, to) {
  document.getElementById('step' + from).classList.remove('active');
  document.getElementById('step' + to).classList.add('active');
  document.getElementById('ps' + to).classList.add('active');
}

// ════════════════════════════════════════
// VALIDATION
// ════════════════════════════════════════

function validateStep(n) {
  let valid = true;

  if (n === 1) {
    const err = document.getElementById('typeError');
    if (state.selectedTypes.length === 0) {
      err.classList.add('show');
      valid = false;
    } else {
      err.classList.remove('show');
    }
  }

  if (n === 2) {
    // Description
    const desc   = document.getElementById('description');
    const descErr = document.getElementById('descError');
    if (desc.value.trim().length < 100) {
      descErr.classList.add('show');
      desc.classList.add('error');
      valid = false;
    } else {
      descErr.classList.remove('show');
      desc.classList.remove('error');
    }

    // Surface
    const surfaceErr = document.getElementById('surfaceError');
    const surfaceExacte = document.getElementById('surfaceExacte').value;
    if (!state.selectedSurface && !surfaceExacte) {
      surfaceErr.classList.add('show');
      valid = false;
    } else {
      surfaceErr.classList.remove('show');
    }
  }

  if (n === 3) {
    // Budget minimum
    const budgetErr = document.getElementById('budgetError');
    if (state.budgetValue < 1500) {
      budgetErr.classList.add('show');
      valid = false;
    } else {
      budgetErr.classList.remove('show');
    }

    // Délai
    const delai    = document.getElementById('delai');
    const delaiErr = document.getElementById('delaiError');
    if (!delai.value) {
      delaiErr.classList.add('show');
      valid = false;
    } else {
      delaiErr.classList.remove('show');
    }
  }

  if (n === 4) {
    const photoErr = document.getElementById('photoError');
    if (state.photos.length === 0) {
      photoErr.classList.add('show');
      valid = false;
    } else {
      photoErr.classList.remove('show');
    }
  }

  if (n === 5) {
    const ville   = document.getElementById('ville');
    const cp      = document.getElementById('codePostal');
    const villeErr = document.getElementById('villeError');
    const cpErr    = document.getElementById('cpError');

    if (!ville.value.trim()) {
      villeErr.classList.add('show');
      ville.classList.add('error');
      valid = false;
    } else {
      villeErr.classList.remove('show');
      ville.classList.remove('error');
    }

    if (cp.value.trim().length !== 5 || isNaN(cp.value.trim())) {
      cpErr.classList.add('show');
      cp.classList.add('error');
      valid = false;
    } else {
      cpErr.classList.remove('show');
      cp.classList.remove('error');
    }
  }

  return valid;
}

// ════════════════════════════════════════
// SOUMISSION
// ════════════════════════════════════════

function submitForm() {
  let valid = true;

  const fields = [
    { id: 'prenom',    errId: 'prenomError',   check: v => v.trim().length > 0 },
    { id: 'nom',       errId: 'nomError',      check: v => v.trim().length > 0 },
    { id: 'telephone', errId: 'telError',      check: v => v.trim().replace(/\s/g,'').length >= 10 },
    { id: 'email',     errId: 'emailError',    check: v => v.includes('@') && v.includes('.') },
  ];

  fields.forEach(f => {
    const el  = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (!f.check(el.value)) {
      err.classList.add('show');
      el.classList.add('error');
      valid = false;
    } else {
      err.classList.remove('show');
      el.classList.remove('error');
    }
  });

  const cgu    = document.getElementById('cguCheck');
  const cguErr = document.getElementById('cguError');
  if (!cgu.checked) {
    cguErr.classList.add('show');
    valid = false;
  } else {
    cguErr.classList.remove('show');
  }

  if (!valid) return;

  // Générer référence unique
  const ref = 'RL-2026-' + String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
  const refEl = document.getElementById('successRef');
  if (refEl) refEl.textContent = 'Réf. ' + ref;

  // Afficher la page succès
  const formMain = document.querySelector('.form-main');
  const progressWrap = document.querySelector('.progress-wrap');
  const successPage  = document.getElementById('successPage');

  if (formMain)    formMain.style.display    = 'none';
  if (progressWrap) progressWrap.style.display = 'none';
  if (successPage)  successPage.classList.add('show');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════
// TYPE DE TRAVAUX — Multi-sélection
// ════════════════════════════════════════

function toggleType(el, label) {
  const idx = state.selectedTypes.indexOf(label);
  if (idx === -1) {
    state.selectedTypes.push(label);
    el.classList.add('selected');
  } else {
    state.selectedTypes.splice(idx, 1);
    el.classList.remove('selected');
  }

  const badge = document.getElementById('selectedCount');
  if (badge) {
    if (state.selectedTypes.length > 0) {
      badge.style.display = 'block';
      badge.textContent   = state.selectedTypes.length + ' sélectionné(s)';
      const err = document.getElementById('typeError');
      if (err) err.classList.remove('show');
    } else {
      badge.style.display = 'none';
    }
  }
}

// ════════════════════════════════════════
// SURFACE
// ════════════════════════════════════════

function selectSurface(el, val) {
  document.querySelectorAll('.surface-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedSurface = val;
  const err = document.getElementById('surfaceError');
  if (err) err.classList.remove('show');
}

// ════════════════════════════════════════
// BUDGET
// ════════════════════════════════════════

function updateBudget(val) {
  state.budgetValue = parseInt(val);
  const display = document.getElementById('budgetDisplay');
  if (!display) return;

  display.textContent = parseInt(val).toLocaleString('fr-FR') + ' €';
  display.className   = 'budget-value' + (state.budgetValue < 1500 ? ' too-low' : '');

  document.querySelectorAll('.budget-opt').forEach(e => e.classList.remove('selected'));

  const err = document.getElementById('budgetError');
  if (err && state.budgetValue >= 1500) err.classList.remove('show');
}

function setBudget(val, el) {
  state.budgetValue = val;
  const slider = document.getElementById('budgetSlider');
  if (slider) slider.value = val;
  updateBudget(val);
  document.querySelectorAll('.budget-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

// ════════════════════════════════════════
// PHOTOS
// ════════════════════════════════════════

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (state.photos.length >= 10) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = e => {
      state.photos.push({ name: file.name, url: e.target.result });
      renderPhotos();
    };
    reader.readAsDataURL(file);
  });
}

function renderPhotos() {
  const grid  = document.getElementById('photoGrid');
  const badge = document.getElementById('photoBadge');
  const zone  = document.getElementById('uploadZone');
  const err   = document.getElementById('photoError');

  if (!grid) return;

  grid.innerHTML = '';
  state.photos.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'photo-thumb';
    div.innerHTML = `
      <img src="${p.url}" alt="${p.name}">
      <button class="photo-remove" onclick="removePhoto(${i})">✕</button>
    `;
    grid.appendChild(div);
  });

  if (state.photos.length > 0) {
    if (badge) {
      badge.className = 'photo-badge badge-success';
      badge.textContent = `✅ ${state.photos.length} photo${state.photos.length > 1 ? 's' : ''} ajoutée${state.photos.length > 1 ? 's' : ''}`;
    }
    if (zone) zone.classList.add('has-files');
    if (err)  err.classList.remove('show');
  } else {
    if (badge) {
      badge.className = 'photo-badge badge-warning';
      badge.textContent = '⚠️ Au moins 1 photo obligatoire';
    }
    if (zone) zone.classList.remove('has-files');
  }
}

function removePhoto(i) {
  state.photos.splice(i, 1);
  renderPhotos();
}

// Drag & drop
function initDragDrop() {
  const zone = document.getElementById('uploadZone');
  if (!zone) return;

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag');
    handleFiles(e.dataTransfer.files);
  });
}

// ════════════════════════════════════════
// COMPTEUR DE CARACTÈRES
// ════════════════════════════════════════

function updateCharCount(el) {
  const count   = el.value.length;
  const display = document.getElementById('charCount');
  if (!display) return;
  display.textContent = count + ' / 1000 caractères (minimum 100)';
  display.className   = count < 100 ? 'char-count warning' : 'char-count';
}

// ════════════════════════════════════════
// RÉCAPITULATIF
// ════════════════════════════════════════

function updateRecap() {
  // Types
  const recapTypes = document.getElementById('recapTypes');
  if (recapTypes) recapTypes.textContent = state.selectedTypes.join(', ') || '—';

  // Description
  const desc      = document.getElementById('description');
  const recapDesc = document.getElementById('recapDesc');
  if (recapDesc && desc) {
    const txt = desc.value;
    recapDesc.textContent = txt.length > 120 ? txt.substring(0, 120) + '...' : txt || '—';
  }

  // Surface
  const surfaceExacte = document.getElementById('surfaceExacte');
  const recapSurface  = document.getElementById('recapSurface');
  if (recapSurface) {
    recapSurface.textContent = surfaceExacte?.value
      ? surfaceExacte.value + ' m²'
      : state.selectedSurface || '—';
  }

  // Bien
  const typeBien  = document.getElementById('typeBien');
  const recapBien = document.getElementById('recapBien');
  if (recapBien && typeBien) recapBien.textContent = typeBien.value || '—';

  // Budget
  const recapBudget = document.getElementById('recapBudget');
  if (recapBudget) recapBudget.textContent = state.budgetValue.toLocaleString('fr-FR') + ' €';

  // Délai
  const delai      = document.getElementById('delai');
  const recapDelai = document.getElementById('recapDelai');
  if (recapDelai && delai) recapDelai.textContent = delai.value || '—';

  // Localisation
  const ville            = document.getElementById('ville');
  const cp               = document.getElementById('codePostal');
  const recapLocalisation = document.getElementById('recapLocalisation');
  if (recapLocalisation) {
    recapLocalisation.textContent = ville?.value && cp?.value
      ? `${ville.value} (${cp.value})`
      : ville?.value || '—';
  }

  // Photos
  const recapPhotos = document.getElementById('recapPhotos');
  if (recapPhotos) {
    recapPhotos.innerHTML = '';
    state.photos.slice(0, 4).forEach(p => {
      const div = document.createElement('div');
      div.className = 'recap-photo';
      div.innerHTML = `<img src="${p.url}" alt="photo">`;
      recapPhotos.appendChild(div);
    });
    if (state.photos.length > 4) {
      const div = document.createElement('div');
      div.className = 'recap-photo';
      div.style.cssText = 'display:flex;align-items:center;justify-content:center;background:#F5F2ED;font-size:0.75rem;font-weight:700;color:#7A736A;';
      div.textContent = '+' + (state.photos.length - 4);
      recapPhotos.appendChild(div);
    }
  }
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initDragDrop();
});

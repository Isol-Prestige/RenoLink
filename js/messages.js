/* ═══════════════════════════════════════════
   RENOLINK — messages.js
   Génération de messages manuels (WhatsApp / SMS / Email)
   et module facturation commission
   ═══════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════
// CONFIG FACTURATION (modifiable dans paramètres)
// ══════════════════════════════════════════
const FactureConfig = {
  // Statut juridique : 'ae' (auto-entrepreneur) ou 'societe'
  statut: 'ae',

  // Auto-entrepreneur
  ae: {
    nom:        'Prénom NOM',
    activite:   'Mise en relation artisans BTP',
    siret:      '000 000 000 00000',
    adresse:    '12 rue des Jardins',
    cp:         '54000',
    ville:      'Nancy',
    email:      'contact@renolink.fr',
    tel:        '06 XX XX XX XX',
    mentionTVA: 'TVA non applicable — art. 293 B du CGI',
  },

  // Société
  societe: {
    denomination: 'RENOLINK',
    forme:        'SASU',
    capital:      '1 000',
    siret:        '000 000 000 00000',
    rcs:          'Nancy',
    adresse:      '12 rue des Jardins',
    cp:           '54000',
    ville:        'Nancy',
    email:        'contact@renolink.fr',
    tel:          '06 XX XX XX XX',
    tvaIntra:     'FR00 000000000',
    tvaRate:      20,
    mentionTVA:   'TVA 20% applicable',
  },
};

// Compteur factures en mémoire (en prod → Firestore)
let factureCounter = 1;
let factures = [];

// ══════════════════════════════════════════
// GÉNÉRATION NUMÉRO FACTURE
// ══════════════════════════════════════════
function genNumeroFacture() {
  const year = new Date().getFullYear();
  const num  = String(factureCounter).padStart(3, '0');
  factureCounter++;
  return `RL-${year}-F${num}`;
}

// ══════════════════════════════════════════
// MESSAGES MANUELS — templates courts
// ══════════════════════════════════════════

/**
 * Génère un message de proposition de dossier pour un artisan
 * Court, professionnel, prêt à copier-coller
 */
function genMessagePropositionArtisan(projet, artisan) {
  const comm = Math.round(projet.budget * 0.08).toLocaleString('fr-FR');
  return `Bonjour ${artisan.rs},

Nous avons un nouveau dossier qui correspond à votre profil :

📋 ${projet.type}
📍 ${projet.ville} (${projet.cp})
📐 Surface : ${projet.surface}
💶 Budget estimé : ${projet.budget.toLocaleString('fr-FR')} €
📅 Délai : ${projet.delai}

${projet.desc.length > 120 ? projet.desc.substring(0, 120) + '…' : projet.desc}

Commission RenoLink : 8% → environ ${comm} €

Vous intéressez-vous à ce dossier ?
Répondez OUI et nous vous transmettons les coordonnées client.

RenoLink — ${new Date().toLocaleDateString('fr-FR')}`;
}

/**
 * Message de validation dossier pour le client
 */
function genMessageValidationClient(projet) {
  return `Bonjour ${projet.client.nom.split(' ')[0]},

Votre projet a bien été reçu et est en cours d'analyse par notre équipe.

📋 Réf. ${projet.id} — ${projet.type}
📍 ${projet.ville}

Nous revenons vers vous prochainement avec une sélection d'artisans adaptés à votre projet.

À très bientôt,
RenoLink`;
}

/**
 * Message de mise en relation (coordonnées client → artisan)
 */
function genMessageMiseEnRelation(projet, artisan) {
  return `Bonjour ${artisan.rs},

Suite à votre accord, voici les coordonnées de votre contact :

👤 ${projet.client.nom}
📞 ${formatTel(projet.client.tel)}
✉️ ${projet.client.email}
📋 Dossier : ${projet.id} — ${projet.type} — ${projet.ville}
💶 Budget : ${projet.budget.toLocaleString('fr-FR')} €

Rappel : en cas de devis signé, merci de nous informer du montant afin que nous puissions établir notre facture de commission (8% HT).

Bonne continuation,
RenoLink`;
}

/**
 * Message de relance artisan (vérification signature)
 */
function genMessageRelanceArtisan(projet, artisan) {
  return `Bonjour ${artisan.rs},

Nous faisons le point concernant le dossier ${projet.id} (${projet.type} — ${projet.ville}).

Avez-vous pu prendre contact avec le client ?
Un devis a-t-il été remis ou signé ?

Si un chantier a été conclu, merci de nous communiquer le montant HT du devis signé pour établir notre facture de commission.

Merci pour votre retour,
RenoLink`;
}

/**
 * Message de relance client (confirmation signature)
 */
function genMessageRelanceClient(projet) {
  return `Bonjour ${projet.client.nom.split(' ')[0]},

Nous espérons que votre projet avance bien.

Avez-vous eu l'occasion d'échanger avec ${projet.artisanAssigne || "l'artisan"} ?
Un devis vous a-t-il été remis ?

N'hésitez pas à nous faire un retour, nous restons disponibles pour vous accompagner.

À bientôt,
RenoLink`;
}

/**
 * Message après signature (confirmation commission)
 */
function genMessageConfirmationSignature(projet) {
  const comm = Math.round((projet.montantSigne || projet.budget) * 0.08).toLocaleString('fr-FR');
  return `Bonjour ${projet.artisanAssigne},

Félicitations pour la signature du chantier ${projet.id} !

Conformément à votre engagement lors de l'inscription, nous allons établir notre facture de commission :
💶 Montant du chantier : ${(projet.montantSigne || projet.budget).toLocaleString('fr-FR')} € HT
📊 Commission RenoLink 8% : ${comm} € HT

Vous recevrez notre facture prochainement.

Merci pour votre confiance,
RenoLink`;
}

// ══════════════════════════════════════════
// MODAL MESSAGES — afficher + copier
// ══════════════════════════════════════════
function ouvrirModalMessages(projetId) {
  const p = projects.find(x => x.id === projetId);
  if (!p) return;

  const art = p.artisanAssigne ? artisans.find(a => a.rs === p.artisanAssigne) : null;

  // Construire les templates disponibles
  const templates = [
    {
      label:   '📋 Proposition à l\'artisan',
      icone:   '🔨',
      cible:   art ? art.rs : 'Aucun artisan assigné',
      contact: art ? formatTel(art.tel) : '',
      email:   art ? art.email : '',
      texte:   art ? genMessagePropositionArtisan(p, art) : 'Assignez d\'abord un artisan à ce dossier.',
      canSend: !!art,
    },
    {
      label:   '✅ Validation au client',
      icone:   '👤',
      cible:   p.client.nom,
      contact: formatTel(p.client.tel),
      email:   p.client.email,
      texte:   genMessageValidationClient(p),
      canSend: true,
    },
    {
      label:   '🤝 Mise en relation (coords client → artisan)',
      icone:   '🔗',
      cible:   art ? art.rs : 'Aucun artisan assigné',
      contact: art ? formatTel(art.tel) : '',
      email:   art ? art.email : '',
      texte:   art ? genMessageMiseEnRelation(p, art) : 'Assignez d\'abord un artisan.',
      canSend: !!art,
    },
    {
      label:   '🔔 Relance artisan',
      icone:   '🔨',
      cible:   art ? art.rs : 'Aucun artisan assigné',
      contact: art ? formatTel(art.tel) : '',
      email:   art ? art.email : '',
      texte:   art ? genMessageRelanceArtisan(p, art) : 'Assignez d\'abord un artisan.',
      canSend: !!art,
    },
    {
      label:   '🔔 Relance client',
      icone:   '👤',
      cible:   p.client.nom,
      contact: formatTel(p.client.tel),
      email:   p.client.email,
      texte:   genMessageRelanceClient(p),
      canSend: true,
    },
    {
      label:   '💶 Confirmation commission (après signature)',
      icone:   '💶',
      cible:   art ? art.rs : 'Aucun artisan assigné',
      contact: art ? formatTel(art.tel) : '',
      email:   art ? art.email : '',
      texte:   art ? genMessageConfirmationSignature(p) : 'Assignez d\'abord un artisan.',
      canSend: !!art && p.statut === 'signe',
    },
  ];

  // Stocker les templates pour utilisation dans les boutons
  window._msgTemplates = templates;
  window._msgProjetId  = projetId;

  // Remplir le modal
  const el = document.getElementById('msg-projet-ref');
  if (el) el.textContent = p.id + ' — ' + p.type;

  const list = document.getElementById('msg-list');
  if (!list) return;

  list.innerHTML = templates.map((t, i) => `
    <div class="msg-item" id="msg-item-${i}" onclick="selectMessage(${i})"
         style="padding:12px 14px;border:1.5px solid var(--border);border-radius:9px;cursor:pointer;
                margin-bottom:8px;transition:all .2s;${!t.canSend ? 'opacity:.5;cursor:not-allowed;' : ''}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
        <div style="font-size:.8rem;font-weight:600;">${escHtml(t.label)}</div>
        <div style="font-size:.68rem;color:var(--muted);">${escHtml(t.icone)} → ${escHtml(t.cible)}</div>
      </div>
      <div style="font-size:.7rem;color:var(--muted);line-height:1.5;">
        ${escHtml(t.texte.substring(0, 80))}…
      </div>
    </div>`
  ).join('');

  // Sélectionner le premier par défaut
  selectMessage(0);
  openModal('modal-messages');
}

function selectMessage(index) {
  const templates = window._msgTemplates || [];
  const t = templates[index];
  if (!t) return;

  // Highlight sélectionné
  document.querySelectorAll('.msg-item').forEach((el, i) => {
    el.style.borderColor = i === index ? 'var(--gold)' : 'var(--border)';
    el.style.background  = i === index ? 'rgba(184,130,10,0.04)' : '';
  });

  // Afficher le texte
  const preview = document.getElementById('msg-preview');
  if (preview) preview.value = t.texte;

  // Maj boutons d'envoi
  const tel   = t.contact ? t.contact.replace(/\s/g, '') : '';
  const email = t.email || '';
  const wa    = tel ? 'https://wa.me/33' + tel.replace(/^0/, '') + '?text=' + encodeURIComponent(t.texte) : '';

  const btnWA    = document.getElementById('msg-btn-wa');
  const btnSMS   = document.getElementById('msg-btn-sms');
  const btnEmail = document.getElementById('msg-btn-email');
  const btnCopy  = document.getElementById('msg-btn-copy');

  if (btnWA) {
    btnWA.onclick  = wa ? () => window.open(wa, '_blank') : null;
    btnWA.disabled = !wa || !t.canSend;
  }
  if (btnSMS) {
    btnSMS.onclick  = tel ? () => window.location.href = 'sms:' + tel + '?body=' + encodeURIComponent(t.texte) : null;
    btnSMS.disabled = !tel || !t.canSend;
  }
  if (btnEmail) {
    const sujet = 'RenoLink — ' + (window._msgProjetId || '');
    btnEmail.onclick  = email ? () => window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(t.texte) : null;
    btnEmail.disabled = !email || !t.canSend;
  }
  if (btnCopy) {
    btnCopy.onclick = () => copyMessage();
  }

  window._selectedMsgIndex = index;
}

function copyMessage() {
  const preview = document.getElementById('msg-preview');
  if (!preview) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(preview.value).then(() => toast('✅ Message copié dans le presse-papiers', 'success'));
  } else {
    preview.select();
    document.execCommand('copy');
    toast('✅ Message copié', 'success');
  }
}

// ══════════════════════════════════════════
// FACTURATION — GÉNÉRATION PDF FACTURE
// ══════════════════════════════════════════

function ouvrirModalFacture(projetId) {
  const p = projects.find(x => x.id === projetId);
  if (!p) { toast('⚠️ Projet introuvable', 'error'); return; }
  if (p.statut !== 'signe') { toast('⚠️ La facturation n\'est possible que pour les chantiers signés', 'error'); return; }

  const montant = p.montantSigne || p.budget;
  const comm    = Math.round(montant * 0.08);
  const cfg     = FactureConfig.statut === 'ae' ? FactureConfig.ae : FactureConfig.societe;
  const numero  = genNumeroFacture();

  // Remplir le formulaire facture
  setInputVal('fact-numero',       numero);
  setInputVal('fact-projet-ref',   p.id);
  setInputVal('fact-projet-desc',  p.type + ' — ' + p.ville);
  setInputVal('fact-artisan',      p.artisanAssigne || '');
  setInputVal('fact-montant-ht',   montant);
  setInputVal('fact-comm-ht',      comm);
  setInputVal('fact-date',         todayStr());
  setInputVal('fact-echeance',     '');

  // Afficher le bon bloc statut juridique
  updateFactureStatut();

  openModal('modal-facture');
}

function setInputVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function updateFactureStatut() {
  const statut = document.getElementById('fact-statut') ? document.getElementById('fact-statut').value : FactureConfig.statut;
  FactureConfig.statut = statut;
  const aeBlock  = document.getElementById('fact-bloc-ae');
  const socBlock = document.getElementById('fact-bloc-soc');
  if (aeBlock)  aeBlock.style.display  = statut === 'ae'      ? 'block' : 'none';
  if (socBlock) socBlock.style.display = statut === 'societe' ? 'block' : 'none';
  updateCommTTC();
}

function updateCommTTC() {
  const commHT = parseFloat(document.getElementById('fact-comm-ht')?.value) || 0;
  const statut = FactureConfig.statut;
  const tva    = statut === 'societe' ? FactureConfig.societe.tvaRate : 0;
  const ttc    = commHT + Math.round(commHT * tva / 100);
  setInputVal('fact-tva-montant', statut === 'societe' ? Math.round(commHT * tva / 100) : 0);
  setInputVal('fact-comm-ttc',    ttc);
}

function genererFacturePDF() {
  const statut = FactureConfig.statut;
  const cfg    = statut === 'ae' ? FactureConfig.ae : FactureConfig.societe;

  const numero     = document.getElementById('fact-numero')?.value || '';
  const date       = document.getElementById('fact-date')?.value || todayStr();
  const echeance   = document.getElementById('fact-echeance')?.value || '';
  const artisan    = document.getElementById('fact-artisan')?.value || '';
  const projetRef  = document.getElementById('fact-projet-ref')?.value || '';
  const projetDesc = document.getElementById('fact-projet-desc')?.value || '';
  const montantHT  = parseFloat(document.getElementById('fact-montant-ht')?.value) || 0;
  const commHT     = parseFloat(document.getElementById('fact-comm-ht')?.value) || 0;
  const tvaRate    = statut === 'societe' ? FactureConfig.societe.tvaRate : 0;
  const tvaMontant = Math.round(commHT * tvaRate / 100);
  const commTTC    = commHT + tvaMontant;

  // Infos émetteur
  const emetteurNom  = statut === 'ae'
    ? cfg.nom
    : cfg.denomination + ' ' + cfg.forme;
  const emetteurLigne2 = statut === 'ae'
    ? 'Auto-entrepreneur — SIRET ' + cfg.siret
    : cfg.forme + ' au capital de ' + cfg.capital + ' € — RCS ' + cfg.rcs + ' — SIRET ' + cfg.siret;
  const mentionTVA = cfg.mentionTVA;

  // Enregistrer la facture en mémoire
  factures.push({
    numero, date, artisan, projetRef, projetDesc,
    montantHT, commHT, tvaRate, tvaMontant, commTTC,
    statut: 'emise',
  });

  const dateFormatee = new Date(date).toLocaleDateString('fr-FR');
  const echeanceFormatee = echeance ? new Date(echeance).toLocaleDateString('fr-FR') : 'À réception';

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<title>Facture ${escHtml(numero)} — RenoLink</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:Arial,sans-serif;color:#1A1714;font-size:13px;padding:40px;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #B8820A;}
  .logo{font-size:24px;font-weight:900;letter-spacing:-.02em;} .logo span{color:#B8820A;}
  .logo-sub{font-size:11px;color:#7A736A;margin-top:3px;}
  .fact-title{font-size:22px;font-weight:700;color:#B8820A;margin-bottom:4px;}
  .fact-num{font-size:13px;color:#7A736A;}
  .parties{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px;}
  .partie-box{background:#F9F6F1;border-radius:8px;padding:16px;}
  .partie-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7A736A;margin-bottom:8px;}
  .partie-nom{font-size:14px;font-weight:700;margin-bottom:4px;}
  .partie-info{font-size:12px;color:#7A736A;line-height:1.7;}
  .dates-bar{display:flex;gap:20px;margin-bottom:24px;padding:12px 16px;background:#FEF9F0;border:1px solid rgba(184,130,10,.2);border-radius:8px;}
  .date-item label{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#92400E;display:block;margin-bottom:2px;}
  .date-item span{font-size:13px;font-weight:600;}
  table{width:100%;border-collapse:collapse;margin-bottom:16px;}
  thead th{background:#1A1714;color:#fff;padding:10px 12px;font-size:11px;text-align:left;font-weight:700;}
  thead th:last-child{text-align:right;}
  tbody td{padding:10px 12px;border-bottom:1px solid #F5F2ED;font-size:12px;vertical-align:top;}
  tbody td:last-child{text-align:right;font-weight:600;}
  .total-block{display:flex;justify-content:flex-end;margin-bottom:20px;}
  .total-table{width:280px;}
  .total-row{display:flex;justify-content:space-between;padding:5px 0;font-size:12px;border-bottom:1px solid #F5F2ED;}
  .total-row:last-child{border-bottom:none;font-size:14px;font-weight:700;color:#B8820A;padding-top:8px;}
  .mention{font-size:11px;color:#7A736A;line-height:1.7;padding:12px;border:1px solid #E4DDD0;border-radius:6px;margin-bottom:16px;}
  .mention strong{color:#1A1714;}
  .paiement{background:#FEF3E2;border:1px solid rgba(184,130,10,.3);border-radius:8px;padding:14px;margin-bottom:16px;}
  .paiement h4{font-size:12px;font-weight:700;color:#92400E;margin-bottom:8px;}
  .paiement p{font-size:12px;color:#92400E;line-height:1.6;}
  footer{margin-top:24px;padding-top:14px;border-top:1px solid #E4DDD0;font-size:11px;color:#7A736A;text-align:center;line-height:1.8;}
  @media print{body{padding:20px;}}
</style></head><body>

<div class="header">
  <div>
    <div class="logo">Reno<span>Link</span></div>
    <div class="logo-sub">Mise en relation artisans BTP — Lorraine</div>
  </div>
  <div style="text-align:right;">
    <div class="fact-title">FACTURE</div>
    <div class="fact-num">${escHtml(numero)}</div>
  </div>
</div>

<div class="parties">
  <div class="partie-box">
    <div class="partie-label">Émetteur — Prestataire</div>
    <div class="partie-nom">${escHtml(emetteurNom)}</div>
    <div class="partie-info">
      ${escHtml(emetteurLigne2)}<br>
      ${escHtml(cfg.adresse)}, ${escHtml(cfg.cp)} ${escHtml(cfg.ville)}<br>
      ${escHtml(cfg.email)} · ${escHtml(cfg.tel)}
      ${statut === 'societe' ? '<br>N° TVA : ' + escHtml(FactureConfig.societe.tvaIntra) : ''}
    </div>
  </div>
  <div class="partie-box">
    <div class="partie-label">Destinataire — Artisan</div>
    <div class="partie-nom">${escHtml(artisan || 'Artisan partenaire')}</div>
    <div class="partie-info">
      Dossier référence : ${escHtml(projetRef)}<br>
      ${escHtml(projetDesc)}
    </div>
  </div>
</div>

<div class="dates-bar">
  <div class="date-item"><label>Date d'émission</label><span>${dateFormatee}</span></div>
  <div class="date-item"><label>Échéance</label><span>${echeanceFormatee}</span></div>
  <div class="date-item"><label>Référence dossier</label><span>${escHtml(projetRef)}</span></div>
</div>

<table>
  <thead>
    <tr>
      <th style="width:50%;">Désignation</th>
      <th style="width:20%;text-align:right;">Base HT (€)</th>
      <th style="width:10%;text-align:right;">Taux</th>
      <th style="width:20%;text-align:right;">Montant HT (€)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <strong>Commission de mise en relation RenoLink</strong><br>
        <span style="color:#7A736A;font-size:11px;">
          Dossier ${escHtml(projetRef)} — ${escHtml(projetDesc)}<br>
          Chantier d'un montant de ${montantHT.toLocaleString('fr-FR')} € HT<br>
          Taux de commission : 8%
        </span>
      </td>
      <td>${montantHT.toLocaleString('fr-FR')} €</td>
      <td>8 %</td>
      <td>${commHT.toLocaleString('fr-FR')} €</td>
    </tr>
  </tbody>
</table>

<div class="total-block">
  <div class="total-table">
    <div class="total-row"><span>Total HT</span><span>${commHT.toLocaleString('fr-FR')} €</span></div>
    ${statut === 'societe'
      ? `<div class="total-row"><span>TVA ${tvaRate}%</span><span>${tvaMontant.toLocaleString('fr-FR')} €</span></div>`
      : `<div class="total-row"><span style="color:#7A736A;font-size:11px;">TVA non applicable</span><span>0 €</span></div>`}
    <div class="total-row"><span>Total TTC</span><span>${commTTC.toLocaleString('fr-FR')} €</span></div>
  </div>
</div>

<div class="mention">
  <strong>Mention légale :</strong> ${escHtml(mentionTVA)}<br>
  ${statut === 'ae'
    ? 'Dispensé d\'immatriculation au registre du commerce et des sociétés (RCS) et au répertoire des métiers (RM).'
    : 'Société immatriculée au RCS de ' + escHtml(FactureConfig.societe.rcs) + '.'}
</div>

<div class="paiement">
  <h4>💶 Modalités de règlement</h4>
  <p>
    Règlement par virement bancaire à réception de la présente facture.<br>
    <strong>Tout retard de paiement entraîne l'application de pénalités</strong> conformément aux articles L441-6 et D441-5 du Code de commerce.
  </p>
</div>

<footer>
  ${escHtml(emetteurNom)} · ${escHtml(cfg.adresse)}, ${escHtml(cfg.cp)} ${escHtml(cfg.ville)} · ${escHtml(cfg.email)}<br>
  SIRET : ${escHtml(cfg.siret)} · ${escHtml(mentionTVA)}
</footer>

</body></html>`;

  const win = window.open('', '_blank');
  if (!win) { toast('⚠️ Autorisez les popups pour générer la facture', 'error'); return; }
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 600);

  // Enregistrer dans le projet
  const projetId = projetRef;
  const proj = projects.find(x => x.id === projetId);
  if (proj) proj.historique.push({ a: 'Facture émise : ' + numero + ' — ' + commTTC.toLocaleString('fr-FR') + ' € TTC', d: nowStr(), user: 'Admin' });

  closeModal('modal-facture');
  toast('📄 Facture ' + numero + ' générée', 'success');
}

// ══════════════════════════════════════════
// RENDER PAGE FACTURES
// ══════════════════════════════════════════
function renderFactures() {
  const body = document.getElementById('factures-body');
  if (!body) return;

  if (!factures.length) {
    body.innerHTML = `<div class="empty"><div class="ei">📄</div><h3>Aucune facture émise</h3><p>Les factures de commission apparaîtront ici</p></div>`;
    return;
  }

  body.innerHTML = factures.map((f, i) => `
    <div style="display:grid;grid-template-columns:120px 1fr 140px 100px 120px 80px;
                padding:14px 18px;border-bottom:1px solid #F5F2ED;align-items:center;">
      <div class="dref">${escHtml(f.numero)}</div>
      <div>
        <div class="dname">${escHtml(f.projetDesc)}</div>
        <div class="dmeta">${escHtml(f.artisan)} · Dossier ${escHtml(f.projetRef)}</div>
      </div>
      <div style="font-size:.78rem;">${new Date(f.date).toLocaleDateString('fr-FR')}</div>
      <div style="font-weight:700;color:var(--gold);">${f.commHT.toLocaleString('fr-FR')} € HT</div>
      <div>
        <span class="statut ${f.statut === 'payee' ? 's-signe' : 's-cours'}">
          ${f.statut === 'payee' ? '✅ Payée' : '⏳ En attente'}
        </span>
      </div>
      <div class="actions">
        <button class="abtn" onclick="marquerFacturePayee(${i})" title="Marquer payée">✅</button>
      </div>
    </div>`
  ).join('');
}

function marquerFacturePayee(index) {
  if (factures[index]) {
    factures[index].statut = 'payee';
    renderFactures();
    toast('✅ Facture marquée comme payée', 'success');
  }
}

// Charge la config depuis les champs paramètres
function saveFactureConfig() {
  const statut = document.getElementById('param-statut-juridique')?.value || 'ae';
  FactureConfig.statut = statut;

  if (statut === 'ae') {
    FactureConfig.ae.nom     = sanitize(document.getElementById('param-ae-nom')?.value || '');
    FactureConfig.ae.siret   = sanitize(document.getElementById('param-ae-siret')?.value || '');
    FactureConfig.ae.adresse = sanitize(document.getElementById('param-ae-adresse')?.value || '');
    FactureConfig.ae.cp      = sanitize(document.getElementById('param-ae-cp')?.value || '');
    FactureConfig.ae.ville   = sanitize(document.getElementById('param-ae-ville')?.value || '');
    FactureConfig.ae.email   = sanitize(document.getElementById('param-ae-email')?.value || '');
    FactureConfig.ae.tel     = sanitize(document.getElementById('param-ae-tel')?.value || '');
  } else {
    FactureConfig.societe.denomination = sanitize(document.getElementById('param-soc-denom')?.value || '');
    FactureConfig.societe.forme        = sanitize(document.getElementById('param-soc-forme')?.value || '');
    FactureConfig.societe.capital      = sanitize(document.getElementById('param-soc-capital')?.value || '');
    FactureConfig.societe.siret        = sanitize(document.getElementById('param-soc-siret')?.value || '');
    FactureConfig.societe.rcs          = sanitize(document.getElementById('param-soc-rcs')?.value || '');
    FactureConfig.societe.adresse      = sanitize(document.getElementById('param-soc-adresse')?.value || '');
    FactureConfig.societe.email        = sanitize(document.getElementById('param-soc-email')?.value || '');
  }

  toast('✅ Informations de facturation sauvegardées', 'success');
}

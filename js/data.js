/* ═══════════════════════════════════════════
   RENOLINK — data.js
   Données démo + état global de l'application
   ═══════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════
// ÉTAT GLOBAL
// ══════════════════════════════════════════
const AppState = {
  activeFilter:  'tous',
  searchTerm:    '',
  activeProject: null,
  activeArtisan: null,
};

// ══════════════════════════════════════════
// PROJETS DÉMO
// ══════════════════════════════════════════
let projects = [
  {
    id: 'RL-2026-047',
    type: 'Rénovation salle de bain',
    client: { nom: 'Martin Jean', tel: '0612345678', email: 'jean.martin@email.fr', pref: 'Téléphone' },
    ville: 'Nancy', cp: '54000', surface: '7,5 m²',
    budget: 11000, delai: 'Dans 1 à 3 mois',
    desc: 'Dépose baignoire, pose douche italienne, carrelage sol/murs, lavabo et robinetterie. 3ème étage sans ascenseur.',
    statut: 'nouveau', date: '2026-04-28',
    artisanAssigne: null,
    notes: '',
    montantSigne: 0,
    photos: [], // tableau de { name, dataUrl, size }
    historique: [{ a: 'Dossier reçu', d: '28/04/2026 14:32', user: 'Système' }]
  },
  {
    id: 'RL-2026-046',
    type: 'Isolation thermique ITE',
    client: { nom: 'Dupont Marie', tel: '0698765432', email: 'marie.dupont@email.fr', pref: 'Email' },
    ville: 'Metz', cp: '57000', surface: '120 m²',
    budget: 18500, delai: 'Dans 3 à 6 mois',
    desc: 'ITE maison 120m² de 1972. Façades nord et sud. Éligible MaPrimeRénov\'.',
    statut: 'valide', date: '2026-04-27',
    artisanAssigne: 'THERMIQUE EST',
    notes: 'Budget confirmé. Client sérieux. RGE obligatoire.',
    montantSigne: 0,
    photos: [],
    historique: [
      { a: 'Dossier reçu', d: '27/04/2026 09:15', user: 'Système' },
      { a: 'Validé par admin', d: '27/04/2026 11:00', user: 'Admin' },
      { a: 'Proposé à THERMIQUE EST', d: '27/04/2026 14:00', user: 'Admin' }
    ]
  },
  {
    id: 'RL-2026-045',
    type: 'Rénovation cuisine complète',
    client: { nom: 'Bernard Sophie', tel: '0711223344', email: 'sophie.bernard@email.fr', pref: 'SMS' },
    ville: 'Nancy', cp: '54000', surface: '14 m²',
    budget: 9500, delai: 'Dans 1 à 3 mois',
    desc: 'Dépose ancienne cuisine, pose nouvelle fournie par client, carrelage sol, peinture, hotte encastrée.',
    statut: 'visite', date: '2026-04-26',
    artisanAssigne: 'RENOV HABITAT',
    notes: 'Visite prévue le 02/05/2026.',
    montantSigne: 0,
    photos: [],
    historique: [
      { a: 'Dossier reçu', d: '26/04/2026 16:48', user: 'Système' },
      { a: 'Artisan assigné : RENOV HABITAT', d: '26/04/2026 18:00', user: 'Admin' },
      { a: 'Visite planifiée 02/05/2026', d: '27/04/2026 09:00', user: 'Admin' }
    ]
  },
  {
    id: 'RL-2026-043',
    type: 'Réfection toiture tuile',
    client: { nom: 'Schmitt Alain', tel: '0677889900', email: 'alain.schmitt@email.fr', pref: 'Téléphone' },
    ville: 'Metz', cp: '57000', surface: '180 m²',
    budget: 22000, delai: 'Dans 1 à 3 mois',
    desc: 'Réfection complète toiture tuile 180m². Velux x3. Traitement charpente préventif.',
    statut: 'signe', date: '2026-04-20',
    artisanAssigne: 'COUVERTURE LORRAINE',
    notes: 'Chantier signé le 22/04. Commission 8% = 1 760 € à facturer.',
    montantSigne: 22000,
    photos: [],
    historique: [
      { a: 'Dossier reçu', d: '20/04/2026 08:45', user: 'Système' },
      { a: 'Validé par admin', d: '20/04/2026 10:00', user: 'Admin' },
      { a: 'Artisan assigné : COUVERTURE LORRAINE', d: '21/04/2026 09:00', user: 'Admin' },
      { a: 'Visite chantier effectuée', d: '22/04/2026 10:00', user: 'Admin' },
      { a: 'Chantier signé — 22 000 €', d: '22/04/2026 14:00', user: 'Admin' }
    ]
  },
  {
    id: 'RL-2026-042',
    type: 'Peinture intérieure',
    client: { nom: 'Morel Céline', tel: '0733445566', email: 'celine.morel@email.fr', pref: 'Email' },
    ville: 'Verdun', cp: '55100', surface: '80 m²',
    budget: 2800, delai: 'Dans le mois',
    desc: 'T3 80m². 3 pièces + couloir. Murs et plafonds. Peinture fournie par le client.',
    statut: 'perdu', date: '2026-04-18',
    artisanAssigne: null,
    notes: 'Aucun artisan disponible sur la période demandée.',
    montantSigne: 0,
    photos: [],
    historique: [
      { a: 'Dossier reçu', d: '18/04/2026 15:10', user: 'Système' },
      { a: 'Aucun artisan disponible — Perdu', d: '20/04/2026 09:00', user: 'Admin' }
    ]
  }
];

// ══════════════════════════════════════════
// ARTISANS DÉMO
// ══════════════════════════════════════════
let artisans = [
  {
    id: 'A001', rs: 'RENOV HABITAT',
    metier: 'Rénovation intérieure', ville: 'Nancy',
    tel: '0610203040', email: 'contact@renovhabitat.fr',
    zone: 'Nancy, Meurthe-et-Moselle (54)',
    kbis: true, decennale: true, rcpro: true,
    rge: true, qualibat: true, qualipac: false,
    statut: 'actif', notes: 'Artisan fondateur. Très réactif. Priorité haute.'
  },
  {
    id: 'A002', rs: 'THERMIQUE EST',
    metier: 'Chauffage, PAC, Isolation', ville: 'Nancy',
    tel: '0630405060', email: 'contact@thermiqueest.fr',
    zone: 'Grand Est — 54, 57, 55, 88',
    kbis: true, decennale: true, rcpro: true,
    rge: true, qualibat: false, qualipac: true,
    statut: 'actif', notes: 'Spécialiste RGE ITE et PAC.'
  },
  {
    id: 'A003', rs: 'BATI EXPERT',
    metier: 'Électricité générale', ville: 'Metz',
    tel: '0620304050', email: 'contact@batiexpert.fr',
    zone: 'Metz, Moselle (57)',
    kbis: true, decennale: false, rcpro: true,
    rge: false, qualibat: false, qualipac: false,
    statut: 'attente', notes: 'Décennale à confirmer avant activation.'
  },
  {
    id: 'A004', rs: 'COUVERTURE LORRAINE',
    metier: 'Toiture & Charpente', ville: 'Metz',
    tel: '0640506070', email: 'contact@couverturelorraine.fr',
    zone: 'Moselle, Meurthe-et-Moselle',
    kbis: true, decennale: true, rcpro: true,
    rge: false, qualibat: true, qualipac: false,
    statut: 'actif', notes: ''
  }
];

// ══════════════════════════════════════════
// CONFIGURATION EMAILS (Brevo / SMTP)
// ══════════════════════════════════════════
// En production : remplacer par appel API Brevo
// En MVP : génère le contenu email et ouvre le client mail
const EmailConfig = {
  adminEmail: 'admin@renolink.fr',
  adminName:  'RenoLink Lorraine',
  signature:  'L\'équipe RenoLink\ncontact@renolink.fr\nrenolink.fr',
};

// ══════════════════════════════════════════
// MESSAGES EMAIL PAR STATUT
// ══════════════════════════════════════════
const EmailTemplates = {
  valide: (p) => ({
    sujet: `✅ Votre projet ${p.id} a été validé — RenoLink`,
    corps: `Bonjour ${p.client.nom.split(' ')[0]},\n\nVotre projet a bien été analysé et validé par notre équipe.\n\n📋 Projet : ${p.type}\n📍 Ville : ${p.ville} (${p.cp})\n💶 Budget estimé : ${p.budget.toLocaleString('fr-FR')} €\n\nNous recherchons actuellement le ou les artisans vérifiés les mieux adaptés à votre projet dans votre zone.\n\nVous serez contacté directement par l'artisan sélectionné sous 48h ouvrées.\n\n${EmailConfig.signature}`
  }),

  'en-cours': (p) => ({
    sujet: `🔍 Votre dossier ${p.id} est en cours de traitement — RenoLink`,
    corps: `Bonjour ${p.client.nom.split(' ')[0]},\n\nNous traitons actuellement votre dossier.\n\nNos équipes analysent votre projet et sélectionnent les artisans disponibles.\n\n📋 ${p.type} — ${p.ville}\n\nNous revenons vers vous très rapidement.\n\n${EmailConfig.signature}`
  }),

  visite: (p) => ({
    sujet: `📍 Visite de chantier planifiée — Dossier ${p.id}`,
    corps: `Bonjour ${p.client.nom.split(' ')[0]},\n\nBonne nouvelle ! Un artisan de notre réseau souhaite visiter votre chantier.\n\n📋 Projet : ${p.type}\n🔨 Artisan : ${p.artisanAssigne || 'À confirmer'}\n\nL'artisan vous contactera directement pour convenir d'un créneau.\n\nPensez à préparer :\n• Les photos du chantier\n• Vos contraintes de planning\n• Toute information utile sur l'accès\n\n${EmailConfig.signature}`
  }),

  devis: (p) => ({
    sujet: `📄 Devis envoyé par l'artisan — Dossier ${p.id}`,
    corps: `Bonjour ${p.client.nom.split(' ')[0]},\n\nL'artisan ${p.artisanAssigne || ''} vous a transmis un devis pour votre projet.\n\n📋 ${p.type} — ${p.ville}\n\nNous vous recommandons de :\n• Vérifier que le devis couvre bien tous les travaux décrits\n• Demander les attestations d'assurance si ce n'est pas déjà fait\n• Nous informer de votre décision\n\nEn cas de signature, un acompte de 30% maximum est légalement autorisé avant le début des travaux.\n\n${EmailConfig.signature}`
  }),

  signe: (p) => ({
    sujet: `🤝 Félicitations — Chantier signé ! Dossier ${p.id}`,
    corps: `Bonjour ${p.client.nom.split(' ')[0]},\n\nExcellente nouvelle ! Votre chantier a été signé avec ${p.artisanAssigne || 'l\'artisan'}.\n\n📋 ${p.type} — ${p.ville}\n💶 Montant : ${(p.montantSigne || p.budget).toLocaleString('fr-FR')} €\n\nNous vous souhaitons un excellent chantier !\n\nN'hésitez pas à nous laisser un avis sur RenoLink après la réalisation des travaux. Cela aide d'autres particuliers à trouver des artisans de confiance.\n\n${EmailConfig.signature}`
  }),

  perdu: (p) => ({
    sujet: `Votre projet RenoLink ${p.id} — Mise à jour`,
    corps: `Bonjour ${p.client.nom.split(' ')[0]},\n\nNous sommes désolés de vous informer que nous n'avons pas trouvé d'artisan disponible pour votre projet dans les délais souhaités.\n\n📋 ${p.type} — ${p.ville}\n\nNous conservons votre dossier et reviendrons vers vous si une disponibilité se libère.\n\nN'hésitez pas à nous recontacter si votre calendrier évolue.\n\n${EmailConfig.signature}`
  }),

  rejete: (p) => ({
    sujet: `Votre demande RenoLink ${p.id} — Information importante`,
    corps: `Bonjour ${p.client.nom.split(' ')[0]},\n\nAprès analyse, nous ne sommes pas en mesure de traiter votre demande dans les conditions actuelles.\n\nCela peut être dû à :\n• Un budget estimé insuffisant pour ce type de projet\n• Une zone géographique non couverte\n• Un projet ne correspondant pas à notre périmètre\n\nN'hésitez pas à nous recontacter pour tout autre projet.\n\n${EmailConfig.signature}`
  }),

  // Email vers l'artisan lors de proposition d'un dossier
  propositionArtisan: (p, artisan) => ({
    sujet: `📋 Nouveau dossier RenoLink — ${p.type} ${p.ville}`,
    corps: `Bonjour,\n\nNous avons un nouveau dossier qui correspond à votre profil.\n\n━━━━━━━━━━━━━━━━━━━━━━\n📋 DOSSIER ${p.id}\n━━━━━━━━━━━━━━━━━━━━━━\n\n🏗️ Type : ${p.type}\n📍 Ville : ${p.ville} (${p.cp})\n📐 Surface : ${p.surface}\n💶 Budget estimé : ${p.budget.toLocaleString('fr-FR')} €\n📅 Délai souhaité : ${p.delai}\n\n📝 Description :\n${p.desc}\n\n━━━━━━━━━━━━━━━━━━━━━━\n💶 Commission RenoLink : 8% du montant HT signé\n   soit ~${Math.round(p.budget * 0.08).toLocaleString('fr-FR')} € sur ce projet\n━━━━━━━━━━━━━━━━━━━━━━\n\nRépondez OUI ou NON à ce message, ou appelez-nous.\n\n⚠️ Les coordonnées client sont transmises UNIQUEMENT après votre acceptation.\n\n${EmailConfig.signature}`
  }),

  // Relance client pour confirmer signature
  relanceSignature: (p) => ({
    sujet: `RenoLink — Confirmation de votre chantier ${p.id}`,
    corps: `Bonjour ${p.client.nom.split(' ')[0]},\n\nNous faisons suite à la mise en relation avec ${p.artisanAssigne || 'notre artisan partenaire'}.\n\nPourriez-vous nous confirmer :\n• Avez-vous signé un devis ?\n• Si oui, quel est le montant du chantier ?\n\nCes informations nous permettent d'améliorer la qualité de notre service.\n\nMerci pour votre retour.\n\n${EmailConfig.signature}`
  })
};

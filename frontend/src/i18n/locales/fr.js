export default {
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    refresh: 'Actualiser',
    loading: 'Chargement...',
    signOut: 'Déconnexion',
    back: 'Retour',
    downloadPdf: 'Télécharger PDF',
    generatingPdf: 'Génération du PDF...',
    takeAction: 'Agir →',
    description: 'Description',
    quantity: 'Qté',
    unit: 'Unité',
    total: 'Total',
    all: 'Tous',
    yes: 'Oui',
    no: 'Non',
    you: 'Vous'
  },
  lang: {
    label: 'Langue',
    fr: 'Français',
    ar: 'العربية',
    en: 'English'
  },
  nav: {
    store: 'Boutique',
    admin: 'Administration',
    dashboard: 'Espace client',
    faq: 'FAQ',
    about: 'À propos',
    signIn: 'Connexion',
    portal: 'Portail',
    consultation: 'Consultation gratuite',
    toggleMenu: 'Menu',
    homeAria: 'Accueil Energy Agency'
  },
  auth: {
    backToSite: '← Retour au site',
    agencyTag: 'Energy Agency',
    signInTitle: 'Connexion',
    registerTitle: 'Créer un compte',
    signInSubtitle: 'Accédez à votre espace client.',
    registerSubtitle: 'Créez un compte pour demander des devis et services.',
    visualTitle: 'Votre portail client',
    visualDesc: 'Demandez des devis, suivez vos commandes et vos projets solaires avec Energy Agency SAK.',
    fullName: 'Nom complet',
    company: 'Entreprise',
    companyPlaceholder: 'Nom de votre société',
    phone: 'Téléphone mobile',
    phonePlaceholder: '+212 612 345 678',
    email: 'E-mail',
    password: 'Mot de passe',
    show: 'Afficher',
    hide: 'Masquer',
    passwordHint: 'Au moins 8 caractères avec majuscule, minuscule et un chiffre.',
    pleaseWait: 'Veuillez patienter...',
    createAccount: 'Créer un compte',
    noAccount: 'Pas encore de compte ?',
    hasAccount: 'Déjà inscrit ?'
  },
  portal: {
    clientPortal: 'Portail client',
    hello: 'Bonjour, {name}',
    browseCatalog: 'Voir le catalogue',
    addPhone: 'Ajouter votre mobile',
    saving: 'Enregistrement...',
    savePhone: 'Enregistrer'
  },
  dashboard: {
    tabs: {
      rfq: 'Demandes de devis',
      followup: 'Suivi',
      messages: 'Messages'
    },
    rfq: {
      title: 'Demandes de devis',
      subtitle: 'Vos demandes boutique et devis officiels SAK.',
      newQuote: 'Nouveau devis depuis la boutique →',
      loading: 'Chargement de vos demandes...',
      emptyTitle: 'Aucune demande de devis',
      emptyDesc: 'Ajoutez des produits au catalogue et soumettez une demande pour commencer.',
      goStore: 'Aller à la boutique',
      quoteTotal: 'Total du devis',
      confirmFollowup: 'Confirmer et ouvrir le suivi',
      followupOpened: 'Suivi ouvert ✓'
    },
    followup: {
      title: 'Suivi de commande',
      subtitle: 'Suivez votre devis confirmé via le workflow SAK — mis à jour à chaque étape.',
      emptyTitle: 'Aucun suivi pour le moment',
      emptyDesc: 'Confirmez un devis dans l’onglet Devis — le suivi s’ouvre automatiquement.',
      viewQuotes: 'Voir mes devis'
    },
    messages: {
      title: 'Messages',
      subtitle: 'Contactez l’équipe SAK pour vos projets ou devis.',
      empty: 'Aucun message. Envoyez une note à SAK ci-dessous.',
      placeholder: 'Écrire à Energy Agency SAK...',
      sending: 'Envoi...',
      send: 'Envoyer'
    }
  },
  admin: {
    console: 'Console opérations SAK',
    tabs: {
      overview: 'Vue d’ensemble',
      orders: 'Commandes & RFQ',
      marketplace: 'Produits',
      projects: 'Projets',
      clients: 'Clients',
      operations: 'Gestion Opérations'
    },
    overview: {
      title: 'Vue d’ensemble',
      subtitle: 'Ce qui demande votre attention aujourd’hui',
      visits: 'Visites du site (7 jours)',
      visitsStat: '{week} visites · {today} aujourd’hui',
      topPages: 'Pages les plus visitées',
      topProducts: 'Produits les plus demandés'
    },
    orders: {
      title: 'Commandes & RFQ',
      subtitle: 'Tarifer le catalogue et ajouter des lignes manuelles. Télécharger les devis PDF.',
      empty: 'Aucune commande RFQ ne correspond aux filtres.',
      editQuote: 'Modifier le devis',
      prepareQuote: 'Préparer le devis',
      quoteBuilder: 'Éditeur de devis',
      clientConfirmed: 'Client confirmé — suivi ouvert'
    },
    projects: {
      title: 'Suivi de projet',
      subtitle: 'Suivi des commandes confirmées — ouvert automatiquement après confirmation du devis.',
      emptyTitle: 'Aucun suivi pour le moment',
      emptyDesc: 'Les projets apparaissent après confirmation du devis par le client.',
      goOrders: 'Aller aux commandes →',
      updateFollowup: 'Mettre à jour le suivi',
      active: 'Suivis actifs',
      onHold: 'En pause',
      completed: 'Terminés',
      allPhases: 'Toutes les phases',
      saveFollowup: 'Enregistrer le suivi',
      saving: 'Enregistrement...',
      saved: 'Suivi enregistré. Journal d’activité mis à jour.'
    },
    clients: {
      title: 'Clients',
      subtitle: 'Partenaires inscrits et leur activité'
    },
    operations: {
      title: 'Opérations & Dispatch Terrain',
      subtitle: 'Gérer le planning des opérateurs, attribuer les tâches terrain (Installation, Maintenance, Livraison, Étude) et suivre la file d’attente.',
      assignTaskBtn: '+ Attribuer une tâche',
      subtabs: {
        calendar: 'Planning & Calendrier',
        operators: 'Liste des Opérateurs',
        tasksQueue: 'Toutes les Tâches'
      },
      kpis: {
        totalOps: 'Opérateurs Terrain',
        onDutyOps: 'Techniciens en service',
        totalTasks: 'Tâches attribuées',
        inProgress: 'En cours',
        assigned: 'En attente / Assignées',
        completed: 'Tâches terminées'
      },
      types: {
        installation: 'Installation (Nouveaux Équipements)',
        maintenance: 'Maintenance (Diagnostic & Réparation)',
        delivery: 'Livraison (Nouvelle Commande)',
        study: 'Faire une Étude (Audit & Dimensionnement)'
      },
      roster: {
        title: 'Flotte d’Opérateurs',
        activeTasks: 'Tâches Actives',
        assignQuick: 'Assigner Tâche',
        duty: 'Statut de Service',
        rating: 'Évaluation',
        specialties: 'Spécialités'
      },
      modal: {
        createTitle: 'Affecter une nouvelle tâche à un opérateur',
        editTitle: 'Détail de l’affectation',
        taskType: 'Type de Service',
        selectOperator: 'Opérateur Assigné',
        taskTitle: 'Titre / Objet de la tâche',
        priority: 'Niveau de Priorité',
        scheduledDate: 'Date prévue',
        timeSlot: 'Créneau horaire',
        clientName: 'Nom du Client',
        clientPhone: 'Téléphone Client',
        clientEmail: 'Email Client',
        clientAddress: 'Adresse du site',
        clientCity: 'Ville / Région',
        adminNotes: 'Consignes & Notes Administrateur',
        submitCreate: 'Dépêcher la Tâche',
        submitUpdate: 'Mettre à jour'
      },
      calendarView: {
        selectDay: 'Planning du jour sélectionné',
        noTasks: 'Aucune tâche programmée pour cette date.'
      }
    },
    kpi: {
      clients: 'Clients',
      products: 'Produits catalogue',
      rfqs: 'Commandes RFQ',
      projects: 'Projets actifs',
      pendingRfqs: 'RFQ en attente',
      lowStock: 'Stock faible'
    },
    filters: {
      allStatuses: 'Tous les statuts',
      review: 'En revue',
      engineering: 'Ingénierie',
      issued: 'Devis émis',
      dispatched: 'Expédié'
    },
    overviewExtra: {
      lowInterest: 'Produits peu demandés',
      recentRfqs: 'Demandes de devis récentes',
      noPageData: 'Pas encore de données de pages.',
      noCatalogData: 'Pas encore de données catalogue.',
      unknownProduct: 'Produit inconnu',
      units: 'unités',
      noRfqDemand: 'Aucune demande RFQ enregistrée.',
      noRfqsYet: 'Aucune demande de devis soumise.'
    },
    marketplace: {
      title: 'Produits',
      subtitle: 'Gérez le catalogue, les stocks et les images produits.',
      newProduct: 'Nouveau produit',
      statProducts: 'Produits',
      inStock: 'En stock',
      lowStock: 'Stock faible',
      unitsSold: 'Unités vendues',
      searchPlaceholder: 'Rechercher par nom ou SKU...',
      allCategories: 'Toutes les catégories',
      allStock: 'Tous les niveaux de stock',
      stockIn: 'En stock',
      stockLow: 'Stock faible (< 5)',
      stockOut: 'Rupture de stock',
      loading: 'Chargement du catalogue...',
      noMatch: 'Aucun produit ne correspond aux filtres',
      empty: 'Votre catalogue est vide',
      tryFilters: 'Modifiez la recherche ou les filtres.',
      createFirst: 'Créez votre premier produit pour l’afficher en boutique.',
      addFirst: 'Ajouter le premier produit',
      colProduct: 'Produit',
      colCategory: 'Catégorie',
      colStock: 'Stock',
      colDemand: 'Demande',
      colSold: 'Vendus',
      colActions: 'Actions',
      editProduct: 'Modifier le produit',
      addToCatalog: 'Ajouter au catalogue',
      dropImage: 'Déposez une image ici',
      chooseFile: 'ou choisissez un fichier',
      removeImage: 'Supprimer',
      productName: 'Nom du produit',
      selectCategory: 'Choisir une catégorie',
      stock: 'Stock',
      rating: 'Note',
      describePlaceholder: 'Description pour les visiteurs de la boutique...',
      saveChanges: 'Enregistrer les modifications',
      createProduct: 'Créer le produit'
    },
    drawer: {
      sakFollowup: 'Suivi SAK',
      quoteLabel: 'Devis',
      confirmedOrder: 'Commande confirmée',
      confirmedOrderHint: 'Issue du devis accepté par le client — lecture seule.',
      installationSite: 'Site d’installation',
      siteHint: 'Ville ou adresse collectée au premier contact.',
      location: 'Localisation',
      locationPlaceholder: 'ex. Casablanca — zone industrielle',
      clientUpdate: 'Mise à jour pour le client',
      clientUpdateHint: 'Message court affiché sur le tableau de bord client — pas les lignes de commande.',
      clientVisible: 'Visible client',
      message: 'Message',
      messagePlaceholder: 'ex. Nous avons reçu vos informations et analysons vos données énergétiques.',
      clientPreview: 'Aperçu client',
      noClientMessage: 'Pas encore de message client — ajoutez-en lors d’une mise à jour.',
      workflowPhase: 'Phase du workflow',
      stepCounter: 'Étape {current} / {total}',
      workflowHint: 'Définir l’étape SAK visible par le client.',
      putOnHold: 'Mettre le suivi en pause',
      internalNotes: 'Notes internes',
      internalHint: 'Contexte équipe uniquement — jamais visible par le client.',
      teamBadge: 'Équipe SAK',
      notes: 'Notes',
      notesPlaceholder: 'Date de visite, statut devis, blocages, prochaines actions...',
      activityLog: 'Journal d’activité',
      traceIntro: 'Qui a changé quoi — pour la traçabilité du suivi.',
      loadingActivity: 'Chargement de l’activité...',
      noTraces: 'Aucun changement enregistré. Les mises à jour apparaissent après enregistrement.',
      noteSuggestions: {
        visit: 'Visite sur site planifiée',
        quote: 'Devis en cours',
        waiting: 'En attente du client',
        study: 'Étude technique démarrée',
        install: 'Installation planifiée'
      }
    },
    clientsTable: {
      name: 'Nom',
      company: 'Entreprise',
      email: 'E-mail',
      phone: 'Téléphone',
      rfqs: 'RFQ',
      projects: 'Projets',
      joined: 'Inscrit le'
    }
  },
  rfq: {
    status: {
      review: 'En revue',
      engineering: 'Ingénierie',
      issued: 'Devis émis',
      dispatched: 'Expédié'
    },
    steps: {
      review: 'Revue',
      engineering: 'Ingénierie',
      issued: 'Devis émis',
      dispatched: 'Expédié'
    },
    itemTypes: {
      product: 'Produit',
      installation: 'Installation',
      service: 'Service',
      transport: 'Transport / livraison',
      other: 'Autre'
    },
    pdfError: 'Impossible de générer le PDF. Réessayez.',
    notPriced: 'Ce devis n’a pas encore été tarifé.',
    table: {
      line: 'Ligne',
      item: 'Article',
      qty: 'Qté',
      unit: 'Unité',
      total: 'Total',
      totalLabel: 'Total :'
    },
    editor: {
      title: 'Lignes du devis',
      subtitle: 'Ajoutez les prix unitaires pour les produits et lignes manuelles (installation, services…).',
      draftTotal: 'Total provisoire',
      type: 'Type',
      unitPrice: 'Prix unitaire',
      lineTotal: 'Total ligne',
      placeholder: 'ex. Installation sur site',
      removeLine: 'Supprimer la ligne',
      totalMad: 'Total (MAD)',
      addLine: '+ Ajouter une ligne',
      sending: 'Envoi...',
      sendQuote: 'Envoyer le devis au client'
    },
    document: {
      tagline: 'Solutions solaires et renouvelables — Maroc',
      title: 'Devis / Quote',
      client: 'Client',
      grandTotal: 'Total général',
      status: 'Statut :',
      clientConfirmed: 'Confirmation client :',
      confirmed: 'Confirmé',
      legal1: 'Vente de matériel sous réserve de confirmation des prix et conditions de paiement convenues avec SAK.',
      legal2: 'Energy Agency SAK — Document de devis officiel.'
    }
  },
  followup: {
    steps: {
      premier_contact: {
        label: 'Premier contact',
        short: 'Contact',
        clientHint: 'SAK confirme votre demande et collecte les informations initiales du projet.',
        adminHint: 'Collecter localisation, type de projet et besoin énergétique estimé.'
      },
      data_collection: {
        label: 'Collecte des données',
        short: 'Collecte',
        clientHint: 'SAK recueille les informations du site nécessaires à votre projet.',
        adminHint: 'Compléter les données : analyse de facture ou inventaire hors réseau.'
      },
      energy_data: {
        label: 'Données énergétiques',
        short: 'Énergie',
        clientHint: 'SAK analyse vos besoins énergétiques avant la phase suivante.',
        adminHint: 'Valider les données énergétiques avant visite ou étude technique.'
      },
      completed: {
        label: 'Terminé',
        short: 'Terminé',
        clientHint: 'Votre suivi est terminé. SAK reste disponible si besoin.',
        adminHint: 'Marquer la fin de la livraison ou de la prestation.'
      }
    },
    status: {
      on_hold: 'En pause',
      premier_contact: 'Premier contact',
      data_collection: 'Collecte des données',
      energy_data: 'Données énergétiques',
      completed: 'Terminé'
    },
    currentStep: 'Étape en cours',
    onHoldTitle: 'En pause',
    onHoldClient: 'SAK a mis ce suivi en pause. Vous serez informé à la reprise.',
    onHoldAdmin: 'Ce suivi est temporairement en pause.',
    latestFromSak: 'Dernière mise à jour SAK',
    clientMessage: 'Message client',
    viewDetails: 'Voir le détail du suivi',
    workflow: 'Workflow SAK',
    whatDoing: 'Ce que fait SAK maintenant',
    backToFollowup: '← Retour au suivi',
    stepOf: 'Étape {current} sur {total}',
    complete: 'Terminé',
    percentComplete: '{n} % complété',
    notFound: 'Suivi introuvable.',
    returnDashboard: 'Retour au tableau de bord',
    workflowIntro: 'Trois étapes structurées avant visite sur site et étude technique.',
    loading: 'Chargement du suivi...',
    timeline: {
      current: 'En cours',
      done: 'Terminé',
      onHold: 'En pause'
    }
  },
  store: {
    title: 'Catalogue équipements',
    subtitle: 'Parcourez les produits solaires et composez votre demande de devis.',
    heroTitle: 'Produits solaires et renouvelables',
    heroSubtitle: 'Parcourez le catalogue, composez votre devis et suivez votre demande depuis votre espace.',
    search: 'Rechercher des produits...',
    sortPopular: 'Les plus populaires',
    sortRating: 'Mieux notés',
    sortCapacity: 'Plus grande capacité',
    sortWeight: 'Plus légers',
    myQuote: 'Mon devis',
    loadingProducts: 'Chargement des produits...',
    noProducts: 'Aucun produit trouvé',
    tryAnother: 'Essayez une autre recherche ou catégorie.',
    resetFilters: 'Réinitialiser les filtres',
    outOfStock: 'Rupture de stock',
    inStock: '{n} en stock',
    quickView: 'Aperçu rapide',
    addToQuote: 'Ajouter au devis',
    yourQuote: 'Votre devis',
    reviewItems: 'Vérifiez les articles et envoyez votre demande.',
    emptyQuote: 'Votre devis est vide. Ajoutez des produits depuis le catalogue.',
    remove: 'Retirer',
    signedInAs: 'Connecté en tant que {company}',
    signInHint: 'Connectez-vous ou créez un compte pour envoyer.',
    submitQuote: 'Envoyer le devis',
    signInSubmit: 'Connexion et envoi',
    viewDetails: 'Voir les détails',
    quoteSubmitted: 'Devis envoyé',
    reference: 'Référence :',
    goDashboard: 'Aller au tableau de bord',
    signInToSubmit: 'Connectez-vous pour envoyer votre demande de devis.',
    continue: 'Continuer',
    all: 'Tous',
    addToCart: 'Ajouter au panier',
    requestQuote: 'Demander un devis',
    cart: 'Panier',
    emptyCart: 'Votre panier est vide.',
    submitRfq: 'Envoyer la demande',
    submitting: 'Envoi...'
  },
  operator: {
    console: 'Console Opérateur Terrain',
    resetDemo: 'Réinitialiser démo',
    duty: {
      onDuty: 'En service (Actif)',
      onBreak: 'En pause',
      offDuty: 'Hors service',
      offDutyNotice: 'Vous êtes actuellement marqué hors service. Passez en service pour recevoir les nouvelles missions.'
    },
    kpi: {
      todayTasks: "Planning d'aujourd'hui",
      inProgress: 'En cours (Sur site)',
      urgent: 'Urgent / Haute priorité',
      completed: 'Tâches terminées',
      scheduled: 'prévues aujourd’hui',
      fieldActive: 'Exécution terrain',
      requiresAttention: 'Action immédiate',
      total: 'total assigné'
    },
    tabs: {
      tasks: 'Missions',
      agenda: "Planning du jour",
      archive: 'Archives terminées',
      tasksTitle: 'Missions Terrain Assignées',
      tasksSub: 'Installation, maintenance, livraison et études de consommation électrique confiées par l’Admin.'
    },
    types: {
      all: 'Toutes les missions',
      installation: 'Installation (Nouveaux équipements)',
      maintenance: 'Maintenance (Anciennes installations)',
      delivery: 'Livraison (Nouvelle commande)',
      study: 'Réaliser une étude (Consommation électrique)',
      installationShort: 'Installation',
      maintenanceShort: 'Maintenance',
      deliveryShort: 'Livraison',
      studyShort: 'Étude solaire'
    },
    statuses: {
      all: 'Tous les statuts',
      assigned: 'Assignée',
      inProgress: 'En cours',
      onHold: 'En attente',
      completed: 'Terminée'
    },
    priority: {
      urgent: 'Urgent',
      high: 'Haute',
      medium: 'Normale',
      low: 'Basse'
    },
    filters: {
      searchPlaceholder: 'Rechercher par client, code, ville, équipement...'
    },
    views: {
      grid: 'Vue cartes',
      list: 'Vue liste'
    },
    actions: {
      start: 'Démarrer',
      finish: 'Finaliser',
      view: 'Détails'
    },
    drawer: {
      statusLabel: 'Statut actuel :',
      reportIssue: 'Signaler un incident',
      clientSite: 'Détails client & site',
      clientName: 'Client / Contact',
      phone: 'Téléphone',
      location: 'Adresse d’intervention / livraison',
      schedule: 'Créneau horaire planifié',
      adminInstructions: 'Instructions Administrateur',
      operatorNotes: 'Notes de terrain & observations',
      notesPlaceholder: 'Saisissez vos observations sur site, mesures électriques, état des équipements...',
      activityLog: 'Historique d’activité',
      markCompleted: 'Marquer la tâche comme terminée'
    },
    incident: {
      title: 'Signaler un incident terrain / blocage',
      typeLabel: 'Catégorie de l’incident',
      absent: 'Client absent / injoignable',
      damaged: 'Matériel défectueux ou endommagé',
      access: 'Accès au site refusé ou impossible',
      hazard: 'Risque toiture / sécurité non garantie',
      weather: 'Météo défavorable (pluie / vents violents)',
      specs: 'Spécifications incompatibles / besoin validation Admin',
      other: 'Autre blocage',
      detailsLabel: 'Description de l’incident et démarches entreprises',
      placeholder: 'Expliquez ce qui s’est passé, qui a été contacté et l’intervention requise...',
      holdToggle: 'Mettre la mission en attente (requiert intervention Admin)',
      submit: 'Envoyer le rapport d’incident'
    },
    agenda: {
      title: "Itinéraire & Planning du jour",
      sub: 'Feuille de route chronologique des interventions prévues aujourd’hui.'
    },
    archive: {
      title: 'Archives des missions achevées',
      sub: 'Historique des livraisons remises, chantiers solaires mis en service et audits.',
      emptyTitle: 'Aucune tâche terminée pour le moment',
      emptySub: 'Les missions validées s’afficheront ici.'
    },
    empty: {
      title: 'Aucune tâche ne correspond à vos filtres',
      sub: 'Modifiez vos filtres de type, statut ou effacez la recherche.',
      clearFilters: 'Réinitialiser les filtres'
    }
  }
}

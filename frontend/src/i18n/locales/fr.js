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
    services: 'Services',
    partners: 'Partenaires',
    admin: 'Espace admin',
    operator: 'Espace opérateur',
    dashboard: 'Espace client',
    faq: 'FAQ',
    about: 'À propos',
    signIn: 'Connexion',
    portal: 'Portail',
    consultation: 'Consultation gratuite',
    toggleMenu: 'Menu',
    homeAria: 'Accueil Energy Agency',
    mainAria: 'Navigation principale',
    mobileAria: 'Navigation mobile'
  },
  auth: {
    backToSite: '← Retour au site',
    agencyTag: 'Energy Agency',
    signInTitle: 'Connexion',
    registerTitle: 'Créer un compte',
    signInSubtitle: 'Accédez à votre espace client.',
    registerSubtitle: 'Créez un compte pour demander des devis et services.',
    visualTitle: 'Votre portail client',
    visualDesc: 'Demandez des devis, suivez vos commandes et vos projets solaires avec Energy Agency.',
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
    invalidEmail: "Entrez un email valide (ex. nom{'@'}entreprise.com).",
    invalidPhone: 'Entrez un numéro de téléphone valide.',
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
    console: 'Espace client',
    storeLink: 'Voir la boutique',
    tabs: {
      rfq: 'Demandes de devis',
      services: 'Services',
      followup: 'Suivi',
      messages: 'Messages'
    },
    services: {
      title: 'Demandes de services',
      subtitle: 'Suivez l’avancement de vos installations, maintenances et autres services.',
      browse: 'Voir les services →',
      loading: 'Chargement de vos demandes…',
      emptyTitle: 'Aucune demande de service',
      emptyDesc: 'Demandez un service depuis le catalogue pour suivre sa réalisation ici.',
      phase: 'Phase de réalisation',
      currentStep: 'Étape actuelle',
      operator: 'Opérateur assigné',
      historyTitle: 'Journal d’activité'
    },
    rfq: {
      title: 'Demandes de devis',
      subtitle: 'Vos demandes boutique et devis officiels.',
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
      subtitle: 'Suivez votre devis confirmé via le workflow — mis à jour à chaque étape.',
      emptyTitle: 'Aucun suivi pour le moment',
      emptyDesc: 'Confirmez un devis dans l’onglet Devis — le suivi s’ouvre automatiquement.',
      viewQuotes: 'Voir mes devis'
    },
    messages: {
      title: 'Messages',
      subtitle: 'Contactez notre équipe pour vos projets ou devis.',
      empty: 'Aucun message. Envoyez une note à notre équipe ci-dessous.',
      placeholder: 'Écrire à Energy Agency...',
      sending: 'Envoi...',
      send: 'Envoyer'
    }
  },
  admin: {
    console: 'Console opérations',
    tabs: {
      overview: 'Vue d’ensemble',
      orders: 'Commandes et RFQ',
      marketplace: 'Produits',
      projects: 'Projets',
      services: 'Services',
      clients: 'Clients',
      operators: 'Opérateurs',
      operations: 'Missions',
      aiAnalysis: 'Analyse IA'
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
      emptyNew: 'Aucune nouvelle demande RFQ en attente.',
      emptyActive: 'Aucune RFQ en cours ou déjà traitée.',
      newSection: 'Nouvelles demandes',
      activeSection: 'En cours & anciennes',
      allSection: 'Toutes',
      newHint: 'Venant d’arriver — à tarifer ou à mettre à jour.',
      activeHint: 'Déjà examinées, devisées ou expédiées.',
      newBadge: 'Nouveau',
      statNew: 'Nouvelles',
      statActive: 'Traitées',
      statTotal: 'Total',
      linesCount: '{n} lignes',
      showLines: 'Voir les lignes catalogue',
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
      backToList: 'Retour aux projets',
      noInstallations: 'Aucune installation. Ajoutez-en une si besoin.',
      noMaintenances: 'Aucune maintenance pour le moment.',
      noStoreProducts: 'Aucun produit du catalogue sur ce projet.',
      unnamedProduct: 'Produit',
      active: 'Suivis actifs',
      onHold: 'En pause',
      completed: 'Terminés',
      allPhases: 'Toutes les phases',
      saveFollowup: 'Enregistrer le suivi',
      saving: 'Enregistrement...',
      saved: 'Suivi enregistré. Journal mis à jour.',
      newProject: 'Nouveau projet',
      createTitle: 'Nouveau projet',
      projectName: 'Nom',
      selectClient: 'Client',
      selectClientPlaceholder: 'Choisir un client…',
      createEssentials: 'Informations du projet',
      createEssentialsHint: 'Nom, client et localisation du suivi.',
      assignQuotes: 'Devis',
      assignQuotesHint: 'Lier des devis existants pour ce client (optionnel).',
      pickClientFirst: 'Choisissez un client pour voir les devis disponibles.',
      noQuotes: 'Aucun devis pour ce client. Vous pouvez quand même ajouter des produits ci-dessous.',
      description: 'Détails',
      descriptionPlaceholder: 'Notes optionnelles sur le projet…',
      createServices: 'Services (optionnel)',
      createServicesHint: 'Ajoutez installation ou maintenance seulement si besoin maintenant.',
      storeProducts: 'Produits du catalogue',
      additionalProducts: 'Produits complémentaires',
      additionalProductsHint: 'Articles du catalogue en plus du devis — affichés comme les lignes RFQ ci-dessus.',
      noAdditionalProducts: 'Aucun produit complémentaire. Ajoutez ce dont le client a encore besoin.',
      pickProductTitle: 'Choisir un produit',
      addProduct: 'Ajouter un produit',
      pickProduct: 'Choisir un produit',
      addLine: 'Ajouter',
      unitPrice: 'Prix unitaire',
      installations: 'Installation',
      addInstallation: 'Ajouter une installation',
      installationName: 'Site / titre d’installation',
      installationNamePlaceholder: 'ex. Toiture PV — entrepôt Casablanca',
      maintenances: 'Maintenance',
      addMaintenance: 'Ajouter une maintenance',
      energyType: 'Type d’énergie',
      scheduled: 'Date',
      serviceType: 'Type',
      price: 'Prix',
      serviceDetailsPlaceholder: 'Courtes notes sur ce service…',
      remove: 'Retirer',
      selectedProducts: 'Produits sélectionnés',
      enterPrice: 'Indiquez un prix unitaire avant d’ajouter.',
      productAdded: '« {name} » ajouté au projet.',
      outOfStock: 'Ce produit est en rupture de stock.',
      qtyExceedsStock: 'La quantité ne peut pas dépasser le stock ({stock}).',
      stockAvailable: 'Stock : {count}',
      priceMismatchWarnRfq: 'Différent du devis ({existing}).',
      priceMismatchWarnList: 'Différent du prix en liste ({existing}).',
      lockLine: 'Verrouiller prix et quantité',
      unlockLine: 'Déverrouiller pour modifier',
      unlockToEdit: 'Déverrouillez ce produit avant de le modifier ou de le retirer.',
      productsPill: '{count} produits',
      installationsPill: '{count} installations',
      maintenancesPill: '{count} maintenances',
      create: 'Créer'
    },
    clients: {
      title: 'Clients',
      subtitle: 'Partenaires inscrits et leur activité'
    },
    operations: {
      title: 'Missions',
      subtitle: 'Les opérateurs, une date, et les missions du jour.',
      assignHint: 'Assigner = créer une mission terrain pour un opérateur (installation, maintenance, livraison ou étude). Choisissez l’opérateur et le créneau, puis enregistrez.',
      assignTaskBtn: 'Assigner',
      addOperatorBtn: 'Ajouter un opérateur',
      operatorsTitle: 'Opérateurs',
      operatorsSubtitle: 'Ajouter, modifier ou retirer un opérateur.',
      operatorsEmpty: 'Aucun opérateur.',
      deleteOperatorConfirm: 'Retirer cet opérateur ?',
      countdown: {
        done: 'Terminée',
        inMins: 'Reste {m} min',
        inHours: 'Reste {h}h {m}m',
        inDays: 'Reste {d}j {h}h',
        overdueMins: 'En retard de {m} min',
        overdueHours: 'En retard de {h}h {m}m',
        overdueDays: 'En retard de {d}j {h}h'
      },
      schedule: {
        kicker: 'Planning opérateur',
        dayTitle: 'Missions du {date}',
        noTasks: 'Aucune mission ce jour.'
      },
      menu: {
        jobs: 'Tâches',
        operators: 'Opérateurs'
      },
      operatorForm: {
        title: 'Nouvel opérateur',
        editTitle: 'Modifier l’opérateur',
        saveChanges: 'Enregistrer',
        name: 'Nom',
        role: 'Rôle',
        phone: 'Téléphone',
        email: 'Email',
        city: 'Ville',
        password: 'Mot de passe temporaire',
        passwordHint: 'Laisser vide pour génération auto',
        save: 'Ajouter'
      },
      list: {
        search: 'Rechercher une mission ou un client',
        allTypes: 'Tous les types',
        allStatuses: 'Tous les statuts',
        allPeople: 'Tout le monde',
        job: 'Mission',
        person: 'Opérateur',
        when: 'Quand',
        status: 'Statut',
        empty: 'Aucune mission.',
        assigned: 'Assignée',
        inProgress: 'En cours',
        onHold: 'En pause',
        completed: 'Terminée',
        activeJobs: '{n} missions actives',
      },
      subtabs: {
        calendar: 'Planning & Calendrier',
        operators: 'Liste des Opérateurs',
        tasksQueue: 'Toutes les Tâches'
      },
      kpis: {
        totalOps: 'Opérateurs',
        onDutyOps: 'En service',
        totalTasks: 'Missions',
        inProgress: 'En cours',
        assigned: 'En attente / Assignées',
        completed: 'Tâches terminées'
      },
      types: {
        installation: 'Installation',
        maintenance: 'Maintenance',
        delivery: 'Livraison',
        study: 'Étude'
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
        createTitle: 'Nouvelle mission',
        editTitle: 'Modifier la mission',
        jobSection: 'Mission',
        whenSection: 'Quand',
        clientSection: 'Client',
        taskType: 'Type',
        selectOperator: 'Opérateur',
        taskTitle: 'Titre',
        priority: 'Priorité',
        priorityLow: 'Basse',
        priorityMedium: 'Moyenne',
        priorityHigh: 'Haute',
        priorityUrgent: 'Urgente',
        scheduledDate: 'Date',
        timeSlot: 'Horaire',
        clientName: 'Nom',
        clientPhone: 'Téléphone',
        clientEmail: 'Email',
        clientAddress: 'Adresse',
        clientCity: 'Ville',
        adminNotes: 'Notes',
        submitCreate: 'Enregistrer',
        submitUpdate: 'Enregistrer',
        projectOptional: 'Projet (optionnel)',
        noProject: 'Aucun projet',
        slotBusy: 'occupé',
        conflictWarning: 'Cet opérateur a déjà « {title} » sur {slot}.',
        pastDateError: 'Impossible de planifier une mission dans le passé. Choisissez aujourd’hui ou une date future.',
        saved: 'Mission enregistrée.'
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
      sku: 'SKU / Référence',
      selectCategory: 'Choisir une catégorie',
      stock: 'Stock',
      rating: 'Note',
      capacity: 'Capacité',
      weight: 'Poids (kg)',
      surface: 'Surface (m²)',
      climateInfo: 'Info climat',
      climatePlaceholder: 'ex. Adapté aux climats chauds et secs',
      highlights: 'Points forts',
      highlightsPlaceholder: 'Rendement: 21.5%\nGarantie: 25 ans\nType de cellule: Monocristallin',
      specs: 'Spécifications',
      specsPlaceholder: 'Puissance: 450W\nTension: 41.5V\nDimensions: 2100 x 1040 mm',
      documents: 'Documents',
      documentsPlaceholder: 'Fiche technique.pdf | 1.2 MB\nGuide installation.pdf | 800 KB',
      kvHint: 'Une ligne par élément: Libellé: Valeur',
      documentsHint: 'Une ligne par fichier: Nom | Taille',
      describePlaceholder: 'Description pour les visiteurs de la boutique...',
      saveChanges: 'Enregistrer les modifications',
      createProduct: 'Créer le produit',
      backToCatalog: 'Retour au catalogue',
      sectionBasic: 'Informations de base',
      sectionTechnical: 'Données techniques',
      sectionDetails: 'Détails boutique',
      images: 'Images du produit',
      filesCount: 'fichier(s)',
      dropImages: 'Déposez des images ici',
      chooseFiles: 'ou choisissez plusieurs fichiers',
      addDocument: 'Ajouter un document',
      documentsEmpty: 'Aucun document. Ajoutez fiches techniques, manuels ou certificats.',
      documentName: 'Nom du document',
      documentNamePlaceholder: 'ex. Fiche technique',
      documentFile: 'Téléverser le fichier',
      documentIncomplete: 'Chaque document doit avoir un nom et un fichier.',
      createNewCategory: '+ Créer une nouvelle catégorie',
      useExistingCategory: 'Utiliser une catégorie existante',
      newCategoryName: 'Nom de la catégorie',
      newCategoryPlaceholder: 'ex. Câbles de charge',
      newCategoryDescription: 'Description (optionnel)',
      newCategoryDescPlaceholder: 'Courte description de la catégorie',
      saveCategory: 'Enregistrer la catégorie',
      newCategoryRequired: 'Le nom de la catégorie est obligatoire.',
      newCategoryFailed: 'Impossible de créer la catégorie.',
      colVisibility: 'Boutique',
      visibleInStore: 'Visible en boutique',
      visibleInStoreHint: 'Décochez pour masquer ce produit de la boutique publique.',
      allVisibility: 'Toute visibilité',
      onlyVisible: 'Visibles seulement',
      onlyHidden: 'Masqués seulement',
      visible: 'Visible',
      hidden: 'Masqué',
    },
    drawer: {
      followup: 'Suivi',
      quoteLabel: 'Devis',
      confirmedOrder: 'Commande confirmée',
      confirmedOrderHint: 'Issue du devis accepté par le client — lecture seule.',
      installationSite: 'Site d’installation',
      siteHint: 'Ville ou adresse collectée au premier contact.',
      location: 'Localisation',
      locationPlaceholder: 'ex. Casablanca — zone industrielle',
      messagesTitle: 'Messages',
      replyPlaceholder: 'Répondre au client…',
      sendReply: 'Envoyer',
      emptyThread: 'Aucun message.',
      clientLabel: 'Client',
      teamLabel: 'Équipe',
      message: 'Message',
      messagePlaceholder: 'ex. Nous avons reçu vos informations et analysons vos données énergétiques.',
      clientPreview: 'Aperçu client',
      noClientMessage: 'Pas encore de message client — ajoutez-en lors d’une mise à jour.',
      workflowPhase: 'Phase du workflow',
      stepCounter: 'Étape {current} / {total}',
      workflowHint: 'Définir l’étape du workflow visible par le client.',
      putOnHold: 'Mettre le suivi en pause',
      internalNotes: 'Notes internes',
      internalHint: 'Contexte équipe uniquement — jamais visible par le client.',
      teamBadge: 'Équipe',
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
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      grandTotal: 'Total général',
      status: 'Statut :',
      clientConfirmed: 'Confirmation client :',
      confirmed: 'Confirmé',
      legal1: 'Vente de matériel sous réserve de confirmation des prix et conditions de paiement convenues avec Energy Agency.',
      legal2: 'Energy Agency — Document de devis officiel.'
    }
  },
  followup: {
    steps: {
      quote_confirmed: {
        label: 'Devis confirmé',
        short: 'Devis',
        clientHint: 'Votre devis est confirmé. Notre équipe prépare la suite.',
        adminHint: 'Devis accepté — confirmer le périmètre, les produits et les infos client.'
      },
      order_prep: {
        label: 'Commande / préparation',
        short: 'Prépa',
        clientHint: 'Votre commande est en préparation (produits et planification).',
        adminHint: 'Préparer les produits catalogue, la logistique et le planning chantier.'
      },
      installation: {
        label: 'Installation',
        short: 'Install.',
        clientHint: 'Les travaux d’installation sont en cours ou planifiés sur site.',
        adminHint: 'Réaliser ou suivre l’installation et les interventions terrain.'
      },
      completed: {
        label: 'Réception / terminé',
        short: 'Terminé',
        clientHint: 'La livraison est terminée. Notre équipe reste disponible si besoin.',
        adminHint: 'Marquer la réception / le transfert comme terminé.'
      }
    },
    status: {
      on_hold: 'En pause',
      quote_confirmed: 'Devis confirmé',
      order_prep: 'Commande / préparation',
      installation: 'Installation',
      completed: 'Réception / terminé'
    },
    currentStep: 'Étape en cours',
    onHoldTitle: 'En pause',
    onHoldClient: 'Notre équipe a mis ce suivi en pause. Vous serez informé à la reprise.',
    onHoldAdmin: 'Ce suivi est temporairement en pause.',
    latestUpdate: 'Dernière mise à jour',
    clientMessage: 'Message client',
    askPlaceholder: 'Posez une question…',
    send: 'Envoyer',
    viewDetails: 'Voir le détail du suivi',
    workflow: 'workflow',
    whatDoing: 'Ce que nous faisons maintenant',
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
      services: 'Réalisation services',
      agenda: "Planning du jour",
      archive: 'Archives terminées',
      tasksTitle: 'Missions Terrain Assignées',
      tasksSub: 'Installation, maintenance, livraison et études de consommation électrique confiées par l’Admin.'
    },
    services: {
      title: 'Demandes de services assignées',
      subtitle: 'Faites avancer les étapes de réalisation (1–5) pour les missions que l’admin vous a confiées.',
      empty: 'Aucune demande de service ne vous est assignée.',
      currentStep: 'Étape actuelle',
      setProgress: 'Définir la progression :',
      clientNotes: 'Notes client',
      noNotes: 'Aucune'
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
  },
  services: {
    heroTitle: 'Services Solaires & Énergies Renouvelables',
    heroSubtitle: 'De l’installation clé en main et la maintenance aux audits d’électricité gratuits et livraisons express.',
    ourServices: 'Nos Offres de Services',
    activeCount: 'services actifs',
    emptyTitle: 'Aucun service disponible',
    emptyDesc: 'Revenez bientôt — le catalogue est en cours de mise à jour.',
    requestService: 'Demander ce service',
    viewDetails: 'Voir détails & dimensionnement',
    disabledNotice: 'Ce service fait actuellement l’objet d’une mise à niveau de capacité et est temporairement suspendu.',
    requestModalTitle: 'Soumettre une Demande de Service',
    requestModalSubtitle: 'Renseignez les coordonnées de votre site et notre équipe technique traitera votre demande sous 2 heures.',
    requestSubmitted: 'Demande de service envoyée',
    requestFailed: 'Impossible d’envoyer la demande. Réessayez.',
    notFound: 'Service introuvable',
    clientsOnly: 'Seuls les comptes clients peuvent demander un service.',
    form: {
      fullName: 'Nom Complet / Raison Sociale',
      email: 'Adresse Email',
      phone: 'Numéro de Téléphone',
      city: 'Ville / Région',
      address: 'Adresse du site ou d’installation',
      preferredDate: 'Date d’intervention souhaitée',
      notes: 'Remarques sur le besoin ou le site',
      submitBtn: 'Envoyer la demande de service'
    },
    realization: {
      title: 'Suivi de la Barre de Réalisation',
      currentPhase: 'Phase Actuelle de Réalisation',
      phaseStep: 'Étape {step} sur 5',
      historyTitle: 'Journal d’Activité de la Mission'
    }
  },
  landing: {
    hero: {
      titleLine1: 'Alimentez votre avenir',
      titleLine2Before: 'avec l’',
      titleAccent: 'énergie solaire',
      subtitle: 'Économisez et réduisez votre empreinte carbone grâce à des solutions renouvelables intelligentes et premium.',
      ctaConsultation: 'Consultation gratuite',
      ctaStore: 'Explorer la boutique',
      alreadyAccount: 'Vous avez déjà un compte ?',
      scrollDown: 'Défiler vers le bas',
      features: {
        noHiddenFees: 'Sans frais cachés',
        certifiedInstall: 'Installation certifiée',
        reliable: '100 % fiable',
        warranty: 'Garantie 25 ans'
      }
    },
    cta: {
      titleLine1: 'Prêt à passer',
      titleAccent: 'solaire',
      titleLine2Before: 'au',
      titleLine2After: ' ?',
      description: 'Rejoignez des centaines de clients qui réduisent déjà leur facture d’électricité avec l’énergie propre d’Energy Agency.',
      ctaConsultation: 'Consultation gratuite',
      ctaStore: 'Explorer la boutique',
      note: 'Sans engagement · Étude de site gratuite · Financement disponible',
      statsAria: 'Statistiques clés',
      statNums: {
        installations: '+500',
        satisfaction: '98%',
        hiddenFees: '0 €',
        warranty: '25 ans'
      },
      stats: {
        installations: 'Installations',
        satisfaction: 'Satisfaction',
        hiddenFees: 'Frais cachés',
        warranty: 'Garantie'
      }
    },
    footer: {
      brandName: 'ENERGY AGENCY',
      brandDesc: 'Solutions d’énergie renouvelable premium pour particuliers et entreprises. Accélérer la transition vers une énergie propre.',
      company: 'Entreprise',
      services: 'Services',
      aboutUs: 'À propos',
      marketplace: 'Boutique',
      allServices: 'Tous les services',
      careers: 'Carrières',
      solarInstallation: 'Installation solaire',
      batteryStorage: 'Stockage batterie',
      systemMonitoring: 'Suivi de système',
      maintenance: 'Maintenance',
      stayUpdated: 'Restez informé',
      newsletterDesc: 'Inscrivez-vous à notre newsletter pour les actualités solaires et offres exclusives.',
      emailPlaceholder: 'Votre adresse e-mail',
      email: "contact{'@'}energy.inc",
      phone: '+212 690 000 000',
      social: {
        twitter: 'Twitter',
        linkedin: 'LinkedIn',
        instagram: 'Instagram'
      },
      copyright: '© 2026 Energy Agency. Tous droits réservés.',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d’utilisation',
      newsletterSuccess: 'Merci ! Vous êtes inscrit.',
      newsletterError: 'Impossible de s’inscrire. Réessayez.',
      newsletterInvalid: 'Entrez une adresse e-mail valide.'
    },
    whySolar: {
      eyebrow: 'Pourquoi le solaire ?',
      title: 'Pourquoi choisir l’énergie solaire ?',
      desc: 'Découvrez les nombreux avantages d’une transition vers des solutions renouvelables conçues pour votre avenir.',
      items: {
        bills: { title: 'Factures réduites', desc: 'Réduisez fortement, voire éliminez, vos coûts d’électricité mensuels en produisant votre propre énergie solaire.' },
        independence: { title: 'Indépendance énergétique', desc: 'Protégez-vous contre la hausse des tarifs et les coupures grâce à des solutions de stockage intelligentes.' },
        eco: { title: 'Écologique', desc: 'Réduisez significativement votre empreinte carbone et contribuez à une planète plus propre pour les générations futures.' }
      }
    },
    about: {
      eyebrow: 'À propos',
      titleLine1: 'Une énergie durable',
      titleLine2: 'pour un meilleur demain',
      p1Before: 'Nous sommes',
      brand: 'Energy Agency',
      p1After: ', spécialistes du développement de projets d’énergie renouvelable, avec des systèmes solaires premium pour particuliers et entreprises dans la région.',
      p2: 'Avec plus de dix ans d’expertise et plus de 500 installations réussies, nous livrons des solutions solaires de bout en bout — de la consultation et la conception sur mesure jusqu’à l’installation et la maintenance.',
      cta: 'En savoir plus sur nous',
      badgeLabel: 'Projets réalisés',
      playVideo: 'Lire la vidéo',
      closeVideo: 'Fermer la vidéo',
      stats: {
        years: 'Ans d’expérience',
        projects: 'Projets réalisés',
        satisfaction: 'Satisfaction client',
        warranty: 'Garantie panneaux'
      }
    },
    howItWorks: {
      eyebrow: 'Notre processus',
      title: 'Comment ça marche',
      desc: 'Passer au solaire est simple. Voici notre processus éprouvé en 4 étapes.',
      steps: {
        consultation: { title: 'Consultation', desc: 'Nous analysons votre consommation et déterminons la taille et la configuration optimales pour vos besoins.' },
        design: { title: 'Conception sur mesure', desc: 'Nos ingénieurs créent un plan solaire personnalisé adapté à votre propriété et à vos objectifs énergétiques.' },
        installation: { title: 'Installation', desc: 'Notre équipe certifiée installe votre équipement premium en toute sécurité — généralement en 1 à 2 jours.' },
        activation: { title: 'Activation', desc: 'Nous gérons inspections et raccordement réseau. Activez et commencez à économiser dès le premier jour.' }
      }
    },
    partners: {
      title: 'Partenaires équipements de confiance',
      sub: 'Nous travaillons uniquement avec des fabricants tier-1 pour garantir qualité et longévité.',
      logosAria: 'Logos partenaires',
      cta: 'En savoir plus sur nos partenaires'
    },
    servicesBlock: {
      titleLine1: 'Tout ce qu’il faut',
      titleLine2: 'pour une énergie propre',
      subtitle: 'De l’approvisionnement en équipements premium à l’installation et à la maintenance — nous nous occupons de tout.',
      mostPopular: 'Le plus populaire',
      learnMore: 'En savoir plus',
      items: {
        sales: {
          title: 'Vente d’équipements',
          desc: 'Panneaux solaires tier-1, onduleurs et stockage batterie premium auprès de nos partenaires fabricants.',
          bullets: ['Panneaux solaires tier-1', 'Onduleurs intelligents', 'Stockage batterie', 'Prix compétitifs']
        },
        installation: {
          title: 'Installation',
          desc: 'Installations professionnelles, autorisées et inspectées par notre équipe d’ingénieurs certifiés. Généralement en 1 à 2 jours.',
          bullets: ['Ingénieurs certifiés', 'Pose en 1-2 jours', 'Gestion des permis', 'Raccordement réseau']
        },
        maintenance: {
          title: 'Maintenance',
          desc: 'Suivi, nettoyage et maintenance préventive pour garder votre système au maximum de performance année après année.',
          bullets: ['Supervision 24/7', 'Nettoyage annuel', 'Rapports de performance', 'Support garantie 25 ans']
        }
      }
    },
    projects: {
      eyebrow: 'Notre portfolio',
      title: 'Installations récentes',
      desc: 'Découvrez comment nous transformons la consommation énergétique dans différents secteurs.',
      viewDetails: 'Voir les détails',
      systemSize: 'Taille système',
      annualSavings: 'Économies annuelles',
      categories: { residential: 'Résidentiel', commercial: 'Commercial', industrial: 'Industriel' },
      items: {
        ecoHome: { title: 'Maison éco moderne', location: 'Casablanca' },
        campus: { title: 'Campus tech HQ', location: 'Rabat' },
        logistics: { title: 'Site logistique', location: 'Marrakech' }
      }
    },
    testimonials: {
      eyebrow: 'Avis',
      title: 'Ce que disent nos clients',
      desc: 'Rejoignez des centaines de familles qui ont choisi une énergie propre et abordable.',
      ratingBanner: 'note moyenne sur',
      verified: 'clients vérifiés',
      items: {
        fatima: {
          quote: 'Tout le processus a été fluide. Notre facture est passée de 2 000 MAD/mois à presque zéro. L’équipe d’installation était pro et rapide — terminé en une journée !',
          role: 'Propriétaire, Casablanca'
        },
        youssef: {
          quote: 'Energy Agency a dépassé nos attentes. Le design sur mesure s’adapte parfaitement à notre toit, et l’appli de suivi rend le suivi de production très simple.',
          role: 'Chef d’entreprise, Tanger'
        },
        amira: {
          quote: 'De la première consultation à l’activation, tout a été géré avec un professionnalisme remarquable. Je recommande vivement Energy Agency.',
          role: 'Propriétaire, Marrakech'
        }
      }
    },
    faq: {
      eyebrow: 'Questions fréquentes',
      title: 'Foire aux questions',
      desc: 'Tout ce qu’il faut savoir pour passer au solaire.',
      items: [
        {
          q: 'Combien coûte un système de panneaux solaires ?',
          a: 'Le coût dépend de vos besoins énergétiques et de la taille du toit. Avec les aides et crédits d’impôt disponibles, la plupart des foyers rentabilisent l’investissement en 5 à 7 ans, avec une baisse immédiate des factures.'
        },
        {
          q: 'Combien de temps dure l’installation ?',
          a: 'La consultation, la conception et les autorisations peuvent prendre quelques semaines, mais l’installation physique des panneaux dure généralement 1 à 2 jours, avec peu de perturbation.'
        },
        {
          q: 'Que se passe-t-il sous la pluie ou la neige ?',
          a: 'Les panneaux produisent encore par temps nuageux ou pluvieux, à un rythme réduit. La pluie aide à les nettoyer. La neige fond vite grâce à la couleur sombre et à l’angle, et les batteries peuvent fournir une alimentation de secours.'
        },
        {
          q: 'Quelle est la durée de vie des panneaux solaires ?',
          a: 'Nos panneaux premium tier-1 sont conçus pour durer. Ils ont une garantie fabricant de 25 ans et produisent généralement encore pendant 30 à 40 ans avec une légère baisse d’efficacité.'
        },
        {
          q: 'Les panneaux endommagent-ils mon toit ?',
          a: 'Non. Nos installateurs certifiés utilisent un matériel de fixation spécialisé qui protège votre toiture. Les panneaux peuvent même protéger la zone couverte des intempéries et des UV.'
        }
      ]
    }
  }
}

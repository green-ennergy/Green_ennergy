export default {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    refresh: 'Refresh',
    loading: 'Loading...',
    signOut: 'Sign out',
    back: 'Back',
    downloadPdf: 'Download PDF',
    generatingPdf: 'Generating PDF...',
    takeAction: 'Take action →',
    description: 'Description',
    quantity: 'Qty',
    unit: 'Unit',
    total: 'Total',
    all: 'All',
    yes: 'Yes',
    no: 'No',
    you: 'You'
  },
  lang: {
    label: 'Language',
    fr: 'Français',
    ar: 'العربية',
    en: 'English'
  },
  nav: {
    store: 'Store',
    services: 'Services',
    partners: 'Partners',
    admin: 'Admin space',
    operator: 'Operator space',
    dashboard: 'Client space',
    faq: 'FAQ',
    about: 'About Us',
    signIn: 'Sign in',
    portal: 'Portal',
    consultation: 'Get Free Consultation',
    toggleMenu: 'Toggle menu',
    homeAria: 'Energy Agency home',
    mainAria: 'Main navigation',
    mobileAria: 'Mobile navigation'
  },
  auth: {
    backToSite: '← Back to site',
    agencyTag: 'Energy Agency',
    signInTitle: 'Sign in',
    registerTitle: 'Create account',
    signInSubtitle: 'Access your client dashboard.',
    registerSubtitle: 'Create an account to request quotes and services.',
    visualTitle: 'Your client portal',
    visualDesc: 'Request quotes, track your orders, and follow your solar projects with Energy Agency.',
    fullName: 'Full name',
    company: 'Company',
    companyPlaceholder: 'Your business name',
    phone: 'Mobile phone',
    phonePlaceholder: '+212 612 345 678',
    email: 'Email',
    password: 'Password',
    show: 'Show',
    hide: 'Hide',
    passwordHint: 'At least 8 characters with uppercase, lowercase, and a number.',
    invalidEmail: "Enter a valid email (e.g. name{'@'}company.com).",
    invalidPhone: 'Enter a valid phone number.',
    pleaseWait: 'Please wait...',
    createAccount: 'Create account',
    noAccount: "Don't have an account?",
    hasAccount: 'Already registered?'
  },
  portal: {
    clientPortal: 'Client Portal',
    hello: 'Hello, {name}',
    browseCatalog: 'Browse catalog',
    addPhone: 'Add your mobile phone',
    saving: 'Saving...',
    savePhone: 'Save phone'
  },
  dashboard: {
    console: 'Client space',
    storeLink: 'Browse store',
    tabs: {
      rfq: 'Quote requests',
      services: 'Services',
      followup: 'Follow-up',
      messages: 'Messages'
    },
    services: {
      title: 'Service requests',
      subtitle: 'Track installation, maintenance and other service realizations.',
      browse: 'Browse services →',
      loading: 'Loading your service requests...',
      emptyTitle: 'No service requests yet',
      emptyDesc: 'Request a service from the catalog to see progress here.',
      phase: 'Realization phase',
      currentStep: 'Current step',
      operator: 'Assigned operator',
      historyTitle: 'Activity log'
    },
    rfq: {
      title: 'Quote requests',
      subtitle: 'Your store requests and official quotes from our team.',
      newQuote: 'New quote from store →',
      loading: 'Loading your quote requests...',
      emptyTitle: 'No quote requests yet',
      emptyDesc: 'Add products from the catalog and submit a quote request to get started.',
      goStore: 'Go to store',
      quoteTotal: 'Quote total',
      confirmFollowup: 'Confirm & open follow-up',
      followupOpened: 'Follow-up opened ✓'
    },
    followup: {
      title: 'Order follow-up',
      subtitle: 'Track your confirmed quote through our workflow — updated by our team at each step.',
      emptyTitle: 'No follow-up yet',
      emptyDesc: 'Confirm a quote on the Quotes tab — your follow-up opens automatically.',
      viewQuotes: 'View my quotes'
    },
    messages: {
      title: 'Messages',
      subtitle: 'Contact our team about your projects or quotes.',
      empty: 'No messages yet. Send a note to our team below.',
      placeholder: 'Write to Energy Agency...',
      sending: 'Sending...',
      send: 'Send message'
    }
  },
  admin: {
    console: 'Operations Console',
    tabs: {
      overview: 'Overview',
      orders: 'Orders & RFQs',
      marketplace: 'Products',
      projects: 'Projects',
      services: 'Services',
      clients: 'Clients',
      operators: 'Operators',
      operations: 'Missions'
    },
    overview: {
      title: 'Operations Overview',
      subtitle: 'What needs your attention today',
      visits: 'Site visits (7 days)',
      visitsStat: '{week} visits · {today} today',
      topPages: 'Top pages',
      topProducts: 'Top requested products'
    },
    orders: {
      title: 'Orders & RFQ',
      subtitle: 'Price catalog products and add manual lines. Download PDF quotes for clients.',
      empty: 'No RFQ orders match your filters.',
      editQuote: 'Edit quote',
      prepareQuote: 'Prepare quote',
      quoteBuilder: 'Quote builder',
      clientConfirmed: 'Client confirmed — follow-up opened'
    },
    projects: {
      title: 'Project follow-up',
      subtitle: 'Track confirmed orders through our workflow — opened automatically after quote confirmation.',
      emptyTitle: 'No follow-ups yet',
      emptyDesc: 'Projects appear here after a client confirms a quote on their dashboard.',
      goOrders: 'Go to Orders & RFQ →',
      updateFollowup: 'Update follow-up',
      backToList: 'Back to projects',
      noInstallations: 'No installations yet. Add one if needed.',
      noMaintenances: 'No maintenance entries yet.',
      noStoreProducts: 'No store products on this project yet.',
      unnamedProduct: 'Product',
      active: 'Active follow-ups',
      onHold: 'On hold',
      completed: 'Completed',
      allPhases: 'All phases',
      saveFollowup: 'Save follow-up',
      saving: 'Saving...',
      newProject: 'New project',
      createTitle: 'New project',
      projectName: 'Name',
      selectClient: 'Client',
      selectClientPlaceholder: 'Select a client…',
      createEssentials: 'Project details',
      createEssentialsHint: 'Name, client and location for this follow-up.',
      assignQuotes: 'Quotes',
      assignQuotesHint: 'Link existing RFQs for this client (optional).',
      pickClientFirst: 'Select a client to see available quotes.',
      noQuotes: 'No quotes for this client yet. You can still add catalog products below.',
      description: 'Details',
      descriptionPlaceholder: 'Optional notes about the project…',
      createServices: 'Services (optional)',
      createServicesHint: 'Add installation or maintenance only if needed now.',
      storeProducts: 'Store products',
      additionalProducts: 'Additional products',
      additionalProductsHint: 'Extra catalog items needed after the RFQ — shown like the quote lines above.',
      noAdditionalProducts: 'No additional products yet. Add catalog items the client still needs.',
      pickProductTitle: 'Pick a product',
      addProduct: 'Add product',
      pickProduct: 'Pick a product',
      addLine: 'Add',
      unitPrice: 'Unit price',
      installations: 'Installation',
      addInstallation: 'Add installation',
      installationName: 'Site / installation title',
      installationNamePlaceholder: 'e.g. Rooftop PV — Casablanca warehouse',
      maintenances: 'Maintenance',
      addMaintenance: 'Add maintenance',
      energyType: 'Energy type',
      scheduled: 'Date',
      serviceType: 'Type',
      price: 'Price',
      serviceDetailsPlaceholder: 'Short notes about this service…',
      remove: 'Remove',
      selectedProducts: 'Selected products',
      enterPrice: 'Enter a unit price before adding.',
      productAdded: 'Added “{name}” to the project.',
      outOfStock: 'This product is out of stock.',
      qtyExceedsStock: 'Quantity cannot exceed stock ({stock}).',
      stockAvailable: 'Stock: {count}',
      priceMismatchWarnRfq: 'Differs from quote ({existing}).',
      priceMismatchWarnList: 'Differs from list price ({existing}).',
      lockLine: 'Lock price and quantity',
      unlockLine: 'Unlock to edit',
      unlockToEdit: 'Unlock this product before editing or removing it.',
      productsPill: '{count} products',
      installationsPill: '{count} installations',
      maintenancesPill: '{count} maintenances',
      create: 'Create',
    },
    clients: {
      title: 'Clients',
      subtitle: 'Registered partners and their activity'
    },
    operations: {
      title: 'Jobs',
      subtitle: 'Operators, a date, and the jobs for that day.',
      assignHint: 'Assign job = create a field mission for one operator (installation, maintenance, delivery, or study). Pick the operator and schedule, then save — they see it in their Tasks hub.',
      assignTaskBtn: 'Assign job',
      addOperatorBtn: 'Add operator',
      operatorsTitle: 'Operators',
      operatorsSubtitle: 'Add, edit, or remove field operators.',
      operatorsEmpty: 'No operators yet.',
      deleteOperatorConfirm: 'Remove this operator?',
      menu: {
        jobs: 'Jobs',
        operators: 'Operators'
      },
      operatorForm: {
        title: 'New operator',
        editTitle: 'Edit operator',
        saveChanges: 'Save changes',
        name: 'Name',
        role: 'Role',
        phone: 'Phone',
        email: 'Email',
        city: 'City',
        password: 'Temporary password',
        passwordHint: 'Leave empty to auto-generate',
        save: 'Add operator'
      },
      list: {
        search: 'Search jobs or clients',
        allTypes: 'All types',
        allStatuses: 'All statuses',
        allPeople: 'Everyone',
        job: 'Job',
        person: 'Operator',
        when: 'When',
        status: 'Status',
        empty: 'No jobs yet.',
        assigned: 'Assigned',
        inProgress: 'In progress',
        onHold: 'On hold',
        completed: 'Completed',
        activeJobs: '{n} active jobs'
      },
      subtabs: {
        calendar: 'Schedule & Calendar',
        operators: 'Field Operators Roster',
        tasksQueue: 'All Dispatched Tasks'
      },
      kpis: {
        totalOps: 'Operators',
        onDutyOps: 'On duty',
        totalTasks: 'Jobs',
        inProgress: 'In progress',
        assigned: 'Pending / Assigned',
        completed: 'Completed Tasks'
      },
      types: {
        installation: 'Installation',
        maintenance: 'Maintenance',
        delivery: 'Delivery',
        study: 'Study'
      },
      roster: {
        title: 'Operator Fleet Roster',
        activeTasks: 'Active Tasks',
        assignQuick: 'Assign Task',
        duty: 'Duty Status',
        rating: 'Rating',
        specialties: 'Specialties'
      },
      modal: {
        createTitle: 'New job',
        editTitle: 'Edit job',
        jobSection: 'Job',
        whenSection: 'When',
        clientSection: 'Client',
        taskType: 'Type',
        selectOperator: 'Operator',
        taskTitle: 'Title',
        priority: 'Priority',
        priorityLow: 'Low',
        priorityMedium: 'Medium',
        priorityHigh: 'High',
        priorityUrgent: 'Urgent',
        scheduledDate: 'Date',
        timeSlot: 'Time',
        clientName: 'Name',
        clientPhone: 'Phone',
        clientEmail: 'Email',
        clientAddress: 'Address',
        clientCity: 'City',
        adminNotes: 'Notes',
        submitCreate: 'Save job',
        submitUpdate: 'Save changes'
      },
      calendarView: {
        selectDay: 'Selected Day Agenda',
        noTasks: 'No field tasks scheduled for this date.'
      }
    },
    kpi: {
      clients: 'Clients',
      products: 'Catalog Products',
      rfqs: 'RFQ Orders',
      projects: 'Active Projects',
      pendingRfqs: 'Pending RFQs',
      lowStock: 'Low Stock Items'
    },
    filters: {
      allStatuses: 'All statuses',
      review: 'Under review',
      engineering: 'Engineering',
      issued: 'Quote issued',
      dispatched: 'Dispatched'
    },
    overviewExtra: {
      lowInterest: 'Low-interest products',
      recentRfqs: 'Recent Quote Requests',
      noPageData: 'No page data yet.',
      noCatalogData: 'No catalog data yet.',
      unknownProduct: 'Unknown product',
      units: 'units',
      noRfqDemand: 'No RFQ demand recorded yet.',
      noRfqsYet: 'No RFQs submitted yet.'
    },
    marketplace: {
      title: 'Products',
      subtitle: 'Manage your store catalog, stock levels, and product images.',
      newProduct: 'New product',
      statProducts: 'Products',
      inStock: 'In stock',
      lowStock: 'Low stock',
      unitsSold: 'Units sold',
      searchPlaceholder: 'Search by name or SKU...',
      allCategories: 'All categories',
      allStock: 'All stock levels',
      stockIn: 'In stock',
      stockLow: 'Low stock (< 5)',
      stockOut: 'Out of stock',
      loading: 'Loading catalog...',
      noMatch: 'No products match your filters',
      empty: 'Your catalog is empty',
      tryFilters: 'Try changing search or filters.',
      createFirst: 'Create your first product to show it in the store.',
      addFirst: 'Add first product',
      colProduct: 'Product',
      colCategory: 'Category',
      colStock: 'Stock',
      colDemand: 'Demand',
      colSold: 'Sold',
      colActions: 'Actions',
      editProduct: 'Edit product',
      addToCatalog: 'Add to catalog',
      dropImage: 'Drop an image here',
      chooseFile: 'or choose a file',
      removeImage: 'Remove',
      productName: 'Product name',
      sku: 'SKU / Reference',
      selectCategory: 'Select category',
      stock: 'Stock',
      rating: 'Rating',
      capacity: 'Capacity',
      weight: 'Weight (kg)',
      surface: 'Surface (m²)',
      climateInfo: 'Climate info',
      climatePlaceholder: 'e.g. Suitable for hot and dry climates',
      highlights: 'Highlights',
      highlightsPlaceholder: 'Efficiency: 21.5%\nWarranty: 25 years\nCell type: Monocrystalline',
      specs: 'Specifications',
      specsPlaceholder: 'Power: 450W\nVoltage: 41.5V\nDimensions: 2100 x 1040 mm',
      documents: 'Documents',
      documentsPlaceholder: 'Datasheet.pdf | 1.2 MB\nInstallation guide.pdf | 800 KB',
      kvHint: 'One per line: Label: Value',
      documentsHint: 'One per line: File name | Size',
      describePlaceholder: 'Describe the product for store visitors...',
      saveChanges: 'Save changes',
      createProduct: 'Create product',
      backToCatalog: 'Back to catalog',
      sectionBasic: 'Basic information',
      sectionTechnical: 'Technical data',
      sectionDetails: 'Store details',
      images: 'Product images',
      filesCount: 'file(s)',
      dropImages: 'Drop images here',
      chooseFiles: 'or choose multiple files',
      addDocument: 'Add document',
      documentsEmpty: 'No documents yet. Add datasheets, manuals, or certificates.',
      documentName: 'Document name',
      documentNamePlaceholder: 'e.g. Datasheet',
      documentFile: 'Upload file',
      documentIncomplete: 'Each document needs a name and a file.',
      createNewCategory: '+ Create new category',
      useExistingCategory: 'Use existing category',
      newCategoryName: 'Category name',
      newCategoryPlaceholder: 'e.g. Charging cables',
      newCategoryDescription: 'Description (optional)',
      newCategoryDescPlaceholder: 'Short description for this category',
      saveCategory: 'Save category',
      newCategoryRequired: 'Category name is required.',
      newCategoryFailed: 'Could not create category.',
      colVisibility: 'Store',
      visibleInStore: 'Visible in store',
      visibleInStoreHint: 'Uncheck to hide this product from the public store.',
      allVisibility: 'All visibility',
      onlyVisible: 'Visible only',
      onlyHidden: 'Hidden only',
      visible: 'Visible',
      hidden: 'Hidden',
    },
    drawer: {
      followup: 'Follow-up',
      quoteLabel: 'Quote',
      confirmedOrder: 'Confirmed order',
      confirmedOrderHint: 'From the client’s accepted quote — read only.',
      installationSite: 'Installation site',
      siteHint: 'City or address collected at first contact.',
      location: 'Location',
      locationPlaceholder: 'e.g. Casablanca — industrial zone',
      messagesTitle: 'Messages',
      replyPlaceholder: 'Reply to the client…',
      sendReply: 'Send',
      emptyThread: 'No messages yet.',
      clientLabel: 'Client',
      teamLabel: 'Team',
      message: 'Message',
      messagePlaceholder: 'e.g. We received your site details and are reviewing your energy data.',
      clientPreview: 'Client preview',
      noClientMessage: 'No client message yet — add one when you have a status update.',
      workflowPhase: 'Workflow phase',
      stepCounter: 'Step {current} / {total}',
      workflowHint: 'Set the current workflow step visible to the client.',
      putOnHold: 'Put follow-up on hold',
      internalNotes: 'Internal notes',
      internalHint: 'Team-only context — never visible to the client.',
      teamBadge: 'Team',
      notes: 'Notes',
      notesPlaceholder: 'Site visit date, quote draft status, blockers, next actions...',
      activityLog: 'Activity log',
      traceIntro: 'Who changed what — for shared follow-up responsibility.',
      loadingActivity: 'Loading activity...',
      noTraces: 'No changes recorded yet. Updates appear here after you save.',
      noteSuggestions: {
        visit: 'Site visit scheduled',
        quote: 'Quote in progress',
        waiting: 'Waiting for client',
        study: 'Technical study started',
        install: 'Installation planned'
      }
    },
    clientsTable: {
      name: 'Name',
      company: 'Company',
      email: 'Email',
      phone: 'Phone',
      rfqs: 'RFQs',
      projects: 'Projects',
      joined: 'Joined'
    }
  },
  rfq: {
    status: {
      review: 'Under review',
      engineering: 'Engineering',
      issued: 'Quote issued',
      dispatched: 'Dispatched'
    },
    steps: {
      review: 'Review',
      engineering: 'Engineering',
      issued: 'Quote issued',
      dispatched: 'Dispatched'
    },
    itemTypes: {
      product: 'Product',
      installation: 'Installation',
      service: 'Service',
      transport: 'Transport / delivery',
      other: 'Other'
    },
    pdfError: 'Could not generate PDF. Please try again.',
    notPriced: 'This quote has not been priced yet.',
    table: {
      line: 'Line',
      item: 'Item',
      qty: 'Qty',
      unit: 'Unit',
      total: 'Total',
      totalLabel: 'Total:'
    },
    editor: {
      title: 'Quote lines',
      subtitle: 'Add unit prices for products and manual lines (installation, services…).',
      draftTotal: 'Draft total',
      type: 'Type',
      unitPrice: 'Unit price',
      lineTotal: 'Line total',
      placeholder: 'e.g. Installation on site',
      removeLine: 'Remove line',
      totalMad: 'Total (MAD)',
      addLine: '+ Add line',
      sending: 'Sending...',
      sendQuote: 'Send quote to client'
    },
    document: {
      tagline: 'Solar & renewable solutions — Morocco',
      title: 'Quote / Devis',
      client: 'Client',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      grandTotal: 'Grand total',
      status: 'Status:',
      clientConfirmed: 'Client confirmation:',
      confirmed: 'Confirmed',
      legal1: 'Material sale subject to price confirmation and payment terms agreed with Energy Agency.',
      legal2: 'Energy Agency — Official quote document.'
    }
  },
  followup: {
    steps: {
      quote_confirmed: {
        label: 'Quote confirmed',
        short: 'Quote',
        clientHint: 'Your quote is confirmed. Our team is preparing the next steps.',
        adminHint: 'Quote accepted — confirm scope, products and client details.'
      },
      order_prep: {
        label: 'Order & preparation',
        short: 'Prep',
        clientHint: 'Your order is being prepared (products and scheduling).',
        adminHint: 'Prepare catalog products, logistics and site planning.'
      },
      installation: {
        label: 'Installation',
        short: 'Install',
        clientHint: 'Installation work is in progress or scheduled on site.',
        adminHint: 'Carry out or follow installation and field work.'
      },
      completed: {
        label: 'Handover complete',
        short: 'Done',
        clientHint: 'Delivery is complete. Our team remains available if you need support.',
        adminHint: 'Mark reception / handover as finished.'
      }
    },
    status: {
      on_hold: 'On hold',
      quote_confirmed: 'Quote confirmed',
      order_prep: 'Order & preparation',
      installation: 'Installation',
      completed: 'Handover complete'
    },
    currentStep: 'Current step',
    onHoldTitle: 'On hold',
    onHoldClient: 'Our team has paused this follow-up. You will be notified when work continues.',
    onHoldAdmin: 'This follow-up is temporarily on hold.',
    latestUpdate: 'Latest update',
    clientMessage: 'Client message',
    askPlaceholder: 'Ask a question…',
    send: 'Send',
    viewDetails: 'View follow-up details',
    workflow: 'Workflow',
    whatDoing: 'What we are doing now',
    backToFollowup: '← Back to follow-up',
    stepOf: 'Step {current} of {total}',
    complete: 'Complete',
    percentComplete: '{n}% complete',
    notFound: 'Follow-up not found.',
    returnDashboard: 'Return to dashboard',
    workflowIntro: 'Three structured steps before site visit and technical study.',
    loading: 'Loading follow-up...',
    timeline: {
      current: 'Current',
      done: 'Done',
      onHold: 'On hold'
    }
  },
  store: {
    title: 'Equipment catalog',
    subtitle: 'Browse solar products and build your quote request.',
    heroTitle: 'Solar & renewable products',
    heroSubtitle: 'Browse our catalog, build your quote, and track your request from your dashboard.',
    search: 'Search products...',
    sortPopular: 'Most popular',
    sortRating: 'Highest rated',
    sortCapacity: 'Highest capacity',
    sortWeight: 'Lightest first',
    myQuote: 'My quote',
    loadingProducts: 'Loading products...',
    noProducts: 'No products found',
    tryAnother: 'Try another search or category.',
    resetFilters: 'Reset filters',
    outOfStock: 'Out of stock',
    inStock: '{n} in stock',
    quickView: 'Quick view',
    addToQuote: 'Add to quote',
    yourQuote: 'Your quote',
    reviewItems: 'Review items and submit your request.',
    emptyQuote: 'Your quote is empty. Add products from the catalog.',
    remove: 'Remove',
    signedInAs: 'Signed in as {company}',
    signInHint: 'Sign in or create an account to submit.',
    submitQuote: 'Submit quote',
    signInSubmit: 'Sign in & submit',
    viewDetails: 'View details',
    quoteSubmitted: 'Quote submitted',
    reference: 'Reference:',
    goDashboard: 'Go to dashboard',
    signInToSubmit: 'Sign in to submit your quote request.',
    continue: 'Continue',
    all: 'All',
    addToCart: 'Add to cart',
    requestQuote: 'Request quote',
    cart: 'Cart',
    emptyCart: 'Your cart is empty.',
    submitRfq: 'Submit quote request',
    submitting: 'Submitting...'
  },
  operator: {
    console: 'Operator Field Console',
    resetDemo: 'Reset Demo',
    duty: {
      onDuty: 'On Duty (Active)',
      onBreak: 'On Break',
      offDuty: 'Off Duty',
      offDutyNotice: 'You are currently marked as Off Duty. Set status to "On Duty" when ready to receive new dispatch updates.'
    },
    kpi: {
      todayTasks: "Today's Agenda",
      inProgress: 'In Progress (Active)',
      urgent: 'Urgent / High Priority',
      completed: 'Completed Tasks',
      scheduled: 'scheduled today',
      fieldActive: 'On-site execution',
      requiresAttention: 'Immediate action',
      total: 'total assigned'
    },
    tabs: {
      tasks: 'Tasks Hub',
      services: 'Service realization',
      agenda: "Today's Agenda",
      archive: 'Completed Archive',
      tasksTitle: 'Assigned Field Tasks',
      tasksSub: 'Installation, maintenance, delivery, and energy feasibility studies dispatched by Admin.'
    },
    services: {
      title: 'Assigned service requests',
      subtitle: 'Advance realization steps (1–5) for jobs assigned to you by admin.',
      empty: 'No service requests assigned to you yet.',
      currentStep: 'Current step',
      setProgress: 'Set realization progress:',
      clientNotes: 'Client notes',
      noNotes: 'None provided'
    },
    types: {
      all: 'All Tasks',
      installation: 'Installation (New Equipments)',
      maintenance: 'Maintenance (Old Installations)',
      delivery: 'Delivery (New Orders)',
      study: 'Make a Study (Electricity Audit)',
      installationShort: 'Installation',
      maintenanceShort: 'Maintenance',
      deliveryShort: 'Delivery',
      studyShort: 'Energy Study'
    },
    statuses: {
      all: 'All Statuses',
      assigned: 'Assigned',
      inProgress: 'In Progress',
      onHold: 'On Hold',
      completed: 'Completed'
    },
    priority: {
      urgent: 'Urgent',
      high: 'High',
      medium: 'Normal',
      low: 'Low'
    },
    filters: {
      searchPlaceholder: 'Search tasks by client, ID, city, equipment...'
    },
    views: {
      grid: 'Cards View',
      list: 'Compact List'
    },
    actions: {
      start: 'Start',
      finish: 'Review & Finish',
      view: 'Details'
    },
    drawer: {
      statusLabel: 'Current Status:',
      reportIssue: 'Report Incident',
      clientSite: 'Client & Site Details',
      clientName: 'Client / Contact',
      phone: 'Phone',
      location: 'Installation / Delivery Address',
      schedule: 'Scheduled Time Slot',
      adminInstructions: 'Admin Instructions & Scope',
      operatorNotes: 'Field Notes & Observations',
      notesPlaceholder: 'Enter on-site notes, measurements, equipment condition, or next action recommendations...',
      activityLog: 'Task Timeline & Activity Log',
      markCompleted: 'Mark Task as Completed'
    },
    incident: {
      title: 'Report Field Incident / Block',
      typeLabel: 'Incident / Block Category',
      absent: 'Customer Absent / Unreachable',
      damaged: 'Defective / Damaged Hardware',
      access: 'Site Access Denied / Key Missing',
      hazard: 'Structural Hazard / Unsafe Roof',
      weather: 'Adverse Weather (High Wind / Rain)',
      specs: 'Site Mismatch / Need Admin Approval',
      other: 'Other Blocker',
      detailsLabel: 'Incident Description & On-Site Actions Taken',
      placeholder: 'Detail what occurred, who was contacted, and what resolution is required from Admin...',
      holdToggle: 'Put Task On Hold (Requires Admin or Dispatch intervention)',
      submit: 'Submit Incident Report'
    },
    agenda: {
      title: "Today's Field Route & Schedule",
      sub: 'Step-by-step route planning for today’s active assignments.'
    },
    archive: {
      title: 'Completed Field Work Archive',
      sub: 'Historical archive of signed deliveries, installed solar setups, and audits.',
      emptyTitle: 'No completed tasks yet',
      emptySub: 'Tasks marked as completed will be recorded here.'
    },
    empty: {
      title: 'No tasks match your filter',
      sub: 'Try selecting a different task type or status, or clear the search keyword.',
      clearFilters: 'Clear All Filters'
    }
  },
  services: {
    heroTitle: 'Professional Solar & Renewable Services',
    heroSubtitle: 'From turnkey installation and maintenance to free electricity audits and express equipment delivery.',
    ourServices: 'Our Service Offerings',
    activeCount: 'active services',
    emptyTitle: 'No services available',
    emptyDesc: 'Check back soon — our catalog is being updated.',
    requestService: 'Request Service',
    viewDetails: 'View Details & Sizing',
    disabledNotice: 'This service is currently undergoing capacity upgrades and is temporarily paused.',
    requestModalTitle: 'Submit Service Request',
    requestModalSubtitle: 'Fill in your site details and our engineering team will review and assign an operator within 2 hours.',
    requestSubmitted: 'Service request submitted',
    requestFailed: 'Could not submit request. Please try again.',
    notFound: 'Service not found',
    clientsOnly: 'Only client accounts can request services.',
    form: {
      fullName: 'Full Name / Business',
      email: 'Email Address',
      phone: 'Phone Number',
      city: 'City / Region',
      address: 'Installation / Site Address',
      preferredDate: 'Preferred Service Date',
      notes: 'Service Scope & Site Context Notes',
      submitBtn: 'Submit Service Request'
    },
    realization: {
      title: 'Realization Progress Tracker',
      currentPhase: 'Current Realization Phase',
      phaseStep: 'Step {step} of 5',
      historyTitle: 'Realization Activity Log'
    }
  },
  landing: {
    hero: {
      titleLine1: 'Power your future',
      titleLine2Before: 'with',
      titleAccent: 'solar energy',
      subtitle: 'Save money and reduce your carbon footprint with smart, premium renewable solutions.',
      ctaConsultation: 'Get Free Consultation',
      ctaStore: 'Explore Store',
      alreadyAccount: 'Already have an account?',
      scrollDown: 'Scroll down',
      features: {
        noHiddenFees: 'No hidden fees',
        certifiedInstall: 'Certified installation',
        reliable: '100% reliable',
        warranty: '25-year warranty'
      }
    },
    cta: {
      titleLine1: 'Ready to switch',
      titleAccent: 'solar',
      titleLine2Before: 'to',
      titleLine2After: '?',
      description: 'Join hundreds of customers already reducing their electricity bills with clean, premium renewable energy from Energy Agency.',
      ctaConsultation: 'Get Free Consultation',
      ctaStore: 'Explore Store',
      note: 'No commitment required · Free site survey · Financing available',
      statsAria: 'Key statistics',
      statNums: {
        installations: '+500',
        satisfaction: '98%',
        hiddenFees: '$0',
        warranty: '25yr'
      },
      stats: {
        installations: 'Installations',
        satisfaction: 'Satisfaction',
        hiddenFees: 'Hidden Fees',
        warranty: 'Warranty'
      }
    },
    footer: {
      brandName: 'ENERGY AGENCY',
      brandDesc: 'Premium renewable energy solutions built for homes and businesses. Transitioning the world to clean power.',
      company: 'Company',
      services: 'Services',
      aboutUs: 'About Us',
      marketplace: 'Marketplace',
      allServices: 'All Services',
      careers: 'Careers',
      solarInstallation: 'Solar Installation',
      batteryStorage: 'Battery Storage',
      systemMonitoring: 'System Monitoring',
      maintenance: 'Maintenance',
      stayUpdated: 'Stay Updated',
      newsletterDesc: 'Subscribe to our newsletter for the latest solar news and exclusive offers.',
      emailPlaceholder: 'Enter your email',
      email: "contact{'@'}energy.inc",
      phone: '+212 690 000 000',
      social: {
        twitter: 'Twitter',
        linkedin: 'LinkedIn',
        instagram: 'Instagram'
      },
      copyright: '© 2026 Energy Agency. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      newsletterSuccess: 'Thanks! You are subscribed.',
      newsletterError: 'Could not subscribe. Please try again.',
      newsletterInvalid: 'Enter a valid email address.'
    },
    whySolar: {
      eyebrow: 'Why solar?',
      title: 'Why Choose Solar Energy?',
      desc: 'Experience the multiple benefits of upgrading to renewable energy solutions designed for your future.',
      items: {
        bills: { title: 'Lower Energy Bills', desc: 'Dramatically reduce or even eliminate your monthly electricity costs by generating your own power from the sun.' },
        independence: { title: 'Energy Independence', desc: 'Protect yourself against rising utility rates and grid outages with smart battery storage solutions.' },
        eco: { title: 'Eco-Friendly', desc: 'Significantly reduce your carbon footprint and contribute to a cleaner, sustainable planet for future generations.' }
      }
    },
    about: {
      eyebrow: 'About Us',
      titleLine1: 'Sustainable Energy',
      titleLine2: 'for a Better Tomorrow',
      p1Before: 'We are',
      brand: 'Energy Agency',
      p1After: ', specialists in the development of renewable energy projects, focusing on premium solar systems for homes and commercial facilities across the region.',
      p2: 'With over a decade of expertise and 500+ successful installations, we deliver end-to-end solar solutions — from consultation and custom design through to installation and ongoing maintenance.',
      cta: 'Learn more about us',
      badgeLabel: 'Projects Done',
      playVideo: 'Play video',
      closeVideo: 'Close video',
      stats: {
        years: 'Years Experience',
        projects: 'Realised Projects',
        satisfaction: 'Client Satisfaction',
        warranty: 'Panel Warranty'
      }
    },
    howItWorks: {
      eyebrow: 'Our Process',
      title: 'How It Works',
      desc: 'Transitioning to solar is seamless. Here is our proven 4-step process.',
      steps: {
        consultation: { title: 'Consultation', desc: 'We analyze your energy usage and determine the optimal system size and configuration for your needs.' },
        design: { title: 'Custom Design', desc: 'Our engineers craft a personalized solar layout tailored specifically for your property and energy goals.' },
        installation: { title: 'Installation', desc: 'Our certified team installs your premium equipment safely and efficiently — typically in just 1-2 days.' },
        activation: { title: 'Activation', desc: 'We handle all inspections and grid connections. Flip the switch and start saving from day one.' }
      }
    },
    partners: {
      title: 'Trusted Equipment Partners',
      sub: 'We work only with tier-1 manufacturers to guarantee quality and longevity.',
      logosAria: 'Partner logos',
      cta: 'Learn More About Our Partners'
    },
    servicesBlock: {
      titleLine1: 'Everything you need',
      titleLine2: 'for clean energy',
      subtitle: "From sourcing premium equipment to installation and lifetime maintenance — we've got you covered.",
      mostPopular: 'Most Popular',
      learnMore: 'Learn more',
      items: {
        sales: {
          title: 'Equipment Sales',
          desc: 'Premium tier-1 solar panels, inverters, and battery storage systems from our trusted manufacturing partners.',
          bullets: ['Tier-1 solar panels', 'Smart inverters', 'Battery storage', 'Competitive pricing']
        },
        installation: {
          title: 'Installation',
          desc: 'Professional, permitted, and inspected installations by our certified in-house engineering team. Typically completed in 1-2 days.',
          bullets: ['Certified engineers', '1-2 day install', 'Permit handling', 'Grid connection']
        },
        maintenance: {
          title: 'Maintenance',
          desc: 'Ongoing monitoring, cleaning, and preventative maintenance to keep your system operating at peak performance year after year.',
          bullets: ['24/7 monitoring', 'Annual cleaning', 'Performance reports', '25yr warranty support']
        }
      }
    },
    projects: {
      eyebrow: 'Our Portfolio',
      title: 'Recent Installations',
      desc: "See how we're transforming energy consumption across various sectors.",
      viewDetails: 'View Details',
      systemSize: 'System Size',
      annualSavings: 'Annual Savings',
      categories: { residential: 'Residential', commercial: 'Commercial', industrial: 'Industrial' },
      items: {
        ecoHome: { title: 'Modern Eco-Home', location: 'Casablanca' },
        campus: { title: 'Tech Campus HQ', location: 'Rabat' },
        logistics: { title: 'Logistics Facility', location: 'Marrakech' }
      }
    },
    testimonials: {
      eyebrow: 'Reviews',
      title: 'What Our Customers Say',
      desc: 'Join hundreds of happy families who made the switch to clean, affordable energy.',
      ratingBanner: 'average rating from',
      verified: 'verified customers',
      items: {
        fatima: {
          quote: 'The entire process was so smooth. Our energy bill went from 2,000 MAD/month to almost zero. The installation team was professional and fast — done in a single day!',
          role: 'Homeowner, Casablanca'
        },
        youssef: {
          quote: 'Energy Agency exceeded our expectations. The custom design fits perfectly on our roof, and the monitoring app makes tracking our production incredibly easy.',
          role: 'Business Owner, Tangier'
        },
        amira: {
          quote: 'From the first consultation to activation, everything was handled with incredible professionalism. I highly recommend Energy Agency to anyone considering solar.',
          role: 'Property Owner, Marrakech'
        }
      }
    },
    faq: {
      eyebrow: 'Common Questions',
      title: 'Frequently Asked Questions',
      desc: 'Everything you need to know about switching to solar.',
      items: [
        {
          q: 'How much does a solar panel system cost?',
          a: 'The cost varies based on your energy needs and roof size. However, with available tax credits and local incentives, most homeowners see a return on investment within 5-7 years, with immediate reduction in monthly utility bills.'
        },
        {
          q: 'How long does the installation take?',
          a: 'While the initial consultation, design, and permitting process can take a few weeks, the actual physical installation of the panels usually only takes 1-2 days with minimal disruption to your home.'
        },
        {
          q: 'What happens when it rains or snows?',
          a: 'Solar panels still generate electricity on cloudy or rainy days, though at a reduced rate. Rain actually helps keep your panels clean. Snow will melt quickly due to the dark color and angle of the panels, and battery systems can provide backup power during severe weather.'
        },
        {
          q: 'How long do solar panels last?',
          a: 'Our premium tier-1 solar panels are built to last. They come with a 25-year manufacturer warranty, but typically continue generating power for 30-40 years with only a slight decrease in efficiency over time.'
        },
        {
          q: 'Will solar panels damage my roof?',
          a: 'No. Our certified installers use specialized flashing and mounting hardware that protects your roof. In fact, panels can actually protect the portion of the roof they cover from weather damage and UV light.'
        }
      ]
    }
  }
}

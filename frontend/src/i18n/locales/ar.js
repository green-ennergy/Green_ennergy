export default {
  common: {
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    refresh: 'تحديث',
    loading: 'جاري التحميل...',
    signOut: 'تسجيل الخروج',
    back: 'رجوع',
    downloadPdf: 'تحميل PDF',
    generatingPdf: 'جاري إنشاء PDF...',
    takeAction: 'اتخاذ إجراء ←',
    description: 'الوصف',
    quantity: 'الكمية',
    unit: 'الوحدة',
    total: 'المجموع',
    all: 'الكل',
    yes: 'نعم',
    no: 'لا',
    you: 'أنت'
  },
  lang: {
    label: 'اللغة',
    fr: 'Français',
    ar: 'العربية',
    en: 'English'
  },
  nav: {
    store: 'المتجر',
    services: 'الخدمات',
    admin: 'مساحة الإدارة',
    dashboard: 'مساحة العميل',
    faq: 'الأسئلة الشائعة',
    about: 'من نحن',
    signIn: 'تسجيل الدخول',
    portal: 'البوابة',
    consultation: 'استشارة مجانية',
    toggleMenu: 'القائمة',
    homeAria: 'الصفحة الرئيسية Energy Agency'
  },
  auth: {
    backToSite: '← العودة إلى الموقع',
    agencyTag: 'Energy Agency',
    signInTitle: 'تسجيل الدخول',
    registerTitle: 'إنشاء حساب',
    signInSubtitle: 'الوصول إلى لوحة تحكم العميل.',
    registerSubtitle: 'أنشئ حساباً لطلب عروض الأسعار والخدمات.',
    visualTitle: 'بوابة العميل',
    visualDesc: 'اطلب عروض الأسعار، تابع طلباتك ومشاريعك الشمسية مع Energy Agency .',
    fullName: 'الاسم الكامل',
    company: 'الشركة',
    companyPlaceholder: 'اسم شركتك',
    phone: 'الهاتف المحمول',
    phonePlaceholder: '+212 612 345 678',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    show: 'إظهار',
    hide: 'إخفاء',
    passwordHint: '8 أحرف على الأقل مع حرف كبير وصغير ورقم.',
    pleaseWait: 'يرجى الانتظار...',
    createAccount: 'إنشاء حساب',
    noAccount: 'ليس لديك حساب؟',
    hasAccount: 'مسجل بالفعل؟'
  },
  portal: {
    clientPortal: 'بوابة العميل',
    hello: 'مرحباً، {name}',
    browseCatalog: 'تصفح المتجر',
    addPhone: 'أضف رقم هاتفك',
    saving: 'جاري الحفظ...',
    savePhone: 'حفظ الرقم'
  },
  dashboard: {
    tabs: {
      rfq: 'طلبات عروض الأسعار',
      followup: 'المتابعة',
      messages: 'الرسائل'
    },
    rfq: {
      title: 'طلبات عروض الأسعار',
      subtitle: 'طلبات المتجر وعروض الأسعار الرسمية من .',
      newQuote: 'عرض جديد من المتجر ←',
      loading: 'جاري تحميل طلباتك...',
      emptyTitle: 'لا توجد طلبات بعد',
      emptyDesc: 'أضف منتجات من الكatalog وقدّم طلب عرض سعر للبدء.',
      goStore: 'الذهاب إلى المتجر',
      quoteTotal: 'مجموع العرض',
      confirmFollowup: 'تأكيد وفتح المتابعة',
      followupOpened: 'تم فتح المتابعة ✓'
    },
    followup: {
      title: 'متابعة الطلب',
      subtitle: 'تابع عرض السعر المؤكد عبر سير عمل  — يُحدّث في كل مرحلة.',
      emptyTitle: 'لا توجد متابعة بعد',
      emptyDesc: 'أكّد عرض سعر من تبويب العروض — تُفتح المتابعة تلقائياً.',
      viewQuotes: 'عرض طلباتي'
    },
    messages: {
      title: 'الرسائل',
      subtitle: 'تواصل مع فريق  حول مشاريعك أو عروض الأسعار.',
      empty: 'لا رسائل بعد. أرسل ملاحظة إلى  أدناه.',
      placeholder: 'اكتب إلى Energy Agency ...',
      sending: 'جاري الإرسال...',
      send: 'إرسال الرسالة'
    }
  },
  admin: {
    console: 'لوحة عمليات ',
    tabs: {
      overview: 'نظرة عامة',
      orders: 'الطلبات و RFQ',
      marketplace: 'المنتجات',
      projects: 'المشاريع',
      clients: 'العملاء',
      operations: 'إدارة العمليات'
    },
    overview: {
      title: 'نظرة عامة على العمليات',
      subtitle: 'ما يحتاج انتباهك اليوم',
      visits: 'زيارات الموقع (7 أيام)',
      visitsStat: '{week} زيارة · {today} اليوم',
      topPages: 'أكثر الصفحات زيارة',
      topProducts: 'المنتجات الأكثر طلباً'
    },
    orders: {
      title: 'الطلبات و RFQ',
      subtitle: 'تسعير الكatalog وإضافة بنود يدوية. تحميل عروض PDF للعملاء.',
      empty: 'لا توجد طلبات RFQ تطابق الفلاتر.',
      editQuote: 'تعديل العرض',
      prepareQuote: 'إعداد العرض',
      quoteBuilder: 'محرر العروض',
      clientConfirmed: 'أكّد العميل — فُتحت المتابعة'
    },
    projects: {
      title: 'متابعة المشاريع',
      subtitle: 'متابعة الطلبات المؤكدة — تُفتح تلقائياً بعد تأكيد العرض.',
      emptyTitle: 'لا متابعات بعد',
      emptyDesc: 'تظهر المشاريع بعد تأكيد العميل للعرض.',
      goOrders: 'الذهاب إلى الطلبات ←',
      updateFollowup: 'تحديث المتابعة',
      active: 'متابعات نشطة',
      onHold: 'متوقفة',
      completed: 'مكتملة',
      allPhases: 'جميع المراحل',
      saveFollowup: 'حفظ المتابعة',
      saving: 'جاري الحفظ...',
      saved: 'تم الحفظ. سُجّل النشاط.'
    },
    clients: {
      title: 'العملاء',
      subtitle: 'الشركاء المسجلون ونشاطهم'
    },
    operations: {
      title: 'العمليات والتوزيع الميداني',
      subtitle: 'إدارة جدول التقنيين، تعيين المهام الميدانية (تركيب، صيانة، توصيل، دراسة)، ومتابعة قائمة الانتظار.',
      assignTaskBtn: '+ تعيين مهمة جديدة',
      subtabs: {
        calendar: 'الجدول والتقويم',
        operators: 'قائمة التقنيين الميدانيين',
        tasksQueue: 'جميع المهام الموزعة'
      },
      kpis: {
        totalOps: 'التقنيون الميدانيون',
        onDutyOps: 'التقنيون في الخدمة',
        totalTasks: 'إجمالي المهام الموزعة',
        inProgress: 'قيد التنفيذ',
        assigned: 'معينة / قيد الانتظار',
        completed: 'المهام المكتملة'
      },
      types: {
        installation: 'التركيب (معدات جديدة)',
        maintenance: 'الصيانة (تشخيص وإصلاح)',
        delivery: 'التوصيل (طلب جديد)',
        study: 'إجراء دراسة (تدقيق واحتساب)'
      },
      roster: {
        title: 'أسطول التقنيين الميدانيين',
        activeTasks: 'المهام النشطة',
        assignQuick: 'تعيين مهمة',
        duty: 'حالة الخدمة',
        rating: 'التقييم',
        specialties: 'التخصصات'
      },
      modal: {
        createTitle: 'تعيين مهمة جديدة لتقني ميداني',
        editTitle: 'تفاصيل المهمة الموزعة',
        taskType: 'نوع الخدمة',
        selectOperator: 'التقني المعين',
        taskTitle: 'عنوان / نطاق المهمة',
        priority: 'مستوى الأولوية',
        scheduledDate: 'التاريخ المحدد',
        timeSlot: 'الفترة الزمنية',
        clientName: 'اسم العميل',
        clientPhone: 'هاتف العميل',
        clientEmail: 'بريد العميل',
        clientAddress: 'عنوان الموقع',
        clientCity: 'المدينة / المنطقة',
        adminNotes: 'تعليمات الإدارة وملاحظات الموقع',
        submitCreate: 'إرسال المهمة',
        submitUpdate: 'تحديث البيانات'
      },
      calendarView: {
        selectDay: 'جدول اليوم المحدد',
        noTasks: 'لا توجد مهام ميدانية مجدولة لهذا التاريخ.'
      }
    },
    kpi: {
      clients: 'العملاء',
      products: 'منتجات المتجر',
      rfqs: 'طلبات RFQ',
      projects: 'مشاريع نشطة',
      pendingRfqs: 'RFQ قيد الانتظار',
      lowStock: 'مخزون منخفض'
    },
    filters: {
      allStatuses: 'جميع الحالات',
      review: 'قيد المراجعة',
      engineering: 'الهندسة',
      issued: 'عرض صادر',
      dispatched: 'تم الشحن'
    },
    overviewExtra: {
      lowInterest: 'منتجات قليلة الطلب',
      recentRfqs: 'طلبات عروض أسعار حديثة',
      noPageData: 'لا توجد بيانات صفحات بعد.',
      noCatalogData: 'لا توجد بيانات متجر بعد.',
      unknownProduct: 'منتج غير معروف',
      units: 'وحدات',
      noRfqDemand: 'لم تُسجَّل أي طلبات RFQ.',
      noRfqsYet: 'لم تُرسَل أي طلبات عروض أسعار بعد.'
    },
    marketplace: {
      title: 'المنتجات',
      subtitle: 'إدارة المتجر والمخزون وصور المنتجات.',
      newProduct: 'منتج جديد',
      statProducts: 'المنتجات',
      inStock: 'متوفر',
      lowStock: 'مخزون منخفض',
      unitsSold: 'الوحدات المباعة',
      searchPlaceholder: 'البحث بالاسم أو SKU...',
      allCategories: 'جميع الفئات',
      allStock: 'جميع مستويات المخزون',
      stockIn: 'متوفر',
      stockLow: 'مخزون منخفض (< 5)',
      stockOut: 'نفد المخزون',
      loading: 'جاري تحميل المتجر...',
      noMatch: 'لا منتجات تطابق الفلاتر',
      empty: 'المتجر فارغ',
      tryFilters: 'جرّب تغيير البحث أو الفلاتر.',
      createFirst: 'أنشئ أول منتج لعرضه في المتجر.',
      addFirst: 'إضافة أول منتج',
      colProduct: 'المنتج',
      colCategory: 'الفئة',
      colStock: 'المخزون',
      colDemand: 'الطلب',
      colSold: 'المباع',
      colActions: 'إجراءات',
      editProduct: 'تعديل المنتج',
      addToCatalog: 'إضافة للمتجر',
      dropImage: 'أسقط صورة هنا',
      chooseFile: 'أو اختر ملفاً',
      removeImage: 'إزالة',
      productName: 'اسم المنتج',
      sku: 'المرجع / SKU',
      selectCategory: 'اختر الفئة',
      stock: 'المخزون',
      rating: 'التقييم',
      capacity: 'القدرة',
      weight: 'الوزن (كغ)',
      surface: 'المساحة (م²)',
      climateInfo: 'معلومات المناخ',
      climatePlaceholder: 'مثال: مناسب للمناخ الحار والجاف',
      highlights: 'أبرز المميزات',
      highlightsPlaceholder: 'الكفاءة: 21.5%\nالضمان: 25 سنة',
      specs: 'المواصفات',
      specsPlaceholder: 'القدرة: 450W\nالجهد: 41.5V',
      documents: 'المستندات',
      documentsPlaceholder: 'Datasheet.pdf | 1.2 MB',
      kvHint: 'سطر لكل عنصر: العنوان: القيمة',
      documentsHint: 'سطر لكل ملف: الاسم | الحجم',
      describePlaceholder: 'وصف المنتج لزوار المتجر...',
      saveChanges: 'حفظ التغييرات',
      createProduct: 'إنشاء المنتج',
      backToCatalog: 'العودة إلى الكتالوج',
      sectionBasic: 'معلومات أساسية',
      sectionTechnical: 'بيانات تقنية',
      sectionDetails: 'تفاصيل المتجر',
      images: 'صور المنتج',
      filesCount: 'ملف/ملفات',
      dropImages: 'أسقط الصور هنا',
      chooseFiles: 'أو اختر عدة ملفات',
      addDocument: 'إضافة مستند',
      documentsEmpty: 'لا توجد مستندات بعد. أضف كتيبات أو شهادات.',
      documentName: 'اسم المستند',
      documentNamePlaceholder: 'مثال: ورقة البيانات',
      documentFile: 'رفع الملف',
      documentIncomplete: 'كل مستند يحتاج اسماً وملفاً.',
      createNewCategory: '+ إنشاء فئة جديدة',
      useExistingCategory: 'استخدام فئة موجودة',
      newCategoryName: 'اسم الفئة',
      newCategoryPlaceholder: 'مثال: كابلات الشحن',
      newCategoryDescription: 'الوصف (اختياري)',
      newCategoryDescPlaceholder: 'وصف قصير للفئة',
      saveCategory: 'حفظ الفئة',
      newCategoryRequired: 'اسم الفئة مطلوب.',
      newCategoryFailed: 'تعذر إنشاء الفئة.',
      colVisibility: 'المتجر',
      visibleInStore: 'ظاهر في المتجر',
      visibleInStoreHint: 'ألغِ التحديد لإخفاء هذا المنتج من المتجر العام.',
      allVisibility: 'كل حالات الظهور',
      onlyVisible: 'الظاهرة فقط',
      onlyHidden: 'المخفية فقط',
      visible: 'ظاهر',
      hidden: 'مخفي',
    },
    drawer: {
      Followup: 'متابعة ',
      quoteLabel: 'عرض السعر',
      confirmedOrder: 'الطلب المؤكد',
      confirmedOrderHint: 'من عرض السعر المقبول — للقراءة فقط.',
      installationSite: 'موقع التركيب',
      siteHint: 'المدينة أو العنوان المجمّع عند أول تواصل.',
      location: 'الموقع',
      locationPlaceholder: 'مثال: الدار البيضاء — المنطقة الصناعية',
      clientUpdate: 'تحديث الحالة للعميل',
      clientUpdateHint: 'رسالة قصيرة تظهر في لوحة العميل — وليس بنود الطلب.',
      clientVisible: 'مرئي للعميل',
      message: 'الرسالة',
      messagePlaceholder: 'مثال: استلمنا معلومات موقعكم ونراجع بيانات الطاقة.',
      clientPreview: 'معاينة العميل',
      noClientMessage: 'لا رسالة للعميل بعد — أضف واحدة عند التحديث.',
      workflowPhase: 'مرحلة سير العمل',
      stepCounter: 'المرحلة {current} / {total}',
      workflowHint: 'تحديد مرحلة  الحالية المرئية للعميل.',
      putOnHold: 'إيقاف المتابعة مؤقتاً',
      internalNotes: 'ملاحظات داخلية',
      internalHint: 'سياق الفريق فقط — غير مرئي للعميل.',
      teamBadge: 'فريق ',
      notes: 'ملاحظات',
      notesPlaceholder: 'موعد الزيارة، حالة العرض، العوائق، الخطوات التالية...',
      activityLog: 'سجل النشاط',
      traceIntro: 'من غيّر ماذا — لمسؤولية المتابعة المشتركة.',
      loadingActivity: 'جاري تحميل النشاط...',
      noTraces: 'لا تغييرات مسجّلة. تظهر التحديثات بعد الحفظ.',
      noteSuggestions: {
        visit: 'زيارة ميدانية مجدولة',
        quote: 'عرض سعر قيد الإعداد',
        waiting: 'في انتظار العميل',
        study: 'بدء الدراسة التقنية',
        install: 'التركيب مخطّط'
      }
    },
    clientsTable: {
      name: 'الاسم',
      company: 'الشركة',
      email: 'البريد',
      phone: 'الهاتف',
      rfqs: 'RFQ',
      projects: 'المشاريع',
      joined: 'تاريخ التسجيل'
    }
  },
  rfq: {
    status: {
      review: 'قيد المراجعة',
      engineering: 'الهندسة',
      issued: 'عرض صادر',
      dispatched: 'تم الشحن'
    },
    steps: {
      review: 'مراجعة',
      engineering: 'هندسة',
      issued: 'عرض صادر',
      dispatched: 'شحن'
    },
    itemTypes: {
      product: 'منتج',
      installation: 'تركيب',
      service: 'خدمة',
      transport: 'نقل / توصيل',
      other: 'أخرى'
    },
    pdfError: 'تعذّر إنشاء PDF. حاول مرة أخرى.',
    notPriced: 'لم يُسعَّر هذا العرض بعد.',
    table: {
      line: 'البند',
      item: 'الصنف',
      qty: 'الكمية',
      unit: 'الوحدة',
      total: 'المجموع',
      totalLabel: 'المجموع:'
    },
    editor: {
      title: 'بنود العرض',
      subtitle: 'أضف الأسعار للمنتجات والبنود اليدوية (تركيب، خدمات…).',
      draftTotal: 'المجموع المؤقت',
      type: 'النوع',
      unitPrice: 'سعر الوحدة',
      lineTotal: 'مجموع البند',
      placeholder: 'مثال: تركيب في الموقع',
      removeLine: 'حذف البند',
      totalMad: 'المجموع (درهم)',
      addLine: '+ إضافة بند',
      sending: 'جاري الإرسال...',
      sendQuote: 'إرسال العرض للعميل'
    },
    document: {
      tagline: 'حلول شمسية ومتجددة — المغرب',
      title: 'عرض سعر / Devis',
      client: 'العميل',
      grandTotal: 'المجموع الكلي',
      status: 'الحالة:',
      clientConfirmed: 'تأكيد العميل:',
      confirmed: 'مؤكد',
      legal1: 'بيع المواد خاضع لتأكيد الأسعار وشروط الدفع المتفق عليها مع .',
      legal2: 'Energy Agency  — وثيقة عرض سعر رسمية.'
    }
  },
  followup: {
    steps: {
      premier_contact: {
        label: 'التواصل الأول',
        short: 'تواصل',
        clientHint: ' يؤكد طلبك ويجمع المعلومات الأولية للمشروع.',
        adminHint: 'جمع الموقع ونوع المشروع والحاجة التقديرية للطاقة.'
      },
      data_collection: {
        label: 'جمع البيانات',
        short: 'جمع',
        clientHint: ' يجمع معلومات الموقع اللازمة لمشروعك.',
        adminHint: 'إكمال بيانات الموقع: فاتورة الكهرباء أو جرد المعدات.'
      },
      energy_data: {
        label: 'البيانات الطاقوية',
        short: 'طاقة',
        clientHint: ' يراجع احتياجاتك الطاقوية قبل المرحلة التالية.',
        adminHint: 'التحقق من البيانات قبل الزيارة الميدانية أو الدراسة.'
      },
      completed: {
        label: 'مكتمل',
        short: 'مكتمل',
        clientHint: 'اكتملت المتابعة.  متاح عند الحاجة.',
        adminHint: 'تحديد اكتمال التسليم أو التسليم للعميل.'
      }
    },
    status: {
      on_hold: 'متوقف',
      premier_contact: 'التواصل الأول',
      data_collection: 'جمع البيانات',
      energy_data: 'البيانات الطاقوية',
      completed: 'مكتمل'
    },
    currentStep: 'المرحلة الحالية',
    onHoldTitle: 'متوقف',
    onHoldClient: 'أوقف  هذه المتابعة مؤقتاً. سيتم إعلامك عند الاستئناف.',
    onHoldAdmin: 'هذه المتابعة متوقفة مؤقتاً.',
    latestFrom: 'آخر تحديث من ',
    clientMessage: 'رسالة العميل',
    viewDetails: 'عرض تفاصيل المتابعة',
    workflow: 'سير عمل ',
    whatDoing: 'ما يفعله  الآن',
    backToFollowup: '← العودة للمتابعة',
    stepOf: 'المرحلة {current} من {total}',
    complete: 'مكتمل',
    percentComplete: '{n}% مكتمل',
    notFound: 'المتابعة غير موجودة.',
    returnDashboard: 'العودة للوحة التحكم',
    workflowIntro: 'ثلاث مراحل منظمة قبل الزيارة الميدانية والدراسة التقنية.',
    loading: 'جاري تحميل المتابعة...',
    timeline: {
      current: 'الحالية',
      done: 'منجز',
      onHold: 'متوقف'
    }
  },
  store: {
    title: 'معدات المتجر',
    subtitle: 'تصفّح منتجات الطاقة الشمسية وكوّن طلب عرض السعر.',
    heroTitle: 'منتجات الطاقة الشمسية والمتجددة',
    heroSubtitle: 'تصفّح المتجر، كوّن عرضك وتابع طلبك من لوحة التحكم.',
    search: 'البحث عن منتجات...',
    sortPopular: 'الأكثر شعبية',
    sortRating: 'الأعلى تقييماً',
    sortCapacity: 'أعلى سعة',
    sortWeight: 'الأخف وزناً',
    myQuote: 'عرضي',
    loadingProducts: 'جاري تحميل المنتجات...',
    noProducts: 'لم يُعثر على منتجات',
    tryAnother: 'جرّب بحثاً أو فئة أخرى.',
    resetFilters: 'إعادة تعيين الفلاتر',
    outOfStock: 'نفد المخزون',
    inStock: '{n} متوفر',
    quickView: 'معاينة سريعة',
    addToQuote: 'إضافة للعرض',
    yourQuote: 'عرضك',
    reviewItems: 'راجع العناصر وأرسل طلبك.',
    emptyQuote: 'عرضك فارغ. أضف منتجات من المتجر.',
    remove: 'إزالة',
    signedInAs: 'مسجّل الدخول كـ {company}',
    signInHint: 'سجّل الدخول أو أنشئ حساباً للإرسال.',
    submitQuote: 'إرسال العرض',
    signInSubmit: 'تسجيل الدخول والإرسال',
    viewDetails: 'عرض التفاصيل',
    quoteSubmitted: 'تم إرسال العرض',
    reference: 'المرجع:',
    goDashboard: 'الذهاب للوحة التحكم',
    signInToSubmit: 'سجّل الدخول لإرسال طلب عرض السعر.',
    continue: 'متابعة',
    all: 'الكل',
    addToCart: 'إضافة للسلة',
    requestQuote: 'طلب عرض سعر',
    cart: 'السلة',
    emptyCart: 'سلتك فارغة.',
    submitRfq: 'إرسال الطلب',
    submitting: 'جاري الإرسال...'
  },
  operator: {
    console: 'لوحة تحكم التقني الميداني',
    resetDemo: 'إعادة ضبط البيانات التجريبية',
    duty: {
      onDuty: 'في الخدمة (نشط)',
      onBreak: 'في استراحة',
      offDuty: 'خارج الخدمة',
      offDutyNotice: 'أنت حالياً خارج الخدمة. قم بتغيير الحالة إلى "في الخدمة" لاستقبال المهام والتحديثات الجديدة.'
    },
    kpi: {
      todayTasks: 'مهام اليوم',
      inProgress: 'قيد التنفيذ ميدانياً',
      urgent: 'عاجل / أولوية قصوى',
      completed: 'المهام المنجزة',
      scheduled: 'مجدولة لليوم',
      fieldActive: 'تنفيذ ميداني مباشر',
      requiresAttention: 'تتطلب تدخلاً فورياً',
      total: 'إجمالي المهام الموكلة'
    },
    tabs: {
      tasks: 'مركز المهام',
      agenda: 'جدول اليوم الميداني',
      archive: 'سجل المنجزات',
      tasksTitle: 'المهام الميدانية الموكلة',
      tasksSub: 'مهام التركيب والصيانة والتوصيل ودراسات الاستهلاك الموكلة من الإدارة.'
    },
    types: {
      all: 'جميع المهام',
      installation: 'تركيب (معدات جديدة)',
      maintenance: 'صيانة (منشآت سابقة)',
      delivery: 'توصيل (طلبية جديدة)',
      study: 'إجراء دراسة (استهلاك الكهرباء)',
      installationShort: 'تركيب',
      maintenanceShort: 'صيانة',
      deliveryShort: 'توصيل',
      studyShort: 'دراسة استهلاك'
    },
    statuses: {
      all: 'جميع الحالات',
      assigned: 'موكلة',
      inProgress: 'قيد التنفيذ',
      onHold: 'معلقة',
      completed: 'منجزة'
    },
    priority: {
      urgent: 'عاجل',
      high: 'عالية',
      medium: 'عادية',
      low: 'منخفضة'
    },
    filters: {
      searchPlaceholder: 'البحث عن طريق العميل، المعرف، المدينة، المعدات...'
    },
    views: {
      grid: 'عرض البطاقات',
      list: 'عرض القائمة'
    },
    actions: {
      start: 'بدء المهمة',
      finish: 'إتمام ومراجعة',
      view: 'التفاصيل'
    },
    drawer: {
      statusLabel: 'الحالة الحالية:',
      reportIssue: 'إبلاغ عن عائق / عطل',
      clientSite: 'بيانات العميل وموقع العمل',
      clientName: 'العميل / جهة الاتصال',
      phone: 'الهاتف',
      location: 'عنوان التدخل أو التوصيل',
      schedule: 'الموعد الزمني المجدول',
      adminInstructions: 'تعليمات الإدارة ونطاق العمل',
      operatorNotes: 'ملاحظات التقني الميدانية',
      notesPlaceholder: 'أدخل الملاحظات الميدانية، القياسات الكهربائية، حالة المعدات...',
      activityLog: 'سجل الأنشطة والمتابعة',
      markCompleted: 'تأكيد إنجاز المهمة بنجاح'
    },
    incident: {
      title: 'إبلاغ عن عائق ميداني / توقف',
      typeLabel: 'نوع العائق الميداني',
      absent: 'العميل غير متواجد أو يتعذر الاتصال به',
      damaged: 'معدات متضررة أو بها خلل مصنعي',
      access: 'تعذر الوصول إلى الموقع أو عدم توفر المفتاح',
      hazard: 'خطر إنشائي أو عدم أمان السطح',
      weather: 'أحوال جوية غير ملائمة (رياح قوية / أمطار)',
      specs: 'عدم تطابق المواصفات / يتطلب موافقة الإدارة',
      other: 'عائق آخر',
      detailsLabel: 'وصف العائق والإجراءات المتخذة ميدانياً',
      placeholder: 'وضح ما حدث بالتفصيل، من تم التواصل معه، والإجراء المطلوب من الإدارة...',
      holdToggle: 'تعليق المهمة مؤقتاً (يتطلب تدخل الإدارة)',
      submit: 'إرسال تقرير العائق'
    },
    agenda: {
      title: 'مسار وجدول اليوم الميداني',
      sub: 'خطة التحرك والمحطات الزمنية للمهام الميدانية اليوم.'
    },
    archive: {
      title: 'أرشيف المهام المكتملة',
      sub: 'السجل التاريخي لعمليات التركيب المنتهية والتوصيلات المسلّمة ودراسات الجدوى المنجزة.',
      emptyTitle: 'لا توجد مهام منجزة بعد',
      emptySub: 'المهام التي يتم إتمامها ستسجل هنا.'
    },
    empty: {
      title: 'لم يتم العثور على مهام تطابق الفلتر',
      sub: 'جرّب تغيير نوع المهمة أو الحالة أو مسح كلمة البحث.',
      clearFilters: 'إعادة ضبط الفلاتر'
    }
  },
  services: {
    heroTitle: 'خدمات الطاقة الشمسية والمجددة الاحترافية',
    heroSubtitle: 'من التركيب والصيانة المتكاملة إلى تدقيق الكهرباء المجاني وتوصيل المعدات السريع.',
    ourServices: 'عروض خدماتنا الميدانية',
    requestService: 'طلب الخدمة',
    viewDetails: 'عرض التفاصيل والاحتساب',
    disabledNotice: 'تخضع هذه الخدمة حالياً لتحديثات الطاقة الاستيعابية وهي متوقفة مؤقتاً.',
    requestModalTitle: 'تقديم طلب خدمة ميدانية',
    requestModalSubtitle: 'أدخل تفاصيل موقعك وسيقوم فريقنا الهندسي بمراجعة الطلب وتعيين تقني خلال ساعتين.',
    form: {
      fullName: 'الاسم الكامل / الشركة',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      city: 'المدينة / المنطقة',
      address: 'عنوان الموقع أو التركيب',
      preferredDate: 'التاريخ المفضل للخدمة',
      notes: 'تفاصيل الموقع ونطاق الخدمة المطلوب',
      submitBtn: 'إرسال طلب الخدمة'
    },
    realization: {
      title: 'مؤشر تتبع مراحل الإنجاز (Progress Bar)',
      currentPhase: 'المرحلة الحالية للإنجاز',
      phaseStep: 'الخطوة {step} من 5',
      historyTitle: 'سجل نشاط وتحديثات الخدمة'
    }
  }
}

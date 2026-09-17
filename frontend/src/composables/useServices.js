import { ref, computed } from 'vue'

const SERVICES_CONFIG_KEY = 'ea_services_config'
const SERVICE_REQUESTS_KEY = 'ea_service_requests'

export const defaultServices = [
  {
    id: 'installation',
    titleKey: 'services.catalog.installation.title',
    title: 'Solar System Installation',
    descKey: 'services.catalog.installation.desc',
    desc: 'Professional rooftop & ground-mounted solar equipment installation by certified renewable energy engineers.',
    icon: 'installation',
    category: 'Engineering & Setup',
    enabled: true,
    estimatedDuration: '1-3 Days',
    startingPrice: '4,500 MAD',
    bullets: [
      'Site structural & roof weight integrity audit',
      'Tier-1 panel mounting & ballasted racking',
      'Inverter AC/DC wiring & earthing protection',
      'Grid synchronization & utility approval assistance'
    ],
    realizationSteps: [
      { step: 1, key: 'received', title: 'Request Logged', desc: 'Service request received by Green_energy dispatch.' },
      { step: 2, key: 'review', title: 'Site Review & Engineering', desc: 'Technical assessment and permit checks.' },
      { step: 3, key: 'assigned', title: 'Operator & Crew Dispatched', desc: 'Field technician assigned with equipment manifest.' },
      { step: 4, key: 'in_progress', title: 'On-Site Installation', desc: 'Racking, panel wiring, inverter setup & earthing.' },
      { step: 5, key: 'completed', title: 'Commissioned & Handover', desc: 'Live grid testing & client app pairing completed.' }
    ]
  },
  {
    id: 'maintenance',
    titleKey: 'services.catalog.maintenance.title',
    title: 'Preventative & Emergency Maintenance',
    descKey: 'services.catalog.maintenance.desc',
    desc: '24/7 array diagnostics, string voltage checks, panel thermal scanning, and inverter fault repair.',
    icon: 'maintenance',
    category: 'Operation & Support',
    enabled: true,
    estimatedDuration: '2-4 Hours',
    startingPrice: '800 MAD',
    bullets: [
      'Inverter fault code diagnosis (Growatt, Deye, Huawei)',
      'Solar string IV-curve voltage testing',
      'Thermal imaging for hotspot detection',
      'Battery bank health diagnostic & BMS rebalancing'
    ],
    realizationSteps: [
      { step: 1, key: 'received', title: 'Ticket Logged', desc: 'Maintenance request registered in operations.' },
      { step: 2, key: 'review', title: 'Diagnostic Triage', desc: 'Remote error code log review by lead engineer.' },
      { step: 3, key: 'assigned', title: 'Field Tech Assigned', desc: 'Maintenance operator dispatched with diagnostic tools.' },
      { step: 4, key: 'in_progress', title: 'On-Site Repair & Cleaning', desc: 'Fault resolution, part replacement & string testing.' },
      { step: 5, key: 'completed', title: 'Service Certified', desc: 'System restored to peak operating efficiency.' }
    ]
  },
  {
    id: 'consultation',
    titleKey: 'services.catalog.consultation.title',
    title: 'Electricity Audit & Solar Study',
    descKey: 'services.catalog.consultation.desc',
    desc: 'Comprehensive electrical consumption study, shading simulation, and financial ROI payback analysis.',
    icon: 'study',
    category: 'Advisory & Sizing',
    enabled: true,
    estimatedDuration: '24-48 Hours',
    startingPrice: 'FREE',
    bullets: [
      'Utility bill analysis (ONEE / Lydec / Redal)',
      'Roof 3D shading & solar irradiance simulation',
      'Hybrid inverter & LiFePO4 battery sizing',
      'Financial ROI breakdown & payback period report'
    ],
    realizationSteps: [
      { step: 1, key: 'received', title: 'Audit Requested', desc: 'Free solar study request submitted.' },
      { step: 2, key: 'review', title: 'Bill & Load Modeling', desc: 'Hourly electricity consumption curve modeling.' },
      { step: 3, key: 'assigned', title: 'Energy Analyst Assigned', desc: 'Senior analyst assigned to site report.' },
      { step: 4, key: 'in_progress', title: 'Study Generation', desc: 'Generating solar kWp recommendation & ROI chart.' },
      { step: 5, key: 'completed', title: 'Report Delivered', desc: 'Personalized solar study delivered with quotation.' }
    ]
  },
  {
    id: 'delivery',
    titleKey: 'services.catalog.delivery.title',
    title: 'Equipment Transport & Delivery',
    descKey: 'services.catalog.delivery.desc',
    desc: 'Secure logistics & insured delivery for solar panels, lithium batteries, and heavy mounting hardware.',
    icon: 'delivery',
    category: 'Logistics & Supply',
    enabled: true,
    estimatedDuration: 'Same / Next Day',
    startingPrice: '350 MAD',
    bullets: [
      'Insured transport for fragile glass panels & batteries',
      'Crane / lift hoisting service for rooftop delivery',
      'On-site recipient sign-off & item inspection',
      'GPS tracked dispatch across all regions of Morocco'
    ],
    realizationSteps: [
      { step: 1, key: 'received', title: 'Order Dispatched', desc: 'Logistics request registered in store dispatch.' },
      { step: 2, key: 'review', title: 'Warehouse Loading', desc: 'Item manifest verification & secure strapping.' },
      { step: 3, key: 'assigned', title: 'Truck Driver Dispatched', desc: 'Logistics operator en route to destination.' },
      { step: 4, key: 'in_progress', title: 'En Route to Site', desc: 'Real-time GPS tracking active for customer delivery.' },
      { step: 5, key: 'completed', title: 'Delivered & Signed', desc: 'Delivery completed with client sign-off.' }
    ]
  }
]

const defaultRequests = [
  {
    id: 'SRV-2026-901',
    serviceId: 'installation',
    serviceTitle: 'Solar System Installation',
    clientName: 'M. Omar Bennani',
    clientEmail: 'omar.bennani@gmail.com',
    clientPhone: '+212 661 889 900',
    city: 'Casablanca',
    address: 'Villa 12, California district',
    notes: 'Require 8 kWp rooftop installation with Deye inverter.',
    preferredDate: '2026-09-20',
    status: 'accepted', // pending, accepted, rejected, completed
    currentPhase: 3, // 1 to 5
    assignedOperatorId: 'OP-101',
    assignedOperatorName: 'Ahmed Moussaoui',
    createdAt: '2026-09-15 10:30',
    history: [
      { date: '2026-09-15 10:30', actor: 'Client', text: 'Service request submitted.' },
      { date: '2026-09-15 11:15', actor: 'Admin', text: 'Request accepted and assigned to Ahmed Moussaoui.' },
      { date: '2026-09-15 14:00', actor: 'Operator (Ahmed)', text: 'Phase updated to 3: Operator & Crew Dispatched.' }
    ]
  },
  {
    id: 'SRV-2026-902',
    serviceId: 'maintenance',
    serviceTitle: 'Preventative & Emergency Maintenance',
    clientName: 'CleanTech Morocco',
    clientEmail: 'contact@cleantech.ma',
    clientPhone: '+212 522 345 678',
    city: 'Rabat',
    address: 'Avenue de France, Agdal',
    notes: 'Inverter tripping during high noon hours (Code E04).',
    preferredDate: '2026-09-16',
    status: 'accepted',
    currentPhase: 4,
    assignedOperatorId: 'OP-102',
    assignedOperatorName: 'Youssef Berrada',
    createdAt: '2026-09-14 16:00',
    history: [
      { date: '2026-09-14 16:00', actor: 'Client', text: 'Emergency repair request submitted.' },
      { date: '2026-09-14 16:30', actor: 'Admin', text: 'Accepted and assigned Youssef Berrada.' },
      { date: '2026-09-15 09:30', actor: 'Operator (Youssef)', text: 'On site conducting IV string diagnostic.' }
    ]
  }
]

const servicesConfig = ref([])
const serviceRequests = ref([])

function loadServicesState() {
  try {
    const storedCfg = localStorage.getItem(SERVICES_CONFIG_KEY)
    if (storedCfg) {
      servicesConfig.value = JSON.parse(storedCfg)
    } else {
      servicesConfig.value = defaultServices
      localStorage.setItem(SERVICES_CONFIG_KEY, JSON.stringify(defaultServices))
    }

    const storedReqs = localStorage.getItem(SERVICE_REQUESTS_KEY)
    if (storedReqs) {
      serviceRequests.value = JSON.parse(storedReqs)
    } else {
      serviceRequests.value = defaultRequests
      localStorage.setItem(SERVICE_REQUESTS_KEY, JSON.stringify(defaultRequests))
    }
  } catch (e) {
    console.error('Error loading services state:', e)
    servicesConfig.value = defaultServices
    serviceRequests.value = defaultRequests
  }
}

function saveConfig() {
  try {
    localStorage.setItem(SERVICES_CONFIG_KEY, JSON.stringify(servicesConfig.value))
  } catch (e) {
    console.error('Error saving services config:', e)
  }
}

function saveRequests() {
  try {
    localStorage.setItem(SERVICE_REQUESTS_KEY, JSON.stringify(serviceRequests.value))
  } catch (e) {
    console.error('Error saving service requests:', e)
  }
}

export function useServices() {
  loadServicesState()

  const availableServices = computed(() => {
    return servicesConfig.value.filter(s => s.enabled)
  })

  function getServiceById(id) {
    return servicesConfig.value.find(s => s.id === id) || null
  }

  function toggleServiceEnabled(serviceId) {
    const srv = servicesConfig.value.find(s => s.id === serviceId)
    if (srv) {
      srv.enabled = !srv.enabled
      saveConfig()
    }
  }

  function updateService(serviceId, data) {
    const srv = servicesConfig.value.find(s => s.id === serviceId)
    if (srv) {
      if (data.title !== undefined) srv.title = data.title
      if (data.startingPrice !== undefined) srv.startingPrice = data.startingPrice
      if (data.estimatedDuration !== undefined) srv.estimatedDuration = data.estimatedDuration
      if (data.desc !== undefined) srv.desc = data.desc
      if (data.enabled !== undefined) srv.enabled = data.enabled
      saveConfig()
    }
  }

  function createServiceRequest(data) {
    const srv = getServiceById(data.serviceId)
    const newReq = {
      id: `SRV-2026-${Math.floor(100 + Math.random() * 900)}`,
      serviceId: data.serviceId,
      serviceTitle: srv ? srv.title : 'Custom Service',
      clientName: data.clientName || 'Valued Client',
      clientEmail: data.clientEmail || '',
      clientPhone: data.clientPhone || '',
      city: data.city || 'Casablanca',
      address: data.address || '',
      notes: data.notes || '',
      preferredDate: data.preferredDate || new Date().toISOString().split('T')[0],
      status: 'pending', // pending, accepted, in_progress, completed, rejected
      currentPhase: 1,
      assignedOperatorId: null,
      assignedOperatorName: 'Pending Assignment',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      history: [
        {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor: 'Client',
          text: 'Service request created and sent to Green_energy dispatch.'
        }
      ]
    }

    serviceRequests.value.unshift(newReq)
    saveRequests()
    return newReq
  }

  function acceptAndAssignRequest(requestId, operatorId, operatorName) {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req) {
      req.status = 'accepted'
      req.currentPhase = Math.max(req.currentPhase, 2)
      req.assignedOperatorId = operatorId
      req.assignedOperatorName = operatorName
      req.history.unshift({
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actor: 'Admin',
        text: `Request accepted and assigned to ${operatorName}.`
      })
      saveRequests()
    }
  }

  function updateRequestPhase(requestId, newPhase, actorName = 'Admin / Operator', notes = '') {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req) {
      req.currentPhase = Number(newPhase)
      if (req.currentPhase === 5) {
        req.status = 'completed'
      } else if (req.currentPhase >= 2) {
        req.status = 'accepted'
      }

      const srv = getServiceById(req.serviceId)
      const stepDef = srv?.realizationSteps?.find(st => st.step === Number(newPhase))
      const phaseTitle = stepDef ? stepDef.title : `Phase ${newPhase}`

      req.history.unshift({
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actor: actorName,
        text: `Realization phase updated to ${newPhase} (${phaseTitle}). ${notes}`
      })
      saveRequests()
    }
  }

  function getRequestsForClient(email) {
    if (!email) return serviceRequests.value
    return serviceRequests.value.filter(r => r.clientEmail.toLowerCase() === email.toLowerCase())
  }

  function getRequestsForOperator(operatorId) {
    if (!operatorId) return []
    return serviceRequests.value.filter(r => r.assignedOperatorId === operatorId)
  }

  return {
    servicesConfig,
    serviceRequests,
    availableServices,
    getServiceById,
    toggleServiceEnabled,
    updateService,
    createServiceRequest,
    acceptAndAssignRequest,
    updateRequestPhase,
    getRequestsForClient,
    getRequestsForOperator,
    reloadServices: loadServicesState
  }
}

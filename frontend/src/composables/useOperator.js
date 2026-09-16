import { ref, computed } from 'vue'

const STORAGE_KEY = 'ea_operator_tasks'
const DUTY_KEY = 'ea_operator_duty_status'

const defaultTasks = [
  {
    id: 'TSK-INST-104',
    type: 'installation',
    title: 'Commercial Rooftop PV Setup (12 kWp)',
    status: 'in_progress',
    priority: 'high',
    scheduledDate: '2026-09-15',
    timeSlot: '09:00 - 13:00',
    client: {
      name: 'Maroc Agro Industries (M. Tazi)',
      phone: '+212 661 245 890',
      email: 'contact@marocagro.ma',
      address: 'Lot 45, Zone Industrielle Ain Sebaa',
      city: 'Casablanca'
    },
    adminNotes: 'Client confirmed accepted quote #Q-2026-088. Rooftop crane access arranged with site manager at 08:30. Verify inverter grounding before AC hookup.',
    operatorNotes: 'On site since 09:15. Racks assembled, panels wired into 2 strings. Testing open-circuit voltage currently.',
    typeData: {
      equipmentList: [
        { name: '550W Tier-1 Mono PERC Solar Panels', qty: 22, checked: true },
        { name: 'Deye 12kW 3-Phase Hybrid Inverter', qty: 1, checked: true },
        { name: 'Aluminum Ballasted Flat Roof Racking Kits', qty: 4, checked: true },
        { name: 'Solar Cable 6mm² (Red & Black)', qty: '120m', checked: true },
        { name: 'DC Isolator Switch 1000V 32A', qty: 2, checked: true },
        { name: 'Surge Protection Device Type II AC/DC', qty: 1, checked: false }
      ],
      checklist: [
        { label: 'Site structural & roof weight integrity check', done: true },
        { label: 'Ballasted mounting rails alignment & torque verification', done: true },
        { label: 'PV panel string DC voltage & polarity test (Voc & Isc)', done: true },
        { label: 'Inverter wall mounting & AC/DC wiring isolation', done: false },
        { label: 'Earth ground resistance test (< 5 Ohms)', done: false },
        { label: 'Grid synchronization & live commissioning test', done: false },
        { label: 'Client mobile monitoring app pairing & hand-off', done: false }
      ],
      commissioningKW: 10.8,
      inverterSN: 'DY-12K-2026-09884'
    },
    traces: [
      { date: '2026-09-14 16:30', user: 'Admin (Karim)', action: 'Dispatched task to Operator' },
      { date: '2026-09-15 08:45', user: 'Operator (You)', action: 'Status changed to In Progress — En route to site' },
      { date: '2026-09-15 09:30', user: 'Operator (You)', action: 'Checked 4 equipment items and passed roof integrity' }
    ]
  },
  {
    id: 'TSK-MAIN-208',
    type: 'maintenance',
    title: 'Routine Inspection & Inverter Error E04 Diagnosis',
    status: 'assigned',
    priority: 'urgent',
    scheduledDate: '2026-09-15',
    timeSlot: '14:30 - 17:00',
    client: {
      name: 'Villa Benjelloun (Mme. Leila)',
      phone: '+212 662 987 123',
      email: 'leila.benjelloun@gmail.com',
      address: '32 Rue des Palmiers, Palmeraie',
      city: 'Marrakech'
    },
    adminNotes: 'Installation dated 2024 (6kW SolarEdge system). Client reported intermittent shutdown and Inverter Error E04 (Isolation fault / leakage current). Panels also require dust cleaning.',
    operatorNotes: '',
    typeData: {
      systemAge: '2 years (Installed May 2024)',
      systemCapacity: '6.4 kWp (16x 400W Panels)',
      inverterModel: 'SolarEdge SE6000H',
      lastServiceDate: '2025-11-10',
      reportedFault: 'Error E04 — DC Isolation Fault during morning humidity',
      diagnosticsChecklist: [
        { label: 'Visual inspection of solar panel glass & anti-reflective coating', done: false },
        { label: 'Check for MC4 connector moisture ingress or corrosion', done: false },
        { label: 'Measure DC megohmmeter insulation resistance (String to Ground)', done: false },
        { label: 'Clean dust and desert sediment with demineralized water', done: false },
        { label: 'Inspect DC/AC SPD cartridges and replace if tripped', done: false },
        { label: 'Clear inverter fault memory and run 30-min load test', done: false }
      ],
      replacedParts: [
        { name: 'MC4 Branch Connector Pair', qty: 2, used: false },
        { name: '1000V 15A DC Fuse Link', qty: 1, used: false }
      ]
    },
    traces: [
      { date: '2026-09-15 08:00', user: 'Admin (Karim)', action: 'Logged urgent client fault ticket & assigned task' }
    ]
  },
  {
    id: 'TSK-DELV-312',
    type: 'delivery',
    title: 'New Order Delivery & Material Hand-Off',
    status: 'in_progress',
    priority: 'medium',
    scheduledDate: '2026-09-15',
    timeSlot: '11:30 - 13:30',
    client: {
      name: 'Atelier Solaire (M. Hicham)',
      phone: '+212 670 456 789',
      email: 'atelier.solaire.maroc@gmail.com',
      address: 'Boulevard Hassan II, Quartier Industriel',
      city: 'Rabat'
    },
    adminNotes: 'Online Marketplace Order #ORD-8823 paid in full. Load items from Central Warehouse Bay 3. Requires signed delivery receipt upon hand-off.',
    operatorNotes: 'Loaded vehicle from warehouse. Items safely secured. Contacted customer for arrival estimation at 12:15.',
    typeData: {
      orderNumber: 'ORD-8823',
      stagingBay: 'Central Depot - Bay 3B',
      items: [
        { sku: 'PNL-550-MONO', name: 'Tier-1 550W Mono PERC Solar Panel', qty: 8, packaged: true },
        { sku: 'INV-HYB-5K', name: '5kW Single-Phase Hybrid Solar Inverter', qty: 1, packaged: true },
        { sku: 'BAT-LITH-5K', name: '5.12kWh LiFePO4 Wall-Mount Battery', qty: 1, packaged: true },
        { sku: 'ACC-MC4-100', name: 'MC4 Solar Connectors (Bag of 50)', qty: 1, packaged: true }
      ],
      deliverySteps: [
        { label: 'Verify warehouse picking list & serial numbers', done: true },
        { label: 'Cargo safe strap & fragile battery packing check', done: true },
        { label: 'Customer arrival call & delivery site access confirmation', done: true },
        { label: 'Unload pallets at customer ground warehouse', done: false },
        { label: 'Customer unboxing & visual condition inspection', done: false },
        { label: 'Obtain signed Delivery Note (Bon de Livraison)', done: false }
      ],
      recipientName: '',
      recipientSignatureId: ''
    },
    traces: [
      { date: '2026-09-15 07:30', user: 'Admin (Sara)', action: 'Order dispatched for delivery' },
      { date: '2026-09-15 10:45', user: 'Operator (You)', action: 'Checked inventory and left depot' }
    ]
  },
  {
    id: 'TSK-STUD-405',
    type: 'study',
    title: "Household Electricity Consumption Audit & Solar Feasibility Study",
    status: 'assigned',
    priority: 'high',
    scheduledDate: '2026-09-16',
    timeSlot: '10:00 - 12:30',
    client: {
      name: 'Dr. Rachid Alami (Residential Villa)',
      phone: '+212 663 112 345',
      email: 'dr.alami.rachid@gmail.com',
      address: 'Route d’Imouzzer, Quartier Narjiss',
      city: 'Fès'
    },
    adminNotes: 'Customer high electricity bill (~2,800 MAD/month) with air conditioning and swimming pool pump. Wants solar study to achieve 70%+ energy autonomy.',
    operatorNotes: '',
    typeData: {
      auditChecklist: [
        { label: 'Review past 12 months ONEE electricity bills & peak tariff tier', done: false },
        { label: 'Inspect main electric board (TGBT), breaker ratings & earthing pit', done: false },
        { label: 'Laser-measure roof surface area, inclination angle & orientation', done: false },
        { label: 'Conduct solar path & horizon shading analysis (trees / buildings)', done: false },
        { label: 'Log heavy appliances (Pool pump 1.5kW, 4x AC split units, water heater)', done: false },
        { label: 'Run PV sizing calculator & compile client financial ROI summary', done: false }
      ],
      // Solar calculator data
      monthlyBillMAD: 2800,
      estimatedKWhMonthly: 1650,
      roofAreaM2: 140,
      roofOrientation: 'South (180°)',
      roofTiltDeg: 28,
      shadingCondition: 'low', // none | low | medium | heavy
      recommendedKWp: 9.6,
      estimatedYearlyKWh: 16200,
      estimatedMonthlySavingsMAD: 2350,
      batteryNeeded: true,
      recommendedBatteryKWh: 10,
      paybackYears: 4.2,
      feasibilityScore: 'Excellent (94%)',
      studyNotes: ''
    },
    traces: [
      { date: '2026-09-15 11:00', user: 'Admin (Karim)', action: 'Scheduled on-site feasibility study for client request' }
    ]
  },
  {
    id: 'TSK-INST-099',
    type: 'installation',
    title: 'Off-Grid Solar System (5 kWp) with LiFePO4 Storage',
    status: 'completed',
    priority: 'normal',
    scheduledDate: '2026-09-13',
    timeSlot: '08:30 - 15:30',
    client: {
      name: 'Dar El Ksar Ecolodge',
      phone: '+212 654 789 012',
      email: 'info@darelksar.ma',
      address: 'Palmeraie Nord, Km 12',
      city: 'Ouarzazate'
    },
    adminNotes: 'Off-grid setup. Generator backup automatic transfer switch included.',
    operatorNotes: 'Completed installation successfully. 10x 500W panels installed, 2x 5kWh batteries connected and synced. System produces 4.8kW peak under direct sun.',
    typeData: {
      equipmentList: [
        { name: '500W Bifacial Solar Panels', qty: 10, checked: true },
        { name: '5kW 48V Off-Grid Inverter', qty: 1, checked: true },
        { name: '10kWh LiFePO4 Battery Bank', qty: 2, checked: true }
      ],
      checklist: [
        { label: 'Site structural check', done: true },
        { label: 'Mounting & string wiring', done: true },
        { label: 'Battery integration & BMS setup', done: true },
        { label: 'Full load test on water pumps', done: true }
      ],
      commissioningKW: 4.8,
      inverterSN: 'OG-5K-2026-0412'
    },
    traces: [
      { date: '2026-09-13 08:30', user: 'Operator (You)', action: 'Started installation' },
      { date: '2026-09-13 15:15', user: 'Operator (You)', action: 'Completed commissioning and signed off with client' }
    ]
  },
  {
    id: 'TSK-MAIN-195',
    type: 'maintenance',
    title: 'Emergency Breaker Tripping on Main PV Inverter',
    status: 'on_hold',
    priority: 'urgent',
    scheduledDate: '2026-09-14',
    timeSlot: '16:00 - 18:00',
    client: {
      name: 'Résidence Palmier',
      phone: '+212 660 334 556',
      email: 'syndic.palmier@gmail.com',
      address: 'Rue Abou Dhabi, Gauthier',
      city: 'Casablanca'
    },
    adminNotes: 'Syndic reported circuit breaker trips whenever inverter feeds into grid.',
    operatorNotes: 'Put on hold: AC Breaker rating (32A) is undersized for current 3-phase surge. Requested admin approval to replace with 63A D-curve breaker.',
    typeData: {
      systemAge: '1 year',
      systemCapacity: '15 kWp',
      inverterModel: 'Huawei SUN2000-15KTL',
      lastServiceDate: '2026-03-12',
      reportedFault: 'AC Main breaker tripping on peak solar output',
      diagnosticsChecklist: [
        { label: 'Inspect AC distribution panel & cable diameter', done: true },
        { label: 'Check for phase imbalance and harmonic distortion', done: true },
        { label: 'Test inverter AC output current on all 3 phases', done: true },
        { label: 'Replace undersized breaker with 63A D-curve', done: false }
      ],
      replacedParts: []
    },
    traces: [
      { date: '2026-09-14 16:15', user: 'Operator (You)', action: 'Arrived on site and diagnosed undersized breaker' },
      { date: '2026-09-14 17:30', user: 'Operator (You)', action: 'Put task on hold — waiting for 63A D-curve breaker approval' }
    ]
  }
]

// Initialize tasks from localStorage if available
function loadStoredTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Failed to parse stored operator tasks:', e)
  }
  return defaultTasks
}

const tasks = ref(loadStoredTasks())
const dutyStatus = ref(localStorage.getItem(DUTY_KEY) || 'on_duty') // on_duty | on_break | off_duty

function persistTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value))
  } catch (e) {
    console.error('Failed to save operator tasks:', e)
  }
}

export function useOperator() {
  const setDutyStatus = (status) => {
    dutyStatus.value = status
    localStorage.setItem(DUTY_KEY, status)
  }

  const getTaskById = (id) => {
    return tasks.value.find(t => t.id === id)
  }

  const updateTaskStatus = (taskId, newStatus) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return null
    task.status = newStatus
    task.traces.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: 'Operator (You)',
      action: `Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`
    })
    persistTasks()
    return task
  }

  const updateTaskNotes = (taskId, operatorNotes) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return null
    task.operatorNotes = operatorNotes
    task.traces.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: 'Operator (You)',
      action: 'Updated field notes'
    })
    persistTasks()
    return task
  }

  const toggleChecklistItem = (taskId, listKey, itemIndex) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task || !task.typeData) return
    const list = task.typeData[listKey]
    if (Array.isArray(list) && list[itemIndex]) {
      const target = list[itemIndex]
      if (typeof target.done !== 'undefined') {
        target.done = !target.done
      } else if (typeof target.checked !== 'undefined') {
        target.checked = !target.checked
      } else if (typeof target.used !== 'undefined') {
        target.used = !target.used
      }
      persistTasks()
    }
  }

  const updateStudyData = (taskId, newStudyData) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task || task.type !== 'study') return null
    task.typeData = {
      ...task.typeData,
      ...newStudyData
    }
    task.traces.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: 'Operator (You)',
      action: 'Updated solar consumption audit parameters'
    })
    persistTasks()
    return task
  }

  const updateDeliveryProof = (taskId, recipientName, signatureNotes) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task || task.type !== 'delivery') return null
    task.typeData.recipientName = recipientName
    task.typeData.recipientSignatureId = 'SIG-' + Date.now().toString(36).toUpperCase()
    task.status = 'completed'
    task.traces.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: 'Operator (You)',
      action: `Delivery signed by ${recipientName}. Note: ${signatureNotes || 'None'}`
    })
    persistTasks()
    return task
  }

  const reportIncident = (taskId, { issueType, notes, urgent }) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return null
    if (urgent) {
      task.status = 'on_hold'
    }
    task.traces.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: 'Operator (You)',
      action: `⚠️ Incident reported [${issueType}]: ${notes}`
    })
    persistTasks()
    return task
  }

  const resetToDemoTasks = () => {
    tasks.value = JSON.parse(JSON.stringify(defaultTasks))
    persistTasks()
  }

  const stats = computed(() => {
    const list = tasks.value
    const total = list.length
    const assigned = list.filter(t => t.status === 'assigned').length
    const inProgress = list.filter(t => t.status === 'in_progress').length
    const completed = list.filter(t => t.status === 'completed').length
    const onHold = list.filter(t => t.status === 'on_hold').length
    const urgent = list.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed').length

    const todayDate = new Date().toISOString().slice(0, 10)
    const todayTasks = list.filter(t => t.scheduledDate === todayDate || t.scheduledDate === '2026-09-15')

    // Breakdowns by type
    const byType = {
      installation: list.filter(t => t.type === 'installation').length,
      maintenance: list.filter(t => t.type === 'maintenance').length,
      delivery: list.filter(t => t.type === 'delivery').length,
      study: list.filter(t => t.type === 'study').length
    }

    return {
      total,
      assigned,
      inProgress,
      completed,
      onHold,
      urgent,
      todayTotal: todayTasks.length,
      todayPending: todayTasks.filter(t => t.status !== 'completed').length,
      byType
    }
  })

  return {
    tasks,
    dutyStatus,
    stats,
    setDutyStatus,
    getTaskById,
    updateTaskStatus,
    updateTaskNotes,
    toggleChecklistItem,
    updateStudyData,
    updateDeliveryProof,
    reportIncident,
    resetToDemoTasks
  }
}

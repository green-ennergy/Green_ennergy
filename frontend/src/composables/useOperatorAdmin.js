import { ref, computed } from 'vue'

const ADMIN_TASKS_KEY = 'ea_operator_tasks'
const OPERATORS_ROSTER_KEY = 'ea_operator_roster'

const defaultOperators = [
  {
    id: 'OP-101',
    name: 'Ahmed Moussaoui',
    role: 'Senior Solar Field Engineer',
    phone: '+212 661 245 890',
    email: 'a.moussaoui@greenenergy.ma',
    city: 'Casablanca',
    specialties: ['installation', 'maintenance', 'study'],
    dutyStatus: 'onDuty',
    avatarColor: '#16a34a',
    completedTasksCount: 42,
    rating: 4.9
  },
  {
    id: 'OP-102',
    name: 'Youssef Berrada',
    role: 'HV & Grid Hookup Specialist',
    phone: '+212 662 901 234',
    email: 'y.berrada@greenenergy.ma',
    city: 'Rabat / Salé',
    specialties: ['installation', 'maintenance'],
    dutyStatus: 'onDuty',
    avatarColor: '#0284c7',
    completedTasksCount: 38,
    rating: 4.8
  },
  {
    id: 'OP-103',
    name: 'Fatima Zahra Idrissi',
    role: 'Solar Consumption Analyst',
    phone: '+212 663 567 890',
    email: 'fz.idrissi@greenenergy.ma',
    city: 'Marrakech / Tensift',
    specialties: ['study', 'maintenance'],
    dutyStatus: 'onDuty',
    avatarColor: '#9333ea',
    completedTasksCount: 29,
    rating: 4.95
  },
  {
    id: 'OP-104',
    name: 'Karim Bennani',
    role: 'Logistics & Equipment Dispatcher',
    phone: '+212 664 112 233',
    email: 'k.bennani@greenenergy.ma',
    city: 'Casablanca / Mohammedia',
    specialties: ['delivery', 'installation'],
    dutyStatus: 'onBreak',
    avatarColor: '#ea580c',
    completedTasksCount: 54,
    rating: 4.7
  }
]

const defaultTasks = [
  {
    id: 'TSK-INST-104',
    type: 'installation',
    title: 'Commercial Rooftop PV Setup (12 kWp)',
    operatorId: 'OP-101',
    operatorName: 'Ahmed Moussaoui',
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
    operatorNotes: 'On site since 09:15. Racks assembled, panels wired into 2 strings.',
    typeData: {
      equipmentList: [
        { name: '550W Tier-1 Mono PERC Solar Panels', qty: 22, checked: true },
        { name: 'Deye 12kW 3-Phase Hybrid Inverter', qty: 1, checked: true },
        { name: 'Aluminum Ballasted Flat Roof Racking Kits', qty: 4, checked: true }
      ],
      checklist: [
        { label: 'Site structural integrity check', done: true },
        { label: 'Ballasted mounting rails alignment', done: true },
        { label: 'PV panel string DC voltage test', done: true }
      ],
      commissioningKW: 10.8,
      inverterSN: 'DY-12K-2026-09884'
    },
    traces: [
      { date: '2026-09-14 16:30', user: 'Admin Dispatch', action: 'Created & assigned task to Ahmed Moussaoui' }
    ]
  },
  {
    id: 'TSK-MAIN-208',
    type: 'maintenance',
    title: 'Emergency Inverter Repair & Array Diagnostic',
    operatorId: 'OP-102',
    operatorName: 'Youssef Berrada',
    status: 'assigned',
    priority: 'urgent',
    scheduledDate: '2026-09-15',
    timeSlot: '14:00 - 17:00',
    client: {
      name: 'Dr. Hassan Alami (Villa Residence)',
      phone: '+212 663 889 001',
      email: 'hassan.alami@gmail.com',
      address: '14 Avenue Bir Anzarane, Souissi',
      city: 'Rabat'
    },
    adminNotes: 'Client reported E04 Grid Voltage Surge fault on 8kW Growatt Inverter. Battery bank disconnected.',
    operatorNotes: '',
    typeData: {
      faultDescription: 'Inverter tripping on E04 code every 15 mins during peak solar hours.',
      actionsTaken: [],
      partsReplaced: []
    },
    traces: [
      { date: '2026-09-15 08:00', user: 'Admin Dispatch', action: 'Created & assigned urgent maintenance task' }
    ]
  },
  {
    id: 'TSK-DELV-312',
    type: 'delivery',
    title: 'Solar Panels & Hybrid Battery Delivery',
    operatorId: 'OP-104',
    operatorName: 'Karim Bennani',
    status: 'in_progress',
    priority: 'medium',
    scheduledDate: '2026-09-15',
    timeSlot: '10:30 - 12:30',
    client: {
      name: 'Société CleanTech Nord',
      phone: '+212 522 443 210',
      email: 'logistics@cleantech.ma',
      address: 'Route de Tétouan, Km 7',
      city: 'Tangier'
    },
    adminNotes: 'Deliver 16x 450W Panels + 1x Felicity 10kWh LiFePO4 battery. Require receiver signature.',
    operatorNotes: '',
    typeData: {
      manifestItems: [
        { item: '450W Mono Solar Panel', qty: 16 },
        { item: 'Felicity 10kWh LiFePO4 Battery', qty: 1 }
      ],
      recipientName: 'M. Reda Kasmi',
      deliveryNotes: ''
    },
    traces: [
      { date: '2026-09-15 09:00', user: 'Admin Dispatch', action: 'Dispatched delivery truck T-204' }
    ]
  },
  {
    id: 'TSK-STUD-405',
    type: 'study',
    title: 'Residential Electricity Audit & Solar Sizing',
    operatorId: 'OP-103',
    operatorName: 'Fatima Zahra Idrissi',
    status: 'assigned',
    priority: 'medium',
    scheduledDate: '2026-09-16',
    timeSlot: '09:30 - 11:30',
    client: {
      name: 'Mme. Samira Chraibi',
      phone: '+212 665 332 211',
      email: 'samira.chraibi@hotmail.com',
      address: 'Villa 28, Palmerie Phase II',
      city: 'Marrakech'
    },
    adminNotes: 'Perform consumption study (monthly bill ~ 1,800 MAD). Roof dimensions 180m², south orientation.',
    operatorNotes: '',
    typeData: {
      monthlyBillMAD: 1800,
      roofAreaM2: 180,
      recommendedKWp: 6.5,
      estimatedPaybackYears: 4.2
    },
    traces: [
      { date: '2026-09-15 11:00', user: 'Admin Dispatch', action: 'Scheduled on-site solar assessment' }
    ]
  }
]

const tasks = ref([])
const operators = ref([])

function loadState() {
  try {
    const storedTasks = localStorage.getItem(ADMIN_TASKS_KEY)
    if (storedTasks) {
      tasks.value = JSON.parse(storedTasks)
    } else {
      tasks.value = [...defaultTasks]
      localStorage.setItem(ADMIN_TASKS_KEY, JSON.stringify(defaultTasks))
    }

    const storedOps = localStorage.getItem(OPERATORS_ROSTER_KEY)
    if (storedOps) {
      operators.value = JSON.parse(storedOps)
    } else {
      operators.value = [...defaultOperators]
      localStorage.setItem(OPERATORS_ROSTER_KEY, JSON.stringify(defaultOperators))
    }
  } catch (e) {
    console.error('Failed to load operations state:', e)
    tasks.value = [...defaultTasks]
    operators.value = [...defaultOperators]
  }
}

function saveTasks() {
  try {
    localStorage.setItem(ADMIN_TASKS_KEY, JSON.stringify(tasks.value))
  } catch (e) {
    console.error('Failed to save tasks:', e)
  }
}

function saveOperators() {
  try {
    localStorage.setItem(OPERATORS_ROSTER_KEY, JSON.stringify(operators.value))
  } catch (e) {
    console.error('Failed to save operators:', e)
  }
}

export function useOperatorAdmin() {
  loadState()

  const stats = computed(() => {
    const totalOps = operators.value.length
    const onDutyOps = operators.value.filter(o => o.dutyStatus === 'onDuty').length
    const totalTasks = tasks.value.length
    const inProgress = tasks.value.filter(t => t.status === 'in_progress').length
    const assigned = tasks.value.filter(t => t.status === 'assigned').length
    const completed = tasks.value.filter(t => t.status === 'completed').length

    return {
      totalOps,
      onDutyOps,
      totalTasks,
      inProgress,
      assigned,
      completed
    }
  })

  function createTask(taskData) {
    const newId = `TSK-${taskData.type.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
    const assignedOp = operators.value.find(o => o.id === taskData.operatorId)

    const newTask = {
      id: newId,
      type: taskData.type,
      title: taskData.title,
      operatorId: taskData.operatorId,
      operatorName: assignedOp ? assignedOp.name : 'Unassigned',
      status: 'assigned',
      priority: taskData.priority || 'medium',
      scheduledDate: taskData.scheduledDate || new Date().toISOString().split('T')[0],
      timeSlot: taskData.timeSlot || '09:00 - 12:00',
      client: {
        name: taskData.clientName || '',
        phone: taskData.clientPhone || '',
        email: taskData.clientEmail || '',
        address: taskData.clientAddress || '',
        city: taskData.clientCity || 'Casablanca'
      },
      adminNotes: taskData.adminNotes || '',
      operatorNotes: '',
      typeData: taskData.typeData || {},
      traces: [
        {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          user: 'Admin Dispatch',
          action: `Created and assigned task to ${assignedOp ? assignedOp.name : 'Operator'}`
        }
      ]
    }

    tasks.value.unshift(newTask)
    saveTasks()
    return newTask
  }

  function updateTaskStatus(taskId, status, notes = '') {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = status
      if (notes) task.operatorNotes = notes
      task.traces.unshift({
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: 'Admin Dispatch',
        action: `Updated status to ${status.replace('_', ' ').toUpperCase()}`
      })
      saveTasks()
    }
  }

  function reassignTask(taskId, newOperatorId) {
    const task = tasks.value.find(t => t.id === taskId)
    const newOp = operators.value.find(o => o.id === newOperatorId)
    if (task && newOp) {
      const oldOpName = task.operatorName
      task.operatorId = newOp.id
      task.operatorName = newOp.name
      task.traces.unshift({
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: 'Admin Dispatch',
        action: `Reassigned from ${oldOpName} to ${newOp.name}`
      })
      saveTasks()
    }
  }

  function deleteTask(taskId) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    saveTasks()
  }

  function getOperatorActiveTaskCount(operatorId) {
    return tasks.value.filter(t => t.operatorId === operatorId && (t.status === 'assigned' || t.status === 'in_progress')).length
  }

  return {
    tasks,
    operators,
    stats,
    createTask,
    updateTaskStatus,
    reassignTask,
    deleteTask,
    getOperatorActiveTaskCount,
    reloadOperations: loadState
  }
}

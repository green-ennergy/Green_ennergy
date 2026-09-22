import { computed, ref } from 'vue'
import api, { getApiErrorMessage } from '../api/client'

const tasks = ref([])
const dutyStatus = ref('on_duty')
const operatorProfile = ref(null)
const isLoading = ref(false)
const error = ref(null)

function replaceTask(updated) {
  if (!updated) return null
  const index = tasks.value.findIndex((task) => task.id === updated.id)
  if (index !== -1) tasks.value[index] = updated
  return updated
}

export function useOperator() {
  const loadMissions = async () => {
    try {
      isLoading.value = true
      error.value = null
      const [profile, missions] = await Promise.all([
        api.get('/operator/me'),
        api.get('/operator/missions')
      ])
      dutyStatus.value = profile.data.duty_status || 'on_duty'
      operatorProfile.value = profile.data.operator || null
      tasks.value = missions.data.data || []
      return tasks.value
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Could not load operator missions.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const setDutyStatus = async (status) => {
    const previous = dutyStatus.value
    dutyStatus.value = status
    try {
      const response = await api.patch('/operator/duty', { duty_status: status })
      dutyStatus.value = response.data.duty_status
      if (response.data.operator) {
        operatorProfile.value = response.data.operator
      }
      return dutyStatus.value
    } catch (err) {
      dutyStatus.value = previous
      error.value = getApiErrorMessage(err, 'Could not update duty status.')
      throw err
    }
  }

  const getTaskById = (id) => tasks.value.find((task) => task.id === id)

  const patchTask = async (taskId, payload) => {
    try {
      const response = await api.patch(`/operator/missions/${taskId}`, payload)
      return replaceTask(response.data.mission)
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Could not update mission.')
      throw err
    }
  }

  const updateTaskStatus = (taskId, status) => patchTask(taskId, { status })

  const updateTaskNotes = (taskId, operatorNotes) => patchTask(taskId, {
    operatorNotes,
    traceAction: 'Updated field notes'
  })

  const toggleChecklistItem = async (taskId, listKey, itemIndex) => {
    const task = tasks.value.find((item) => item.id === taskId)
    if (!task?.typeData) return null
    const typeData = structuredClone(task.typeData)
    const list = typeData[listKey]
    if (!Array.isArray(list) || !list[itemIndex]) return null
    const target = list[itemIndex]
    if (typeof target.done !== 'undefined') target.done = !target.done
    else if (typeof target.checked !== 'undefined') target.checked = !target.checked
    else if (typeof target.used !== 'undefined') target.used = !target.used
    return patchTask(taskId, { typeData, traceAction: 'Updated checklist' })
  }

  const updateStudyData = (taskId, newStudyData) => {
    const task = tasks.value.find((item) => item.id === taskId)
    if (!task || task.type !== 'study') return null
    return patchTask(taskId, {
      typeData: { ...task.typeData, ...newStudyData },
      traceAction: 'Updated solar consumption audit parameters'
    })
  }

  const updateDeliveryProof = (taskId, recipientName, signatureNotes) => {
    const task = tasks.value.find((item) => item.id === taskId)
    if (!task || task.type !== 'delivery') return null
    return patchTask(taskId, {
      status: 'completed',
      typeData: {
        ...task.typeData,
        recipientName,
        recipientSignatureId: `SIG-${Date.now().toString(36).toUpperCase()}`,
        deliveryNotes: signatureNotes || ''
      },
      traceAction: `Delivery signed by ${recipientName}. Note: ${signatureNotes || 'None'}`
    })
  }

  const updateInstallationMeta = (taskId, { inverterSN, commissioningKW }) => {
    const task = tasks.value.find((item) => item.id === taskId)
    if (!task || task.type !== 'installation') return null
    return patchTask(taskId, {
      typeData: {
        ...task.typeData,
        inverterSN: inverterSN ?? task.typeData?.inverterSN ?? '',
        commissioningKW: Number(commissioningKW) || 0
      },
      traceAction: 'Updated commissioning parameters'
    })
  }

  const reportIncident = (taskId, { issueType, notes, urgent }) => patchTask(taskId, {
    ...(urgent ? { status: 'on_hold' } : {}),
    traceAction: `Incident reported [${issueType}]: ${notes}`
  })

  const refreshMissions = () => loadMissions()

  // Drop any leftover client-side demo cache from the old operator template
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('ea_operator_tasks')
    localStorage.removeItem('ea_operator_duty_status')
  }

  const stats = computed(() => {
    const list = tasks.value
    const now = new Date()
    const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const todayTasks = list.filter((task) => task.scheduledDate === todayDate)

    return {
      total: list.length,
      assigned: list.filter((task) => task.status === 'assigned').length,
      inProgress: list.filter((task) => task.status === 'in_progress').length,
      completed: list.filter((task) => task.status === 'completed').length,
      onHold: list.filter((task) => task.status === 'on_hold').length,
      urgent: list.filter((task) => (task.priority === 'urgent' || task.priority === 'high') && task.status !== 'completed').length,
      todayTotal: todayTasks.length,
      todayPending: todayTasks.filter((task) => task.status !== 'completed').length,
      byType: {
        installation: list.filter((task) => task.type === 'installation').length,
        maintenance: list.filter((task) => task.type === 'maintenance').length,
        delivery: list.filter((task) => task.type === 'delivery').length,
        study: list.filter((task) => task.type === 'study').length
      }
    }
  })

  return {
    tasks,
    dutyStatus,
    operatorProfile,
    isLoading,
    error,
    stats,
    loadMissions,
    setDutyStatus,
    getTaskById,
    updateTaskStatus,
    updateTaskNotes,
    toggleChecklistItem,
    updateStudyData,
    updateDeliveryProof,
    updateInstallationMeta,
    reportIncident,
    refreshMissions
  }
}

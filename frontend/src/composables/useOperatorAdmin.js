import { computed, ref } from 'vue'
import api, { getApiErrorMessage } from '../api/client'

const tasks = ref([])
const operators = ref([])
const error = ref(null)

export function useOperatorAdmin() {
  const stats = computed(() => ({
    totalOps: operators.value.length,
    onDutyOps: operators.value.filter((operator) => operator.dutyStatus === 'onDuty').length,
    totalTasks: tasks.value.length,
    inProgress: tasks.value.filter((task) => task.status === 'in_progress').length,
    assigned: tasks.value.filter((task) => task.status === 'assigned').length,
    completed: tasks.value.filter((task) => task.status === 'completed').length
  }))

  async function fetchOperations() {
    error.value = null
    const [operatorResponse, missionResponse] = await Promise.all([
      api.get('/admin/operators'),
      api.get('/admin/missions')
    ])
    operators.value = operatorResponse.data.data || []
    tasks.value = missionResponse.data.data || []
  }

  function getOperatorActiveTaskCount(operatorId) {
    return tasks.value.filter(
      (task) =>
        task.operatorId === operatorId &&
        (task.status === 'assigned' || task.status === 'in_progress')
    ).length
  }

  async function createTask(taskData) {
    const response = await api.post('/admin/missions', taskData)
    tasks.value.unshift(response.data.mission)
    return response.data.mission
  }

  async function updateTask(taskId, taskData) {
    const response = await api.patch(`/admin/missions/${taskId}`, taskData)
    const index = tasks.value.findIndex((task) => task.id === taskId)
    if (index !== -1) tasks.value[index] = response.data.mission
    return response.data.mission
  }

  async function updateTaskStatus(taskId, status) {
    return updateTask(taskId, { status })
  }

  async function reassignTask(taskId, newOperatorId) {
    return updateTask(taskId, { operatorId: newOperatorId })
  }

  async function deleteTask(taskId) {
    await api.delete(`/admin/missions/${taskId}`)
    tasks.value = tasks.value.filter((task) => task.id !== taskId)
  }

  async function createOperator(data) {
    const response = await api.post('/admin/operators', {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      role: data.role || 'Field operator',
      city: data.city || null,
      password: data.password || undefined
    })
    operators.value.unshift(response.data.operator)
    return response.data
  }

  async function updateOperator(operatorId, data) {
    const response = await api.patch(`/admin/operators/${operatorId}`, {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      role: data.role || null,
      city: data.city || null
    })
    const index = operators.value.findIndex((operator) => operator.id === operatorId)
    if (index !== -1) operators.value[index] = response.data.operator
    tasks.value.forEach((task) => {
      if (task.operatorId === operatorId) task.operatorName = response.data.operator.name
    })
    return response.data.operator
  }

  async function deleteOperator(operatorId) {
    await api.delete(`/admin/operators/${operatorId}`)
    operators.value = operators.value.filter((operator) => operator.id !== operatorId)
    tasks.value.forEach((task) => {
      if (task.operatorId === operatorId) {
        task.operatorId = null
        task.operatorName = 'Unassigned'
      }
    })
  }

  async function toggleOperatorDuty(operatorId) {
    const op = operators.value.find((o) => o.id === operatorId)
    if (!op) return null
    const cycle = { onDuty: 'on_break', onBreak: 'off_duty', offDuty: 'on_duty', on_duty: 'on_break', on_break: 'off_duty', off_duty: 'on_duty' }
    const next = cycle[op.dutyStatus] || 'on_duty'
    // Admin has no dedicated duty endpoint for other operators — patch via update if needed
    op.dutyStatus = next === 'on_duty' ? 'onDuty' : next === 'on_break' ? 'onBreak' : 'offDuty'
    return op
  }

  return {
    tasks,
    operators,
    stats,
    error,
    createTask,
    updateTask,
    createOperator,
    updateOperator,
    deleteOperator,
    updateTaskStatus,
    reassignTask,
    deleteTask,
    toggleOperatorDuty,
    getOperatorActiveTaskCount,
    reloadOperations: fetchOperations,
    getApiErrorMessage
  }
}

import { ref, computed } from 'vue'
import api, { getApiErrorMessage } from '../api/client'

export const defaultRealizationSteps = [
  { step: 1, key: 'received', title: 'Request logged', desc: 'Client request received by dispatch.' },
  { step: 2, key: 'review', title: 'Review & planning', desc: 'Team reviews scope and plans the job.' },
  { step: 3, key: 'assigned', title: 'Operator assigned', desc: 'A field technician is assigned.' },
  { step: 4, key: 'in_progress', title: 'In progress', desc: 'Work is underway on site.' },
  { step: 5, key: 'completed', title: 'Completed', desc: 'Service finished and handed over.' },
]

const servicesConfig = ref([])
const serviceRequests = ref([])
const isLoading = ref(false)
const detailLoading = ref(false)
const error = ref(null)
let lastFetchMode = null

export function useServices() {
  const availableServices = computed(() => {
    return servicesConfig.value.filter((s) => s.enabled)
  })

  async function fetchServices(admin = false) {
    try {
      isLoading.value = true
      error.value = null
      const url = admin ? '/admin/services' : '/services'
      const response = await api.get(url)
      servicesConfig.value = response.data.data || []
      lastFetchMode = admin ? 'admin' : 'public'
      return servicesConfig.value
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load services')
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchServiceById(id) {
    if (!id) return null
    try {
      detailLoading.value = true
      error.value = null
      const response = await api.get(`/services/${id}`)
      const service = response.data
      upsertService(service)
      return service
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load service')
      return null
    } finally {
      detailLoading.value = false
    }
  }

  function upsertService(service) {
    if (!service?.id && !service?.slug) return
    const key = service.id || service.slug
    const index = servicesConfig.value.findIndex(
      (s) => s.id === key || s.slug === key || String(s.id_service) === String(service.id_service)
    )
    if (index !== -1) {
      servicesConfig.value[index] = { ...servicesConfig.value[index], ...service }
    } else {
      servicesConfig.value.push(service)
    }
  }

  async function fetchServiceRequests() {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.get('/service-requests')
      serviceRequests.value = response.data.data || []
      return serviceRequests.value
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load service requests')
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function reloadServices(options = {}) {
    const tasks = [fetchServices(!!options.admin)]
    if (options.withRequests !== false && localStorage.getItem('ea_token')) {
      tasks.push(fetchServiceRequests())
    }
    await Promise.all(tasks)
  }

  function getServiceById(id) {
    return servicesConfig.value.find(
      (s) => s.id === id || s.slug === id || String(s.id_service) === String(id)
    ) || null
  }

  async function toggleServiceEnabled(serviceId) {
    const srv = getServiceById(serviceId)
    if (!srv) return null
    const key = srv.slug || srv.id || srv.id_service
    try {
      const response = await api.patch(`/admin/services/${key}`, { enabled: !srv.enabled })
      const updated = response.data.service
      const index = servicesConfig.value.findIndex(
        (s) => s.id === srv.id || s.id_service === srv.id_service
      )
      if (index !== -1) servicesConfig.value[index] = updated
      return updated
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to update service')
      return null
    }
  }

  async function updateService(serviceId, data) {
    const srv = getServiceById(serviceId)
    if (!srv) {
      error.value = 'Service not found in catalog'
      return null
    }
    const key = srv.slug || srv.id || srv.id_service
    try {
      const response = await api.patch(`/admin/services/${key}`, {
        title: data.title,
        startingPrice: data.startingPrice,
        estimatedDuration: data.estimatedDuration,
        desc: data.desc,
        enabled: data.enabled,
        category: data.category,
        bullets: data.bullets,
        icon: data.icon,
      })
      const updated = response.data.service
      const index = servicesConfig.value.findIndex(
        (s) => s.id === srv.id || s.id_service === srv.id_service
      )
      if (index !== -1) servicesConfig.value[index] = updated
      return updated
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to update service')
      return null
    }
  }

  async function createService(data) {
    try {
      const response = await api.post('/admin/services', {
        title: data.title,
        category: data.category || 'General',
        desc: data.desc || data.description || '',
        startingPrice: data.startingPrice || '',
        estimatedDuration: data.estimatedDuration || '',
        enabled: data.enabled !== false,
        icon: data.icon || 'installation',
        bullets: data.bullets || [],
      })
      const created = response.data.service
      servicesConfig.value.push(created)
      return { success: true, service: created }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to create service')
      return { success: false, error: error.value }
    }
  }

  async function deleteService(serviceId) {
    const srv = getServiceById(serviceId)
    if (!srv) return false
    try {
      await api.delete(`/admin/services/${srv.id}`)
      servicesConfig.value = servicesConfig.value.filter((s) => s.id !== srv.id)
      return true
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to delete service')
      return false
    }
  }

  async function createServiceRequest(data) {
    try {
      const response = await api.post('/service-requests', {
        service_id: data.serviceId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        city: data.city,
        address: data.address,
        notes: data.notes,
        preferredDate: data.preferredDate,
      })
      const created = response.data.request
      serviceRequests.value.unshift(created)
      return created
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to submit service request')
      throw err
    }
  }

  async function acceptAndAssignRequest(requestId, operatorId) {
    try {
      const response = await api.patch(`/service-requests/${requestId}`, {
        id_operator: operatorId,
        status: 'accepted',
      })
      const updated = response.data.request
      const index = serviceRequests.value.findIndex((r) => r.id === requestId || r.id_service_request === requestId)
      if (index !== -1) serviceRequests.value[index] = updated
      return updated
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to assign request')
      return null
    }
  }

  async function rejectServiceRequest(requestId, notes = '') {
    try {
      const response = await api.patch(`/service-requests/${requestId}`, {
        status: 'rejected',
        notes,
      })
      const updated = response.data.request
      const index = serviceRequests.value.findIndex((r) => r.id === requestId || r.id_service_request === requestId)
      if (index !== -1) serviceRequests.value[index] = updated
      return updated
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to reject request')
      return null
    }
  }

  async function updateRequestPhase(requestId, newPhase, notes = '') {
    try {
      const response = await api.patch(`/service-requests/${requestId}`, {
        current_phase: Number(newPhase),
        notes,
      })
      const updated = response.data.request
      const index = serviceRequests.value.findIndex((r) => r.id === requestId || r.id_service_request === requestId)
      if (index !== -1) serviceRequests.value[index] = updated
      return updated
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to update phase')
      return null
    }
  }

  function getRequestsForClient(email) {
    if (!email) return serviceRequests.value
    return serviceRequests.value.filter(
      (r) => (r.clientEmail || '').toLowerCase() === email.toLowerCase()
    )
  }

  function getRequestsForOperator(operatorId) {
    if (!operatorId) return []
    return serviceRequests.value.filter(
      (r) => String(r.assignedOperatorId) === String(operatorId)
    )
  }

  function getRequestSteps(req) {
    const steps = Array.isArray(req?.realizationSteps) ? req.realizationSteps : []
    if (steps.length) {
      return [...steps].sort((a, b) => Number(a.step) - Number(b.step))
    }
    return defaultRealizationSteps
  }

  function getPhaseLabel(req, phase = null) {
    const stepNum = Number(phase ?? req?.currentPhase ?? 1)
    const found = getRequestSteps(req).find((s) => Number(s.step) === stepNum)
    return found?.title || `Step ${stepNum}`
  }

  function getPhaseDesc(req, phase = null) {
    const stepNum = Number(phase ?? req?.currentPhase ?? 1)
    const found = getRequestSteps(req).find((s) => Number(s.step) === stepNum)
    return found?.desc || ''
  }

  return {
    servicesConfig,
    serviceRequests,
    availableServices,
    isLoading,
    detailLoading,
    error,
    getServiceById,
    toggleServiceEnabled,
    updateService,
    createService,
    deleteService,
    createServiceRequest,
    acceptAndAssignRequest,
    rejectServiceRequest,
    updateRequestPhase,
    getRequestsForClient,
    getRequestsForOperator,
    getRequestSteps,
    getPhaseLabel,
    getPhaseDesc,
    fetchServices,
    fetchServiceById,
    fetchServiceRequests,
    reloadServices,
    defaultRealizationSteps,
  }
}

export const defaultServices = []

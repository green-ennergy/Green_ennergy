import { ref } from 'vue'
import api, { getApiErrorMessage } from '../api/client'

const buildProductFormData = (data, { imageFiles = [], documentUploads = [] } = {}) => {
  const formData = new FormData()
  const clearable = new Set([
    'description',
    'climate_info',
    'highlights',
    'specs',
    'product_key',
    'existing_images',
    'existing_documents',
  ])

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return
    if (value === '' && !clearable.has(key)) return
    formData.append(key, value)
  })

  imageFiles.forEach((file, index) => {
    if (file) formData.append(`images[${index}]`, file)
  })

  documentUploads.forEach((doc, index) => {
    if (!doc?.file) return
    formData.append(`document_names[${index}]`, doc.name || '')
    formData.append(`document_files[${index}]`, doc.file)
  })

  return formData
}

const stats = ref(null)
const rfqs = ref([])
const projects = ref([])
const products = ref([])
const users = ref([])
const isLoading = ref(false)
const error = ref(null)

export function useAdmin() {
  const fetchStats = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.get('/admin/stats')
      stats.value = response.data
      return stats.value
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load dashboard stats')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchRfqs = async (filters = {}) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.get('/admin/rfq', { params: filters })
      rfqs.value = response.data.data || response.data
      return response.data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load RFQ orders')
      return []
    } finally {
      isLoading.value = false
    }
  }

  const updateRfqStatus = async (id, status) => {
    try {
      const response = await api.patch(`/admin/rfq/${id}/status`, { status })
      const index = rfqs.value.findIndex(r => r.id === id)
      if (index !== -1) {
        rfqs.value[index] = response.data.rfq
      }
      return response.data.rfq
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to update RFQ status')
      return null
    }
  }


  const fetchProjects = async (filters = {}) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.get('/admin/projects', { params: filters })
      projects.value = response.data.data || response.data
      return response.data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load projects')
      return []
    } finally {
      isLoading.value = false
    }
  }


  const updateProject = async (id, data) => {
    try {
      const response = await api.patch(`/admin/projects/${id}`, data)
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = response.data.project
      }
      return response.data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to update project')
      return null
    }
  }


  const fetchProjectMessages = async (id) => {
    try {
      const response = await api.get(`/admin/projects/${id}/messages`)
      return response.data.messages || []
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load messages')
      return []
    }
  }

  const postProjectMessage = async (id, body) => {
    const response = await api.post(`/admin/projects/${id}/messages`, { body })
    return response.data.message
  }

  const fetchProjectTraces = async (id) => {
    try {
      const response = await api.get(`/admin/projects/${id}/traces`)
      return response.data.traces || []
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load activity log')
      return []
    }
  }


  const fetchQuotes = async () => {
    try {
      const response = await api.get('/admin/quotes')
      return response.data.data || []
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load quotes')
      return []
    }
  }

  const createProject = async (data) => {
    try {
      error.value = null
      const response = await api.post('/admin/projects', data)
      projects.value.unshift(response.data.project)
      return { success: true, project: response.data.project }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to create project')
      return { success: false, error: error.value }
    }
  }


  const deleteProject = async (id) => {
    try {
      await api.delete(`/admin/projects/${id}`)
      projects.value = projects.value.filter(p => p.id !== id)
      return { success: true }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to delete project')
      return { success: false, error: error.value }
    }
  }


  const fetchProducts = async (filters = {}) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.get('/admin/products', { params: filters })
      products.value = response.data.data || response.data.products || response.data
      if (!Array.isArray(products.value)) {
        products.value = []
      }
      return response.data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load products')
      return []
    } finally {
      isLoading.value = false
    }
  }


  const updateProduct = async (id, data, media = {}) => {
    try {
      const payload = buildProductFormData(data, media)
      // Multipart bodies are unreliable with PATCH; use POST + method spoofing
      payload.append('_method', 'PATCH')
      const response = await api.post(`/admin/products/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = response.data.product
      }
      return { success: true, product: response.data.product }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to update product')
      return { success: false, error: error.value }
    }
  }


  const createProduct = async (data, media = {}) => {
    try {
      error.value = null
      const payload = buildProductFormData(data, media)
      const response = await api.post('/admin/products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      products.value.unshift(response.data.product)
      return { success: true, product: response.data.product }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to create product')
      return { success: false, error: error.value }
    }
  }


  const deleteProduct = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`)
      products.value = products.value.filter(p => p.id !== id)
      return { success: true }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to delete product')
      return { success: false, error: error.value }
    }
  }


  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      return response.data
    } catch (err) {
      return []
    }
  }

  const createCategory = async (data) => {
    try {
      error.value = null
      const response = await api.post('/admin/categories', data)
      return { success: true, category: response.data.category }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to create category')
      return { success: false, error: error.value }
    }
  }

  
  const fetchUsers = async (filters = {}) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.get('/admin/clients', { params: filters })
      users.value = response.data.users || []
      return response.data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load users')
      return []
    } finally {
      isLoading.value = false
    }
  }

  const quoteRfq = async (id, payload) => {
    try {
      error.value = null
      const response = await api.post(`/admin/rfq/${id}/quote`, payload)
      const index = rfqs.value.findIndex(r => r.id === id)
      if (index !== -1) {
        rfqs.value[index] = response.data.rfq
      }
      return { success: true, rfq: response.data.rfq }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to send quote')
      return { success: false, error: error.value }
    }
  }

  return {
    stats,
    rfqs,
    projects,
    products,
    users,
    isLoading,
    error,
    fetchStats,
    fetchRfqs,
    updateRfqStatus,
    fetchProjects,
    updateProject,
    fetchProjectTraces,
    fetchProjectMessages,
    postProjectMessage,
    fetchQuotes,
    createProject,
    deleteProject,
    fetchProducts,
    updateProduct,
    createProduct,
    deleteProduct,
    fetchCategories,
    createCategory,
    fetchUsers,
    quoteRfq
  }
}

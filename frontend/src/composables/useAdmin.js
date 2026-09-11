import { ref } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ea_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const getApiErrorMessage = (err, fallback) => {
  const data = err.response?.data
  if (!data) return fallback
  if (data.errors) {
    const first = Object.values(data.errors).flat()[0]
    if (first) return first
  }
  return data.message || fallback
}

const buildProductFormData = (data, imageFile) => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return
    formData.append(key, value)
  })
  if (imageFile) {
    formData.append('image', imageFile)
  }
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


  const fetchProjectTraces = async (id) => {
    try {
      const response = await api.get(`/admin/projects/${id}/traces`)
      return response.data.traces || []
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load activity log')
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
      products.value = response.data.data || response.data
      return response.data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to load products')
      return []
    } finally {
      isLoading.value = false
    }
  }


  const updateProduct = async (id, data, imageFile = null) => {
    try {
      const payload = buildProductFormData(data, imageFile)
      const response = await api.patch(`/admin/products/${id}`, payload, {
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


  const createProduct = async (data, imageFile = null) => {
    try {
      error.value = null
      const payload = buildProductFormData(data, imageFile)
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

  
  const fetchUsers = async (filters = {}) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.get('/admin/users', { params: filters })
      users.value = response.data.data || response.data
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
    createProject,
    deleteProject,
    fetchProducts,
    updateProduct,
    createProduct,
    deleteProduct,
    fetchCategories,
    fetchUsers,
    quoteRfq
  }
}

import { ref } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ea_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const projects = ref([])
const isLoading = ref(false)
const error = ref(null)

export function useProjects() {
  const fetchProjects = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await api.get('/projects')
      projects.value = response.data.data || response.data
      return projects.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch projects'
      console.error('Fetch projects error:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getProjectById = async (id) => {
    try {
      isLoading.value = true
      const response = await api.get(`/projects/${id}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch project'
      console.error('Fetch project error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    getProjectById
  }
}

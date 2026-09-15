import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ea_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(err, fallback) {
  const data = err.response?.data
  if (!data) return fallback
  if (data.errors) {
    const first = Object.values(data.errors).flat()[0]
    if (first) return first
  }
  return data.message || fallback
}

export default api

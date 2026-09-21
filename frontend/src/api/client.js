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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = String(error.config?.url || '')
      const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register')
      if (!isAuthCall && typeof window !== 'undefined') {
        localStorage.removeItem('ea_token')
        localStorage.removeItem('ea_user')
        if (!window.location.pathname.startsWith('/login')) {
          const redirect = encodeURIComponent(window.location.pathname + window.location.search)
          window.location.assign(`/login?redirect=${redirect}`)
        }
      }
    }
    return Promise.reject(error)
  }
)

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

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
})

export function trackPageVisit(path) {
  api.post('/analytics/visit', { path }).catch(() => {})
}

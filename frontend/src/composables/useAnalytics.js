import api from '../api/client'

export function trackPageVisit(path) {
  api.post('/analytics/visit', { path }).catch(() => {})
}

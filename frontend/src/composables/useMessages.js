import { ref } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ea_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const messages = ref([])
const sakContact = ref(null)
const isLoading = ref(false)
const error = ref(null)

export function useMessages() {
  const fetchSakContact = async () => {
    try {
      const response = await api.get('/messages/contact')
      sakContact.value = response.data.contact
      return sakContact.value
    } catch {
      return null
    }
  }

  const fetchMessages = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.get('/messages')
      messages.value = response.data.data || response.data
      return messages.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load messages'
      return []
    } finally {
      isLoading.value = false
    }
  }

  const sendMessage = async (content, recipientId = null) => {
    try {
      isLoading.value = true
      error.value = null
      const payload = { content }
      if (recipientId) payload.recipient_id = recipientId
      const response = await api.post('/messages', payload)
      messages.value.unshift(response.data.message)
      return { success: true, message: response.data.message }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to send message'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const markRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`)
      const msg = messages.value.find(m => m.id === id)
      if (msg) msg.read = true
    } catch {
      /* ignore */
    }
  }

  return {
    messages,
    sakContact,
    isLoading,
    error,
    fetchSakContact,
    fetchMessages,
    sendMessage,
    markRead
  }
}

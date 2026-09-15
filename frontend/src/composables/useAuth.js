import { ref, computed } from 'vue'
import api, { getApiErrorMessage } from '../api/client'

const storedUser = localStorage.getItem('ea_user') ?? localStorage.getItem('ea_b2b_user')
if (storedUser && !localStorage.getItem('ea_user') && localStorage.getItem('ea_b2b_user')) {
  localStorage.setItem('ea_user', storedUser)
  localStorage.removeItem('ea_b2b_user')
}
const user = ref(JSON.parse(storedUser || 'null'))
const rfqTickets = ref([])
const token = ref(localStorage.getItem('ea_token') || null)
const isLoading = ref(false)
const error = ref(null)

export function useAuth() {
  const isLoggedIn = computed(() => user.value !== null && token.value !== null)
  const isAdmin = computed(() => {
    const role = user.value?.role
    return role === 'administrator' || role === 'admin'
  })

  const registerUser = async (name, company, phone, email, password) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.post('/auth/register', {
        name,
        company,
        phone,
        email,
        password,
        password_confirmation: password
      })

      user.value = response.data.user
      token.value = response.data.token
      localStorage.setItem('ea_user', JSON.stringify(response.data.user))
      localStorage.setItem('ea_token', response.data.token)
      
      return { success: true, user: response.data.user }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Registration failed')
      console.error('Registration error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const loginUser = async (email, password) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password
      })

      user.value = response.data.user
      token.value = response.data.token
      localStorage.setItem('ea_user', JSON.stringify(response.data.user))
      localStorage.setItem('ea_token', response.data.token)
      
      return { success: true, user: response.data.user }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Invalid email or password.')
      console.error('Login error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logoutUser = async () => {
    try {
      isLoading.value = true
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      rfqTickets.value = []
      localStorage.removeItem('ea_user')
      localStorage.removeItem('ea_b2b_user')
      localStorage.removeItem('ea_token')
      isLoading.value = false
    }
  }

  const fetchRfqTickets = async () => {
    try {
      isLoading.value = true
      const response = await api.get('/rfq')
      rfqTickets.value = response.data.data || response.data
      return rfqTickets.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch RFQ tickets'
      console.error('Fetch RFQ error:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const submitRfqTicket = async (items) => {
    if (!isLoggedIn.value) {
      error.value = 'Not logged in'
      return null
    }
    
    try {
      isLoading.value = true
      error.value = null
      
      const response = await api.post('/rfq', { items })
      const newTicket = response.data.rfq
      rfqTickets.value.unshift(newTicket)
      
      return newTicket
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create RFQ'
      console.error('Submit RFQ error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateTicketStatus = async (ticketId, nextStatus) => {
    try {
      isLoading.value = true
      const response = await api.patch(`/rfq/${ticketId}/status`, {
        status: nextStatus
      })
      
      const index = rfqTickets.value.findIndex(t => t.id === ticketId)
      if (index !== -1) {
        rfqTickets.value[index] = response.data.rfq
      }
      
      return response.data.rfq
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update RFQ status'
      console.error('Update status error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (data) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await api.patch('/me', data)
      user.value = response.data.user
      localStorage.setItem('ea_user', JSON.stringify(response.data.user))

      return { success: true, user: response.data.user }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to update profile')
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const confirmRfqQuote = async (ticketId) => {
    try {
      isLoading.value = true
      const response = await api.post(`/rfq/${ticketId}/confirm`)
      const index = rfqTickets.value.findIndex(t => t.id === ticketId)
      if (index !== -1) {
        rfqTickets.value[index] = response.data.rfq
      }
      return { success: true, rfq: response.data.rfq, project: response.data.project }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Failed to confirm quote')
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    rfqTickets,
    token,
    isLoading,
    error,
    registerUser,
    loginUser,
    logoutUser,
    updateProfile,
    submitRfqTicket,
    updateTicketStatus,
    fetchRfqTickets,
    confirmRfqQuote
  }
}


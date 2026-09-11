import { ref, computed } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
})

// Add token to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ea_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const quoteItems = ref([])
const isQuoteOpen = ref(false)
const isLoading = ref(false)
const error = ref(null)

export function useCart() {
  const totalItems = computed(() => {
    return quoteItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const addToQuote = (product, qty = 1) => {
    const existing = quoteItems.value.find(item => item.product.id === product.id)
    if (existing) {
      if (existing.quantity + qty <= product.stock) {
        existing.quantity += qty
      } else {
        existing.quantity = product.stock
      }
    } else {
      quoteItems.value.push({ product, quantity: qty })
    }
    isQuoteOpen.value = true
  }

  const removeFromQuote = (item) => {
    quoteItems.value = quoteItems.value.filter(i => i.product.id !== item.product.id)
  }

  const increaseQty = (item) => {
    if (item.quantity < item.product.stock) {
      item.quantity++
    }
  }

  const decreaseQty = (item) => {
    if (item.quantity > 1) {
      item.quantity--
    } else {
      removeFromQuote(item)
    }
  }

  const clearQuote = () => {
    quoteItems.value = []
  }

  const submitQuote = async () => {
    try {
      isLoading.value = true
      error.value = null

      const items = quoteItems.value.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))

      const response = await api.post('/rfq', { items })
      
      clearQuote()
      isQuoteOpen.value = false
      
      return { success: true, rfq: response.data.rfq }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to submit quote'
      console.error('Submit quote error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const openQuote = () => {
    isQuoteOpen.value = true
  }

  const closeQuote = () => {
    isQuoteOpen.value = false
  }

  return {
    quoteItems,
    isQuoteOpen,
    totalItems,
    isLoading,
    error,
    addToQuote,
    removeFromQuote,
    increaseQty,
    decreaseQty,
    clearQuote,
    openQuote,
    closeQuote,
    submitQuote
  }
}

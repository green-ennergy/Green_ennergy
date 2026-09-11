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

const products = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const isLoading = ref(false)
const error = ref(null)

export function useProducts() {
  const fetchProducts = async (filters = {}) => {
    try {
      isLoading.value = true
      error.value = null

      const params = {
        per_page: filters.perPage || 50,
        ...filters
      }

      const response = await api.get('/products', { params })
      products.value = response.data.data || response.data
      return products.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch products'
      console.error('Fetch products error:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      isLoading.value = true
      const response = await api.get('/categories')
      categories.value = response.data
      return categories.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      console.error('Fetch categories error:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getProductById = async (id) => {
    try {
      isLoading.value = true
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch product'
      console.error('Fetch product error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const searchProducts = (query) => {
    return fetchProducts({ search: query })
  }

  const filterByCategory = (categoryId) => {
    selectedCategory.value = categoryId
    return fetchProducts({ category_id: categoryId })
  }

  const sortProducts = (sortBy) => {
    return fetchProducts({ sort: sortBy })
  }

  return {
    products,
    categories,
    selectedCategory,
    isLoading,
    error,
    fetchProducts,
    fetchCategories,
    getProductById,
    searchProducts,
    filterByCategory,
    sortProducts
  }
}

<template>
  <div class="store-page">
    <section class="store-hero">
      <div class="container">
        <h1>{{ t('store.heroTitle') }}</h1>
        <p>{{ t('store.heroSubtitle') }}</p>
      </div>
    </section>

    <main class="container store-main">
      <div class="store-toolbar">
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="t('store.search')"
          class="search-input"
        />

        <div class="toolbar-row">
          <div class="category-tabs">
            <button
              v-for="cat in categoryTabs"
              :key="cat.id ?? 'all'"
              class="tab-btn"
              :class="{ active: selectedCategory === cat.id }"
              @click="selectedCategory = cat.id"
            >
              {{ cat.name }}
            </button>
          </div>

          <div class="toolbar-actions">
            <select v-model="sortBy" class="sort-select">
              <option value="popular">{{ t('store.sortPopular') }}</option>
              <option value="rating-desc">{{ t('store.sortRating') }}</option>
              <option value="capacity-desc">{{ t('store.sortCapacity') }}</option>
              <option value="weight-asc">{{ t('store.sortWeight') }}</option>
            </select>

            <button class="quote-btn" @click="isQuoteOpen = true">
              {{ t('store.myQuote') }}
              <span v-if="totalItems" class="quote-count">{{ totalItems }}</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="productsLoading" class="status-box">{{ t('store.loadingProducts') }}</div>
      <div v-else-if="catalogError" class="status-box error">{{ catalogError }}</div>

      <div v-else-if="filteredProducts.length === 0" class="status-box">
        <h3>{{ t('store.noProducts') }}</h3>
        <p>{{ t('store.tryAnother') }}</p>
        <button class="btn-primary" @click="resetFilters">{{ t('store.resetFilters') }}</button>
      </div>

      <div v-else class="product-grid">
        <article v-for="prod in filteredProducts" :key="prod.id" class="product-card">
          <router-link :to="`/store/${prod.id}`" class="product-image-link">
            <div class="product-image-stage">
              <img :src="resolveProductImage(prod)" :alt="prod.title" />
              <div class="image-fade" aria-hidden="true"></div>
              <span v-if="prod.category?.name" class="image-category">{{ prod.category.name }}</span>
              <span v-if="(prod.images?.length || 0) > 1" class="image-count">{{ prod.images.length }} photos</span>
              <span class="stock-badge" :class="{ low: prod.stock <= 3, out: prod.stock === 0 }">
                {{ prod.stock === 0 ? t('store.outOfStock') : t('store.inStock', { n: prod.stock }) }}
              </span>
            </div>
          </router-link>

          <div class="product-body">
            <span class="product-category">{{ prod.category?.name }}</span>
            <h2>
              <router-link :to="`/store/${prod.id}`">{{ prod.title }}</router-link>
            </h2>
            <p class="product-desc">{{ truncate(prod.description, 100) }}</p>

            <div class="product-meta">
              <span>★ {{ prod.rating }}</span>
              <button type="button" class="link-btn" @click="openQuickView(prod)">{{ t('store.quickView') }}</button>
            </div>

            <button
              class="btn-primary full"
              :disabled="prod.stock <= 0"
              @click="addToQuote(prod)"
            >
              {{ prod.stock <= 0 ? t('store.outOfStock') : t('store.addToQuote') }}
            </button>
          </div>
        </article>
      </div>
    </main>

    <!-- Quote drawer -->
    <div class="overlay" :class="{ open: isQuoteOpen }" @click="isQuoteOpen = false"></div>
    <aside class="quote-drawer" :class="{ open: isQuoteOpen }">
      <header class="drawer-head">
        <div>
          <h3>{{ t('store.yourQuote') }}</h3>
          <p>{{ t('store.reviewItems') }}</p>
        </div>
        <button class="icon-btn" @click="isQuoteOpen = false">×</button>
      </header>

      <div class="drawer-body">
        <div v-if="!quoteItems.length" class="drawer-empty">
          <p>{{ t('store.emptyQuote') }}</p>
        </div>

        <ul v-else class="quote-list">
          <li v-for="item in quoteItems" :key="item.product.id" class="quote-item">
            <img :src="resolveProductImage(item.product)" :alt="item.product.title" />
            <div class="quote-item-info">
              <strong>{{ item.product.title }}</strong>
              <div class="qty-row">
                <button type="button" @click="decreaseQty(item)">−</button>
                <span>{{ item.quantity }}</span>
                <button type="button" @click="increaseQty(item)">+</button>
              </div>
            </div>
            <button type="button" class="remove-btn" @click="removeFromQuote(item)">{{ t('store.remove') }}</button>
          </li>
        </ul>

        <form v-if="quoteItems.length" @submit.prevent="handleQuoteSubmit" class="quote-form">
          <p v-if="isLoggedIn" class="signed-in">{{ t('store.signedInAs', { company: user.company }) }}</p>
          <p v-else class="hint">{{ t('store.signInHint') }}</p>
          <p v-if="quoteError" class="form-error">{{ quoteError }}</p>
          <button type="submit" class="btn-primary full" :disabled="isSubmitting">
            {{ isSubmitting ? t('store.submitting') : isLoggedIn ? t('store.submitQuote') : t('store.signInSubmit') }}
          </button>
        </form>
      </div>
    </aside>

    <!-- Quick view -->
    <div v-if="quickViewProduct" class="overlay open" @click.self="closeQuickView">
      <div class="modal">
        <button class="icon-btn modal-close" @click="closeQuickView">×</button>
        <div class="modal-grid">
          <img :src="resolveProductImage(quickViewProduct)" :alt="quickViewProduct.title" class="modal-image" />
          <div>
            <span class="product-category">{{ quickViewProduct.category?.name }}</span>
            <h2>{{ quickViewProduct.title }}</h2>
            <p>{{ truncate(quickViewProduct.description, 180) }}</p>
            <ul class="spec-list">
              <li v-for="(val, key) in quickViewProduct.highlights" :key="key">
                <span>{{ key }}</span> <strong>{{ val }}</strong>
              </li>
            </ul>
            <div class="modal-actions">
              <button class="btn-primary" @click="addToQuote(quickViewProduct); closeQuickView()">
                {{ t('store.addToQuote') }}
              </button>
              <router-link :to="`/store/${quickViewProduct.id}`" class="btn-secondary" @click="closeQuickView">
                {{ t('store.viewDetails') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success -->
    <div v-if="showSuccessModal" class="overlay open">
      <div class="modal success-modal">
        <div class="success-icon">✓</div>
        <h2>{{ t('store.quoteSubmitted') }}</h2>
        <p v-if="lastSubmittedRfq">{{ t('store.reference') }} <strong>{{ lastSubmittedRfq.ticket_number }}</strong></p>
        <button class="btn-primary" @click="closeSuccessModal">{{ t('store.goDashboard') }}</button>
      </div>
    </div>

    <!-- Auth -->
    <div v-if="showAuthModal" class="overlay open auth-overlay" @click.self="showAuthModal = false">
      <div class="modal auth-modal">
        <button class="icon-btn modal-close" @click="showAuthModal = false">×</button>
        <h2>{{ authTab === 'login' ? t('auth.signInTitle') : t('auth.registerTitle') }}</h2>
        <p class="hint">{{ t('store.signInToSubmit') }}</p>

        <div class="auth-tabs">
          <button :class="{ active: authTab === 'login' }" @click="authTab = 'login'">{{ t('auth.signInTitle') }}</button>
          <button :class="{ active: authTab === 'register' }" @click="authTab = 'register'">{{ t('auth.registerTitle') }}</button>
        </div>

        <form @submit.prevent="handleAuthSubmit" class="auth-form">
          <p v-if="authError" class="form-error">{{ authError }}</p>

          <label v-if="authTab === 'register'">
            {{ t('auth.fullName') }}
            <input v-model="authForm.name" required />
          </label>
          <label v-if="authTab === 'register'">
            {{ t('auth.company') }}
            <input v-model="authForm.company" required />
          </label>
          <label v-if="authTab === 'register'">
            {{ t('auth.phone') }}
            <input v-model="authForm.phone" type="tel" required :placeholder="t('auth.phonePlaceholder')" />
          </label>
          <label>
            {{ t('auth.email') }}
            <input v-model="authForm.email" type="email" required />
          </label>
          <label>
            {{ t('auth.password') }}
            <input v-model="authForm.password" type="password" required />
            <small v-if="authTab === 'register'">{{ t('auth.passwordHint') }}</small>
          </label>

          <button type="submit" class="btn-primary full" :disabled="authSubmitting">
            {{ authSubmitting ? t('auth.pleaseWait') : t('store.continue') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'
import { isStrongPassword } from '../utils/password'
import { isValidEmail } from '../utils/email'
import { resolveProductImage } from '../utils/productImage'

const router = useRouter()
const { t } = useI18n()
const { isLoggedIn, user, loginUser, registerUser, fetchRfqTickets } = useAuth()
const { submitQuote, quoteItems, isQuoteOpen, totalItems, addToQuote, removeFromQuote, increaseQty, decreaseQty } = useCart()
const { products, fetchProducts, categories, fetchCategories, isLoading: productsLoading, error: catalogError } = useProducts()

onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
})

const selectedCategory = ref(null)
const sortBy = ref('popular')
const searchQuery = ref('')
const filterInStock = ref(false)
const quickViewProduct = ref(null)
const isSubmitting = ref(false)
const quoteError = ref('')
const showSuccessModal = ref(false)
const lastSubmittedRfq = ref(null)
const showAuthModal = ref(false)
const authTab = ref('login')
const authForm = ref({ name: '', company: '', phone: '', email: '', password: '' })
const authError = ref('')
const authSubmitting = ref(false)

const categoryTabs = computed(() => [
  { id: null, name: t('store.all') },
  ...categories.value
])

const filteredProducts = computed(() => {
  let list = [...products.value]

  if (selectedCategory.value) {
    list = list.filter(p => p.category_id === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q)
    )
  }

  if (filterInStock.value) {
    list = list.filter(p => p.stock > 0)
  }

  if (sortBy.value === 'rating-desc' || sortBy.value === 'popular') {
    list.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'capacity-desc') {
    list.sort((a, b) => (b.unit_capacity || 0) - (a.unit_capacity || 0))
  } else if (sortBy.value === 'weight-asc') {
    list.sort((a, b) => (a.unit_weight || 0) - (b.unit_weight || 0))
  }

  return list
})

const truncate = (text, len) => {
  if (!text) return ''
  return text.length > len ? `${text.slice(0, len)}…` : text
}

const openQuickView = (prod) => { quickViewProduct.value = prod }
const closeQuickView = () => { quickViewProduct.value = null }

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
  filterInStock.value = false
  sortBy.value = 'popular'
}

const handleQuoteSubmit = async () => {
  quoteError.value = ''
  if (!quoteItems.value.length) {
    quoteError.value = 'Add at least one product.'
    return
  }
  if (!isLoggedIn.value) {
    isQuoteOpen.value = false
    showAuthModal.value = true
    authTab.value = 'login'
    return
  }
  isSubmitting.value = true
  const result = await submitQuote()
  isSubmitting.value = false
  if (result.success) {
    lastSubmittedRfq.value = result.rfq
    try {
      await fetchRfqTickets()
    } catch (_) {
      /* quote already submitted; dashboard refresh is best-effort */
    }
    isQuoteOpen.value = false
    showSuccessModal.value = true
  } else {
    quoteError.value = result.error || 'Failed to submit quote.'
  }
}

const handleAuthSubmit = async () => {
  authError.value = ''

  if (!isValidEmail(authForm.value.email)) {
    authError.value = t('auth.invalidEmail')
    return
  }

  authSubmitting.value = true
  let result
  if (authTab.value === 'login') {
    result = await loginUser(authForm.value.email, authForm.value.password)
  } else {
    if (!authForm.value.name || !authForm.value.company || !authForm.value.phone) {
      authError.value = 'Name, company, and mobile phone are required.'
      authSubmitting.value = false
      return
    }
    const pwdErr = isStrongPassword(authForm.value.password)
    if (pwdErr) {
      authError.value = pwdErr
      authSubmitting.value = false
      return
    }
    result = await registerUser(
      authForm.value.name,
      authForm.value.company,
      authForm.value.phone.trim(),
      authForm.value.email.trim().toLowerCase(),
      authForm.value.password
    )
  }
  if (!result.success) {
    authError.value = result.error || 'Authentication failed.'
    authSubmitting.value = false
    return
  }
  const quoteResult = await submitQuote()
  authSubmitting.value = false
  if (!quoteResult.success) {
    authError.value = quoteResult.error || 'Quote submission failed.'
    showAuthModal.value = false
    isQuoteOpen.value = true
    return
  }
  lastSubmittedRfq.value = quoteResult.rfq
  try {
    await fetchRfqTickets()
  } catch (_) {
    /* quote already submitted; dashboard refresh is best-effort */
  }
  showAuthModal.value = false
  isQuoteOpen.value = false
  showSuccessModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  lastSubmittedRfq.value = null
  router.push('/dashboard')
}
</script>

<style scoped>
.store-page {
  min-height: 100vh;
  background: #f3f7f4;
  font-family: 'Outfit', sans-serif;
  padding-bottom: 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.store-hero {
  background: linear-gradient(rgba(2, 13, 7, 0.88), rgba(2, 13, 7, 0.92)), url('/login_backdrop_1779051950394.png') center/cover;
  color: #f0fdf4;
  padding: 7.5rem 0 5.5rem;
  text-align: center;
}

.store-hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.2rem, 4.5vw, 3.2rem);
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
}

.store-hero p {
  color: rgba(240, 253, 244, 0.85);
  font-size: 1.05rem;
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.6;
}

.store-main {
  margin-top: -1.5rem;
}

.store-toolbar {
  background: #fff;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.toolbar-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tab-btn {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #f9fafb;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.tab-btn.active {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.35);
  color: #15803d;
}

.toolbar-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.sort-select {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.quote-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #052e16;
  color: #f0fdf4;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.quote-count {
  background: #22c55e;
  color: #052e16;
  font-size: 0.75rem;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.product-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.product-image-link {
  position: relative;
  display: block;
  aspect-ratio: 4/3;
  background:
    linear-gradient(160deg, #eef4f0, #f8fbf9),
    repeating-linear-gradient(
      -18deg,
      rgba(22, 163, 74, 0.04) 0,
      rgba(22, 163, 74, 0.04) 8px,
      transparent 8px,
      transparent 16px
    );
  overflow: hidden;
}

.product-image-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.product-image-link img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.product-card:hover .product-image-link img {
  transform: scale(1.05);
}

.image-fade {
  position: absolute;
  inset: auto 0 0;
  height: 42%;
  background: linear-gradient(to top, rgba(5, 46, 22, 0.35), transparent);
  pointer-events: none;
}

.image-category {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  z-index: 1;
  background: rgba(255, 255, 255, 0.92);
  color: #14532d;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.image-count {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  z-index: 1;
  background: rgba(5, 46, 22, 0.72);
  color: #ecfdf5;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
}

.stock-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  box-shadow: 0 6px 14px rgba(5, 46, 22, 0.1);
}

.stock-badge.low { color: #b45309; }
.stock-badge.out { color: #b91c1c; }

.product-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.product-category {
  font-size: 0.75rem;
  font-weight: 700;
  color: #16a34a;
  text-transform: uppercase;
}

.product-body h2 {
  font-size: 1.05rem;
  line-height: 1.3;
}

.product-body h2 a {
  color: #052e16;
  text-decoration: none;
}

.product-desc {
  font-size: 0.88rem;
  color: #6b7280;
  line-height: 1.5;
  flex: 1;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.link-btn {
  background: none;
  border: none;
  color: #16a34a;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: #22c55e;
  color: #052e16;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary.full { width: 100%; }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-secondary {
  display: inline-block;
  text-align: center;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #052e16;
  font-weight: 600;
  text-decoration: none;
}

.status-box {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  color: #6b7280;
}

.status-box.error { color: #b91c1c; }

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;
  z-index: 200;
}

.overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.overlay.auth-overlay {
  z-index: 500;
}

.auth-modal {
  z-index: 510;
}

.quote-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: min(420px, 100%);
  height: 100%;
  background: #fff;
  z-index: 210;
  transform: translateX(100%);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
}

.quote-drawer.open { transform: translateX(0); }

.drawer-head {
  display: flex;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
}

.drawer-empty {
  color: #6b7280;
  text-align: center;
  padding: 2rem 0;
}

.quote-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.quote-item {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 0.75rem;
  align-items: center;
}

.quote-item img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 10px;
}

.qty-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.qty-row button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  cursor: pointer;
}

.remove-btn {
  background: none;
  border: none;
  color: #b91c1c;
  font-size: 0.8rem;
  cursor: pointer;
}

.quote-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hint, .signed-in {
  font-size: 0.88rem;
  color: #6b7280;
}

.form-error {
  color: #b91c1c;
  font-size: 0.85rem;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  width: min(720px, calc(100% - 2rem));
  max-height: 90vh;
  overflow-y: auto;
  z-index: 410;
}

.modal-close { position: absolute; top: 1rem; right: 1rem; }

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.modal-image {
  width: 100%;
  border-radius: 12px;
  aspect-ratio: 1;
  object-fit: cover;
}

.spec-list {
  list-style: none;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.88rem;
}

.spec-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.success-modal {
  text-align: center;
  width: min(400px, calc(100% - 2rem));
}

.success-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #dcfce7;
  color: #15803d;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  font-weight: 800;
}

.auth-modal h2 { margin-bottom: 0.35rem; }

.auth-tabs {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.auth-tabs button {
  flex: 1;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #f9fafb;
  cursor: pointer;
  font-weight: 600;
}

.auth-tabs button.active {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.auth-form label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.auth-form input {
  padding: 0.65rem 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.auth-form small {
  font-weight: 400;
  color: #6b7280;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

@media (max-width: 768px) {
  .modal-grid { grid-template-columns: 1fr; }
  .toolbar-row { flex-direction: column; align-items: stretch; }
}
</style>

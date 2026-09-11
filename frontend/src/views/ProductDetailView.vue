<template>
  <div v-if="loading" class="page-wrap status">Loading product...</div>

  <div v-else-if="product" class="page-wrap product-page">
    <div class="container">
      <router-link to="/store" class="back-link">← Back to store</router-link>

      <div class="product-layout">
        <div class="media-col">
          <img :src="resolveProductImage(product)" :alt="product.title" class="main-image" />
          <div v-if="product.local_onee_cert" class="cert-badge">ONEE certified</div>
        </div>

        <div class="info-col">
          <span class="category">{{ product.category?.name }}</span>
          <h1>{{ product.title }}</h1>

          <div class="meta-row">
            <span class="rating">★ {{ product.rating }}</span>
            <span class="stock" :class="{ low: product.stock <= 3, out: product.stock === 0 }">
              {{ product.stock === 0 ? 'Out of stock' : `${product.stock} available` }}
            </span>
          </div>

          <p class="description">{{ product.description }}</p>

          <ul v-if="product.highlights" class="highlights">
            <li v-for="(val, key) in product.highlights" :key="key">
              <span>{{ key }}</span>
              <strong>{{ val }}</strong>
            </li>
          </ul>

          <div class="purchase-box">
            <label>Quantity</label>
            <div class="qty-controls">
              <button type="button" @click="decreaseQty" :disabled="quantity <= 1">−</button>
              <span>{{ quantity }}</span>
              <button type="button" @click="increaseQty" :disabled="quantity >= product.stock">+</button>
            </div>
            <button
              class="btn-primary"
              :disabled="product.stock <= 0"
              @click="handleAddToQuote"
            >
              {{ addedFeedback ? 'Added to quote ✓' : 'Add to quote' }}
            </button>
            <router-link to="/store" class="btn-secondary">View my quote on store</router-link>
          </div>
        </div>
      </div>

      <section class="details-section">
        <div class="tabs">
          <button :class="{ active: activeTab === 'specs' }" @click="activeTab = 'specs'">Specifications</button>
          <button :class="{ active: activeTab === 'climate' }" @click="activeTab = 'climate'">Climate info</button>
          <button v-if="product.documents?.length" :class="{ active: activeTab === 'docs' }" @click="activeTab = 'docs'">Documents</button>
        </div>

        <div class="tab-panel">
          <table v-if="activeTab === 'specs'" class="spec-table">
            <tbody>
              <tr v-for="(val, key) in product.specs" :key="key">
                <th>{{ key }}</th>
                <td>{{ val }}</td>
              </tr>
            </tbody>
          </table>

          <p v-if="activeTab === 'climate'" class="climate-text">
            {{ product.climate_info || 'Climate information will be provided by our team.' }}
          </p>

          <ul v-if="activeTab === 'docs'" class="doc-list">
            <li v-for="doc in product.documents" :key="doc.name">
              <button type="button" @click="simulateDownload(doc.name)">
                {{ doc.name }} <small>({{ doc.size }})</small>
              </button>
            </li>
          </ul>
        </div>
      </section>

      <section v-if="relatedProducts.length" class="related-section">
        <h2>Related products</h2>
        <div class="related-grid">
          <article v-for="rel in relatedProducts" :key="rel.id" class="related-card">
            <router-link :to="`/store/${rel.id}`">
              <img :src="resolveProductImage(rel)" :alt="rel.title" />
              <h3>{{ rel.title }}</h3>
              <p>{{ rel.category?.name }}</p>
            </router-link>
          </article>
        </div>
      </section>
    </div>
  </div>

  <div v-else class="page-wrap status">
    <h2>Product not found</h2>
    <router-link to="/store" class="btn-primary">Back to store</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useProducts } from '../composables/useProducts'
import { resolveProductImage } from '../utils/productImage'

const route = useRoute()
const { getProductById, fetchProducts, products: allProducts } = useProducts()
const { addToQuote } = useCart()

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const activeTab = ref('specs')
const addedFeedback = ref(false)

const loadProduct = async (id) => {
  loading.value = true
  addedFeedback.value = false
  product.value = await getProductById(id)
  quantity.value = 1
  loading.value = false
}

onMounted(async () => {
  await fetchProducts()
  await loadProduct(route.params.id)
})

watch(() => route.params.id, (id) => {
  if (id) loadProduct(id)
})

const increaseQty = () => {
  if (product.value && quantity.value < product.value.stock) quantity.value++
}

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

const handleAddToQuote = () => {
  if (!product.value || product.value.stock <= 0) return
  addToQuote(product.value, quantity.value)
  addedFeedback.value = true
  setTimeout(() => { addedFeedback.value = false }, 2000)
}

const simulateDownload = (docName) => {
  alert(`"${docName}" will be shared after your quote is confirmed.`)
}

const relatedProducts = computed(() => {
  if (!product.value?.related_ids?.length) return []
  return allProducts.value.filter(p => product.value.related_ids.includes(p.product_key))
})
</script>

<style scoped>
.page-wrap {
  min-height: 100vh;
  background: #f3f7f4;
  font-family: 'Outfit', sans-serif;
  padding: 6rem 0 4rem;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #6b7280;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #6b7280;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover { color: #16a34a; }

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.media-col {
  position: relative;
}

.main-image {
  width: 100%;
  border-radius: 12px;
  aspect-ratio: 1;
  object-fit: cover;
  background: #eef4f0;
}

.cert-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.category {
  font-size: 0.75rem;
  font-weight: 700;
  color: #16a34a;
  text-transform: uppercase;
}

.info-col h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin: 0.35rem 0 0.75rem;
  color: #052e16;
}

.meta-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.stock.low { color: #b45309; }
.stock.out { color: #b91c1c; }

.description {
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 1.25rem;
}

.highlights {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.highlights li {
  background: #f3f7f4;
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.highlights span { color: #6b7280; font-size: 0.75rem; }

.purchase-box {
  background: #f3f7f4;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.purchase-box label {
  font-size: 0.85rem;
  font-weight: 600;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.qty-controls button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  cursor: pointer;
  font-size: 1.1rem;
}

.qty-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-primary {
  background: #22c55e;
  color: #052e16;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-secondary {
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #052e16;
  font-weight: 600;
  text-decoration: none;
}

.details-section {
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.tabs button {
  flex: 1;
  padding: 0.85rem;
  border: none;
  background: transparent;
  font-weight: 600;
  cursor: pointer;
  color: #6b7280;
}

.tabs button.active {
  color: #15803d;
  box-shadow: inset 0 -2px 0 #22c55e;
}

.tab-panel {
  padding: 1.25rem;
}

.spec-table {
  width: 100%;
  border-collapse: collapse;
}

.spec-table th,
.spec-table td {
  padding: 0.65rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  text-align: left;
  font-size: 0.9rem;
}

.spec-table th {
  width: 40%;
  color: #6b7280;
  font-weight: 600;
}

.climate-text {
  line-height: 1.7;
  color: #4b5563;
}

.doc-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.doc-list button {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #f9fafb;
  cursor: pointer;
  font-weight: 600;
}

.related-section h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #052e16;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.related-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.related-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.related-card img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
}

.related-card h3 {
  font-size: 0.95rem;
  padding: 0.75rem 0.75rem 0.25rem;
  color: #052e16;
}

.related-card p {
  padding: 0 0.75rem 0.75rem;
  font-size: 0.8rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .product-layout,
  .highlights {
    grid-template-columns: 1fr;
  }
}
</style>
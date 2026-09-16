<template>
  <div v-if="loading" class="page-wrap status">Loading product...</div>

  <div v-else-if="product" class="page-wrap product-page">
    <div class="container">
      <router-link to="/store" class="back-link">← Back to store</router-link>

      <div class="product-layout">
        <div class="media-col">
          <div class="media-stage">
            <div class="media-glow" aria-hidden="true"></div>
            <div class="media-frame">
              <img
                :src="activeProductImage"
                :alt="product.title"
                class="main-image"
                :key="activeGalleryIndex"
              />

              <div class="media-top-bar">
                <span v-if="product.category?.name" class="media-chip">{{ product.category.name }}</span>
                <span v-if="product.product_key" class="media-chip muted">{{ product.product_key }}</span>
              </div>

              <div class="media-bottom-bar">
                <span class="media-chip rating-chip" v-if="product.rating != null">★ {{ product.rating }}</span>
                <span
                  class="media-chip stock-chip"
                  :class="{ low: product.stock <= 3, out: product.stock === 0 }"
                >
                  {{ product.stock === 0 ? 'Out of stock' : `${product.stock} in stock` }}
                </span>
                <span v-if="productGallery.length > 1" class="media-chip counter-chip">
                  {{ activeGalleryIndex + 1 }} / {{ productGallery.length }}
                </span>
              </div>

              <template v-if="productGallery.length > 1">
                <button type="button" class="media-nav prev" aria-label="Previous image" @click="prevImage">‹</button>
                <button type="button" class="media-nav next" aria-label="Next image" @click="nextImage">›</button>
              </template>

              <div v-if="product.local_onee_cert" class="cert-badge">ONEE certified</div>
            </div>
          </div>

          <div v-if="productGallery.length > 1" class="gallery-thumbs">
            <button
              v-for="(src, index) in productGallery"
              :key="`${src}-${index}`"
              type="button"
              class="gallery-thumb"
              :class="{ active: activeGalleryIndex === index }"
              @click="activeGalleryIndex = index"
            >
              <img :src="src" :alt="`${product.title} ${index + 1}`" />
            </button>
          </div>

          <div v-if="quickFacts.length" class="quick-facts">
            <div v-for="fact in quickFacts" :key="fact.label" class="quick-fact">
              <span>{{ fact.label }}</span>
              <strong>{{ fact.value }}</strong>
            </div>
          </div>
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

          <ul v-if="Object.keys(displayHighlights).length" class="highlights">
            <li v-for="(val, key) in displayHighlights" :key="key">
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
          <button v-if="displayDocuments.length" :class="{ active: activeTab === 'docs' }" @click="activeTab = 'docs'">Documents</button>
        </div>

        <div class="tab-panel">
          <table v-if="activeTab === 'specs'" class="spec-table">
            <tbody>
              <tr v-if="product.product_key">
                <th>Reference</th>
                <td>{{ product.product_key }}</td>
              </tr>
              <tr v-for="(val, key) in displaySpecs" :key="key">
                <th>{{ key }}</th>
                <td>{{ val }}</td>
              </tr>
              <tr v-if="!product.product_key && !Object.keys(displaySpecs).length">
                <td colspan="2" class="empty-detail">No specifications added yet.</td>
              </tr>
            </tbody>
          </table>

          <p v-if="activeTab === 'climate'" class="climate-text">
            {{ product.climate_info || 'Climate information will be provided by our team.' }}
          </p>

          <ul v-if="activeTab === 'docs'" class="doc-list">
            <li v-for="doc in displayDocuments" :key="doc.name + (doc.path || '')">
              <a
                v-if="doc.url"
                class="doc-link"
                :href="doc.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ doc.name }} <small v-if="doc.size">({{ doc.size }})</small>
              </a>
              <button v-else type="button" @click="simulateDownload(doc.name)">
                {{ doc.name }} <small v-if="doc.size">({{ doc.size }})</small>
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
import { resolveProductImage, resolveProductImages, resolveMediaUrl } from '../utils/productImage'

const route = useRoute()
const { getProductById, fetchProducts, products: allProducts } = useProducts()
const { addToQuote } = useCart()

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const activeTab = ref('specs')
const addedFeedback = ref(false)
const activeGalleryIndex = ref(0)

const loadProduct = async (id) => {
  loading.value = true
  addedFeedback.value = false
  activeGalleryIndex.value = 0
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
  if (!product.value) return []

  if (product.value.related_ids?.length) {
    return allProducts.value.filter((p) => product.value.related_ids.includes(p.product_key))
  }

  // Fallback: other products in the same category
  return allProducts.value
    .filter((p) => p.id !== product.value.id && p.category_id === product.value.category_id)
    .slice(0, 4)
})

const asObject = (value) => {
  if (!value) return {}
  if (typeof value === 'object' && !Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return typeof parsed === 'object' && parsed && !Array.isArray(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }
  return {}
}

const displayHighlights = computed(() => asObject(product.value?.highlights))

const displaySpecs = computed(() => {
  if (!product.value) return {}
  const specs = { ...asObject(product.value.specs) }
  if (product.value.unit_capacity != null) specs.Capacity = `${product.value.unit_capacity}`
  if (product.value.unit_weight != null) specs['Weight (kg)'] = `${product.value.unit_weight}`
  if (product.value.unit_area != null) specs['Surface (m²)'] = `${product.value.unit_area}`
  return specs
})

const productGallery = computed(() => resolveProductImages(product.value))
const activeProductImage = computed(() => productGallery.value[activeGalleryIndex.value] || resolveProductImage(product.value))

const prevImage = () => {
  const total = productGallery.value.length
  if (!total) return
  activeGalleryIndex.value = (activeGalleryIndex.value - 1 + total) % total
}

const nextImage = () => {
  const total = productGallery.value.length
  if (!total) return
  activeGalleryIndex.value = (activeGalleryIndex.value + 1) % total
}

const quickFacts = computed(() => {
  if (!product.value) return []
  const facts = []
  if (product.value.unit_capacity != null) {
    facts.push({ label: 'Capacity', value: product.value.unit_capacity })
  }
  if (product.value.unit_weight != null) {
    facts.push({ label: 'Weight', value: `${product.value.unit_weight} kg` })
  }
  if (product.value.unit_area != null) {
    facts.push({ label: 'Surface', value: `${product.value.unit_area} m²` })
  }
  if (product.value.units_sold) {
    facts.push({ label: 'Sold', value: product.value.units_sold })
  }
  return facts.slice(0, 4)
})

const displayDocuments = computed(() => {
  const docs = product.value?.documents
  if (!docs) return []
  if (Array.isArray(docs)) {
    return docs.map((doc) => ({
      ...doc,
      url: resolveMediaUrl(doc.url || doc.path, ''),
    }))
  }
  if (typeof docs === 'string') {
    try {
      const parsed = JSON.parse(docs)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
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
  grid-template-columns: 1.05fr 0.95fr;
  gap: 2rem;
  background:
    radial-gradient(circle at 12% 18%, rgba(74, 222, 128, 0.12), transparent 42%),
    linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%);
  border-radius: 22px;
  padding: 1.5rem;
  border: 1px solid rgba(5, 46, 22, 0.06);
  margin-bottom: 2rem;
  box-shadow: 0 18px 40px rgba(5, 46, 22, 0.06);
}

.media-col {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.media-stage {
  position: relative;
}

.media-glow {
  position: absolute;
  inset: 12% 8% auto;
  height: 55%;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.22), transparent 70%);
  filter: blur(18px);
  pointer-events: none;
}

.media-frame {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background:
    linear-gradient(145deg, rgba(238, 244, 240, 0.95), rgba(255, 255, 255, 0.7)),
    repeating-linear-gradient(
      -18deg,
      rgba(22, 163, 74, 0.035) 0,
      rgba(22, 163, 74, 0.035) 8px,
      transparent 8px,
      transparent 16px
    );
  border: 1px solid rgba(5, 46, 22, 0.08);
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  min-height: 420px;
  max-height: 520px;
  object-fit: contain;
  padding: 1.5rem;
  transition: transform 0.35s ease, opacity 0.25s ease;
  animation: imageIn 0.35s ease;
}

.media-frame:hover .main-image {
  transform: scale(1.03);
}

@keyframes imageIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.media-top-bar,
.media-bottom-bar {
  position: absolute;
  left: 0.85rem;
  right: 0.85rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  z-index: 2;
}

.media-top-bar { top: 0.85rem; }
.media-bottom-bar { bottom: 0.85rem; }

.media-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(5, 46, 22, 0.08);
  color: #14532d;
  font-size: 0.72rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
  box-shadow: 0 6px 16px rgba(5, 46, 22, 0.08);
}

.media-chip.muted {
  color: #4b5563;
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: 0.04em;
}

.rating-chip {
  color: #a16207;
}

.stock-chip.low {
  color: #b45309;
}

.stock-chip.out {
  color: #b91c1c;
}

.counter-chip {
  margin-left: auto;
}

.media-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  color: #052e16;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(5, 46, 22, 0.12);
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.media-frame:hover .media-nav {
  opacity: 1;
}

.media-nav:hover {
  background: #ecfdf5;
}

.media-nav.prev { left: 0.75rem; }
.media-nav.next { right: 0.75rem; }

.gallery-thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.gallery-thumb {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  background: #eef4f0;
  box-shadow: 0 4px 12px rgba(5, 46, 22, 0.06);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.gallery-thumb:hover {
  transform: translateY(-2px);
}

.gallery-thumb.active {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18);
}

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quick-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
}

.quick-fact {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(5, 46, 22, 0.06);
  border-radius: 12px;
  padding: 0.7rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.quick-fact span {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
}

.quick-fact strong {
  font-size: 0.95rem;
  color: #052e16;
  font-family: 'Space Grotesk', sans-serif;
}

.cert-badge {
  position: absolute;
  top: 3.1rem;
  left: 0.85rem;
  z-index: 2;
  background: rgba(34, 197, 94, 0.16);
  color: #15803d;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(22, 163, 74, 0.2);
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

.empty-detail {
  color: #9ca3af;
  font-style: italic;
  text-align: center;
  padding: 1rem 0 !important;
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

.doc-list button,
.doc-list .doc-link {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #f9fafb;
  cursor: pointer;
  font-weight: 600;
  color: inherit;
  text-decoration: none;
  display: block;
}

.doc-list .doc-link:hover {
  border-color: rgba(34, 197, 94, 0.45);
  background: #f7fcf9;
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
  .highlights,
  .quick-facts {
    grid-template-columns: 1fr;
  }

  .media-frame,
  .main-image {
    min-height: 300px;
  }

  .media-nav {
    opacity: 1;
  }
}
</style>

<template>
  <div class="catalog-picker">
    <div class="extras-head">
      <div>
        <h4 class="extras-title">{{ t('admin.projects.additionalProducts') }}</h4>
        <p class="extras-hint">{{ t('admin.projects.additionalProductsHint') }}</p>
      </div>
      <div class="extras-head-actions">
        <strong v-if="lines.length" class="extras-total">{{ formatMoney(selectedTotal) }}</strong>
        <button
          type="button"
          class="primary-btn icon-action-btn"
          :title="t('admin.projects.addProduct')"
          :aria-label="t('admin.projects.addProduct')"
          @click="openModal"
        >
          <AdminIcon name="plus" :size="16" />
        </button>
      </div>
    </div>

    <table v-if="lines.length" class="extras-table">
      <thead>
        <tr>
          <th>{{ t('admin.marketplace.colProduct') }}</th>
          <th>{{ t('common.quantity') }}</th>
          <th>{{ t('admin.projects.unitPrice') }}</th>
          <th>{{ t('common.total') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(line, index) in lines" :key="`${line.id_product}-${index}`" :class="{ 'row-locked': line.locked }">
          <td>
            <strong class="line-title">{{ line.title || t('admin.projects.unnamedProduct') }}</strong>
            <p v-if="linePriceWarning(line)" class="price-warn">{{ linePriceWarning(line) }}</p>
          </td>
          <td>
            <input
              :value="line.quantity"
              type="number"
              min="1"
              :max="stockFor(line.id_product) || undefined"
              class="picker-input"
              :disabled="!!line.locked"
              @input="updateLine(index, 'quantity', $event.target.value)"
            />
            <span v-if="stockFor(line.id_product) != null" class="stock-cap">
              {{ t('admin.projects.stockAvailable', { count: stockFor(line.id_product) }) }}
            </span>
          </td>
          <td>
            <input
              :value="line.unit_price"
              type="number"
              min="0"
              step="0.01"
              class="picker-input"
              :disabled="!!line.locked"
              @input="updateLine(index, 'unit_price', $event.target.value)"
            />
          </td>
          <td class="line-total">{{ formatMoney(Number(line.quantity) * Number(line.unit_price)) }}</td>
          <td>
            <div class="line-actions">
              <button
                type="button"
                class="icon-btn"
                :class="{ locked: line.locked }"
                :title="line.locked ? t('admin.projects.unlockLine') : t('admin.projects.lockLine')"
                :aria-label="line.locked ? t('admin.projects.unlockLine') : t('admin.projects.lockLine')"
                @click="toggleLock(index)"
              >
                <AdminIcon :name="line.locked ? 'lock' : 'unlock'" :size="15" />
              </button>
              <button
                type="button"
                class="icon-btn danger"
                :disabled="!!line.locked"
                :title="line.locked ? t('admin.projects.unlockToEdit') : t('admin.projects.remove')"
                :aria-label="t('admin.projects.remove')"
                @click="removeLine(index)"
              >
                <AdminIcon name="trash" :size="15" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="extras-empty">{{ t('admin.projects.noAdditionalProducts') }}</p>

    <Teleport to="body">
      <div v-if="modalOpen" class="picker-modal-overlay" @click.self="closeModal">
        <div class="picker-modal" role="dialog" aria-modal="true" :aria-label="t('admin.projects.addProduct')">
          <header class="picker-modal-header">
            <div>
              <p class="picker-kicker">{{ t('admin.projects.additionalProducts') }}</p>
              <h3>{{ t('admin.projects.pickProductTitle') }}</h3>
            </div>
            <button type="button" class="close-btn" @click="closeModal">×</button>
          </header>

          <div class="picker-modal-body">
            <div class="catalog-picker-toolbar">
              <div class="search-wrap">
                <AdminIcon name="search" :size="16" />
                <input
                  v-model="search"
                  type="search"
                  :placeholder="t('admin.marketplace.searchPlaceholder')"
                  @input="debouncedRefresh"
                />
              </div>
              <select v-model="categoryId" class="filter-select" @change="emitRefresh">
                <option value="">{{ t('admin.marketplace.allCategories') }}</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
              <select v-model="stockFilter" class="filter-select">
                <option value="">{{ t('admin.marketplace.allStock') }}</option>
                <option value="in">{{ t('admin.marketplace.stockIn') }}</option>
                <option value="low">{{ t('admin.marketplace.stockLow') }}</option>
                <option value="out">{{ t('admin.marketplace.stockOut') }}</option>
              </select>
            </div>

            <div v-if="loading" class="catalog-picker-loading">{{ t('admin.marketplace.loading') }}</div>

            <div v-else-if="!filteredProducts.length" class="catalog-picker-empty">
              <p>{{ productList.length ? t('admin.marketplace.noMatch') : t('admin.marketplace.empty') }}</p>
            </div>

            <div v-else class="catalog-picker-table-wrap">
              <table class="catalog-picker-table">
                <thead>
                  <tr>
                    <th>{{ t('admin.marketplace.colProduct') }}</th>
                    <th>{{ t('admin.marketplace.colStock') }}</th>
                    <th>{{ t('common.quantity') }}</th>
                    <th>{{ t('admin.projects.unitPrice') }}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="product in filteredProducts"
                    :key="product.id"
                    :class="{ 'row-disabled': Number(product.stock) <= 0 }"
                  >
                    <td>
                      <div class="product-cell">
                        <div class="product-thumb-sm">
                          <img :src="resolveProductImage(product)" :alt="product.title" />
                        </div>
                        <div>
                          <strong>{{ product.title }}</strong>
                          <span class="product-sku">{{ product.product_key || '—' }}</span>
                          <p v-if="draftPriceWarning(product)" class="price-warn">{{ draftPriceWarning(product) }}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="stock-value" :class="stockLevelClass(product.stock)">{{ product.stock }}</span>
                    </td>
                    <td>
                      <input
                        v-model.number="draftFor(product.id).quantity"
                        type="number"
                        min="1"
                        :max="Math.max(1, Number(product.stock) || 0)"
                        class="picker-input"
                        :disabled="Number(product.stock) <= 0"
                      />
                    </td>
                    <td>
                      <input
                        v-model="draftFor(product.id).unit_price"
                        type="number"
                        min="0"
                        step="0.01"
                        class="picker-input"
                        :placeholder="t('admin.projects.unitPrice')"
                        :disabled="Number(product.stock) <= 0"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        class="primary-btn icon-action-btn"
                        :disabled="Number(product.stock) <= 0"
                        :title="t('admin.projects.addLine')"
                        :aria-label="t('admin.projects.addLine')"
                        @click="addProduct(product)"
                      >
                        <AdminIcon name="plus" :size="16" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <footer class="picker-modal-footer">
            <button type="button" class="ghost-btn" @click="closeModal">{{ t('common.close') }}</button>
          </footer>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminIcon from './AdminIcon.vue'
import { resolveProductImage } from '../../utils/productImage'
import { formatMoney } from '../../utils/rfqQuote'
import { useToast } from '../../composables/useToast'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  products: { type: [Array, Object], default: () => [] },
  categories: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  /** [{ id_product, unit_price, source: 'rfq'|'list', label? }] */
  priceReferences: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'refresh'])

const { t } = useI18n()
const toast = useToast()

const modalOpen = ref(false)
const search = ref('')
const categoryId = ref('')
const stockFilter = ref('in')
const drafts = reactive({})
const lines = ref([])
let refreshTimer = null
let syncingFromParent = false

const productList = computed(() => {
  if (Array.isArray(props.products)) return props.products
  if (Array.isArray(props.products?.data)) return props.products.data
  return []
})

const productById = computed(() => {
  const map = new Map()
  productList.value.forEach((product) => {
    map.set(Number(product.id ?? product.id_product), product)
  })
  return map
})

const filteredProducts = computed(() => {
  let list = [...productList.value]
  const query = search.value.trim().toLowerCase()

  if (query) {
    list = list.filter((product) => {
      const title = String(product.title || '').toLowerCase()
      const sku = String(product.product_key || '').toLowerCase()
      return title.includes(query) || sku.includes(query)
    })
  }

  if (categoryId.value !== '' && categoryId.value != null) {
    list = list.filter((product) => String(product.category_id) === String(categoryId.value))
  }

  if (stockFilter.value === 'in') {
    list = list.filter((product) => product.stock > 0)
  } else if (stockFilter.value === 'low') {
    list = list.filter((product) => product.stock > 0 && product.stock < 5)
  } else if (stockFilter.value === 'out') {
    list = list.filter((product) => product.stock === 0)
  }

  list = list.filter((product) => product.is_visible !== false)
  list.forEach((product) => ensureDraft(product.id))
  return list
})

const selectedTotal = computed(() =>
  lines.value.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unit_price || 0), 0)
)

function ensureDraft(productId) {
  const key = String(productId)
  if (!drafts[key]) {
    drafts[key] = { quantity: 1, unit_price: '' }
  }
  return drafts[key]
}

function draftFor(productId) {
  return ensureDraft(productId)
}

function stockFor(productId) {
  const product = productById.value.get(Number(productId))
  if (!product) return null
  return Number(product.stock)
}

function stockLevelClass(stock) {
  if (stock === 0) return 'out'
  if (stock < 5) return 'low'
  return 'ok'
}

function referenceFor(productId, excludeListPrice = false) {
  const id = Number(productId)
  const refs = (props.priceReferences || []).filter((ref) => Number(ref.id_product) === id)
  const rfq = refs.find((ref) => ref.source === 'rfq' && ref.unit_price != null)
  if (rfq) return rfq
  if (excludeListPrice) return null
  return refs.find((ref) => ref.source === 'list' && ref.unit_price != null) || null
}

function formatPriceWarning(ref, newPrice) {
  if (!ref || ref.unit_price == null || Number.isNaN(Number(newPrice))) return ''
  if (Math.abs(Number(ref.unit_price) - Number(newPrice)) <= 0.01) return ''
  const key =
    ref.source === 'rfq'
      ? 'admin.projects.priceMismatchWarnRfq'
      : 'admin.projects.priceMismatchWarnList'
  return t(key, {
    existing: formatMoney(Number(ref.unit_price)),
    current: formatMoney(Number(newPrice))
  })
}

function draftPriceWarning(product) {
  const id = Number(product?.id ?? product?.id_product)
  const draft = drafts[String(id)]
  if (!draft || draft.unit_price === '' || draft.unit_price == null) return ''
  const ref = referenceFor(id)
  return formatPriceWarning(ref, draft.unit_price)
}

function linePriceWarning(line) {
  const ref = referenceFor(line.id_product, true)
  return formatPriceWarning(ref, line.unit_price)
}

function emitRefresh() {
  emit('refresh', {
    search: search.value.trim() || undefined,
    category_id: categoryId.value || undefined
  })
}

function debouncedRefresh() {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(emitRefresh, 350)
}

function openModal() {
  modalOpen.value = true
  emitRefresh()
}

function closeModal() {
  modalOpen.value = false
}

function commitLines(next) {
  lines.value = next.map((line) => ({
    id_product: Number(line.id_product),
    title: line.title || '',
    quantity: Number(line.quantity) || 1,
    unit_price: Number(line.unit_price) || 0,
    locked: !!line.locked
  }))
  emit('update:modelValue', lines.value.map((line) => ({ ...line })))
}

function addProduct(product) {
  const id = Number(product?.id ?? product?.id_product)
  const stock = Number(product?.stock ?? 0)
  if (!id) return

  if (stock <= 0) {
    toast.error(t('admin.projects.outOfStock'))
    return
  }

  const existingLocked = lines.value.find((line) => Number(line.id_product) === id && line.locked)
  if (existingLocked) {
    toast.error(t('admin.projects.unlockToEdit'))
    return
  }

  ensureDraft(id)
  const draft = drafts[String(id)]
  const price = draft.unit_price
  if (price === '' || price == null || Number.isNaN(Number(price)) || Number(price) < 0) {
    toast.error(t('admin.projects.enterPrice'))
    return
  }

  let quantity = Number(draft.quantity) || 1
  if (quantity < 1) quantity = 1
  if (quantity > stock) {
    toast.error(t('admin.projects.qtyExceedsStock', { stock }))
    draft.quantity = stock
    return
  }

  const unitPrice = Number(price)
  const title = product.title || product.name || t('admin.projects.unnamedProduct')
  const next = lines.value.map((line) => ({ ...line }))
  const existing = next.find((line) => Number(line.id_product) === id)

  if (existing) {
    existing.quantity = quantity
    existing.unit_price = unitPrice
    existing.title = title
  } else {
    next.push({
      id_product: id,
      title,
      quantity,
      unit_price: unitPrice,
      locked: false
    })
  }

  commitLines(next)
  draft.unit_price = ''
  draft.quantity = 1
  toast.success(t('admin.projects.productAdded', { name: title }))
}

function updateLine(index, field, raw) {
  const next = lines.value.map((line) => ({ ...line }))
  if (!next[index] || next[index].locked) return

  if (field === 'quantity') {
    let qty = Number(raw) || 1
    const stock = stockFor(next[index].id_product)
    if (stock != null && qty > stock) {
      toast.error(t('admin.projects.qtyExceedsStock', { stock }))
      qty = stock
    }
    if (qty < 1) qty = 1
    next[index].quantity = qty
  } else {
    next[index].unit_price = Number(raw)
  }

  commitLines(next)
}

function toggleLock(index) {
  const next = lines.value.map((line) => ({ ...line }))
  if (!next[index]) return
  next[index].locked = !next[index].locked
  commitLines(next)
}

function removeLine(index) {
  if (lines.value[index]?.locked) {
    toast.error(t('admin.projects.unlockToEdit'))
    return
  }
  const next = lines.value.map((line) => ({ ...line }))
  next.splice(index, 1)
  commitLines(next)
}

function resetFilters() {
  search.value = ''
  categoryId.value = ''
  stockFilter.value = 'in'
}

watch(
  () => props.modelValue,
  (value) => {
    if (syncingFromParent) return
    const incoming = Array.isArray(value) ? value : []
    const same =
      incoming.length === lines.value.length &&
      incoming.every((line, index) => {
        const current = lines.value[index]
        return (
          current &&
          Number(current.id_product) === Number(line.id_product) &&
          Number(current.quantity) === Number(line.quantity) &&
          Number(current.unit_price) === Number(line.unit_price) &&
          String(current.title || '') === String(line.title || '') &&
          !!current.locked === !!line.locked
        )
      })
    if (same) return
    syncingFromParent = true
    lines.value = incoming.map((line) => ({
      id_product: Number(line.id_product),
      title: line.title || '',
      quantity: Number(line.quantity) || 1,
      unit_price: Number(line.unit_price) || 0,
      locked: !!line.locked
    }))
    syncingFromParent = false
  },
  { immediate: true, deep: true }
)

defineExpose({ resetFilters, emitRefresh, openModal, closeModal })
</script>

<style scoped>
.catalog-picker {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.extras-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.extras-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 750;
  color: #1c1917;
}

.extras-hint {
  margin: 0.25rem 0 0;
  font-size: 0.82rem;
  color: #78716c;
  max-width: 36rem;
}

.extras-head-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.extras-total {
  font-size: 0.92rem;
  color: #1c1917;
  background: #f5f5f4;
  border: 1px solid #e7e5e4;
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
}

.extras-empty {
  margin: 0;
  padding: 0.85rem 0;
  color: #78716c;
  font-size: 0.88rem;
}

.extras-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  background: #fff;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  overflow: hidden;
}

.extras-table th,
.extras-table td {
  padding: 0.65rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}

.extras-table th {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #78716c;
  background: #f8faf9;
}

.extras-table tr:last-child td {
  border-bottom: none;
}

.line-title {
  display: block;
  color: #052e16;
}

.line-total {
  font-weight: 700;
  white-space: nowrap;
}

.stock-cap {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.72rem;
  color: #78716c;
}

.price-warn {
  margin: 0.2rem 0 0;
  font-size: 0.68rem;
  line-height: 1.25;
  font-weight: 500;
  color: #a16207;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
}

.picker-input {
  width: 100%;
  min-width: 72px;
  border: 1px solid rgba(5, 46, 22, 0.12);
  border-radius: 8px;
  padding: 0.45rem 0.55rem;
  font: inherit;
  background: #fff;
}

.picker-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(28, 25, 23, 0.45);
}

.picker-modal {
  width: min(920px, 100%);
  max-height: min(88vh, 820px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.picker-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid #e7e5e4;
}

.picker-kicker {
  margin: 0 0 0.2rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #15803d;
}

.picker-modal-header h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #1c1917;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #57534e;
}

.picker-modal-body {
  padding: 1rem 1.25rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.picker-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 0.85rem 1.25rem 1.1rem;
  border-top: 1px solid #e7e5e4;
}

.catalog-picker-toolbar {
  display: grid;
  grid-template-columns: minmax(180px, 1.6fr) repeat(2, minmax(120px, 1fr));
  gap: 0.55rem;
  align-items: center;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(5, 46, 22, 0.12);
  background: #fff;
  border-radius: 10px;
  padding: 0 0.75rem;
}

.search-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.65rem 0;
  font: inherit;
  min-width: 0;
}

.search-wrap input:focus {
  outline: none;
}

.filter-select {
  width: 100%;
  border: 1px solid rgba(5, 46, 22, 0.12);
  background: #fff;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font: inherit;
}

.catalog-picker-table-wrap {
  max-height: min(48vh, 420px);
  overflow: auto;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  background: #fff;
}

.catalog-picker-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.catalog-picker-table th,
.catalog-picker-table td {
  padding: 0.65rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.catalog-picker-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f8faf9;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #57534e;
}

.catalog-picker-table tr.row-disabled {
  opacity: 0.55;
}

.product-cell {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  min-width: 0;
}

.product-thumb-sm {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f5f4;
  flex-shrink: 0;
}

.product-thumb-sm img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-cell strong {
  display: block;
  color: #052e16;
}

.product-sku {
  display: block;
  font-size: 0.75rem;
  color: #78716c;
}

.stock-value.ok { color: #15803d; font-weight: 700; }
.stock-value.low { color: #d97706; font-weight: 700; }
.stock-value.out { color: #dc2626; font-weight: 700; }

.picker-add-btn {
  white-space: nowrap;
  padding: 0.45rem 0.75rem;
  font-size: 0.82rem;
}

.icon-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  padding: 0;
  border-radius: 10px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid #e7e5e4;
  border-radius: 8px;
  background: #fff;
  color: #57534e;
  cursor: pointer;
}

.icon-btn:hover {
  background: #fafaf9;
  border-color: #d6d3d1;
}

.icon-btn.danger {
  color: #b91c1c;
}

.icon-btn.danger:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-btn.locked {
  color: #15803d;
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.line-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.extras-table tr.row-locked td {
  background: #fafaf9;
}

.picker-input:disabled {
  background: #f5f5f4;
  color: #78716c;
  cursor: not-allowed;
}

.catalog-picker-loading,
.catalog-picker-empty {
  padding: 1.25rem;
  text-align: center;
  color: #57534e;
  border: 1px dashed #d6d3d1;
  border-radius: 12px;
  background: #fafaf9;
}

@media (max-width: 900px) {
  .catalog-picker-toolbar {
    grid-template-columns: 1fr;
  }
}
</style>

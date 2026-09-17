<template>
  <div class="catalog-picker">
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
      <select v-model="visibilityFilter" class="filter-select">
        <option value="">{{ t('admin.marketplace.allVisibility') }}</option>
        <option value="visible">{{ t('admin.marketplace.onlyVisible') }}</option>
        <option value="hidden">{{ t('admin.marketplace.onlyHidden') }}</option>
      </select>
    </div>

    <div v-if="loading" class="catalog-picker-loading">{{ t('admin.marketplace.loading') }}</div>

    <div v-else-if="!filteredProducts.length" class="catalog-picker-empty">
      <p>{{ products.length ? t('admin.marketplace.noMatch') : t('admin.marketplace.empty') }}</p>
      <p class="catalog-picker-hint">{{ products.length ? t('admin.marketplace.tryFilters') : t('admin.marketplace.createFirst') }}</p>
    </div>

    <div v-else class="catalog-picker-table-wrap">
      <table class="catalog-picker-table">
        <thead>
          <tr>
            <th>{{ t('admin.marketplace.colProduct') }}</th>
            <th>{{ t('admin.marketplace.colCategory') }}</th>
            <th>{{ t('admin.marketplace.colStock') }}</th>
            <th>{{ t('common.quantity') }}</th>
            <th>{{ t('admin.projects.unitPrice') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id" :class="{ 'row-hidden': product.is_visible === false }">
            <td class="col-product">
              <div class="product-cell">
                <div class="product-thumb-sm">
                  <img :src="resolveProductImage(product)" :alt="product.title" />
                </div>
                <div>
                  <strong>{{ product.title }}</strong>
                  <span class="product-sku">{{ product.product_key || '—' }}</span>
                </div>
              </div>
            </td>
            <td><span class="category-chip">{{ product.category?.name || '—' }}</span></td>
            <td><span class="stock-value" :class="stockLevelClass(product.stock)">{{ product.stock }}</span></td>
            <td>
              <input
                v-model.number="draftFor(product.id).quantity"
                type="number"
                min="1"
                class="picker-input"
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
              />
            </td>
            <td>
              <button type="button" class="primary-btn picker-add-btn" @click="addProduct(product)">
                {{ t('admin.projects.addLine') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modelValue.length" class="catalog-picker-cart">
      <h4>{{ t('admin.projects.selectedProducts') }}</h4>
      <ul class="line-list">
        <li v-for="(line, index) in modelValue" :key="line.id_product">
          <span>{{ line.title }}</span>
          <input v-model.number="line.quantity" type="number" min="1" />
          <input v-model.number="line.unit_price" type="number" min="0" step="0.01" />
          <strong>{{ formatMoney(Number(line.quantity) * Number(line.unit_price)) }}</strong>
          <button type="button" class="ghost-btn" @click="removeLine(index)">{{ t('admin.projects.remove') }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminIcon from './AdminIcon.vue'
import { resolveProductImage } from '../../utils/productImage'
import { formatMoney } from '../../utils/rfqQuote'
import { useToast } from '../../composables/useToast'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  products: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'refresh'])

const { t } = useI18n()
const toast = useToast()

const search = ref('')
const categoryId = ref('')
const stockFilter = ref('')
const visibilityFilter = ref('visible')
const rowDrafts = ref({})
let refreshTimer = null

const filteredProducts = computed(() => {
  let list = [...props.products]
  const query = search.value.trim().toLowerCase()

  if (query) {
    list = list.filter((product) => {
      const title = String(product.title || '').toLowerCase()
      const sku = String(product.product_key || '').toLowerCase()
      return title.includes(query) || sku.includes(query)
    })
  }

  if (categoryId.value) {
    list = list.filter((product) => String(product.category_id) === String(categoryId.value))
  }

  if (stockFilter.value === 'in') {
    list = list.filter((product) => product.stock > 0)
  } else if (stockFilter.value === 'low') {
    list = list.filter((product) => product.stock > 0 && product.stock < 5)
  } else if (stockFilter.value === 'out') {
    list = list.filter((product) => product.stock === 0)
  }

  if (visibilityFilter.value === 'visible') {
    list = list.filter((product) => product.is_visible !== false)
  } else if (visibilityFilter.value === 'hidden') {
    list = list.filter((product) => product.is_visible === false)
  }

  return list
})

function draftFor(productId) {
  if (!rowDrafts.value[productId]) {
    rowDrafts.value[productId] = { quantity: 1, unit_price: '' }
  }
  return rowDrafts.value[productId]
}

function stockLevelClass(stock) {
  if (stock === 0) return 'out'
  if (stock < 5) return 'low'
  return 'ok'
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

function addProduct(product) {
  const draft = draftFor(product.id)
  const price = draft.unit_price
  if (price === '' || Number(price) < 0) {
    toast.error(t('admin.projects.enterPrice'))
    return
  }

  const next = [...props.modelValue]
  const existing = next.find((line) => Number(line.id_product) === product.id)
  if (existing) {
    existing.quantity = Number(draft.quantity) || 1
    existing.unit_price = Number(price)
  } else {
    next.push({
      id_product: product.id,
      title: product.title,
      quantity: Number(draft.quantity) || 1,
      unit_price: Number(price)
    })
  }

  emit('update:modelValue', next)
  draft.unit_price = ''
  draft.quantity = 1
}

function removeLine(index) {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
}

function resetFilters() {
  search.value = ''
  categoryId.value = ''
  stockFilter.value = ''
  visibilityFilter.value = 'visible'
  rowDrafts.value = {}
}

watch(
  () => props.products,
  () => {
    rowDrafts.value = {}
  }
)

defineExpose({ resetFilters, emitRefresh })
</script>

<style scoped>
.catalog-picker {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.catalog-picker-toolbar {
  display: grid;
  grid-template-columns: minmax(180px, 1.4fr) repeat(3, minmax(120px, 1fr));
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
  max-height: min(42vh, 420px);
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

.catalog-picker-table tr:last-child td {
  border-bottom: none;
}

.catalog-picker-table tr.row-hidden {
  opacity: 0.72;
}

.product-cell {
  display: flex;
  align-items: center;
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

.category-chip {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: #f5f5f4;
  font-size: 0.78rem;
  color: #57534e;
}

.stock-value.ok { color: #15803d; font-weight: 700; }
.stock-value.low { color: #d97706; font-weight: 700; }
.stock-value.out { color: #dc2626; font-weight: 700; }

.picker-input {
  width: 100%;
  min-width: 72px;
  border: 1px solid rgba(5, 46, 22, 0.12);
  border-radius: 8px;
  padding: 0.45rem 0.55rem;
  font: inherit;
}

.picker-add-btn {
  white-space: nowrap;
  padding: 0.45rem 0.75rem;
  font-size: 0.82rem;
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

.catalog-picker-hint {
  margin: 0.35rem 0 0;
  font-size: 0.82rem;
  color: #78716c;
}

.catalog-picker-cart h4 {
  margin: 0 0 0.55rem;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #15803d;
}

.line-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.line-list li {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) 0.55fr 0.75fr auto auto;
  gap: 0.45rem;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  background: #fafaf9;
}

@media (max-width: 900px) {
  .catalog-picker-toolbar {
    grid-template-columns: 1fr 1fr;
  }

  .line-list li {
    grid-template-columns: 1fr;
  }
}
</style>

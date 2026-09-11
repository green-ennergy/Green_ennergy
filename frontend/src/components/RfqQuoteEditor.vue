<template>
  <div class="quote-editor">
    <div class="editor-head">
      <div>
        <h4>{{ t('rfq.editor.title') }}</h4>
        <p>{{ t('rfq.editor.subtitle') }}</p>
      </div>
      <div class="editor-total">
        <span>{{ t('rfq.editor.draftTotal') }}</span>
        <strong>{{ formatMoney(draftTotal) }}</strong>
      </div>
    </div>

    <div class="quote-table-wrap">
      <table class="quote-table">
        <thead>
          <tr>
            <th>{{ t('common.description') }}</th>
            <th>{{ t('rfq.editor.type') }}</th>
            <th>{{ t('common.quantity') }}</th>
            <th>{{ t('rfq.editor.unitPrice') }}</th>
            <th>{{ t('rfq.editor.lineTotal') }}</th>
            <th v-if="editable"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(line, index) in lines" :key="lineKey(line, index)">
            <td>
              <input
                v-if="editable && !line.is_catalog"
                v-model="line.label"
                type="text"
                class="cell-input"
                :placeholder="t('rfq.editor.placeholder')"
                required
              />
              <span v-else class="line-label">{{ line.label }}</span>
            </td>
            <td>
              <select
                v-if="editable && !line.is_catalog"
                v-model="line.item_type"
                class="cell-select"
              >
                <option v-for="type in manualTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
              <span v-else class="type-chip">{{ typeLabel(line.item_type) }}</span>
            </td>
            <td>
              <input
                v-if="editable"
                v-model.number="line.quantity"
                type="number"
                min="1"
                class="cell-input qty"
              />
              <span v-else>{{ line.quantity }}</span>
            </td>
            <td>
              <input
                v-if="editable"
                v-model.number="line.unit_price"
                type="number"
                min="0"
                step="0.01"
                class="cell-input price"
                placeholder="0.00"
              />
              <span v-else>{{ formatMoney(line.unit_price) }}</span>
            </td>
            <td class="line-total">{{ formatMoney(lineTotal(line)) }}</td>
            <td v-if="editable">
              <button
                v-if="!line.is_catalog"
                type="button"
                class="remove-btn"
                :title="t('rfq.editor.removeLine')"
                @click="$emit('remove-line', index)"
              >
                ×
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="lines.length">
          <tr>
            <td :colspan="editable ? 4 : 4" class="total-label">{{ t('rfq.editor.totalMad') }}</td>
            <td class="total-value">{{ formatMoney(draftTotal) }}</td>
            <td v-if="editable"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="editable" class="editor-actions">
      <div class="add-row">
        <select v-model="newLineType" class="type-picker">
          <option v-for="type in manualTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
        <button type="button" class="ghost-btn" @click="addLine">{{ t('rfq.editor.addLine') }}</button>
      </div>
      <button type="button" class="primary-btn" :disabled="saving" @click="$emit('save')">
        {{ saving ? t('rfq.editor.sending') : t('rfq.editor.sendQuote') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from '../composables/useLocale'
import {
  getRfqItemTypes,
  rfqItemTypeLabel,
  createManualQuoteLine,
  draftQuoteTotal,
  formatMoney
} from '../utils/rfqQuote'

const props = defineProps({
  lines: { type: Array, required: true },
  editable: { type: Boolean, default: true },
  saving: { type: Boolean, default: false }
})

defineEmits(['remove-line', 'save'])

const { t } = useI18n()
const { locale } = useLocale()

const newLineType = ref('installation')

const manualTypes = computed(() => {
  locale.value
  return getRfqItemTypes().filter(type => type.value !== 'product')
})

const draftTotal = computed(() => draftQuoteTotal(props.lines))

const lineKey = (line, index) => line.id || `new-${index}-${line.label}`

const lineTotal = (line) => {
  const price = Number(line.unit_price)
  const qty = Number(line.quantity)
  if (!price || !qty) return 0
  return price * qty
}

const typeLabel = (value) => rfqItemTypeLabel(value)

const addLine = () => {
  props.lines.push(createManualQuoteLine(newLineType.value))
}
</script>

<style scoped>
.quote-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.editor-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.editor-head h4 {
  margin: 0;
  font-size: 0.95rem;
  color: #052e16;
}

.editor-head p {
  margin: 0.25rem 0 0;
  font-size: 0.82rem;
  color: #6b7280;
}

.editor-total {
  text-align: right;
}

.editor-total span {
  display: block;
  font-size: 0.72rem;
  color: #6b7280;
}

.editor-total strong {
  font-size: 1.1rem;
  color: #052e16;
}

.quote-table-wrap {
  overflow-x: auto;
}

.quote-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.quote-table th,
.quote-table td {
  padding: 0.55rem 0.45rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.quote-table th {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
}

.cell-input,
.cell-select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.35rem 0.45rem;
  font: inherit;
}

.cell-input.qty {
  max-width: 4rem;
}

.cell-input.price {
  max-width: 6rem;
}

.line-label {
  font-weight: 600;
  color: #111827;
}

.type-chip {
  font-size: 0.72rem;
  font-weight: 700;
  color: #166534;
  background: #ecfdf5;
  border-radius: 999px;
  padding: 0.15rem 0.45rem;
}

.line-total {
  font-weight: 700;
  color: #052e16;
}

.remove-btn {
  border: none;
  background: #fee2e2;
  color: #b91c1c;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.total-label {
  text-align: right;
  font-weight: 700;
  color: #374151;
}

.total-value {
  font-weight: 800;
  color: #052e16;
}

.editor-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
}

.add-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.type-picker {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.4rem 0.55rem;
  font: inherit;
}

.ghost-btn,
.primary-btn {
  border-radius: 10px;
  padding: 0.55rem 0.85rem;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.ghost-btn {
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
}

.primary-btn {
  border: none;
  background: #052e16;
  color: #fff;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

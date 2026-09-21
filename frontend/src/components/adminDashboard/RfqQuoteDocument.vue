<template>
  <div class="quote-document">
    <header class="sheet-header">
      <div class="brand">
        <strong>Energy Agency</strong>
        <span>{{ t('rfq.document.tagline') }}</span>
      </div>
      <div class="doc-meta">
        <h1>{{ t('rfq.document.title') }}</h1>
        <p class="ticket">{{ rfq.ticket_number }}</p>
        <p>{{ formatDate(rfq.created_at) }}</p>
      </div>
    </header>

    <section class="client-block">
      <h2>{{ t('rfq.document.client') }}</h2>
      <dl class="client-fields">
        <div class="field">
          <dt>{{ t('rfq.document.name') }}</dt>
          <dd>{{ clientName }}</dd>
        </div>
        <div class="field">
          <dt>{{ t('rfq.document.email') }}</dt>
          <dd>{{ clientEmail }}</dd>
        </div>
        <div class="field">
          <dt>{{ t('rfq.document.phone') }}</dt>
          <dd>{{ clientPhone }}</dd>
        </div>
      </dl>
    </section>

    <section class="lines-block">
      <table class="quote-table">
        <thead>
          <tr>
            <th class="col-num">#</th>
            <th class="col-desc">{{ t('common.description') }}</th>
            <th class="col-qty">{{ t('common.quantity') }}</th>
            <th class="col-price">{{ t('rfq.editor.unitPrice') }}</th>
            <th class="col-total">{{ t('common.total') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rfq.items" :key="item.id || index">
            <td class="col-num">{{ index + 1 }}</td>
            <td class="col-desc">{{ rfqItemLabel(item) }}</td>
            <td class="col-qty">{{ item.quantity }}</td>
            <td class="col-price">{{ formatMoney(item.unit_price) }}</td>
            <td class="col-total">{{ formatMoney(rfqLineTotal(item)) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>{{ t('rfq.document.grandTotal') }}</span>
          <strong>{{ formatMoney(rfqQuoteTotal(rfq)) }}</strong>
        </div>
      </div>
    </section>

    <footer class="sheet-footer">
      <p>{{ t('rfq.document.legal1') }}</p>
      <p>{{ t('rfq.document.legal2') }}</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  formatDate,
  formatMoney,
  rfqItemLabel,
  rfqLineTotal,
  rfqQuoteTotal
} from '../../utils/rfqQuote'

const props = defineProps({
  rfq: { type: Object, required: true }
})

const { t } = useI18n()

const clientName = computed(() =>
  props.rfq.company_name ||
  props.rfq.user?.name ||
  props.rfq.user?.company ||
  '—'
)

const clientEmail = computed(() =>
  props.rfq.email || props.rfq.user?.email || '—'
)

const clientPhone = computed(() =>
  props.rfq.phone || props.rfq.user?.phone || '—'
)
</script>

<style scoped>
/* A4 content width ≈ 190mm at ~96dpi with ~10mm page margins */
.quote-document {
  background: #fff;
  color: #111827;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  box-sizing: border-box;
  width: 190mm;
  max-width: 190mm;
  min-height: 0;
  padding: 0;
  line-height: 1.35;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 2px solid #052e16;
  margin-bottom: 14px;
}

.brand strong {
  display: block;
  font-size: 15px;
  color: #052e16;
  letter-spacing: 0.02em;
}

.brand span {
  display: block;
  margin-top: 2px;
  font-size: 10px;
  color: #6b7280;
}

.doc-meta {
  text-align: right;
}

.doc-meta h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #052e16;
  line-height: 1.2;
}

.doc-meta .ticket {
  margin: 4px 0 0;
  font-size: 11px;
  font-weight: 700;
  color: #166534;
  letter-spacing: 0.03em;
}

.doc-meta p {
  margin: 2px 0 0;
  font-size: 10px;
  color: #6b7280;
}

.client-block {
  margin-bottom: 14px;
}

.client-block h2 {
  margin: 0 0 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
}

.client-fields {
  margin: 0;
  display: grid;
  gap: 3px;
}

.field {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 8px;
  align-items: baseline;
  font-size: 11px;
}

.field dt {
  margin: 0;
  font-weight: 700;
  color: #6b7280;
}

.field dt::after {
  content: ' :';
}

.field dd {
  margin: 0;
  color: #111827;
  font-weight: 600;
  word-break: break-word;
}

.quote-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 11px;
}

.quote-table th,
.quote-table td {
  border: 1px solid #e5e7eb;
  padding: 6px 7px;
  vertical-align: top;
}

.quote-table th {
  background: #f3f4f6;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
}

.col-num {
  width: 28px;
  text-align: center;
}

.col-desc {
  width: auto;
  word-break: break-word;
}

.col-qty {
  width: 52px;
  text-align: center;
}

.col-price,
.col-total {
  width: 88px;
  text-align: right;
  white-space: nowrap;
}

.totals {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.totals-row {
  min-width: 220px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 8px 10px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 4px;
  font-size: 12px;
  color: #052e16;
}

.totals-row strong {
  font-size: 13px;
  font-weight: 800;
}

.sheet-footer {
  margin-top: 18px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}

.sheet-footer p {
  margin: 0 0 4px;
  font-size: 9px;
  line-height: 1.4;
  color: #6b7280;
}
</style>

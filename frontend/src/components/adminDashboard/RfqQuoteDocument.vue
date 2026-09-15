<template>
  <div class="quote-document">
    <header class="sheet-header">
      <div class="brand">
        <strong>Energy Agency</strong>
        <span>{{ t('rfq.document.tagline') }}</span>
      </div>
      <div class="doc-meta">
        <h1>{{ t('rfq.document.title') }}</h1>
        <p>{{ rfq.ticket_number }}</p>
        <p>{{ formatDate(rfq.created_at) }}</p>
      </div>
    </header>

    <section class="client-block">
      <h2>{{ t('rfq.document.client') }}</h2>
      <p><strong>{{ rfq.company_name || rfq.user?.company }}</strong></p>
      <p>{{ rfq.email || rfq.user?.email }}</p>
      <p v-if="rfq.user?.phone">{{ rfq.user.phone }}</p>
    </section>

    <section class="lines-block">
      <table class="quote-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{{ t('common.description') }}</th>
            <th>{{ t('rfq.editor.type') }}</th>
            <th>{{ t('common.quantity') }}</th>
            <th>{{ t('rfq.editor.unitPrice') }}</th>
            <th>{{ t('common.total') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rfq.items" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ rfqItemLabel(item) }}</td>
            <td>{{ typeLabel(item.item_type) }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatMoney(item.unit_price) }}</td>
            <td>{{ formatMoney(rfqLineTotal(item)) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5">{{ t('rfq.document.grandTotal') }}</td>
            <td>{{ formatMoney(rfqQuoteTotal(rfq)) }}</td>
          </tr>
        </tfoot>
      </table>
    </section>

    <section class="footer-block">
      <p><strong>{{ t('rfq.document.status') }}</strong> {{ rfqStatusLabel(rfq.status) }}</p>
      <p v-if="rfq.client_confirmed"><strong>{{ t('rfq.document.clientConfirmed') }}</strong> {{ t('rfq.document.confirmed') }}</p>
      <p class="legal">{{ t('rfq.document.legal1') }}</p>
      <p class="legal">{{ t('rfq.document.legal2') }}</p>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import {
  rfqItemTypeLabel,
  formatDate,
  formatMoney,
  rfqItemLabel,
  rfqLineTotal,
  rfqQuoteTotal,
  rfqStatusLabel
} from '../../utils/rfqQuote'

defineProps({
  rfq: { type: Object, required: true }
})

const { t } = useI18n()

const typeLabel = (value) => rfqItemTypeLabel(value)
</script>

<style scoped>
.quote-document {
  background: #fff;
  color: #111827;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  padding: 24px;
  width: 794px;
  max-width: 794px;
  box-sizing: border-box;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #052e16;
  margin-bottom: 20px;
}

.brand strong {
  display: block;
  font-size: 18px;
  color: #052e16;
}

.brand span {
  font-size: 13px;
  color: #6b7280;
}

.doc-meta {
  text-align: right;
}

.doc-meta h1 {
  margin: 0;
  font-size: 22px;
  color: #052e16;
}

.doc-meta p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.client-block {
  margin-bottom: 20px;
}

.client-block h2 {
  margin: 0 0 8px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
}

.client-block p {
  margin: 2px 0;
  font-size: 14px;
}

.quote-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.quote-table th,
.quote-table td {
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  text-align: left;
}

.quote-table th {
  background: #f9fafb;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
}

.quote-table tfoot td {
  font-weight: 700;
  background: #f0fdf4;
}

.footer-block {
  margin-top: 24px;
  font-size: 13px;
  color: #374151;
}

.footer-block p {
  margin: 6px 0;
}

.legal {
  font-size: 11px;
  color: #6b7280;
}
</style>

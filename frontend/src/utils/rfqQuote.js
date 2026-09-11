import { i18n } from '../i18n'

const RFQ_ITEM_TYPE_KEYS = ['product', 'installation', 'service', 'transport', 'other']
const RFQ_STATUS_KEYS = ['review', 'engineering', 'issued', 'dispatched']

export function getRfqItemTypes() {
  return RFQ_ITEM_TYPE_KEYS.map(value => ({
    value,
    label: i18n.global.t(`rfq.itemTypes.${value}`)
  }))
}

/** @deprecated use getRfqItemTypes() */
export const RFQ_ITEM_TYPES = RFQ_ITEM_TYPE_KEYS.map(value => ({ value }))

export function getRfqStatusSteps() {
  return RFQ_STATUS_KEYS.map(key => ({
    key,
    label: i18n.global.t(`rfq.steps.${key}`)
  }))
}

/** @deprecated use getRfqStatusSteps() */
export const RFQ_STATUS_STEPS = RFQ_STATUS_KEYS.map(key => ({ key }))

export function rfqStatusLabel(status) {
  const key = `rfq.status.${status}`
  if (i18n.global.te(key)) return i18n.global.t(key)
  return status
}

export function rfqItemTypeLabel(type) {
  const key = `rfq.itemTypes.${type || 'other'}`
  if (i18n.global.te(key)) return i18n.global.t(key)
  return type || 'Other'
}

export function rfqItemLabel(item) {
  return item.display_name || item.product?.title || item.label || 'Line item'
}

export function rfqLineTotal(item) {
  if (item.line_total != null) return Number(item.line_total)
  if (item.unit_price == null) return 0
  return Number(item.unit_price) * Number(item.quantity || 0)
}

export function rfqQuoteTotal(rfq) {
  if (rfq?.quoted_total != null) return Number(rfq.quoted_total)
  return (rfq?.items || []).reduce((sum, item) => sum + rfqLineTotal(item), 0)
}

export function buildQuoteLinesFromRfq(rfq) {
  return (rfq?.items || []).map(item => ({
    id: item.id,
    label: rfqItemLabel(item),
    quantity: item.quantity,
    unit_price: item.unit_price ?? '',
    item_type: item.item_type || (item.product_id ? 'product' : 'other'),
    is_catalog: !!item.product_id
  }))
}

export function createManualQuoteLine(type = 'installation') {
  return {
    id: null,
    label: '',
    quantity: 1,
    unit_price: '',
    item_type: type,
    is_catalog: false
  }
}

export function draftQuoteTotal(lines) {
  return lines.reduce((sum, line) => {
    const price = Number(line.unit_price)
    const qty = Number(line.quantity)
    if (!price || !qty) return sum
    return sum + price * qty
  }, 0)
}

export function formatMoney(amount) {
  if (amount == null || amount === '') return '—'
  const locale = i18n.global.locale.value === 'ar' ? 'ar-MA' : 'fr-MA'
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'MAD' }).format(amount)
}

export function formatDate(iso) {
  if (!iso) return ''
  const appLocale = i18n.global.locale.value
  const dateLocale = appLocale === 'ar' ? 'ar-MA' : appLocale === 'en' ? 'en-US' : 'fr-FR'
  return new Date(iso).toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function canDownloadRfqPdf(rfq) {
  if (!rfq) return false
  if (rfq.quoted_total != null && Number(rfq.quoted_total) > 0) return true
  return (rfq.items || []).some(item => item.unit_price != null && item.unit_price !== '')
}

export function rfqPdfErrorMessage(error) {
  if (error?.message && error.message !== 'Could not generate PDF. Please try again.') {
    return error.message
  }
  return i18n.global.t('rfq.pdfError')
}

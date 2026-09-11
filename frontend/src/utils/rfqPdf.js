import { createApp, h, nextTick } from 'vue'
import RfqQuoteDocument from '../components/adminDashboard/RfqQuoteDocument.vue'

export function rfqPdfFilename(rfq) {
  const ticket = (rfq?.ticket_number || 'quote').replace(/[^\w.-]+/g, '-')
  return `${ticket}-devis.pdf`
}

import { canDownloadRfqPdf } from './rfqQuote'

export async function downloadRfqQuotePdf(rfq) {
  if (!canDownloadRfqPdf(rfq)) {
    throw new Error('This quote has not been priced yet.')
  }

  const host = document.createElement('div')
  host.style.position = 'fixed'
  host.style.left = '-10000px'
  host.style.top = '0'
  host.style.zIndex = '-1'
  document.body.appendChild(host)

  const app = createApp({
    render: () => h(RfqQuoteDocument, { rfq })
  })

  app.mount(host)
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 150))

  const element = host.firstElementChild
  if (!element) {
    app.unmount()
    host.remove()
    throw new Error('Could not render quote document.')
  }

  try {
    const html2pdf = (await import('html2pdf.js')).default
    await html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: rfqPdfFilename(rfq),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save()
  } finally {
    app.unmount()
    host.remove()
  }
}

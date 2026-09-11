const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '')

export function resolveProductImage(product, fallback = '/store_panel_1779052677623.png') {
  const src = product?.image_url || product?.image
  if (!src) return fallback

  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }

  if (src.startsWith('/storage/')) {
    return `${API_BASE}${src}`
  }

  if (src.startsWith('products/')) {
    return `${API_BASE}/storage/${src}`
  }

  return src
}

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '')

export function resolveMediaUrl(src, fallback = '') {
  if (!src) return fallback

  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:')) {
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

export function resolveProductImage(product, fallback = '/store_panel_1779052677623.png') {
  const firstGallery = product?.images?.[0]
  const src = firstGallery?.url || product?.image_url || product?.image
  return resolveMediaUrl(src, fallback)
}

export function resolveProductImages(product, fallback = '/store_panel_1779052677623.png') {
  if (product?.images?.length) {
    return product.images.map((img) => resolveMediaUrl(img.url || img.path, fallback))
  }

  const single = resolveProductImage(product, '')
  return single ? [single] : [fallback]
}

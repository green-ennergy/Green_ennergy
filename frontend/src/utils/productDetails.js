/**
 * Convert { Key: Value } objects to editable textarea lines: "Key: Value"
 */
export function objectToLines(value) {
  if (!value) return ''
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return objectToLines(parsed)
    } catch {
      return value
    }
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object') {
          const key = item.name || item.label || item.key
          const val = item.value ?? item.size ?? ''
          return key ? `${key}: ${val}` : ''
        }
        return ''
      })
      .filter(Boolean)
      .join('\n')
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${val}`)
      .join('\n')
  }
  return ''
}

/**
 * Parse "Key: Value" lines into an object
 */
export function linesToObject(text) {
  if (!text?.trim()) return null
  const result = {}
  text.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return
    const idx = trimmed.indexOf(':')
    if (idx === -1) {
      result[trimmed] = ''
      return
    }
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim()
    if (key) result[key] = val
  })
  return Object.keys(result).length ? result : null
}

/**
 * Parse "Name | Size" or "Name: Size" lines into documents array
 */
export function linesToDocuments(text) {
  if (!text?.trim()) return []
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sep = line.includes('|') ? '|' : ':'
      const idx = line.indexOf(sep)
      if (idx === -1) return { name: line, size: '' }
      return {
        name: line.slice(0, idx).trim(),
        size: line.slice(idx + 1).trim(),
      }
    })
    .filter((doc) => doc.name)
}

export function documentsToLines(docs) {
  if (!docs?.length) return ''
  return docs
    .map((doc) => {
      if (typeof doc === 'string') return doc
      return doc.size ? `${doc.name} | ${doc.size}` : doc.name
    })
    .join('\n')
}

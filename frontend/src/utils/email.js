/**
 * Practical email check: requires user@domain.tld
 * Rejects incomplete hosts like "aaa@aaa" or "aa@aa".
 */
export function isValidEmail(value) {
  if (!value || typeof value !== 'string') return false
  const email = value.trim()
  if (email.length > 254) return false
  // local@label.tld — host must contain a dot; TLD at least 2 letters
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i.test(email)) return false
  const domain = email.split('@')[1] || ''
  const tld = domain.split('.').pop() || ''
  return /^[A-Z]{2,}$/i.test(tld)
}

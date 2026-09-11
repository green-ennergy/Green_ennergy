import { createI18n } from 'vue-i18n'
import en from './locales/en'
import fr from './locales/fr'
import ar from './locales/ar'

export const LOCALE_STORAGE_KEY = 'ea_locale'
export const SUPPORTED_LOCALES = ['fr', 'ar', 'en']

const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
const defaultLocale = SUPPORTED_LOCALES.includes(savedLocale) ? savedLocale : 'fr'

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: { en, fr, ar }
})

export function applyDocumentLocale(locale) {
  const isRtl = locale === 'ar'
  document.documentElement.lang = locale
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
  document.body.classList.toggle('locale-ar', isRtl)
}

applyDocumentLocale(defaultLocale)

export default i18n

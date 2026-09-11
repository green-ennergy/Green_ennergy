import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { applyDocumentLocale, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from '../i18n'

export function useLocale() {
  const { locale } = useI18n()

  const isRtl = computed(() => locale.value === 'ar')

  function setLocale(nextLocale) {
    if (!SUPPORTED_LOCALES.includes(nextLocale)) return
    locale.value = nextLocale
    localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
    applyDocumentLocale(nextLocale)
  }

  return {
    locale,
    isRtl,
    setLocale
  }
}

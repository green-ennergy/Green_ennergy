<template>
  <div class="lang-switcher" :class="variant">
    <span v-if="variant !== 'compact'" class="lang-label">{{ t('lang.label') }}</span>
    <div class="lang-options" role="group" :aria-label="t('lang.label')">
      <button
        v-for="code in locales"
        :key="code"
        type="button"
        class="lang-btn"
        :class="{ active: locale === code }"
        :aria-pressed="locale === code"
        @click="setLocale(code)"
      >
        {{ labels[code] }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES } from '../i18n'
import { useLocale } from '../composables/useLocale'

defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact'].includes(value),
  },
})

const { t } = useI18n()
const { locale, setLocale } = useLocale()

const locales = SUPPORTED_LOCALES
const labels = {
  fr: 'FR',
  ar: 'AR',
  en: 'EN',
}
</script>

<style scoped>
.lang-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.lang-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
}

.lang-options {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.15rem;
  border-radius: 999px;
  background: #f1f5f9;
}

.lang-btn {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  cursor: pointer;
  line-height: 1;
}

.lang-btn:hover {
  color: #166534;
}

.lang-btn.active {
  background: #ffffff;
  color: #15803d;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.lang-switcher.compact .lang-btn {
  padding: 0.3rem 0.45rem;
  font-size: 0.68rem;
}
</style>

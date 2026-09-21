<template>
  <section class="faq-section" id="faq">
    <div class="container">
      <div class="header text-center reveal">
        <span class="section-eyebrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          {{ t('landing.faq.eyebrow') }}
        </span>
        <h2 class="section-title">{{ t('landing.faq.title') }}</h2>
        <p class="section-desc">{{ t('landing.faq.desc') }}</p>
      </div>

      <div class="faq-container reveal" data-delay="150">
        <div 
          class="faq-item" 
          v-for="(faq, index) in faqs" 
          :key="index"
          :class="{ active: activeIndex === index }"
        >
          <button class="faq-question" @click="toggle(index)">
            {{ faq.q }}
            <span class="faq-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="plus">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="minus">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </span>
          </button>
          <div class="faq-answer">
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm, locale } = useI18n()
const activeIndex = ref(0)

const toggle = (index) => {
  activeIndex.value = activeIndex.value === index ? -1 : index
}

const faqs = computed(() => {
  void locale.value
  const items = tm('landing.faq.items')
  return Array.isArray(items) ? items : []
})
</script>

<style scoped>
.faq-section {
  background-color: var(--light);
}

.header {
  margin-bottom: 4rem;
}

.text-center { text-align: center; }

.section-title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
}

.section-desc {
  font-size: 1.05rem;
  color: var(--text-muted);
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

.faq-item:first-child {
  border-top: 1px solid rgba(0,0,0,0.08);
}

.faq-question {
  width: 100%;
  text-align: left;
  padding: 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-main);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.faq-question:hover {
  color: var(--primary-dark);
}

.faq-icon {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-dark);
  flex-shrink: 0;
}

.faq-icon svg {
  position: absolute;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.faq-icon .minus {
  opacity: 0;
  transform: rotate(-90deg);
}

.active .faq-question {
  color: var(--primary-dark);
}

.active .faq-icon .plus {
  opacity: 0;
  transform: rotate(90deg);
}

.active .faq-icon .minus {
  opacity: 1;
  transform: rotate(0);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.4s ease;
}

.active .faq-answer {
  max-height: 200px; /* arbitrary large enough value */
  padding-bottom: 1.5rem;
}

.faq-answer p {
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 1rem;
}
</style>

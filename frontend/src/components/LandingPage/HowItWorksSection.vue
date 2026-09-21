<template>
  <section class="how-it-works-section" id="how-it-works">
    <div class="container">
      <div class="header text-center">
        <span class="section-eyebrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {{ t('landing.howItWorks.eyebrow') }}
        </span>
        <h2 class="section-title">{{ t('landing.howItWorks.title') }}</h2>
        <p class="section-desc">{{ t('landing.howItWorks.desc') }}</p>
      </div>

      <div class="steps-container">
        <div class="connector-line" aria-hidden="true">
          <div class="connector-fill"></div>
        </div>

        <div
          class="step-card"
          v-for="(step, i) in steps"
          :key="step.key"
          :class="`animate-fade-up delay-${(i + 1) * 100}`"
        >
          <div class="step-number-wrap">
            <div class="step-number">{{ String(i + 1).padStart(2, '0') }}</div>
          </div>
          <div class="step-image-wrap">
            <img :src="step.image" :alt="t(`landing.howItWorks.steps.${step.key}.title`)" class="step-image" loading="lazy" />
          </div>
          <div class="step-icon" v-html="step.icon" aria-hidden="true"></div>
          <h3 class="step-title">{{ t(`landing.howItWorks.steps.${step.key}.title`) }}</h3>
          <p class="step-desc">{{ t(`landing.howItWorks.steps.${step.key}.desc`) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const steps = [
  {
    key: 'consultation',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    image: '/step_1_consultation_1779050884684.png',
  },
  {
    key: 'design',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    image: '/step_2_design_1779050897636.png',
  },
  {
    key: 'installation',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    image: '/step_3_installation_1779050913053.png',
  },
  {
    key: 'activation',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    image: '/step_4_activation_1779050928592.png',
  },
]
</script>

<style scoped>
.how-it-works-section {
  background-color: var(--bg-section-alt, #eef4f0);
  position: relative;
  overflow: hidden;
}

.how-it-works-section::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -100px;
  transform: translateY(-50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(74,222,128,0.07) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.text-center { text-align: center; }

.header {
  margin-bottom: 5rem;
}

.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
}

.section-desc {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

/* ─── Steps layout ──────────────────────────────────────── */
.steps-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
}

/* Horizontal connector line behind step numbers */
.connector-line {
  position: absolute;
  top: 36px;
  left: calc(12.5% + 36px);
  right: calc(12.5% + 36px);
  height: 2px;
  background: rgba(0,0,0,0.06);
  z-index: 0;
  overflow: hidden;
  border-radius: 1px;
}

.connector-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e, #16a34a, #4ade80);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
  opacity: 0.7;
}

@keyframes shimmer {
  from { background-position: 100% 0; }
  to   { background-position: -100% 0; }
}

/* ─── Step card ─────────────────────────────────────────── */
.step-card {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.5rem;
}

.step-number-wrap {
  position: relative;
  margin-bottom: 1.25rem;
}

.step-number {
  width: 72px;
  height: 72px;
  background: var(--bg-card);
  border: 2px solid rgba(74,222,128,0.4);
  color: #16a34a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem;
  font-weight: 800;
  box-shadow: 0 4px 16px rgba(74,222,128,0.15);
  transition: all 0.35s var(--ease-spring);
}

.step-card:hover .step-number {
  background: #22c55e;
  color: #052e16;
  border-color: #22c55e;
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(34,197,94,0.4);
}

.step-image-wrap {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.step-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.step-card:hover .step-image {
  transform: scale(1.08);
}

.step-icon {
  width: 46px;
  height: 46px;
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  margin-bottom: 1.25rem;
  transition: background 0.3s, transform 0.3s;
}

.step-card:hover .step-icon {
  background: rgba(74,222,128,0.15);
  transform: scale(1.05);
}

.step-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-main);
}

.step-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.65;
}

@media (max-width: 992px) {
  .steps-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 3.5rem 2rem;
  }

  .connector-line { display: none; }
}

@media (max-width: 640px) {
  .steps-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}
</style>

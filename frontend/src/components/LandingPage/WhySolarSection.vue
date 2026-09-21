<template>
  <section class="features-section" id="features">
    <div class="container">
      <div class="features-header text-center">
        <span class="section-eyebrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {{ t('landing.whySolar.eyebrow') }}
        </span>
        <h2 class="section-title">{{ t('landing.whySolar.title') }}</h2>
        <p class="section-desc">{{ t('landing.whySolar.desc') }}</p>
      </div>

      <div class="features-grid">
        <div class="feature-card animate-fade-up delay-100" v-for="(f, i) in features" :key="f.key" :class="`card-${i}`">
          <div class="feature-icon-wrap">
            <div class="feature-icon" v-html="f.icon" aria-hidden="true"></div>
          </div>
          <h3 class="feature-title">{{ t(`landing.whySolar.items.${f.key}.title`) }}</h3>
          <p class="feature-desc">{{ t(`landing.whySolar.items.${f.key}.desc`) }}</p>
          <div class="card-accent" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const features = [
  {
    key: 'bills',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  },
  {
    key: 'independence',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
  {
    key: 'eco',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
  },
]
</script>

<style scoped>
.features-section {
  background-color: var(--light);
  position: relative;
  overflow: hidden;
}

.features-section::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -120px;
  width: 400px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(74,222,128,0.06) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.text-center { text-align: center; }

.features-header {
  max-width: 780px;

  margin: 0 auto 4.5rem;
}

.section-title {
  font-family: 'Space Grotesk', sans-serif;

  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
  color: var(--text-main);
}

.section-desc {
  font-size: 1.05rem;
  color: var(--text-muted);
  line-height: 1.7;
}

/* ─── Grid ──────────────────────────────────────────────── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.feature-card {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem 2rem;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform 0.35s var(--ease-spring), box-shadow 0.35s ease;
  display: flex;
  flex-direction: column;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px rgba(0,0,0,0.1);
}

.feature-card:hover .card-accent {
  opacity: 1;
}

/* Subtle top gradient bar per card */
.card-0::after { background: linear-gradient(90deg, #4ade80, #22c55e); }
.card-1::after { background: linear-gradient(90deg, #22c55e, #16a34a); }
.card-2::after { background: linear-gradient(90deg, #a3e635, #4ade80); }

.feature-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 4px 4px 0 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s var(--ease-spring);
}

.feature-card:hover::after {
  transform: scaleX(1);
}

.card-accent {
  position: absolute;
  bottom: -40px;
  right: -40px;
  width: 120px;
  height: 120px;
  background: radial-gradient(ellipse, rgba(74,222,128,0.08) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.feature-icon-wrap {
  margin-bottom: 1.75rem;
}

.feature-icon {
  width: 54px;
  height: 54px;
  background: rgba(74,222,128,0.1);
  color: #16a34a;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, transform 0.3s, color 0.3s;
  border: 1px solid rgba(74,222,128,0.15);
}

.feature-card:hover .feature-icon {
  background: #4ade80;
  color: #052e16;
  transform: scale(1.08) rotate(4deg);
  box-shadow: 0 6px 20px rgba(74,222,128,0.4);
}

.feature-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-main);
}

.feature-desc {
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

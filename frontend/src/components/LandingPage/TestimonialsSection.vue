<template>
  <section class="testimonials-section" id="testimonials">
    <div class="container">
      <div class="header text-center animate-fade-up">
        <span class="section-eyebrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {{ t('landing.testimonials.eyebrow') }}
        </span>
        <h2 class="section-title">{{ t('landing.testimonials.title') }}</h2>
        <p class="section-desc">{{ t('landing.testimonials.desc') }}</p>
      </div>

      <div class="rating-banner animate-fade-up delay-100">
        <div class="rating-stars">
          <svg v-for="i in 5" :key="i" width="20" height="20" viewBox="0 0 24 24" fill="#22c55e" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <p class="rating-label"><strong>4.9/5</strong> {{ t('landing.testimonials.ratingBanner') }} <strong>200+</strong> {{ t('landing.testimonials.verified') }}</p>
      </div>

      <div class="testimonials-grid">
        <div
          class="testimonial-card"
          v-for="(item, i) in testimonials"
          :key="item.key"
          :class="`animate-fade-up delay-${(i + 1) * 100}`"
        >
          <div class="quote-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 11H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H6a1 1 0 0 1 0-2h1a2 2 0 0 0 2-2v-1a1 1 0 0 1 1-1zm9 0h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4h-1a1 1 0 0 1 0-2h1a2 2 0 0 0 2-2v-1a1 1 0 0 1 1-1z"/>
            </svg>
          </div>

          <div class="stars" :aria-label="`${item.rating} / 5`">
            <svg
              v-for="i in 5"
              :key="i"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              :fill="i <= item.rating ? '#22c55e' : 'rgba(0,0,0,0.1)'"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>

          <p class="testimonial-text">{{ t(`landing.testimonials.items.${item.key}.quote`) }}</p>

          <div class="customer-info">
            <div class="avatar" :style="{ background: item.avatarColor }">{{ item.initials }}</div>
            <div class="customer-details">
              <h4 class="customer-name">{{ item.name }}</h4>
              <p class="customer-role">{{ t(`landing.testimonials.items.${item.key}.role`) }}</p>
            </div>
            <div class="savings-badge" v-if="item.savings">{{ item.savings }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const testimonials = [
  {
    key: 'fatima',
    name: 'Fatima Zahra',
    initials: 'FZ',
    rating: 4,
    avatarColor: 'linear-gradient(135deg, #4ade80, #16a34a)',
  },
  {
    key: 'youssef',
    name: 'Youssef Alaoui',
    initials: 'YA',
    rating: 4.5,
    avatarColor: 'linear-gradient(135deg, #22c55e, #0a6629)',
  },
  {
    key: 'amira',
    name: 'Amira Benali',
    initials: 'AB',
    rating: 5,
    avatarColor: 'linear-gradient(135deg, #86efac, #15803d)',
  },
]
</script>

<style scoped>
.testimonials-section {
  background-color: var(--bg-section-alt, #eef4f0);
  position: relative;
  overflow: hidden;
}

.testimonials-section::before {
  content: '';
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(74,222,128,0.05) 0%, transparent 70%);
  pointer-events: none;
}

.text-center { text-align: center; }

.header {
  margin-bottom: 3rem;
}

.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;
}

.section-desc {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

/* ─── Rating banner ─────────────────────────────────────── */
.rating-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--bg-card);
  border: 1px solid rgba(74,222,128,0.2);
  border-radius: var(--radius-full);
  padding: 0.75rem 2rem;
  margin: 0 auto 3.5rem;
  width: fit-content;
  box-shadow: var(--shadow-sm);
}

.rating-stars {
  display: flex;
  gap: 3px;
}

.rating-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.rating-label strong { color: var(--text-main); }

/* ─── Grid ──────────────────────────────────────────────── */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* ─── Card ──────────────────────────────────────────────── */
.testimonial-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform 0.35s var(--ease-spring), box-shadow 0.35s ease;
}

.testimonial-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

/* Quote icon (decorative) */
.quote-icon {
  color: rgba(74,222,128,0.15);
  margin-bottom: 1rem;
  line-height: 1;
}

.stars {
  display: flex;
  gap: 3px;
  margin-bottom: 1.25rem;
}

.testimonial-text {
  font-size: 0.975rem;
  line-height: 1.75;
  color: var(--text-main);
  margin-bottom: 2rem;
  flex-grow: 1;
  font-style: italic;
}

/* ─── Customer info ─────────────────────────────────────── */
.customer-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(0,0,0,0.05);
  flex-wrap: wrap;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #fff;
  flex-shrink: 0;
}

.customer-details { flex: 1; }

.customer-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-main);
  margin-bottom: 2px;
}

.customer-role {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.savings-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: #16a34a;
  background: rgba(74,222,128,0.1);
  border: 1px solid rgba(74,222,128,0.25);
  padding: 3px 9px;
  border-radius: 99px;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

@media (max-width: 992px) {
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .rating-banner {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>

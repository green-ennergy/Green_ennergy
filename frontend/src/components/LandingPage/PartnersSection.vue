<template>
  <section class="partners-section" id="partners">
    <div class="container">
      <div class="partners-header">
        <h2 class="partners-title">{{ t('landing.partners.title') }}</h2>
        <p class="partners-sub">{{ t('landing.partners.sub') }}</p>
      </div>
    </div>

    <div class="marquee-wrapper" :aria-label="t('landing.partners.logosAria')">
      <div class="marquee-track" aria-hidden="true">
        <div class="partner-logo" v-for="(p, i) in [...partners, ...partners]" :key="i">
          <div class="logo-brand-box">
            <img :src="p.logo" :alt="p.name" class="brand-logo-img" />
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="partners-footer">
        <router-link to="/partners" class="partners-cta" id="partners-learn-more">
          {{ t('landing.partners.cta') }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const partners = [
  { name: 'SAMSUNG',        logo: '/logos/samsung.svg' },
  { name: 'Deye',           logo: '/logos/deye.svg' },
  { name: 'HUAWEI',         logo: '/logos/huawei.svg' },
  { name: 'LG',             logo: '/logos/lg.svg' },
  { name: 'JinkoSolar',     logo: '/logos/jinko.svg' },
  { name: 'LONGi',          logo: '/logos/longi.svg' },
  { name: 'SunPower',       logo: '/logos/sunpower.svg' },
  { name: 'Enphase',        logo: '/logos/enphase.svg' },
  { name: 'Canadian Solar', logo: '/logos/canadian.svg' },
  { name: 'SMA',            logo: '/logos/sma.svg' },
]
</script>

<style scoped>
.partners-section {
  background-color: var(--bg-section);
  padding: 5rem 0 4rem;
  overflow: hidden;
}

.partners-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.partners-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.6rem;
  letter-spacing: -0.3px;
}

.partners-sub {
  font-size: 0.95rem;
  color: var(--text-muted);
}

/* ─── Marquee ───────────────────────────────────────────── */
.marquee-wrapper {
  position: relative;
  overflow: hidden;
  padding: 1.5rem 0;
  /* Edge fade masks */
  mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
  background: var(--bg-card);
  border-top: 1px solid rgba(0,0,0,0.05);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.marquee-track {
  display: flex;
  gap: 4rem;
  width: max-content;
  animation: marquee 28s linear infinite;
}

.marquee-wrapper:hover .marquee-track {
  animation-play-state: paused;
}

.partner-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
  opacity: 0.75;
  transition: opacity 0.25s;
  cursor: default;
  flex-shrink: 0;
}

.partner-logo:hover {
  opacity: 1;
}

.logo-brand-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0.65rem 1.5rem;
  border-radius: 14px;
  height: 52px;
  min-width: 130px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.25s;
}

.partner-logo:hover .logo-brand-box {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.12);
  border-color: rgba(22, 163, 74, 0.3);
}

.brand-logo-img {
  height: 28px;
  max-width: 120px;
  object-fit: contain;
  display: block;
  filter: grayscale(15%);
  transition: filter 0.25s;
}

.partner-logo:hover .brand-logo-img {
  filter: grayscale(0%);
}

/* ─── Footer link ───────────────────────────────────────── */
.partners-footer {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.partners-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-main);
  border-bottom: 2px solid rgba(74,222,128,0.5);
  padding-bottom: 2px;
  transition: color 0.2s, border-color 0.2s;
}

.partners-cta svg {
  transition: transform 0.2s;
}

.partners-cta:hover {
  color: #16a34a;
  border-color: #4ade80;
}

.partners-cta:hover svg {
  transform: translateX(4px);
}
</style>

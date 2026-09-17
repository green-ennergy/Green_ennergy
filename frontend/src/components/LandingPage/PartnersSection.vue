<template>
  <section class="partners-section" id="partners">
    <div class="container">
      <div class="partners-header">
        <h2 class="partners-title">Trusted Equipment Partners</h2>
        <p class="partners-sub">We work only with tier-1 manufacturers to guarantee quality and longevity.</p>
      </div>
    </div>

    <!-- Marquee track (no container constraint) -->
    <div class="marquee-wrapper" aria-label="Partner logos">
      <div class="marquee-track" aria-hidden="true">
        <div class="partner-logo" v-for="(p, i) in [...partners, ...partners]" :key="i">
          <div class="logo-ph-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span class="logo-ph-title">Logo Partenaire</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="partners-footer">
        <router-link to="/partners" class="partners-cta" id="partners-learn-more">
          Learn More About Our Partners
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
const partners = [
  { name: 'Deye',      color: '#4a90e2' },
  { name: 'JinkoSolar', color: '#2e7d32' },
  { name: 'SAMSUNG',   color: '#1565c0' },
  { name: 'LG',        color: '#c62828' },
  { name: 'LONGi',     color: '#d32f2f' },
  { name: 'HUAWEI',    color: '#e53935' },
  { name: 'SunPower',  color: '#ff8f00' },
  { name: 'Enphase',   color: '#00796b' },
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

.logo-ph-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.03);
  border: 1px dashed rgba(0, 0, 0, 0.15);
  padding: 0.6rem 1.25rem;
  border-radius: 12px;
  color: var(--text-muted);
  transition: all 0.2s;
}

.partner-logo:hover .logo-ph-box {
  background: rgba(74, 222, 128, 0.08);
  border-color: #16a34a;
  color: #16a34a;
}

.logo-ph-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
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

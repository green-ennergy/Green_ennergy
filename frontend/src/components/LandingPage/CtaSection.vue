<template>
  <section class="cta-section" id="cta" aria-labelledby="cta-heading">

    <!-- Decorative elements -->
    <div class="cta-grid" aria-hidden="true"></div>
    <div class="cta-orb cta-orb-1" aria-hidden="true"></div>
    <div class="cta-orb cta-orb-2" aria-hidden="true"></div>

    <div class="cta-inner">



      <h2 class="cta-title" id="cta-heading">
        Ready to switch<br />to <span class="accent">solar</span>?
      </h2>

      <p class="cta-desc">
        Join hundreds of customers already reducing their electricity bills
        with clean, premium renewable energy from Energy Agency.
      </p>

      <!-- Trust stats row -->
      <div class="cta-stats" aria-label="Key statistics">
        <div class="cta-stat" v-for="s in stats" :key="s.label">
          <span class="cta-stat-num">{{ s.num }}</span>
          <span class="cta-stat-label">{{ s.label }}</span>
        </div>
      </div>

      <div class="cta-actions">
        <a href="#" class="cta-btn-primary" id="cta-create-account">
          Get Free Consultation
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="#" class="cta-btn-ghost" id="cta-store">Explore Store</a>
      </div>

      <p class="cta-note">No commitment required · Free site survey · Financing available</p>
    </div>
  </section>
</template>

<script setup>
const stats = [
  { num: '+500', label: 'Installations' },
  { num: '98%',  label: 'Satisfaction' },
  { num: '$0',   label: 'Hidden Fees' },
  { num: '25yr', label: 'Warranty' },
]
</script>

<style scoped>
.cta-section {
  position: relative;
  background: #020d07;
  padding: 9rem 1.5rem;
  text-align: center;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;

  color: #f0fdf4;
}

/* Grid texture */
.cta-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(34,197,94,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,197,94,0.05) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 30%, transparent 100%);
  pointer-events: none;
}

/* Glowing orbs */
.cta-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}

.cta-orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(34,197,94,0.16) 0%, transparent 70%);
  top: -180px;
  left: 50%;
  transform: translateX(-50%);
  animation: pulse-glow 7s ease-in-out infinite;
}

.cta-orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(74,222,128,0.10) 0%, transparent 70%);
  bottom: -80px;
  left: 50%;
  transform: translateX(-50%);
  animation: pulse-glow 5s ease-in-out infinite reverse;
}

/* Content */
.cta-inner {
  position: relative;
  z-index: 2;
  max-width: 720px;

  margin: 0 auto;
}

.cta-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(74,222,128,0.85);
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.18);
  padding: 5px 14px;
  border-radius: 99px;
  margin-bottom: 2rem;
}

.cta-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.2rem, 6vw, 3.5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -2px;
  color: #ffffff;
  margin: 0 0 1.25rem;
}

.accent {
  color: #4ade80;
  text-shadow: 0 0 40px rgba(74,222,128,0.5);
}

.cta-desc {
  font-size: 1rem;
  color: rgba(240,253,244,0.55);
  line-height: 1.75;
  margin: 0 0 2.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Stats row */
.cta-stats {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
  padding: 1.5rem 2rem;
  background: rgba(240,253,244,0.04);
  border: 1px solid rgba(240,253,244,0.08);
  border-radius: var(--radius-lg);
}

.cta-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.cta-stat-num {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #4ade80;
  line-height: 1;
}

.cta-stat-label {
  font-size: 0.7rem;
  color: rgba(240,253,244,0.45);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Buttons */
.cta-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #22c55e;
  color: #052e16;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 14px 30px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(34,197,94,0.35);
}

.cta-btn-primary:hover {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(34,197,94,0.5);
}

.cta-btn-primary svg { transition: transform 0.2s; }
.cta-btn-primary:hover svg { transform: translateX(3px); }

.cta-btn-ghost {
  display: inline-flex;
  align-items: center;
  background: rgba(240,253,244,0.06);
  color: rgba(240,253,244,0.8);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 14px 28px;
  border-radius: 10px;
  border: 1px solid rgba(240,253,244,0.12);
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  backdrop-filter: blur(6px);
}

.cta-btn-ghost:hover {
  border-color: rgba(240,253,244,0.28);
  color: #f0fdf4;
  background: rgba(240,253,244,0.1);
}

.cta-note {
  font-size: 0.78rem;
  color: rgba(240,253,244,0.28);
  letter-spacing: 0.01em;
}

@media (max-width: 640px) {
  .cta-stats {
    gap: 1.5rem;
    padding: 1.25rem;
  }
}
</style>
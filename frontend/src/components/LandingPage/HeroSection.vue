<template>
  <header class="hero">
    <!-- Background orbs -->
    <div class="hero-orb hero-orb-1" aria-hidden="true"></div>
    <div class="hero-orb hero-orb-2" aria-hidden="true"></div>
    <div class="hero-grid" aria-hidden="true"></div>

    <div class="hero-inner">



      <h1 class="hero-title animate-fade-up delay-100">
        Power your future<br />
        with <span class="accent">solar energy</span>
      </h1>

      <p class="hero-sub animate-fade-up delay-200">
        Save money and reduce your carbon footprint<br class="desktop-break" />
        with smart, premium renewable solutions.
      </p>

      <div class="hero-actions animate-fade-up delay-300">
        <a href="#" class="hero-btn-primary" id="hero-cta-primary">
          Get Free Consultation
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="/store" class="hero-btn-ghost" id="hero-cta-store">Explore Store</a>
      </div>

      <p class="hero-login animate-fade-up delay-400">
        <template v-if="isLoggedIn">
          <router-link :to="isAdmin ? '/admin' : '/dashboard'">
            {{ isAdmin ? t('nav.admin') : t('nav.dashboard') }}
          </router-link>
        </template>
        <template v-else>
          Already have an account?
          <router-link to="/login">{{ t('nav.signIn') }}</router-link>
        </template>
      </p>

      <!-- Trust pills -->
      <div class="hero-features animate-fade-up delay-500">
        <div class="feature-item" v-for="f in features" :key="f.label">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.3"/>
            <path d="M4.5 7l2 2 3-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ f.label }}
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <a href="#features" class="scroll-indicator animate-fade-in delay-500" aria-label="Scroll down">
      <div class="scroll-dot"></div>
    </a>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useAuth } from '../../composables/useAuth'

const { t } = useI18n()
const { isLoggedIn, isAdmin } = useAuth()

const features = [
  { label: 'No hidden fees' },
  { label: 'Certified installation' },
  { label: '100% reliable' },
  { label: '25-year warranty' },
]
</script>

<style scoped>

/* ─── Hero shell ────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #020d07;
  padding: 100px 24px 80px;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
  color: #f0fdf4;
  background-image:
    linear-gradient(rgba(2,13,7,0.72), rgba(2,13,7,0.88)),
    url('/hero_background.png');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Background decorative elements */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent);
  pointer-events: none;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}

.hero-orb-1 {
  width: 520px;
  height: 520px;
  background: radial-gradient(ellipse, rgba(74,222,128,0.14) 0%, transparent 70%);
  top: -120px;
  left: -100px;
  animation: pulse-glow 6s ease-in-out infinite;
}

.hero-orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(74,222,128,0.10) 0%, transparent 70%);
  bottom: -80px;
  right: -80px;
  animation: pulse-glow 8s ease-in-out infinite reverse;
}

/* ─── Content wrapper ───────────────────────────────────── */
.hero-inner {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 920px;

  width: 100%;
}

/* ─── Trust badge ───────────────────────────────────────── */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(74,222,128,0.9);
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.2);
  padding: 6px 14px;
  border-radius: 9999px;
  margin-bottom: 28px;
}

.badge-dot {
  width: 7px;
  height: 7px;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(74,222,128,0.7);
  animation: pulse-glow 2s ease-in-out infinite;
  flex-shrink: 0;
}

/* ─── Heading ───────────────────────────────────────────── */
.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.8rem, 7vw, 5rem);
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -3px;

  margin: 0 0 24px;
  color: #ffffff;
  text-shadow: 0 4px 32px rgba(0,0,0,0.5);
}

.accent {
  color: #4ade80;
  text-shadow: 0 0 24px rgba(74,222,128,0.18);
}

/* ─── Sub-copy ──────────────────────────────────────────── */
.hero-sub {
  font-size: 1.25rem;
  color: rgba(240,253,244,0.70);
  line-height: 1.8;
  margin: 0 0 40px;
  font-weight: 300;

}

/* ─── CTA buttons ───────────────────────────────────────── */
.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #22c55e;
  color: #052e16;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(34,197,94,0.35);
}

.hero-btn-primary:hover {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(34,197,94,0.5);
}

.hero-btn-primary svg {
  transition: transform 0.2s;
}
.hero-btn-primary:hover svg {
  transform: translateX(3px);
}

.hero-btn-ghost {
  display: inline-flex;
  align-items: center;
  background: rgba(240,253,244,0.06);
  color: rgba(240,253,244,0.8);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 14px 28px;
  border-radius: 10px;
  border: 1px solid rgba(240,253,244,0.12);
  cursor: pointer;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  backdrop-filter: blur(6px);
}

.hero-btn-ghost:hover {
  border-color: rgba(240,253,244,0.28);
  color: #f0fdf4;
  background: rgba(240,253,244,0.1);
}

/* ─── Sign-in ───────────────────────────────────────────── */
.hero-login {
  font-size: 0.8rem;
  color: rgba(240,253,244,0.3);
  margin-bottom: 44px;
}

.hero-login a {
  color: rgba(240,253,244,0.55);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.hero-login a:hover { color: #4ade80; }

/* ─── Feature pills ─────────────────────────────────────── */
.hero-features {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  padding-top: 28px;
  border-top: 1px solid rgba(240,253,244,0.07);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.78rem;
  color: rgba(240,253,244,0.45);
  font-weight: 500;
  letter-spacing: 0.01em;
}

.feature-item svg { color: #22c55e; flex-shrink: 0; }

/* ─── Scroll indicator ──────────────────────────────────── */
.scroll-indicator {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 44px;
  border: 1.5px solid rgba(240,253,244,0.2);
  border-radius: 14px;
  display: flex;
  justify-content: center;
  padding-top: 7px;
  transition: border-color 0.2s;
}

.scroll-indicator:hover { border-color: rgba(74,222,128,0.5); }

.scroll-dot {
  width: 4px;
  height: 8px;
  background: rgba(240,253,244,0.5);
  border-radius: 2px;
  animation: scrollDot 1.8s ease-in-out infinite;
}

@keyframes scrollDot {
  0%   { transform: translateY(0); opacity: 1; }
  80%  { transform: translateY(12px); opacity: 0; }
  100% { transform: translateY(0); opacity: 0; }
}

@media (max-width: 640px) {
  .hero-title { letter-spacing: -1.5px; }
  .hero-sub br.desktop-break { display: none; }
  .hero-features { gap: 16px; }
  .scroll-indicator { display: none; }
}
</style>
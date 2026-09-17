<template>
  <section class="services-section" id="services">
    <div class="container">
      <div class="header text-center animate-fade-up">

        <h2 class="section-title">Everything you need<br />for clean energy</h2>
        <p class="section-subtitle-desc">From sourcing premium equipment to installation and lifetime maintenance — we've got you covered.</p>
      </div>

      <div class="services-grid">
        <div
          class="service-card"
          v-for="(s, i) in services"
          :key="s.title"
          :class="[`service-card-${i}`, { 'featured-card': s.featured }, `animate-fade-up delay-${(i + 1) * 100}`]"
        >
          <div class="service-badge" v-if="s.featured">Most Popular</div>

          <div class="service-icon-wrap">
            <div class="service-icon" v-html="s.icon" aria-hidden="true"></div>
          </div>

          <h3 class="service-title">{{ s.title }}</h3>
          <p class="service-desc">{{ s.desc }}</p>

          <ul class="service-bullets">
            <li v-for="b in s.bullets" :key="b">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2"/>
                <path d="M4.5 7l2 2 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ b }}
            </li>
          </ul>

          <router-link :to="s.route" class="service-link" :id="`service-learn-${i}`">
            Learn more
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>

          <div class="card-glow" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  {
    title: 'Equipment Sales',
    desc: 'Premium tier-1 solar panels, inverters, and battery storage systems from our trusted manufacturing partners.',
    bullets: ['Tier-1 solar panels', 'Smart inverters', 'Battery storage', 'Competitive pricing'],
    featured: false,
    route: '/store',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>`,
  },
  {
    title: 'Installation',
    desc: 'Professional, permitted, and inspected installations by our certified in-house engineering team. Typically completed in 1-2 days.',
    bullets: ['Certified engineers', '1-2 day install', 'Permit handling', 'Grid connection'],
    featured: true,
    route: '/services/installation',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  },
  {
    title: 'Maintenance',
    desc: 'Ongoing monitoring, cleaning, and preventative maintenance to keep your system operating at peak performance year after year.',
    bullets: ['24/7 monitoring', 'Annual cleaning', 'Performance reports', '25yr warranty support'],
    featured: false,
    route: '/services/maintenance',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  },
]
</script>

<style scoped>
.services-section {
  background-color: var(--light);
  position: relative;
  overflow: hidden;
}

.services-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent);
}

.text-center { text-align: center; }

.header {
  margin-bottom: 4.5rem;
}

.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.8px;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.section-subtitle-desc {
  font-size: 1.05rem;
  color: var(--text-muted);
  max-width: 680px;

  margin: 0 auto;
  line-height: 1.7;
}

/* ─── Grid ──────────────────────────────────────────────── */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
  align-items: start;
}

/* ─── Card ──────────────────────────────────────────────── */
.service-card {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem 2rem;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.35s var(--ease-spring), box-shadow 0.35s ease;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.1);
}

/* Featured/highlighted card */
.featured-card {
  background: linear-gradient(160deg, #020d07 0%, #0a1f10 100%);
  border-color: rgba(74,222,128,0.25);
  color: #f0fdf4;
  transform: scale(1.03);
}

.featured-card:hover {
  transform: scale(1.03) translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(74,222,128,0.3);
}

.featured-card .service-title,
.featured-card .service-desc { color: #f0fdf4; }

.featured-card .service-desc { color: rgba(240,253,244,0.65); }

.featured-card .service-bullets { color: rgba(240,253,244,0.75); }

.featured-card .service-bullets li svg { color: #4ade80; }

.featured-card .service-link {
  color: #4ade80;
  border-color: rgba(74,222,128,0.4);
}

.featured-card .service-link:hover {
  color: #a7f3d0;
  border-color: #4ade80;
}

/* Featured badge */
.service-badge {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(74,222,128,0.18);
  color: #4ade80;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 99px;
  border: 1px solid rgba(74,222,128,0.3);
}

/* Glow on hover */
.card-glow {
  position: absolute;
  bottom: -60px;
  right: -60px;
  width: 180px;
  height: 180px;
  background: radial-gradient(ellipse, rgba(74,222,128,0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s;
}

.service-card:hover .card-glow { opacity: 1; }

/* ─── Icon ──────────────────────────────────────────────── */
.service-icon-wrap { margin-bottom: 1.5rem; }

.service-icon {
  width: 60px;
  height: 60px;
  background: rgba(74,222,128,0.1);
  color: #16a34a;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(74,222,128,0.18);
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

.featured-card .service-icon {
  background: rgba(74,222,128,0.15);
  color: #4ade80;
  border-color: rgba(74,222,128,0.3);
}

.service-card:hover .service-icon {
  background: #4ade80;
  color: #052e16;
  transform: scale(1.08) rotate(4deg);
  box-shadow: 0 6px 20px rgba(74,222,128,0.4);
}

/* ─── Text ──────────────────────────────────────────────── */
.service-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-main);
}

.service-desc {
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  flex-grow: 1;
}

/* ─── Bullets ───────────────────────────────────────────── */
.service-bullets {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 2rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.service-bullets li {
  display: flex;
  align-items: center;
  gap: 7px;
}

.service-bullets li svg {
  color: #22c55e;
  flex-shrink: 0;
}

/* ─── Link ──────────────────────────────────────────────── */
.service-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-main);
  border-bottom: 2px solid rgba(74,222,128,0.4);
  padding-bottom: 2px;
  transition: color 0.2s, border-color 0.2s;
  width: fit-content;
}

.service-link svg { transition: transform 0.2s; }

.service-link:hover {
  color: #16a34a;
  border-color: #4ade80;
}

.service-link:hover svg { transform: translateX(4px); }

@media (max-width: 992px) {
  .services-grid { grid-template-columns: 1fr; }
  .featured-card { transform: none; }
  .featured-card:hover { transform: translateY(-8px); }
}

@media (min-width: 993px) and (max-width: 1100px) {
  .service-card { padding: 2rem 1.5rem; }
}
</style>

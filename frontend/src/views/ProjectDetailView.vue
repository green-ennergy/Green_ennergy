<template>
  <div v-if="project" class="project-detail-view animate-fade-in">
    <!-- Header Hero -->
    <header class="project-hero" :style="{ backgroundImage: `linear-gradient(rgba(2, 13, 7, 0.8), rgba(2, 13, 7, 0.95)), url(${project.image})` }">
      <div class="container hero-container">
        <div class="hero-content">
          <span class="project-tag">{{ project.category }}</span>
          <h1 class="project-title">{{ project.title }}</h1>
          <p class="project-location">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {{ project.location }}, Morocco
          </p>
        </div>
      </div>
    </header>

    <!-- Key Metrics row -->
    <section class="metrics-section">
      <div class="container">
        <div class="metrics-grid">
          <div class="metric-card" v-for="metric in project.metrics" :key="metric.label">
            <span class="metric-val">{{ metric.value }}</span>
            <span class="metric-lbl">{{ metric.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content layout -->
    <section class="details-section">
      <div class="container">
        <div class="details-grid">
          <!-- Left Column: Story -->
          <div class="details-story">
            <h2 class="sub-title">Project Overview</h2>
            <p class="description-para">{{ project.longDesc }}</p>

            <h3 class="story-heading">The Challenge</h3>
            <p class="description-para">{{ project.challenge }}</p>

            <h3 class="story-heading">Our Engineering Solution</h3>
            <p class="description-para">{{ project.solution }}</p>
          </div>

          <!-- Right Column: Specs Sidebar -->
          <div class="details-specs">
            <div class="specs-card">
              <h3 class="specs-title">System Specifications</h3>
              <ul class="specs-list">
                <li v-for="spec in project.specs" :key="spec.name">
                  <span class="spec-name">{{ spec.name }}</span>
                  <span class="spec-value">{{ spec.value }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Bottom CTA -->
    <section class="project-cta-section">
      <div class="container text-center">
        <h2 class="cta-heading">Ready for a similar installation?</h2>
        <p class="cta-sub">Let us engineer a custom, high-yield solar setup tailored for your home or business in Morocco.</p>
        <router-link to="/#cta" class="cta-btn">Get Free Consultation</router-link>
      </div>
    </section>
  </div>
  <div v-else class="project-not-found container text-center">
    <h2>Project Not Found</h2>
    <p>The requested solar project details cannot be retrieved.</p>
    <router-link to="/" class="btn-home">Return Home</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const projectsData = {
  'modern-eco-home': {
    title: 'Modern Eco-Home',
    category: 'Residential',
    location: 'Casablanca',
    image: '/project_residential_1779051357105.png',
    longDesc: 'Located in the premium residential suburbs of Casablanca, this state-of-the-art eco-home was engineered with self-sufficiency and high aesthetics in mind. The homeowners sought to completely eliminate their heavy dependence on the Lydec grid while maintaining an advanced smart home infrastructure including underfloor climate controls and electric vehicle charging bays.',
    challenge: 'Casablanca experiences varied weather with high morning moisture followed by high summer temperatures. The concrete flat-roof layout had complex structural constraints, leaving narrow surface paths for optimal panel layouts without disrupting architectural ventilation structures.',
    solution: 'We deployed ultra-sleek, premium tier-1 double glass bifacial monocrystalline solar modules, raised on structural aerospace-grade anodized aluminum mounts angled at 30° to capture high summer midday sun and reflect ambient roof light. Coupled with a smart hybrid inverter system and premium battery backups, the residence runs entirely off-grid during peak tariff windows.',
    metrics: [
      { value: '12 kWp', label: 'Peak Capacity' },
      { value: '18,000 MAD', label: 'Est. Annual Savings' },
      { value: '26 Modules', label: 'High-Efficiency Panels' },
      { value: '5.2 Years', label: 'Payback Period' }
    ],
    specs: [
      { name: 'Solar Panels', value: '460W Double-Glass Bifacial' },
      { name: 'Inverter System', value: 'Smart Hybrid 10kW Inverter' },
      { name: 'Battery Storage', value: '15kWh Lithium Iron Phosphate' },
      { name: 'Mounting Style', value: 'Non-Penetrative Ballasted Roof Mounts' },
      { name: 'Smart Portal', value: 'Energy Agency IoT Mobile Gateway' }
    ]
  },
  'tech-campus-hq': {
    title: 'Tech Campus HQ',
    category: 'Commercial',
    location: 'Rabat',
    image: '/project_commercial_1779051372230.png',
    longDesc: 'This modern headquarters building in the tech hub of Rabat houses over 400 software engineers and severe computing operations. The corporate objective was to achieve carbon neutrality and guarantee continuous zero-downtime server operations by integrating clean, high-performance solar generation.',
    challenge: 'A massive daily base load from engineering workstations and server cabinets meant the system had to deliver high energy output. The engineering plan required seamless installation without disrupting the core operations of the company during business hours.',
    solution: 'We engineered a highly resilient 150 kWp solar array across the building\'s rooftop, integrated with a customized multi-string central commercial inverter setup. A smart real-time telemetry dashboard was integrated into the building management system, providing instantaneous load balancing and direct grid export capabilities.',
    metrics: [
      { value: '150 kWp', label: 'System Size' },
      { value: '240,000 MAD', label: 'Annual Utilities Cut' },
      { value: '326 Panels', label: 'Commercial Array Size' },
      { value: '6.4 Years', label: 'ROI Benchmark' }
    ],
    specs: [
      { name: 'Solar Panels', value: '480W Monocrystalline PERC' },
      { name: 'Inverters', value: 'Dual Commercial 75kW Smart Inverters' },
      { name: 'Battery Storage', value: 'Grid-tied (Zero Export Configured)' },
      { name: 'Structure', value: 'Elevated Rigid Steel Canopy Structures' },
      { name: 'Monitoring', value: 'BMS SCADA Telemetry System' }
    ]
  },
  'logistics-facility': {
    title: 'Logistics Facility',
    category: 'Industrial',
    location: 'Marrakech',
    image: '/project_industrial_1779051388968.png',
    longDesc: 'A colossal industrial storage and cold-chain distribution center in the Marrakech-Safi region. Given the severe ambient summer heat of Marrakech, refrigeration loads were extremely high, creating massive utility bills. We were commissioned to transform this vast rooftop into a high-capacity power station.',
    challenge: 'The massive warehouse roof is constructed from lightweight steel decking, limiting load-bearing tolerance. Marrakech experiences intense summer temperatures which can significantly degrade solar panel performance if sufficient passive cooling ventilation is not engineered.',
    solution: 'We utilized ultra-lightweight high-performance solar panels mounted on aerodynamic structural frames. The panels are elevated and strategically separated to create a massive wind-tunnel effect beneath them, maintaining low operating cell temperatures and maximizing generation. The system successfully covers 85% of the refrigeration power demand.',
    metrics: [
      { value: '500 kWp', label: 'Total Capacity' },
      { value: '850,000 MAD', label: 'Yearly Energy Savings' },
      { value: '1,040 Panels', label: 'Industrial Panel Count' },
      { value: '4.8 Years', label: 'Expected Amortization' }
    ],
    specs: [
      { name: 'Solar Modules', value: '500W High Irradiance Modules' },
      { name: 'Central Inverter', value: 'Multi-Megawatt Industrial Inverter Pack' },
      { name: 'Storage Pack', value: 'Industrial Powerpack 100kWh Backup' },
      { name: 'Mounting Style', value: 'Aerodynamic East-West Flat Roof Setup' },
      { name: 'Optimization', value: 'Automated Dust-Prevention Coatings' }
    ]
  }
}

const project = computed(() => {
  return projectsData[props.id] || null
})
</script>

<style scoped>
.project-detail-view {
  font-family: 'Outfit', sans-serif;
  color: var(--text-main);
  background-color: var(--light);
  min-height: 100vh;
}

/* ─── Hero ──────────────────────────────────────────────── */
.project-hero {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 8rem 0 6rem;
  color: var(--white);
}

.hero-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  position: relative;
  z-index: 2;
}


.hero-content {
  max-width: 800px;
}

.project-tag {
  display: inline-block;
  background: var(--primary);
  color: #020d07;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 12px;
  border-radius: 99px;
  margin-bottom: 1.25rem;
}

.project-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -2px;
  margin: 0 0 1rem;
  color: #fffdf5ff;
}

.project-location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(240,253,244,0.7);
  font-size: 1.1rem;
  font-weight: 500;
}

/* ─── Metrics ───────────────────────────────────────────── */
.metrics-section {
  background-color: var(--dark);
  padding: 3rem 0;
  position: relative;
  z-index: 5;
  box-shadow: var(--shadow-md);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.metric-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-val {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 700;
  color: var(--primary);
}

.metric-lbl {
  font-size: 0.85rem;
  color: rgba(240,253,244,0.5);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* ─── Story & Specs Layout ─────────────────────────────── */
.details-section {
  padding: 5rem 0;
}

.details-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 4rem;
}

.details-story {
  display: flex;
  flex-direction: column;
}

.sub-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-main);
}

.story-heading {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  color: var(--text-main);
}

.description-para {
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

/* Specs Card Right Column */
.details-specs {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.specs-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(0,0,0,0.06);
  padding: 2.2rem;
  box-shadow: var(--shadow-sm);
}

.specs-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-main);
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(74,222,128,0.15);
}

.specs-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.specs-list li {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spec-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.spec-value {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-main);
}



/* ─── Bottom CTA ────────────────────────────────────────── */
.project-cta-section {
  background-color: var(--light-2);
  padding: 6rem 0;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.text-center { text-align: center; }

.cta-heading {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -1px;
}

.cta-sub {
  font-size: 1.1rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
}

.cta-btn {
  display: inline-block;
  background: #22c55e;
  color: #052e16;
  font-size: 1rem;
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(34,197,94,0.3);
}

.cta-btn:hover {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(34,197,94,0.45);
}

/* ─── Project Not Found ────────────────────────────────── */
.project-not-found {
  padding: 10rem 0;
}

.project-not-found h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.project-not-found p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.btn-home {
  display: inline-block;
  background: var(--dark);
  color: var(--white);
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 992px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 2.5rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
    gap: 3.5rem;
  }
  
  .details-specs {
    order: -1;
  }
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>

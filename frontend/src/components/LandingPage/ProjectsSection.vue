<template>
  <section class="projects-section" id="projects">
    <div class="container">
      <div class="header text-center animate-fade-up">
        <span class="section-eyebrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          Our Portfolio
        </span>
        <h2 class="section-title">Recent Installations</h2>
        <p class="section-desc">See how we're transforming energy consumption across various sectors.</p>
      </div>

      <div class="projects-grid">
        <div 
          class="project-card" 
          v-for="(project, index) in projects" 
          :key="project.title"
          :data-delay="index * 150"
        >
          <div class="project-image-wrap">
            <img :src="project.image" :alt="project.title" class="project-image-placeholder" />
            <div class="project-overlay">
              <router-link :to="'/projects/' + project.id" class="view-project-btn">View Details</router-link>
            </div>
            <div class="project-tag">{{ project.category }}</div>
          </div>
          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ project.location }}
            </p>
            <div class="project-stats">
              <div class="p-stat">
                <span class="p-val">{{ project.size }}</span>
                <span class="p-lbl">System Size</span>
              </div>
              <div class="p-stat">
                <span class="p-val">{{ project.savings }}</span>
                <span class="p-lbl">Annual Savings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const projects = [
  {
    id: 'modern-eco-home',
    title: 'Modern Eco-Home',
    category: 'Residential',
    location: 'Casablanca',
    size: '12 kWp',
    savings: '18,000 MAD',
    image: '/project_residential_1779051357105.png'
  },
  {
    id: 'tech-campus-hq',
    title: 'Tech Campus HQ',
    category: 'Commercial',
    location: 'Rabat',
    size: '150 kWp',
    savings: '240,000 MAD',
    image: '/project_commercial_1779051372230.png'
  },
  {
    id: 'logistics-facility',
    title: 'Logistics Facility',
    category: 'Industrial',
    location: 'Marrakech',
    size: '500 kWp',
    savings: '850,000 MAD',
    image: '/project_industrial_1779051388968.png'
  }
]
</script>

<style scoped>
.projects-section {
  background-color: var(--light-2);
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.project-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0,0,0,0.04);
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.project-image-wrap {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.project-image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card:hover .project-image-placeholder {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: rgba(2, 13, 7, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.view-project-btn {
  background: var(--white);
  color: var(--text-main);
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.9rem;
  transform: translateY(10px);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card:hover .view-project-btn {
  transform: translateY(0);
}

.project-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--white);
  color: var(--text-main);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.project-content {
  padding: 1.75rem;
}

.project-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.project-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.project-stats {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(0,0,0,0.06);
  padding-top: 1.25rem;
}

.p-stat {
  display: flex;
  flex-direction: column;
}

.p-val {
  font-weight: 700;
  color: var(--primary-dark);
  font-size: 1.1rem;
}

.p-lbl {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 992px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>

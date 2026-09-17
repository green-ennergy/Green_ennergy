<template>
  <div class="about-page">
    <!-- Hero Header -->
    <header class="about-hero">
      <div class="container hero-content">
        <span class="badge-accent">Energy Agency</span>
        <h1 class="hero-title">À Propos de Notre Agence</h1>
        <p class="hero-subtitle">
          Pionniers de la transition énergétique solaire et de l'autonomie électrique depuis plus de 10 ans.
        </p>
      </div>
    </header>

    <main class="container about-main">
      <!-- Mission Section -->
      <section class="about-grid">
        <div class="about-text-card">
          <span class="section-eyebrow">Notre Mission</span>
          <h2>Démocratiser l'énergie solaire propre et durable</h2>
          <p>
            Fondée avec la vision d'un avenir à empreinte carbone réduite, <strong>Energy Agency</strong> accompagne les particuliers, entreprises et collectivités dans le dimensionnement, l'installation et la maintenance de leurs équipements solaires photovoltaïques.
          </p>
          <p>
            Nous combinons une ingénierie de pointe, du matériel certifié Tier-1 et une assistance technique réactive pour vous garantir une autonomie énergétique maximale et un retour sur investissement optimal.
          </p>

          <div class="values-list">
            <div class="value-item">
              <div class="val-icon">⚡</div>
              <div>
                <h4>Excellence Technique</h4>
                <p>Ingénieurs et techniciens certifiés garantissant des installations sécurisées aux normes internationales.</p>
              </div>
            </div>

            <div class="value-item">
              <div class="val-icon">🛡️</div>
              <div>
                <h4>Qualité Tier-1 Garantie</h4>
                <p>Sélection rigoureuse des fabricants d'onduleurs et panneaux solaires garantis jusqu'à 25 ans.</p>
              </div>
            </div>

            <div class="value-item">
              <div class="val-icon">🤝</div>
              <div>
                <h4>Accompagnement Global</h4>
                <p>De l'étude de consommation initiale à la maintenance curative en passant par la livraison sur site.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="about-media-card">
          <div class="video-container">
            <video
              class="about-video"
              src="/coverr.mp4"
              controls
            ></video>
          </div>
          <div class="stats-badge-grid">
            <div class="stat-card">
              <strong>+500</strong>
              <span>Projets Réalisés</span>
            </div>
            <div class="stat-card">
              <strong>12 MWp</strong>
              <span>Puissance Installée</span>
            </div>
            <div class="stat-card">
              <strong>99.4%</strong>
              <span>Satisfaction Client</span>
            </div>
            <div class="stat-card">
              <strong>10+ Ans</strong>
              <span>D'Expérience</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Timeline / History Section -->
      <section class="timeline-section">
        <div class="timeline-head">
          <span class="section-eyebrow">Notre Histoire</span>
          <h2>Une décennie d'innovation énergétique</h2>
        </div>
        <div class="timeline">
          <div class="timeline-item" v-for="item in timeline" :key="item.year">
            <div class="tl-year">{{ item.year }}</div>
            <div class="tl-dot"></div>
            <div class="tl-body">
              <h4>{{ item.title }}</h4>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="team-section">
        <div class="team-head">
          <span class="section-eyebrow">Notre Équipe</span>
          <h2>Des experts dédiés à votre autonomie</h2>
          <p>Une équipe pluridisciplinaire d'ingénieurs, techniciens et conseillers énergétiques à votre service.</p>
        </div>
        <div class="team-grid">
          <div class="team-card" v-for="member in team" :key="member.name">
            <div class="team-avatar" :style="{ background: member.color }">
              {{ member.initials }}
            </div>
            <div class="team-info">
              <h4>{{ member.name }}</h4>
              <span class="team-role">{{ member.role }}</span>
              <p>{{ member.bio }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Certifications Section -->
      <section class="certs-section">
        <div class="certs-head">
          <span class="section-eyebrow">Certifications &amp; Normes</span>
          <h2>Conformité aux standards les plus stricts</h2>
        </div>
        <div class="certs-grid">
          <div class="cert-card" v-for="cert in certifications" :key="cert.label">
            <div class="cert-icon">{{ cert.icon }}</div>
            <h4>{{ cert.label }}</h4>
            <p>{{ cert.desc }}</p>
          </div>
        </div>
      </section>

      <!-- CTA Footer Section -->
      <section class="about-cta-box">
        <h3>Prêt à concrétiser votre projet solaire ?</h3>
        <p>Demandez votre étude gratuite d'autonomie et découvrez nos services sur-mesure.</p>
        <div class="cta-actions">
          <router-link to="/services" class="primary-btn">Découvrir nos Services</router-link>
          <router-link to="/store" class="ghost-btn">Consulter le Catalogue</router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const timeline = [
  { year: '2016', title: 'Fondation & Vision', desc: 'Création de l\'entreprise avec l\'ambition d\'accélérer l\'adoption du solaire pour les entreprises et particuliers.' },
  { year: '2019', title: 'Partenariats Tier-1', desc: 'Accords directs avec les plus grands constructeurs mondiaux d\'onduleurs et de panneaux solaires.' },
  { year: '2022', title: 'Extension Opérationnelle', desc: 'Déploiement d\'une flotte technique d\'intervention rapide et d\'un centre de monitoring 24/7.' },
  { year: '2026', title: 'Plateforme Digitale', desc: 'Lancement du marketplace unifié et de la gestion connectée des interventions et audits.' },
]

const team = [
  { name: 'Karim Bennani', role: 'Directeur Général & Fondateur', initials: 'KB', color: '#16a34a', bio: 'Ingénieur en génie énergétique avec 15 ans d\'expérience dans les grands projets photovoltaïques.' },
  { name: 'Sarah Mansouri', role: 'Responsable Ingénierie & Études', initials: 'SM', color: '#0284c7', bio: 'Experte en dimensionnement d\'installations hybrides et stockage lithium haute tension.' },
  { name: 'Youssef El Alami', role: 'Chef des Opérations Terrain', initials: 'YA', color: '#d97706', bio: 'Supervise les interventions, audits de conformité et le respect des normes de sécurité.' },
  { name: 'Amine Cherkaoui', role: 'Support Client & Maintenance', initials: 'AC', color: '#7c3aed', bio: 'Dédié au suivi de la performance des centrales solaires et au service après-vente.' },
]

const certifications = [
  { icon: '📜', label: 'ISO 9001 / 14001', desc: 'Gestion de qualité et management environnemental certifié pour tous nos processus.' },
  { icon: '🔒', label: 'Normes CE & IEC', desc: 'Tous nos équipements et onduleurs respectent scrupuleusement les normes de sécurité européennes.' },
  { icon: '🛡️', label: 'Garantie Décennale', desc: 'Assurance responsabilité civile et décennale sur l\'ensemble de nos chantiers et poses.' },
  { icon: '🌱', label: 'Label CleanTech', desc: 'Engagement pour le recyclage des composants photovoltaïques et la réduction carbone.' },
]
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Outfit', sans-serif;
  color: #0f172a;
}

.about-hero {
  background: linear-gradient(160deg, #020d07 0%, #052e16 100%);
  color: #ffffff;
  padding: 5rem 1.5rem 4rem;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.badge-accent {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.85rem;
  border-radius: 999px;
  text-transform: uppercase;
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.2rem, 4.5vw, 3.2rem);
  font-weight: 800;
  margin: 1rem 0 0.5rem;
  color: #ffffff !important;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

.about-main {
  padding: 4rem 1.5rem;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

@media (max-width: 900px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}

.section-eyebrow {
  color: #16a34a;
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 0.5rem;
}

.about-text-card h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #052e16;
  margin-bottom: 1.25rem;
  line-height: 1.25;
}

.about-text-card p {
  font-size: 1rem;
  color: #475569;
  line-height: 1.7;
}

.values-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.value-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.val-icon {
  font-size: 1.6rem;
  background: #f0fdf4;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.value-item h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #052e16;
}

.value-item p {
  margin: 0;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.5;
}

.about-media-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.video-container {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
  background: #000;
}

.about-video {
  width: 100%;
  height: auto;
  display: block;
}

.stats-badge-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-card {
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.stat-card strong {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: #16a34a;
}

.stat-card span {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

/* Timeline */
.timeline-section {
  margin-top: 5rem;
}

.timeline-head {
  text-align: center;
  margin-bottom: 2.5rem;
}

.timeline-head h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #052e16;
}

.timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  position: relative;
}

.timeline-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.timeline-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.08);
}

.tl-year {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 800;
  color: #16a34a;
  background: #f0fdf4;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  margin-bottom: 0.75rem;
}

.tl-body h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #052e16;
  margin: 0 0 0.5rem 0;
}

.tl-body p {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* Team */
.team-section {
  margin-top: 5rem;
}

.team-head {
  text-align: center;
  margin-bottom: 2.5rem;
}

.team-head h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #052e16;
  margin-bottom: 0.5rem;
}

.team-head p {
  color: #64748b;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.team-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.75rem 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;
}

.team-card:hover {
  transform: translateY(-4px);
}

.team-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: #ffffff;
  font-weight: 800;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.team-info h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #052e16;
  margin: 0 0 0.25rem 0;
}

.team-role {
  font-size: 0.8rem;
  font-weight: 700;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 0.75rem;
}

.team-info p {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* Certifications */
.certs-section {
  margin-top: 5rem;
}

.certs-head {
  text-align: center;
  margin-bottom: 2.5rem;
}

.certs-head h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #052e16;
}

.certs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.5rem;
}

.cert-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
}

.cert-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.cert-card h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #052e16;
  margin: 0 0 0.5rem 0;
}

.cert-card p {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* CTA */
.about-cta-box {
  margin-top: 5rem;
  background: linear-gradient(135deg, #052e16 0%, #020d07 100%);
  color: #ffffff;
  border-radius: 24px;
  padding: 3.5rem 2rem;
  text-align: center;
}

.about-cta-box h3 {
  font-size: 1.85rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #ffffff !important;
}

.about-cta-box p {
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.75rem;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.primary-btn {
  background: #16a34a;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s;
}

.primary-btn:hover {
  background: #15803d;
}

.ghost-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.ghost-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>

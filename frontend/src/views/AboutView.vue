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

.about-cta-box {
  margin-top: 4rem;
  background: linear-gradient(135deg, #052e16 0%, #020d07 100%);
  color: #ffffff;
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
}

.about-cta-box h3 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.about-cta-box p {
  color: rgba(255, 255, 255, 0.8);
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

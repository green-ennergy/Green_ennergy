<template>
  <div class="partners-page">
    <!-- Hero Header -->
    <header class="partners-hero">
      <div class="container">
        <h1 class="hero-title">Nos Partenaires Technologiques</h1>
        <p class="hero-subtitle">
          Nous collaborons exclusivement avec les leaders mondiaux du secteur solaire photovoltaïque pour garantir durabilité, haut rendement et garanties constructeur éprouvées.
        </p>
      </div>
    </header>

    <main class="container partners-main">
      <!-- Marquee Section -->
      <section class="marquee-section">
        <div class="marquee-wrapper" aria-label="Logos des partenaires">
          <div class="marquee-track">
            <div
              v-for="(p, idx) in [...partnerList, ...partnerList]"
              :key="idx"
              class="partner-chip"
            >
              <div class="chip-logo-wrap">
                <img :src="p.logo" :alt="p.name" class="chip-logo-img" />
              </div>
              <span class="chip-cat">{{ p.category }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Partners Detail Cards Grid -->
      <section class="partners-grid-section">
        <div class="section-head">
          <h2>Marques & Équipements de Premier Plan</h2>
          <p>Chaque composant installé sur vos projets est certifié selon les standards européens et internationaux les plus stricts.</p>
        </div>

        <div class="partners-grid">
          <article v-for="p in partnerList" :key="p.name" class="partner-card">
            <div class="card-head">
              <div class="partner-logo-box">
                <img :src="p.logo" :alt="p.name" class="card-logo-img" />
              </div>
              <span class="cat-tag">{{ p.category }}</span>
            </div>

            <p class="partner-desc">{{ p.desc }}</p>

            <ul class="specs-list">
              <li><strong>Rendement:</strong> {{ p.efficiency }}</li>
              <li><strong>Garantie:</strong> {{ p.warranty }}</li>
              <li><strong>Origine / Certification:</strong> {{ p.origin }}</li>
            </ul>
          </article>
        </div>
      </section>

      <!-- Equipment Categories Guarantee Box -->
      <section class="guarantee-box">
        <div class="guarantee-card">
          <div class="g-icon">⚙️</div>
          <h3>Onduleurs & Conversion</h3>
          <p>Onduleurs hybrides et micro-onduleurs haute efficacité avec supervision WiFi à distance 24/7 (Deye, Huawei, Enphase).</p>
        </div>
        <div class="guarantee-card">
          <div class="g-icon">☀️</div>
          <h3>Panneaux Solaire Bifaciaux</h3>
          <p>Modules monocristallins PERC & N-Type TOPCon certifiés résistance haute température et dégradation ultra-faible (JinkoSolar, LONGi, SunPower).</p>
        </div>
        <div class="guarantee-card">
          <div class="g-icon">🔋</div>
          <h3>Stockage Lithium LiFePO4</h3>
          <p>Batteries haute tension et basse tension garanties +6000 cycles pour une alimentation continue jour et nuit (Samsung, LG, Deye).</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
const partnerList = [
  {
    name: 'SAMSUNG',
    logo: '/logos/samsung.svg',
    category: 'Stockage & Cellules',
    desc: 'Cellules de batteries haute densité énergétique pour les installations solaires exigeantes.',
    efficiency: 'Cellules LiFePO4 Grade A',
    warranty: '10 Ans Garantie',
    origin: 'Certifié Sécurité UL/CE'
  },
  {
    name: 'Deye',
    logo: '/logos/deye.svg',
    category: 'Onduleurs & Stockage',
    desc: 'Spécialiste mondial des onduleurs hybrides et systèmes d’énergie solaires multifonctions.',
    efficiency: '98.5% Max Efficacité',
    warranty: '10 Ans Garantie Constructeur',
    origin: 'Tier-1 Global Supplier'
  },
  {
    name: 'HUAWEI',
    logo: '/logos/huawei.svg',
    category: 'Onduleurs Intelligent',
    desc: 'Solution de gestion d’énergie intelligente FusionSolar avec sécurité renforcée AI-powered.',
    efficiency: '98.6% Efficacité Européenne',
    warranty: '10 Ans Garantie Étendue',
    origin: 'Leader Mondial Conversion'
  },
  {
    name: 'LG Energy',
    logo: '/logos/lg.svg',
    category: 'Batteries Lithium',
    desc: 'Systèmes de stockage d’énergie Li-ion haute sécurité pour l’autonomie résidentielle.',
    efficiency: '95% Rendement Aller-Retour',
    warranty: '10 Ans (6000+ Cycles)',
    origin: 'Certifié ISO & CE'
  },
  {
    name: 'JinkoSolar',
    logo: '/logos/jinko.svg',
    category: 'Panneaux Solaires',
    desc: 'Numéro 1 mondial des fabricants de panneaux solaires N-Type TOPCon haute performance.',
    efficiency: '22.8% Rendement Module',
    warranty: '25-30 Ans Garantie Linéaire',
    origin: 'Tier-1 BloombergNEF'
  },
  {
    name: 'LONGi',
    logo: '/logos/longi.svg',
    category: 'Panneaux Solaires',
    desc: 'Pionnier de la technologie silicium monocristallin pour installations résidentielles et tertiaires.',
    efficiency: '22.5% Efficacité Cellule',
    warranty: '25 Ans Garantie Matériel',
    origin: 'Tier-1 BloombergNEF'
  },
  {
    name: 'SunPower',
    logo: '/logos/sunpower.svg',
    category: 'Panneaux Solaires Premium',
    desc: 'Panneaux solaires Maxeon à rendement exceptionnel et résistance accrue aux intempéries.',
    efficiency: '23.0% Rendement Record',
    warranty: '40 Ans Garantie Sérénité',
    origin: 'Technologie Brevetée USA'
  },
  {
    name: 'Enphase',
    logo: '/logos/enphase.svg',
    category: 'Micro-Onduleurs',
    desc: 'Micro-onduleurs réseau avec optimisation panneau par panneau et gestion de panne ciblée.',
    efficiency: '97.5% Efficacité Peak',
    warranty: '25 Ans Garantie Pièces',
    origin: 'Standard Sécurité AC'
  },
  {
    name: 'Canadian Solar',
    logo: '/logos/canadian.svg',
    category: 'Modules Bifaciaux',
    desc: 'Modules solaires haute puissance conçus pour résister aux conditions environnementales sévères.',
    efficiency: '22.2% Rendement Global',
    warranty: '25 Ans Garantie Rendement',
    origin: 'Tier-1 BloombergNEF'
  },
  {
    name: 'SMA',
    logo: '/logos/sma.svg',
    category: 'Onduleurs Haute Précision',
    desc: 'Ingénierie allemande pionnière de la gestion intelligente des flux énergétiques industriels et résidentiels.',
    efficiency: '98.4% Rendement Max',
    warranty: '10-15 Ans Garantie',
    origin: 'Made in Germany'
  }
]
</script>

<style scoped>
.partners-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Outfit', sans-serif;
  color: #0f172a;
}

.partners-hero {
  background: linear-gradient(rgba(2, 13, 7, 0.88), rgba(2, 13, 7, 0.92)), url('/login_backdrop_1779051950394.png') center/cover;
  color: #f0fdf4;
  padding: 7.5rem 0 5.5rem;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.2rem, 4.5vw, 3.2rem);
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  color: rgba(240, 253, 244, 0.85);
  font-size: 1.05rem;
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.6;
}

.partners-main {
  padding: 3rem 1.5rem 5rem;
}

.marquee-section {
  overflow: hidden;
}

.marquee-wrapper {
  overflow: hidden;
  position: relative;
}

.marquee-track {
  display: flex;
  gap: 1rem;
  animation: marquee 25s linear infinite;
  width: max-content;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.partner-chip {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.chip-logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chip-logo-img {
  height: 24px;
  max-width: 105px;
  object-fit: contain;
  display: block;
}

.chip-cat {
  font-size: 0.75rem;
  background: #f1f5f9;
  color: #475569;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
}

.section-head {
  text-align: center;
  margin-bottom: 3rem;
}

.section-head h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #052e16;
  margin-bottom: 0.5rem;
}

.section-head p {
  color: #64748b;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.partner-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.partner-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.1);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.partner-logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.9rem;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  height: 48px;
  min-width: 120px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.card-logo-img {
  max-height: 32px;
  max-width: 110px;
  object-fit: contain;
  display: block;
}

.cat-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
}

.partner-desc {
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  flex: 1;
}

.specs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.82rem;
  color: #334155;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.guarantee-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.guarantee-card {
  background: linear-gradient(135deg, #052e16 0%, #020d07 100%);
  color: #ffffff;
  border-radius: 20px;
  padding: 2rem;
}

.g-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.guarantee-card h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #4ade80;
  margin-bottom: 0.5rem;
}

.guarantee-card p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}
</style>

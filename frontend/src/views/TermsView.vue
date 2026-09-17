<template>
  <div class="legal-page">
    <header class="legal-hero">
      <div class="container hero-content">
        <router-link to="/" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Retour à l'accueil
        </router-link>
        <span class="badge-accent">Conditions Générales</span>
        <h1 class="hero-title">Conditions Générales d'Utilisation et de Vente</h1>
        <p class="hero-subtitle">
          Régissant l'utilisation des services de dimensionnement, vente d'équipements photovoltaïques et maintenance d'Energy Agency.
        </p>
      </div>
    </header>

    <main class="container legal-main">
      <article class="legal-card">
        <section class="legal-section">
          <h2>1. Champ d'Application</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation et de Vente (CGUV) s'appliquent sans restriction ni réserve à l'ensemble des services, commandes d'équipements solaires (panneaux solaires, onduleurs, batteries de stockage), études de faisabilité et prestations d'installation proposés par <strong>Energy Agency</strong> à tout client particulier ou professionnel.
          </p>
        </section>

        <section class="legal-section">
          <h2>2. Demandes de Devis (RFQ) &amp; Commandes</h2>
          <p>
            Toute demande effectuée via notre portail web constitue une demande d'étude préliminaire sans engagement financier immédiat.
          </p>
          <ul>
            <li>Nos devis et offres techniques ont une durée de validité de trente (30) jours à compter de leur émission.</li>
            <li>La commande devient définitive dès signature du devis et validation des acomptes convenus.</li>
            <li>Energy Agency se réserve le droit de réajuster les spécifications techniques suite à la visite technique d'audit de toiture ou de terrain.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>3. Tarifs et Modalités de Paiement</h2>
          <p>
            Les prix figurant sur notre marketplace et devis sont indiqués en devises locales, toutes taxes comprises (TTC) ou hors taxes (HT) selon le profil client. Les modalités de paiement sont échelonnées selon les phases d'avancement des travaux :
          </p>
          <ul>
            <li>Acompte à la commande pour la réservation du matériel Tier-1.</li>
            <li>Paiement intermédiaire à la livraison sur site des équipements.</li>
            <li>Solde à la mise en service et raccordement final du système photovoltaïque.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>4. Délais et Réalisation des Interventions</h2>
          <p>
            Les plannings d'installation et de maintenance sont établis en concertation avec le client. Energy Agency s'engage à mobiliser des techniciens et opérateurs qualifiés et certifiés. En cas d'intempéries majeures rendant dangereuse l'intervention en hauteur, un report de date sera planifié d'un commun accord.
          </p>
        </section>

        <section class="legal-section">
          <h2>5. Garanties et Service Après-Vente</h2>
          <p>
            Tous nos équipements bénéficient des garanties constructeurs officielles (jusqu'à 25 ans pour les panneaux solaires et 10 ans pour les onduleurs et batteries). De plus, nos travaux d'installation sont couverts par la garantie décennale et la garantie de parfait achèvement.
          </p>
        </section>

        <section class="legal-section">
          <h2>6. Propriété Intellectuelle</h2>
          <p>
            Tous les éléments de notre plateforme (marques, textes, visuels, calculateurs de rendement) sont la propriété exclusive d'Energy Agency et sont protégés par le droit de la propriété intellectuelle.
          </p>
        </section>

        <section class="legal-section">
          <h2>7. Loi Applicable &amp; Règlement des Litiges</h2>
          <p>
            Les présentes conditions sont soumises au droit en vigueur. Tout litige relatif à leur interprétation ou à leur exécution sera soumis en priorité à une tentative de règlement amiable avant toute saisine des juridictions compétentes.
          </p>
        </section>
      </article>
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Outfit', sans-serif;
  color: #0f172a;
}

.legal-hero {
  background: linear-gradient(160deg, #020d07 0%, #052e16 100%);
  color: #ffffff;
  padding: 4.5rem 1.5rem 3.5rem;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #4ade80;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.8;
}

.badge-accent {
  display: inline-block;
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.85rem;
  border-radius: 999px;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: #ffffff !important;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  line-height: 1.6;
}

.legal-main {
  padding: 3.5rem 1.5rem 5rem;
}

.legal-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
}

.legal-section {
  margin-bottom: 2.5rem;
}

.legal-section:last-child {
  margin-bottom: 0;
}

.legal-section h2 {
  font-size: 1.35rem;
  font-weight: 800;
  color: #052e16;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.legal-section p {
  font-size: 0.98rem;
  color: #475569;
  line-height: 1.75;
  margin: 0 0 1rem 0;
}

.legal-section ul {
  padding-left: 1.5rem;
  margin: 0 0 1rem 0;
  color: #475569;
}

.legal-section li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .legal-card {
    padding: 2rem 1.5rem;
  }
}
</style>

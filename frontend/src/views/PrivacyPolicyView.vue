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
        <span class="badge-accent">Mentions Légales</span>
        <h1 class="hero-title">Politique de Confidentialité</h1>
        <p class="hero-subtitle">
          Dernière mise à jour : 17 Septembre 2026. La protection de vos données personnelles est au cœur de nos engagements.
        </p>
      </div>
    </header>

    <main class="container legal-main">
      <article class="legal-card">
        <section class="legal-section">
          <h2>1. Introduction &amp; Responsable du Traitement</h2>
          <p>
            La présente politique de confidentialité décrit la façon dont <strong>Energy Agency</strong> (« nous », « notre » ou « l'Agence ») collecte, utilise, protège et partage les données à caractère personnel recueillies lors de votre navigation sur notre plateforme web, lors de la soumission de demandes de devis (RFQ), ou lors de la commande de services et d'équipements solaires.
          </p>
          <p>
            Le responsable du traitement des données est la société <strong>Energy Agency SARL</strong>, joignable à l'adresse email <a href="mailto:contact@energy.inc">contact@energy.inc</a>.
          </p>
        </section>

        <section class="legal-section">
          <h2>2. Données Collectées</h2>
          <p>Dans le cadre de nos activités d'installation et de maintenance énergétique, nous sommes amenés à collecter :</p>
          <ul>
            <li><strong>Informations d'identification :</strong> nom, prénom, adresse email, numéro de téléphone.</li>
            <li><strong>Informations relatives au projet :</strong> adresse de l'installation, type de bâtiment (résidentiel, industriel, agricole), puissance souhaitée, facture énergétique moyenne.</li>
            <li><strong>Données de commande &amp; transaction :</strong> détails des devis, factures, statuts de paiement et historique des interventions techniques.</li>
            <li><strong>Données de connexion &amp; navigation :</strong> adresse IP, logs de connexion, type de terminal et préférences de langue.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>3. Finalités du Traitement</h2>
          <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>
          <ul>
            <li>Élaboration et transmission des études de faisabilité et devis sur-mesure.</li>
            <li>Planification et exécution des prestations d'installation et de maintenance sur site par nos opérateurs certifiés.</li>
            <li>Gestion de la relation client, facturation et suivi de garantie décennale / constructeur.</li>
            <li>Amélioration continue de notre catalogue d'équipements et de l'expérience utilisateur de notre portail client.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>4. Partage et Sous-traitance</h2>
          <p>
            Energy Agency ne vend ni ne loue vos données personnelles à des tiers. Les données peuvent être transmises uniquement à nos techniciens et opérateurs habilités pour l'exécution directe des missions sur le terrain, ou aux constructeurs partenaires (Tier-1) aux strictes fins d'activation de la garantie matérielle.
          </p>
        </section>

        <section class="legal-section">
          <h2>5. Conservation des Données</h2>
          <p>
            Vos données relatives aux devis et commandes sont conservées pendant toute la durée de la relation contractuelle, puis archivées conformément aux obligations légales de conservation des documents comptables et de garantie décennale (jusqu'à 10 ans).
          </p>
        </section>

        <section class="legal-section">
          <h2>6. Vos Droits</h2>
          <p>Conformément aux lois applicables sur la protection des données personnelles, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès et de rectification de vos données.</li>
            <li>Droit à l'effacement (« droit à l'oubli ») sous réserve de nos obligations légales.</li>
            <li>Droit d'opposition et de limitation du traitement.</li>
            <li>Droit à la portabilité de vos données.</li>
          </ul>
          <p>
            Pour exercer ces droits, veuillez contacter notre délégué à la protection des données à : <a href="mailto:privacy@energy.inc">privacy@energy.inc</a>.
          </p>
        </section>

        <section class="legal-section">
          <h2>7. Contact</h2>
          <p>
            Pour toute question relative à cette politique ou pour exercer vos droits, vous pouvez nous écrire à <strong>contact@energy.inc</strong> ou par courrier postal à notre siège social.
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

.legal-section a {
  color: #16a34a;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .legal-card {
    padding: 2rem 1.5rem;
  }
}
</style>

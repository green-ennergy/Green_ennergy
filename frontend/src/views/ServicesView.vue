<template>
  <div class="services-page">
    <!-- Header Hero -->
    <header class="services-hero">
      <div class="hero-bg-orb" aria-hidden="true"></div>
      <div class="container hero-content">
        <span class="badge-accent">Energy Agency Services</span>
        <h1 class="hero-title">{{ t('services.heroTitle') }}</h1>
        <p class="hero-subtitle">{{ t('services.heroSubtitle') }}</p>
      </div>
    </header>

    <!-- Main Catalog Section -->
    <main class="container services-main">
      <div class="section-head">
        <h2>{{ t('services.ourServices') }}</h2>
        <div class="active-count-tag">
          {{ availableServices.length }} / {{ servicesConfig.length }} Services Active
        </div>
      </div>

      <div class="services-grid">
        <div
          v-for="service in servicesConfig"
          :key="service.id"
          :class="['service-card', { disabled: !service.enabled }]"
        >
          <!-- Card Header & Badge -->
          <div class="card-top">
            <div :class="['service-icon-box', service.id]">
              <svg v-if="service.id === 'installation'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <svg v-else-if="service.id === 'maintenance'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              <svg v-else-if="service.id === 'consultation'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>

            <div class="card-badges">
              <span v-if="service.enabled" class="status-badge active">● Active</span>
              <span v-else class="status-badge paused">● Paused</span>
              <span class="cat-badge">{{ service.category }}</span>
            </div>
          </div>

          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-desc">{{ service.desc }}</p>

          <!-- Pricing & Duration Meta -->
          <div class="service-meta-row">
            <div class="meta-item">
              <span class="lbl">Est. Duration</span>
              <span class="val">⏱️ {{ service.estimatedDuration }}</span>
            </div>
            <div class="meta-item">
              <span class="lbl">Starting At</span>
              <span class="val price">💰 {{ service.startingPrice }}</span>
            </div>
          </div>

          <!-- Feature Bullets -->
          <ul class="bullet-list">
            <li v-for="(b, i) in service.bullets" :key="i">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>{{ b }}</span>
            </li>
          </ul>

          <div v-if="!service.enabled" class="disabled-notice">
            ⚠️ {{ t('services.disabledNotice') }}
          </div>

          <!-- Actions -->
          <div class="card-actions">
            <button
              class="primary-btn"
              :disabled="!service.enabled"
              @click="openRequestModal(service)"
            >
              <span>{{ t('services.requestService') }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <router-link :to="`/services/${service.id}`" class="ghost-btn">
              {{ t('services.viewDetails') }}
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Request Modal Dialog -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <header class="modal-header">
          <div>
            <h3>{{ t('services.requestModalTitle') }}</h3>
            <p class="modal-sub">{{ selectedService?.title }}</p>
          </div>
          <button class="close-btn" @click="showModal = false">×</button>
        </header>

        <form @submit.prevent="submitRequest" class="request-form">
          <div class="form-row">
            <label>
              <span>{{ t('services.form.fullName') }}</span>
              <input v-model="form.clientName" type="text" placeholder="M. Karim Tazi" required />
            </label>
            <label>
              <span>{{ t('services.form.phone') }}</span>
              <input v-model="form.clientPhone" type="text" placeholder="+212 661 234 567" required />
            </label>
          </div>

          <div class="form-row">
            <label>
              <span>{{ t('services.form.email') }}</span>
              <input v-model="form.clientEmail" type="email" placeholder="client@example.ma" required />
            </label>
            <label>
              <span>{{ t('services.form.city') }}</span>
              <input v-model="form.city" type="text" placeholder="Casablanca, Rabat, Marrakech..." required />
            </label>
          </div>

          <div class="form-row">
            <label class="full">
              <span>{{ t('services.form.address') }}</span>
              <input v-model="form.address" type="text" placeholder="Street address or site location details..." required />
            </label>
          </div>

          <div class="form-row">
            <label>
              <span>{{ t('services.form.preferredDate') }}</span>
              <input v-model="form.preferredDate" type="date" required />
            </label>
          </div>

          <div class="form-row">
            <label class="full">
              <span>{{ t('services.form.notes') }}</span>
              <textarea v-model="form.notes" rows="3" placeholder="Describe roof details, inverter brand, bill amount, or specific request context..."></textarea>
            </label>
          </div>

          <footer class="modal-footer">
            <button type="button" class="ghost-btn" @click="showModal = false">
              {{ t('common.cancel') }}
            </button>
            <button type="submit" class="primary-btn">
              {{ t('services.form.submitBtn') }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useServices } from '../composables/useServices'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { t } = useI18n()
const { user } = useAuth()
const { servicesConfig, availableServices, createServiceRequest } = useServices()

const showModal = ref(false)
const selectedService = ref(null)

const form = ref({
  clientName: user.value?.name || '',
  clientEmail: user.value?.email || '',
  clientPhone: user.value?.phone || '',
  city: 'Casablanca',
  address: '',
  preferredDate: new Date().toISOString().split('T')[0],
  notes: ''
})

function openRequestModal(service) {
  selectedService.value = service
  showModal.value = true
}

function submitRequest() {
  if (!selectedService.value) return
  createServiceRequest({
    serviceId: selectedService.value.id,
    ...form.value
  })

  showModal.value = false
  alert('Your service request has been submitted! You can now track its realization progress in your Client Dashboard.')
  router.push('/dashboard')
}
</script>

<style scoped>
.services-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Outfit', sans-serif;
  color: #0f172a;
}

.services-hero {
  background: linear-gradient(160deg, #020d07 0%, #052e16 100%);
  color: #ffffff;
  padding: 4.5rem 1.5rem 3.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-bg-orb {
  display: none;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
}

.primary-btn {
  width: 100%;
  background: #16a34a;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 1rem;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: background 0.2s;
}

.primary-btn:hover:not(:disabled) {
  background: #15803d;
}

.primary-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.ghost-btn {
  width: 100%;
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #334155;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
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
  letter-spacing: 0.5px;
  display: inline-block;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  margin-bottom: 0.85rem;
  line-height: 1.1;
  color: #ffffff;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.services-main {
  padding: 3rem 1.5rem 5rem;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-head h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #052e16;
}

.active-count-tag {
  background: #dcfce7;
  color: #15803d;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.75rem;
}

.service-card {
  background: #ffffff;
  border: 1px solid rgba(5, 46, 22, 0.08);
  border-radius: 20px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: transform 0.25s, box-shadow 0.25s;
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.service-card.disabled {
  opacity: 0.75;
  background: #f8fafc;
  border-style: dashed;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.service-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0fdf4;
  color: #16a34a;
}
.service-icon-box.maintenance { background: #fffbeb; color: #d97706; }
.service-icon-box.consultation { background: #ecfeff; color: #0891b2; }
.service-icon-box.delivery { background: #faf5ff; color: #9333ea; }

.card-badges {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.status-badge {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
}
.status-badge.active { background: #dcfce7; color: #15803d; }
.status-badge.paused { background: #fef3c7; color: #b45309; }

.cat-badge {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 600;
}

.service-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #052e16;
  margin-bottom: 0.5rem;
}

.service-desc {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  flex-grow: 1;
}

.service-meta-row {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1.25rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-item .lbl {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 600;

  text-transform: uppercase;
}

.meta-item .val {
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
}
.meta-item .val.price { color: #16a34a; }

.bullet-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0;
  list-style: none;
}

.bullet-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #334155;
}

.disabled-notice {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  color: #d48806;
  font-size: 0.8rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 600;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  padding: 1.75rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
}

.modal-header h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #052e16;
}

.modal-sub {
  font-size: 0.88rem;
  color: #16a34a;
  font-weight: 700;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: #94a3b8;
}

.request-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.form-row label.full {
  flex: 100%;
}

.form-row input,
.form-row textarea {
  padding: 0.6rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
  margin-top: 0.5rem;
}
</style>

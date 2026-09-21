<template>
  <div v-if="detailLoading" class="not-found-container">
    <p>{{ t('common.loading') }}</p>
  </div>

  <div class="service-detail-page" v-else-if="service">
    <header class="detail-hero">
      <div class="container">
        <router-link to="/services" class="back-link">
          ← {{ t('common.back') }} to Services
        </router-link>

        <div class="hero-body">
          <div class="service-badge-row">
            <span class="cat-pill">{{ service.category }}</span>
            <span :class="['status-pill', service.enabled ? 'active' : 'paused']">
              ● {{ service.enabled ? 'Service Active' : 'Service Temporarily Paused' }}
            </span>
          </div>

          <h1 class="hero-title">{{ service.title }}</h1>
          <p class="hero-desc">{{ service.desc }}</p>

          <div class="hero-meta-strip">
            <div class="meta-box">
              <span class="lbl">Estimated Duration</span>
              <span class="val">{{ service.estimatedDuration }}</span>
            </div>
            <div class="meta-box">
              <span class="lbl">Starting Price</span>
              <span class="val price">{{ service.startingPrice }}</span>
            </div>
            <div class="meta-box">
              <span class="lbl">Realization Steps</span>
              <span class="val">5 Realization Phases</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="container detail-content">
      <div class="content-grid">
        <div class="main-col">
          <section class="detail-card">
            <h2>Realization Process Roadmap</h2>
            <p class="section-sub">Here is how our engineering team realizes your {{ service.title }} from start to finish:</p>

            <div class="roadmap-timeline">
              <div
                v-for="st in (service.realizationSteps || [])"
                :key="st.step"
                class="roadmap-step"
              >
                <div class="step-num">{{ st.step }}</div>
                <div class="step-content">
                  <h4>{{ st.title }}</h4>
                  <p>{{ st.desc }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="detail-card">
            <h2>Technical Scope & Deliverables</h2>
            <ul class="deliverables-list">
              <li v-for="(b, i) in (service.bullets || [])" :key="i">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div>
                  <strong>{{ b }}</strong>
                  <p>Certified execution compliant with Moroccan renewable energy grid standards.</p>
                </div>
              </li>
            </ul>
          </section>
        </div>

        <aside class="sidebar-col">
          <div class="cta-card">
            <h3>Request This Service</h3>
            <p>Submit your site requirements and our engineering team will dispatch a qualified operator.</p>

            <div class="pricing-summary">
              <span class="from">Starting from</span>
              <span class="amount">{{ service.startingPrice }}</span>
            </div>

            <button
              class="primary-btn full"
              :disabled="!service.enabled"
              @click="openRequestModal"
            >
              <span>Request Service Now</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <div v-if="!service.enabled" class="paused-alert">
              {{ t('services.disabledNotice') }}
            </div>
          </div>
        </aside>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <header class="modal-header">
          <div>
            <h3>{{ t('services.requestModalTitle') }}</h3>
            <p class="modal-sub">{{ service.title }}</p>
          </div>
          <button class="close-btn" @click="showModal = false">×</button>
        </header>

        <form @submit.prevent="submitRequest" class="request-form">
          <div class="form-row">
            <label>
              <span>{{ t('services.form.fullName') }}</span>
              <input v-model="form.clientName" type="text" required :readonly="identityLocked" @keydown.enter.prevent />
            </label>
            <label>
              <span>{{ t('services.form.phone') }}</span>
              <input v-model="form.clientPhone" type="text" required :readonly="identityLocked" @keydown.enter.prevent />
            </label>
          </div>

          <div class="form-row">
            <label>
              <span>{{ t('services.form.email') }}</span>
              <input v-model="form.clientEmail" type="email" required :readonly="identityLocked" @keydown.enter.prevent />
            </label>
            <label>
              <span>{{ t('services.form.city') }}</span>
              <input v-model="form.city" type="text" required @keydown.enter.prevent />
            </label>
          </div>

          <div class="form-row">
            <label class="full">
              <span>{{ t('services.form.address') }}</span>
              <input v-model="form.address" type="text" required @keydown.enter.prevent />
            </label>
          </div>

          <div class="form-row">
            <label>
              <span>{{ t('services.form.preferredDate') }}</span>
              <input v-model="form.preferredDate" type="date" required @keydown.enter.prevent />
            </label>
          </div>

          <div class="form-row">
            <label class="full">
              <span>{{ t('services.form.notes') }}</span>
              <textarea v-model="form.notes" rows="3"></textarea>
            </label>
          </div>

          <footer class="modal-footer">
            <button type="button" class="ghost-btn" @click="showModal = false">
              {{ t('common.cancel') }}
            </button>
            <button type="submit" class="primary-btn" :disabled="submitting">
              {{ submitting ? t('common.loading') : t('services.form.submitBtn') }}
            </button>
          </footer>
          <p v-if="formError" class="form-error">{{ formError }}</p>
        </form>
      </div>
    </div>
  </div>

  <div v-else class="not-found-container">
    <h2>{{ t('services.notFound') }}</h2>
    <router-link to="/services" class="primary-btn">Return to Services</router-link>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getApiErrorMessage } from '../api/client'
import { useServices } from '../composables/useServices'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const { user, isAdmin, isOperator } = useAuth()
const {
  getServiceById,
  fetchServiceById,
  createServiceRequest,
  detailLoading
} = useServices()

const service = ref(null)
const showModal = ref(false)
const submitting = ref(false)
const formError = ref('')
const identityLocked = computed(() => !!user.value)

const form = ref({
  clientName: user.value?.name || '',
  clientEmail: user.value?.email || '',
  clientPhone: user.value?.phone || '',
  city: 'Casablanca',
  address: '',
  preferredDate: new Date().toISOString().split('T')[0],
  notes: ''
})

async function loadService() {
  const id = route.params.id
  service.value = getServiceById(id)
  const fetched = await fetchServiceById(id)
  service.value = fetched
}

onMounted(loadService)
watch(() => route.params.id, loadService)

function openRequestModal() {
  if (!user.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  if (isAdmin.value || isOperator.value) {
    formError.value = t('services.clientsOnly')
    toast.error(t('services.clientsOnly'))
    return
  }
  formError.value = ''
  form.value = {
    ...form.value,
    clientName: user.value?.name || form.value.clientName,
    clientEmail: user.value?.email || form.value.clientEmail,
    clientPhone: user.value?.phone || form.value.clientPhone
  }
  showModal.value = true
}

async function submitRequest() {
  if (!service.value || submitting.value) return
  submitting.value = true
  formError.value = ''
  try {
    await createServiceRequest({
      serviceId: service.value.id,
      ...form.value
    })
    showModal.value = false
    toast.success(t('services.requestSubmitted'))
    router.push({ path: '/dashboard', query: { tab: 'services' } })
  } catch (err) {
    formError.value = getApiErrorMessage(err, t('services.requestFailed'))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.service-detail-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Outfit', sans-serif;
  color: #0f172a;
}

.detail-hero {
  background: linear-gradient(160deg, #020d07 0%, #052e16 100%);
  color: #ffffff;
  padding: 6.5rem 1.5rem 3.5rem;
}

.back-link {
  color: #4ade80;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-radius: 8px;
  transition: all 0.2s;
}

.back-link:hover {
  background: rgba(74, 222, 128, 0.2);
  color: #a7f3d0;
}

.service-badge-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.cat-pill {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
}

.status-pill.active {
  background: #dcfce7;
  color: #15803d;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
}

.status-pill.paused {
  background: #fef3c7;
  color: #b45309;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.75rem;
}

.hero-desc {
  font-size: 1.1rem;
  color: rgba(240, 253, 244, 0.85);
  max-width: 750px;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-meta-strip {
  display: flex;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 14px;
  max-width: 650px;
}

.meta-box .lbl {
  display: block;
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
}

.meta-box .val {
  font-size: 0.95rem;
  font-weight: 800;
}
.meta-box .val.price { color: #4ade80; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.detail-content {
  padding: 3rem 1.5rem 5rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
}

.main-col {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-card {
  background: #ffffff;
  border: 1px solid rgba(5, 46, 22, 0.08);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.detail-card h2 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #052e16;
  margin-bottom: 0.5rem;
}

.section-sub {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 1.75rem;
}

/* Roadmap */
.roadmap-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
}

.roadmap-step {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.step-num {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #052e16;
  color: #4ade80;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.step-content p {
  font-size: 0.88rem;
  color: #475569;
}

/* Deliverables */
.deliverables-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0;
  list-style: none;
}

.deliverables-list li {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.deliverables-list strong {
  display: block;
  font-size: 0.95rem;
  color: #0f172a;

  margin-bottom: 0.2rem;
}

.deliverables-list p {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

/* Sidebar */
.cta-card {
  background: #ffffff;
  border: 1px solid rgba(5, 46, 22, 0.08);
  border-radius: 20px;
  padding: 1.75rem;
  position: sticky;
  top: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

.cta-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #052e16;
  margin-bottom: 0.5rem;
}

.cta-card p {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.pricing-summary {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.pricing-summary .from {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;

  text-transform: uppercase;
}

.pricing-summary .amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #16a34a;
}

.primary-btn {
  background: #16a34a;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.primary-btn.full { width: 100%; }

.paused-alert {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #d48806;
  background: #fffbe6;
  padding: 0.6rem;
  border-radius: 8px;
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

.ghost-btn {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #334155;
  border-radius: 10px;
  padding: 0.65rem 1rem;
  font-weight: 600;
  cursor: pointer;
}

.not-found-container {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.form-error {
  color: #b91c1c;
  font-size: 0.85rem;
  margin: 0.75rem 0 0;
}
</style>

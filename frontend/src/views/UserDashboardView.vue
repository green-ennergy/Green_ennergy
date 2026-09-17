<template>
  <div class="user-dashboard-page">
    <header class="dashboard-header">
      <div class="container header-inner">
        <div>
          <span class="user-badge">Client Portal</span>
          <h1>Welcome, {{ user?.name || 'Valued Partner' }}</h1>
          <p class="sub">{{ user?.email }} · Track your solar service requests and project realization in real time.</p>
        </div>

        <router-link to="/services" class="primary-btn">
          <span>+ Request New Service</span>
        </router-link>
      </div>
    </header>

    <main class="container dashboard-main">
      <!-- Section 1: Active Service Requests & Realization Progress Bars -->
      <section class="dash-section">
        <div class="section-title-row">
          <h2>My Service Requests & Realization Progress</h2>
          <span class="count-tag">{{ clientRequests.length }} Requests</span>
        </div>

        <div v-if="clientRequests.length === 0" class="empty-state">
          <p>You haven't requested any services yet.</p>
          <router-link to="/services" class="primary-btn small">Browse Solar Services</router-link>
        </div>

        <div v-else class="requests-list">
          <div v-for="req in clientRequests" :key="req.id" class="request-card">
            <div class="card-head">
              <div>
                <span class="req-id"><code>{{ req.id }}</code></span>
                <h3>{{ req.serviceTitle }}</h3>
                <p class="req-meta">📍 {{ req.city }} — {{ req.address }} · Requested on {{ req.createdAt }}</p>
              </div>

              <div class="head-right">
                <span :class="['status-pill', req.status]">{{ req.status }}</span>
                <span class="operator-tag">👤 Operator: {{ req.assignedOperatorName }}</span>
              </div>
            </div>

            <!-- REALIZATION PROGRESS BAR -->
            <div class="realization-bar-section">
              <div class="realization-head">
                <span class="realization-title">{{ t('services.realization.title') }}</span>
                <span class="phase-pct">{{ Math.round((req.currentPhase / 5) * 100) }}% Completed</span>
              </div>

              <!-- Animated Step Bar -->
              <div class="progress-track">
                <div
                  class="progress-fill"
                  :style="{ width: `${((req.currentPhase - 1) / 4) * 100}%` }"
                ></div>
              </div>

              <!-- Step Labels -->
              <div class="steps-row">
                <div
                  v-for="step in getServiceSteps(req.serviceId)"
                  :key="step.step"
                  :class="['step-node', { done: req.currentPhase >= step.step, active: req.currentPhase === step.step }]"
                >
                  <div class="node-circle">
                    <span v-if="req.currentPhase > step.step">✓</span>
                    <span v-else>{{ step.step }}</span>
                  </div>
                  <span class="node-label">{{ step.title }}</span>
                </div>
              </div>
            </div>

            <!-- Realization Activity Log Accordion / List -->
            <div class="history-section">
              <h4 class="history-title">{{ t('services.realization.historyTitle') }}</h4>
              <ul class="history-list">
                <li v-for="(h, idx) in req.history" :key="idx" class="history-item">
                  <span class="h-date">{{ h.date }}</span>
                  <span class="h-actor">{{ h.actor }}</span>
                  <span class="h-text">{{ h.text }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composables/useAuth'
import { useServices, defaultServices } from '../composables/useServices'

const { t } = useI18n()
const { user } = useAuth()
const { serviceRequests, getServiceById } = useServices()

const clientRequests = computed(() => {
  if (!user.value?.email) return serviceRequests.value
  return serviceRequests.value.filter(
    r => r.clientEmail.toLowerCase() === user.value.email.toLowerCase() || true
  )
})

function getServiceSteps(serviceId) {
  const srv = getServiceById(serviceId)
  if (srv && srv.realizationSteps) return srv.realizationSteps
  return [
    { step: 1, title: 'Received' },
    { step: 2, title: 'Review' },
    { step: 3, title: 'Assigned' },
    { step: 4, title: 'In Progress' },
    { step: 5, title: 'Completed' }
  ]
}
</script>

<style scoped>
.user-dashboard-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Outfit', sans-serif;
  color: #0f172a;
}

.dashboard-header {
  background: linear-gradient(160deg, #020d07 0%, #052e16 100%);
  color: #ffffff;
  padding: 3rem 1.5rem 2.5rem;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-badge {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  text-transform: uppercase;
}

.dashboard-header h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  margin: 0.35rem 0;
}

.dashboard-header .sub {
  color: #94a3b8;
  font-size: 0.95rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.dashboard-main {
  padding: 3rem 1.5rem 5rem;
}

.dash-section {
  background: #ffffff;
  border: 1px solid rgba(5, 46, 22, 0.08);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
}

.section-title-row h2 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #052e16;
}

.count-tag {
  background: #f1f5f9;
  color: #475569;
  font-weight: 700;
  font-size: 0.82rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #94a3b8;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.request-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.req-id {
  font-size: 0.78rem;
  color: #16a34a;
  font-weight: 700;
}

.card-head h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #052e16;
  margin: 0.25rem 0;
}

.req-meta {
  font-size: 0.85rem;
  color: #64748b;
}

.head-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  text-transform: uppercase;
}
.status-pill.accepted { background: #dcfce7; color: #15803d; }
.status-pill.pending { background: #fef3c7; color: #b45309; }
.status-pill.completed { background: #e0f2fe; color: #0369a1; }

.operator-tag {
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
  background: #f1f5f9;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

/* REALIZATION PROGRESS BAR STYLES */
.realization-bar-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.realization-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
}

.phase-pct {
  color: #16a34a;
}

.progress-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 1.25rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #16a34a, #4ade80);
  border-radius: 999px;
  transition: width 0.5s ease;
}

.steps-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: 0.45;
  transition: opacity 0.3s;
}

.step-node.done, .step-node.active {
  opacity: 1;
}

.node-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #cbd5e1;
  color: #475569;
  font-weight: 800;
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.4rem;
}

.step-node.done .node-circle {
  background: #16a34a;
  color: #ffffff;
}

.step-node.active .node-circle {
  background: #052e16;
  color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.4);
}

.node-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #334155;
  line-height: 1.2;
}

/* History List */
.history-section {
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
}

.history-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
  list-style: none;
}

.history-item {
  display: flex;
  gap: 0.75rem;
  font-size: 0.82rem;
}

.h-date {
  color: #94a3b8;
  font-size: 0.78rem;
  min-width: 110px;
}

.h-actor {
  font-weight: 700;
  color: #16a34a;
  min-width: 100px;
}

.h-text {
  color: #334155;
}

.primary-btn {
  background: #16a34a;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 1.1rem;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
}
.primary-btn.small { font-size: 0.82rem; padding: 0.45rem 0.85rem; }
</style>

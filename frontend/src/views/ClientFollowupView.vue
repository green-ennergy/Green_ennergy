<template>
  <div class="client-page">
    <div class="client-layout">
      <aside class="client-sidebar">
        <div class="sidebar-brand">
          <router-link to="/" class="brand-link">
            <div class="brand-icon"><AdminIcon name="bolt" :size="18" /></div>
            <div>
              <span class="brand-title">ENERGY AGENCY</span>
              <span class="brand-sub">{{ t('dashboard.console') }}</span>
            </div>
          </router-link>
        </div>

        <nav class="sidebar-nav" aria-label="Client navigation">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="nav-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="nav-icon"><AdminIcon :name="tab.icon" :size="18" /></span>
            <span>{{ tab.label }}</span>
            <span v-if="tab.count" class="nav-badge">{{ tab.count }}</span>
          </button>

          <router-link to="/store" class="nav-btn nav-link">
            <span class="nav-icon"><AdminIcon name="marketplace" :size="18" /></span>
            <span>{{ t('dashboard.storeLink') }}</span>
          </router-link>
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-profile">
            <div class="profile-avatar" aria-hidden="true">{{ userInitials }}</div>
            <div class="profile-meta">
              <span class="user-name">{{ user?.name || 'Client' }}</span>
              <span class="user-role">{{ user?.email || t('dashboard.console') }}</span>
            </div>
          </div>
          <button type="button" class="logout-btn" @click="logout">
            {{ t('common.signOut') }}
          </button>
        </div>
      </aside>

      <main class="client-main">
        <p v-if="pageError" class="error banner">{{ pageError }}</p>

        <!-- RFQ tab -->
        <section v-if="activeTab === 'rfq'" class="panel">
          <header class="panel-header">
            <div>
              <h1>{{ t('dashboard.rfq.title') }}</h1>
              <p>{{ t('dashboard.rfq.subtitle') }}</p>
            </div>
            <router-link to="/store" class="primary-btn">{{ t('dashboard.rfq.newQuote') }}</router-link>
          </header>

          <p v-if="rfqLoading" class="muted">{{ t('dashboard.rfq.loading') }}</p>

          <div v-else-if="!rfqTickets.length" class="empty-card">
            <h2>{{ t('dashboard.rfq.emptyTitle') }}</h2>
            <p>{{ t('dashboard.rfq.emptyDesc') }}</p>
            <router-link to="/store" class="primary-btn">{{ t('dashboard.rfq.goStore') }}</router-link>
          </div>

          <div v-else class="card-list">
            <article v-for="rfq in rfqTickets" :key="rfq.id" class="data-card">
              <div class="card-top">
                <div>
                  <span class="ticket">{{ rfq.ticket_number }}</span>
                  <h3>{{ rfq.company_name || user?.company || '—' }}</h3>
                  <small>{{ formatDate(rfq.created_at) }}</small>
                </div>
                <span class="status-pill" :class="rfq.status">{{ rfqStatusLabel(rfq.status) }}</span>
              </div>

              <ul class="line-list">
                <li v-for="item in rfq.items" :key="`${rfq.id}-${item.id}`">
                  <span>{{ rfqItemLabel(item) }}</span>
                  <span>× {{ item.quantity }}</span>
                  <span>{{ item.unit_price != null ? formatMoney(item.unit_price) : '—' }}</span>
                </li>
              </ul>

              <div class="card-foot">
                <strong v-if="rfq.quoted_total != null">
                  {{ t('dashboard.rfq.quoteTotal') }}: {{ formatMoney(rfqQuoteTotal(rfq)) }}
                </strong>
                <span v-else class="muted">—</span>

                <span v-if="rfq.client_confirmed" class="confirmed">
                  {{ t('dashboard.rfq.followupOpened') }}
                </span>
                <button
                  v-else-if="canConfirm(rfq)"
                  type="button"
                  class="primary-btn small"
                  :disabled="confirmingId === rfq.id"
                  @click="handleConfirm(rfq)"
                >
                  {{ confirmingId === rfq.id ? t('common.loading') : t('dashboard.rfq.confirmFollowup') }}
                </button>
                <button
                  v-if="canDownloadPdf(rfq)"
                  type="button"
                  class="ghost small"
                  :disabled="pdfDownloadingId === rfq.id"
                  @click="downloadPdf(rfq)"
                >
                  {{ pdfDownloadingId === rfq.id ? t('common.generatingPdf') : t('common.downloadPdf') }}
                </button>
              </div>
            </article>
          </div>
        </section>

        <!-- Follow-up tab -->
        <section v-else-if="activeTab === 'followup'" class="panel">
          <header class="panel-header">
            <div>
              <h1>{{ t('dashboard.followup.title') }}</h1>
              <p>{{ t('dashboard.followup.subtitle') }}</p>
            </div>
          </header>

          <div v-if="!projects.length" class="empty-card">
            <h2>{{ t('dashboard.followup.emptyTitle') }}</h2>
            <p>{{ t('dashboard.followup.emptyDesc') }}</p>
            <button type="button" class="primary-btn" @click="activeTab = 'rfq'">
              {{ t('dashboard.followup.viewQuotes') }}
            </button>
          </div>

          <div v-else class="card-list">
            <article v-for="project in projects" :key="project.id" class="data-card">
              <div class="card-top">
                <div>
                  <h3>{{ project.name }}</h3>
                  <p class="muted">{{ project.location || '—' }}</p>
                </div>
                <span class="status-pill">{{ getStepShortLabel(getCurrentPhase(project)) }}</span>
              </div>

              <div class="phase-track">
                <div
                  v-for="step in workflowSteps"
                  :key="step.key"
                  class="phase-node"
                  :class="{
                    done: isStepDone(project, step.key),
                    current: getCurrentPhase(project) === step.key
                  }"
                >
                  <span class="dot" />
                  <span class="label">{{ step.label }}</span>
                </div>
              </div>

              <p class="hint">{{ getStepMeta(getCurrentPhase(project))?.clientHint }}</p>

              <button type="button" class="ghost small" @click="openMessagesFor(project)">
                {{ t('dashboard.tabs.messages') }}
              </button>
            </article>
          </div>
        </section>

        <!-- Services tab -->
        <section v-else-if="activeTab === 'services'" class="panel">
          <header class="panel-header">
            <div>
              <h1>{{ t('dashboard.services.title') }}</h1>
              <p>{{ t('dashboard.services.subtitle') }}</p>
            </div>
            <router-link to="/services" class="primary-btn">{{ t('dashboard.services.browse') }}</router-link>
          </header>

          <p v-if="servicesLoading" class="muted">{{ t('dashboard.services.loading') }}</p>

          <div v-else-if="!myServiceRequests.length" class="empty-card">
            <h2>{{ t('dashboard.services.emptyTitle') }}</h2>
            <p>{{ t('dashboard.services.emptyDesc') }}</p>
            <router-link to="/services" class="primary-btn">{{ t('dashboard.services.browse') }}</router-link>
          </div>

          <div v-else class="card-list">
            <article v-for="req in myServiceRequests" :key="req.id" class="data-card">
              <div class="card-top">
                <div>
                  <span class="ticket">{{ req.id }}</span>
                  <h3>{{ req.serviceTitle }}</h3>
                  <small>{{ req.createdAt }} · {{ req.city || '—' }}</small>
                </div>
                <span class="status-pill" :class="req.status">{{ req.status }}</span>
              </div>
              <p class="muted">
                {{ t('dashboard.services.operator') }}: {{ req.assignedOperatorName }}
              </p>
              <p class="phase-now">
                {{ t('dashboard.services.currentStep') }}:
                <strong>{{ getPhaseLabel(req) }}</strong>
                <span>({{ req.currentPhase }}/5)</span>
              </p>
              <p class="hint">{{ getPhaseDesc(req) }}</p>

              <ol class="service-phase-track">
                <li
                  v-for="step in getRequestSteps(req)"
                  :key="step.step"
                  :class="{
                    done: req.currentPhase > step.step,
                    current: req.currentPhase === step.step
                  }"
                >
                  <span class="num">{{ step.step }}</span>
                  <span class="meta">
                    <strong>{{ step.title }}</strong>
                    <em>{{ step.desc }}</em>
                  </span>
                </li>
              </ol>

              <div v-if="req.history?.length" class="service-history">
                <h4>{{ t('dashboard.services.historyTitle') }}</h4>
                <ul>
                  <li v-for="(entry, idx) in req.history" :key="idx">
                    <strong>{{ entry.date }}</strong>
                    <span>{{ entry.actor }}</span>
                    <p>{{ entry.text }}</p>
                  </li>
                </ul>
              </div>

              <p v-if="req.notes" class="hint">{{ req.notes }}</p>
            </article>
          </div>
        </section>

        <!-- Messages tab -->
        <section v-else class="panel">
          <header class="panel-header">
            <div>
              <h1>{{ t('dashboard.messages.title') }}</h1>
              <p>{{ t('dashboard.messages.subtitle') }}</p>
            </div>
          </header>

          <div v-if="!projects.length" class="empty-card">
            <h2>{{ t('dashboard.followup.emptyTitle') }}</h2>
            <p>{{ t('dashboard.messages.empty') }}</p>
            <router-link to="/store" class="primary-btn">{{ t('dashboard.rfq.goStore') }}</router-link>
          </div>

          <div v-else class="messages-layout">
            <aside class="project-rail">
              <button
                v-for="project in projects"
                :key="project.id"
                type="button"
                class="project-pick"
                :class="{ active: selectedId === project.id }"
                @click="openProject(project)"
              >
                <strong>{{ project.name }}</strong>
                <span>{{ project.location || '—' }}</span>
              </button>
            </aside>

            <div v-if="selectedId" class="thread-panel">
              <div class="thread">
                <p v-if="!messages.length" class="muted">{{ t('dashboard.messages.empty') }}</p>
                <article
                  v-for="message in messages"
                  :key="message.id"
                  class="thread-item"
                  :class="message.author"
                >
                  <header>
                    <strong>
                      {{
                        message.author === 'client'
                          ? (message.user?.name || t('admin.drawer.clientLabel'))
                          : t('admin.drawer.teamLabel')
                      }}
                    </strong>
                  </header>
                  <p>{{ message.body }}</p>
                </article>
              </div>
              <form class="compose" @submit.prevent="send">
                <textarea
                  v-model="draft"
                  rows="3"
                  :placeholder="t('dashboard.messages.placeholder')"
                />
                <button type="submit" :disabled="sending || !draft.trim()">
                  {{ sending ? t('dashboard.messages.sending') : t('dashboard.messages.send') }}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api, { getApiErrorMessage } from '../api/client'
import { useAuth } from '../composables/useAuth'
import { useServices } from '../composables/useServices'
import AdminIcon from '../components/adminDashboard/AdminIcon.vue'
import {
  formatDate,
  formatMoney,
  rfqItemLabel,
  rfqQuoteTotal,
  rfqStatusLabel,
  canDownloadRfqPdf,
  rfqPdfErrorMessage
} from '../utils/rfqQuote'
import {
  getCurrentPhase,
  getStepMeta,
  getStepShortLabel,
  getWorkflowSteps,
  isStepDone
} from '../utils/projectSteps'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const {
  user,
  logoutUser,
  rfqTickets,
  fetchRfqTickets,
  confirmRfqQuote
} = useAuth()

const {
  fetchServiceRequests,
  getRequestsForClient,
  getRequestSteps,
  getPhaseLabel,
  getPhaseDesc
} = useServices()

const activeTab = ref('rfq')
const projects = ref([])
const messages = ref([])
const selectedId = ref(null)
const draft = ref('')
const sending = ref(false)
const pageError = ref('')
const confirmingId = ref(null)
const rfqLoading = ref(false)
const servicesLoading = ref(false)
const pdfDownloadingId = ref(null)

const myServiceRequests = computed(() => getRequestsForClient(user.value?.email))

const userInitials = computed(() => {
  const name = user.value?.name?.trim()
  if (!name) return 'C'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
})

function canDownloadPdf(rfq) {
  return canDownloadRfqPdf(rfq)
}

async function downloadPdf(rfq) {
  pdfDownloadingId.value = rfq.id
  pageError.value = ''
  try {
    const { downloadRfqQuotePdf } = await import('../utils/rfqPdf')
    await downloadRfqQuotePdf(rfq)
  } catch (err) {
    pageError.value = rfqPdfErrorMessage(err)
  } finally {
    pdfDownloadingId.value = null
  }
}

const workflowSteps = computed(() => {
  locale.value
  return getWorkflowSteps()
})

const tabs = computed(() => {
  locale.value
  return [
    { id: 'rfq', label: t('dashboard.tabs.rfq'), icon: 'orders', count: rfqTickets.value.length || null },
    { id: 'services', label: t('dashboard.tabs.services'), icon: 'services', count: myServiceRequests.value.length || null },
    { id: 'followup', label: t('dashboard.tabs.followup'), icon: 'projects', count: projects.value.length || null },
    { id: 'messages', label: t('dashboard.tabs.messages'), icon: 'messages', count: null }
  ]
})

function canConfirm(rfq) {
  if (!rfq || rfq.client_confirmed) return false
  if (rfq.quoted_total == null || Number(rfq.quoted_total) <= 0) return false
  return ['issued', 'engineering'].includes(rfq.status)
}

async function loadRfqs() {
  rfqLoading.value = true
  pageError.value = ''
  try {
    await fetchRfqTickets()
  } catch (err) {
    pageError.value = getApiErrorMessage(err, 'Could not load quote requests.')
  } finally {
    rfqLoading.value = false
  }
}

async function loadProjects() {
  const response = await api.get('/projects')
  projects.value = response.data.data || response.data || []

  const fromQuery = route.query.project
  const preferred = fromQuery
    ? projects.value.find((project) => String(project.id) === String(fromQuery))
    : null

  if (activeTab.value === 'messages') {
    const next = preferred || projects.value[0]
    if (next) await openProject(next)
  }
}

async function openProject(project) {
  selectedId.value = project.id
  draft.value = ''
  if (String(route.query.project || '') !== String(project.id)) {
    router.replace({ name: 'dashboard', query: { ...route.query, project: project.id, tab: 'messages' } })
  }
  const response = await api.get(`/projects/${project.id}/messages`)
  messages.value = response.data.messages || []
}

function openMessagesFor(project) {
  activeTab.value = 'messages'
  openProject(project)
}

async function handleConfirm(rfq) {
  confirmingId.value = rfq.id
  pageError.value = ''
  const result = await confirmRfqQuote(rfq.id)
  confirmingId.value = null

  if (!result.success) {
    pageError.value = result.error || 'Could not confirm quote.'
    return
  }

  await loadProjects()
  activeTab.value = 'followup'
  if (result.project?.id) {
    router.replace({ name: 'dashboard', query: { tab: 'followup', project: result.project.id } })
  }
}

async function send() {
  const body = draft.value.trim()
  if (!selectedId.value || !body) return
  sending.value = true
  pageError.value = ''
  try {
    const response = await api.post(`/projects/${selectedId.value}/messages`, { body })
    messages.value = [...messages.value, response.data.message]
    draft.value = ''
  } catch (err) {
    pageError.value = getApiErrorMessage(err, 'Could not send the message.')
  } finally {
    sending.value = false
  }
}

async function logout() {
  await logoutUser()
  router.push('/login')
}

watch(activeTab, async (tab) => {
  if (route.query.tab !== tab) {
    router.replace({ name: 'dashboard', query: { ...route.query, tab } })
  }
  if (tab === 'messages' && projects.value.length && !selectedId.value) {
    await openProject(projects.value[0])
  }
  if (tab === 'services') {
    await loadServiceRequests()
  }
})

async function loadServiceRequests() {
  servicesLoading.value = true
  try {
    await fetchServiceRequests()
  } catch (err) {
    pageError.value = getApiErrorMessage(err, 'Could not load service requests.')
  } finally {
    servicesLoading.value = false
  }
}

onMounted(async () => {
  const tab = typeof route.query.tab === 'string' ? route.query.tab : 'rfq'
  if (['rfq', 'services', 'followup', 'messages'].includes(tab)) {
    activeTab.value = tab
  }

  try {
    const jobs = [loadRfqs(), loadProjects()]
    if (activeTab.value === 'services') jobs.push(loadServiceRequests())
    await Promise.all(jobs)
  } catch (err) {
    pageError.value = getApiErrorMessage(err, 'Could not load dashboard.')
  }
})
</script>

<style scoped>
.client-page {
  height: 100vh;
  overflow: hidden;
  background: #eef4f0;
  color: #1c1917;
  font-family: 'Outfit', sans-serif;
}

.client-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  height: 100%;
}

.client-sidebar {
  background: #020d07;
  color: #f0fdf4;
  border-right: 1px solid rgba(74, 222, 128, 0.12);
  padding: 1.15rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.sidebar-brand {
  padding: 0.35rem 0.55rem 1rem;
  border-bottom: 1px solid rgba(74, 222, 128, 0.12);
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(74, 222, 128, 0.12);
  border: 1px solid rgba(74, 222, 128, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
  flex-shrink: 0;
}

.brand-title {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  letter-spacing: 1.5px;
  font-size: 0.88rem;
}

.brand-sub {
  display: block;
  font-size: 0.68rem;
  color: #4ade80;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(240, 253, 244, 0.72);
  text-align: left;
  text-decoration: none;
  font-family: inherit;
}

.nav-btn:hover {
  background: rgba(74, 222, 128, 0.08);
  color: #f0fdf4;
}

.nav-btn.active {
  background: rgba(74, 222, 128, 0.14);
  color: #4ade80;
}

.nav-link {
  margin-top: 0.35rem;
  border-top: 1px solid rgba(74, 222, 128, 0.12);
  border-radius: 0 0 10px 10px;
  padding-top: 1rem;
}

.nav-icon {
  display: inline-flex;
  color: inherit;
}

.nav-badge {
  margin-left: auto;
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(74, 222, 128, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.35rem 0.45rem;
}

.profile-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(74, 222, 128, 0.16);
  border: 1px solid rgba(74, 222, 128, 0.28);
  color: #4ade80;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 800;
  flex-shrink: 0;
}

.profile-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.user-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #f0fdf4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.72rem;
  color: rgba(240, 253, 244, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(240, 253, 244, 0.22);
  color: #f0fdf4;
  padding: 0.55rem 0.9rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
}

.logout-btn:hover {
  background: rgba(240, 253, 244, 0.08);
  border-color: rgba(74, 222, 128, 0.35);
}

.client-main {
  min-width: 0;
  height: 100%;
  padding: 1.15rem 1.5rem 1.5rem;
  overflow: auto;
}

.client-page :deep(section),
.client-page section {
  padding-block: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.panel-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.6rem;
  font-weight: 800;
  color: #052e16;
}

.panel-header p,
.muted {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.ghost,
.project-pick,
.compose button {
  border: 1px solid #e7e5e4;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  font: inherit;
}

.ghost,
.compose button,
.primary-btn {
  padding: 0.45rem 0.85rem;
}

.ghost.small {
  font-size: 0.85rem;
  padding: 0.35rem 0.7rem;
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #166534;
  color: #fff;
  border: 1px solid #166534;
  border-radius: 10px;
  text-decoration: none;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.primary-btn.small {
  font-size: 0.85rem;
  padding: 0.4rem 0.75rem;
}

.primary-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.empty-card,
.data-card,
.thread-panel {
  background: #fff;
  border: 1px solid #e7e5e4;
  border-radius: 16px;
  padding: 1.25rem 1.35rem;
  box-shadow: 0 1px 0 rgba(28, 25, 23, 0.03);
}

.empty-card {
  text-align: center;
  display: grid;
  gap: 0.75rem;
  justify-items: center;
}

.empty-card h2 {
  margin: 0;
  font-size: 1.1rem;
}

.card-list {
  display: grid;
  gap: 0.9rem;
}

.card-top,
.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.ticket {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #166534;
}

.data-card h3 {
  margin: 0.2rem 0;
  font-size: 1.05rem;
  color: #052e16;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: #f5f5f4;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill.issued,
.status-pill.engineering {
  background: #ecfdf5;
  color: #166534;
}

.status-pill.dispatched {
  background: #e0e7ff;
  color: #3730a3;
}

.status-pill.cancelled {
  background: #fef2f2;
  color: #b91c1c;
}

.line-list {
  list-style: none;
  margin: 1rem 0;
  padding: 0;
  display: grid;
  gap: 0.35rem;
}

.line-list li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  font-size: 0.88rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid #f5f5f4;
}

.card-foot {
  align-items: center;
  flex-wrap: wrap;
}

.confirmed {
  color: #166534;
  font-weight: 700;
  font-size: 0.85rem;
}

.phase-track {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin: 1rem 0 0.75rem;
}

.phase-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  text-align: center;
}

.phase-node .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d6d3d1;
}

.phase-node.done .dot,
.phase-node.current .dot {
  background: #166534;
}

.phase-node .label {
  font-size: 0.72rem;
  color: #78716c;
}

.phase-node.current .label {
  color: #1c1917;
  font-weight: 700;
}

.hint {
  font-size: 0.85rem;
  color: #78716c;
  margin: 0 0 0.85rem;
}

.messages-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1rem;
}

.project-pick {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  width: 100%;
  text-align: left;
  padding: 0.9rem 1rem;
  margin-bottom: 0.5rem;
}

.project-pick.active {
  border-color: #166534;
  background: #f0fdf4;
}

.project-pick span {
  color: #78716c;
  font-size: 0.82rem;
}

.thread {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-height: 180px;
  margin-bottom: 1rem;
}

.thread-item {
  max-width: 80%;
  padding: 0.7rem 0.85rem;
  border-radius: 14px;
  background: #f5f5f4;
}

.thread-item.client {
  margin-left: auto;
  background: #052e16;
  color: #fff;
}

.thread-item p {
  margin: 0.25rem 0 0;
  white-space: pre-wrap;
}

.compose {
  display: grid;
  gap: 0.55rem;
}

.compose textarea {
  width: 100%;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  padding: 0.7rem 0.8rem;
  font: inherit;
  resize: vertical;
}

.compose button {
  justify-self: end;
  background: #052e16;
  color: #fff;
  border-color: #052e16;
}

.compose button:disabled {
  opacity: 0.5;
}

.error.banner {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.phase-now {
  margin: 0.35rem 0;
  font-size: 0.9rem;
  color: #44403c;
}

.service-phase-track {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.4rem;
}

.service-phase-track li {
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
  padding: 0.45rem 0.55rem;
  border-radius: 10px;
  border: 1px solid #e7e5e4;
  background: #fafaf9;
}

.service-phase-track li.done {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.service-phase-track li.current {
  border-color: #16a34a;
  background: #dcfce7;
}

.service-phase-track .num {
  flex-shrink: 0;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 999px;
  background: #e7e5e4;
  color: #44403c;
  font-size: 0.72rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.service-phase-track li.done .num,
.service-phase-track li.current .num {
  background: #16a34a;
  color: #fff;
}

.service-phase-track .meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.service-phase-track .meta strong {
  font-size: 0.82rem;
}

.service-phase-track .meta em {
  font-style: normal;
  font-size: 0.72rem;
  color: #78716c;
}

.service-history {
  margin-top: 0.85rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e7e5e4;
}

.service-history h4 {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
}

.service-history ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}

.service-history li {
  background: #fafaf9;
  border-radius: 8px;
  padding: 0.45rem 0.6rem;
  font-size: 0.78rem;
}

.service-history li strong {
  margin-right: 0.4rem;
}

.service-history li span {
  color: #78716c;
}

.service-history li p {
  margin: 0.2rem 0 0;
  color: #44403c;
}

@media (max-width: 900px) {
  .client-page {
    height: auto;
    overflow: visible;
  }

  .client-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .client-sidebar {
    height: auto;
    overflow: visible;
    border-right: none;
    border-bottom: 1px solid rgba(74, 222, 128, 0.12);
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    flex: none;
  }

  .nav-btn {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .nav-link {
    margin-top: 0;
    border-top: none;
    border-left: 1px solid rgba(74, 222, 128, 0.12);
    border-radius: 10px;
    padding-top: 0.75rem;
  }

  .sidebar-footer {
    flex-direction: row;
    align-items: center;
  }

  .logout-btn {
    width: auto;
    flex-shrink: 0;
  }

  .client-main {
    height: auto;
    overflow: visible;
    padding: 1rem;
  }

  .messages-layout,
  .phase-track {
    grid-template-columns: 1fr;
  }

  .panel-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

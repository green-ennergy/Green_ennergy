<template>
  <div class="client-dashboard">
    <header class="bar">
      <div class="bar-left">
        <router-link to="/" class="brand">Energy Agency</router-link>
        <span class="user-chip">{{ user?.name || user?.email }}</span>
      </div>
      <div class="bar-right">
        <router-link to="/store" class="ghost link">{{ t('dashboard.rfq.goStore') }}</router-link>
        <button type="button" class="ghost" @click="logout">{{ t('common.signOut') }}</button>
      </div>
    </header>

    <main>
      <nav class="tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="tab"
          :class="{ active: activeTab === tab.id }"
          :aria-selected="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span v-if="tab.count != null" class="tab-count">{{ tab.count }}</span>
        </button>
      </nav>

      <p v-if="pageError" class="error banner">{{ pageError }}</p>

      <!-- RFQ tab -->
      <section v-if="activeTab === 'rfq'" class="panel-block">
        <header class="section-head">
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

        <div v-else class="rfq-list">
          <article v-for="rfq in rfqTickets" :key="rfq.id" class="rfq-card">
            <div class="rfq-top">
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

            <div class="rfq-foot">
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
            </div>
          </article>
        </div>
      </section>

      <!-- Follow-up tab -->
      <section v-else-if="activeTab === 'followup'" class="panel-block">
        <header class="section-head">
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

        <div v-else class="followup-list">
          <article v-for="project in projects" :key="project.id" class="followup-card">
            <div class="followup-top">
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

      <!-- Messages tab -->
      <section v-else class="panel-block">
        <header class="section-head">
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

        <div v-else class="layout">
          <aside>
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

          <div v-if="selectedId" class="panel">
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
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api, { getApiErrorMessage } from '../api/client'
import { useAuth } from '../composables/useAuth'
import {
  formatDate,
  formatMoney,
  rfqItemLabel,
  rfqQuoteTotal,
  rfqStatusLabel
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

const activeTab = ref('rfq')
const projects = ref([])
const messages = ref([])
const selectedId = ref(null)
const draft = ref('')
const sending = ref(false)
const pageError = ref('')
const confirmingId = ref(null)
const rfqLoading = ref(false)

const workflowSteps = computed(() => {
  locale.value
  return getWorkflowSteps()
})

const tabs = computed(() => {
  locale.value
  return [
    { id: 'rfq', label: t('dashboard.tabs.rfq'), count: rfqTickets.value.length },
    { id: 'followup', label: t('dashboard.tabs.followup'), count: projects.value.length },
    { id: 'messages', label: t('dashboard.tabs.messages'), count: null }
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
})

onMounted(async () => {
  const tab = typeof route.query.tab === 'string' ? route.query.tab : 'rfq'
  if (['rfq', 'followup', 'messages'].includes(tab)) {
    activeTab.value = tab
  }

  try {
    await Promise.all([loadRfqs(), loadProjects()])
  } catch (err) {
    pageError.value = getApiErrorMessage(err, 'Could not load dashboard.')
  }
})
</script>

<style scoped>
.client-dashboard {
  min-height: 100vh;
  background: #f5f5f4;
  color: #1c1917;
  font-family: 'Outfit', sans-serif;
}

.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #e7e5e4;
}

.bar-left,
.bar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand {
  color: inherit;
  font-weight: 700;
  text-decoration: none;
}

.user-chip {
  font-size: 0.82rem;
  color: #78716c;
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

.ghost.link {
  text-decoration: none;
  color: inherit;
  display: inline-flex;
  align-items: center;
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
}

.primary-btn.small {
  font-size: 0.85rem;
  padding: 0.4rem 0.75rem;
}

.primary-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem 2.5rem;
}

.tabs {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.tab {
  border: 1px solid transparent;
  background: transparent;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font: inherit;
  font-weight: 600;
  color: #78716c;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.tab.active {
  background: #fff;
  border-color: #e7e5e4;
  color: #1c1917;
}

.tab-count {
  font-size: 0.75rem;
  background: #e7e5e4;
  border-radius: 999px;
  padding: 0.1rem 0.45rem;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.section-head h1 {
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
}

.section-head p,
.muted {
  margin: 0;
  color: #78716c;
  font-size: 0.9rem;
}

.empty-card,
.rfq-card,
.followup-card,
.panel {
  background: #fff;
  border: 1px solid #e7e5e4;
  border-radius: 16px;
  padding: 1.25rem 1.35rem;
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

.rfq-list,
.followup-list {
  display: grid;
  gap: 0.9rem;
}

.rfq-top,
.followup-top,
.rfq-foot {
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

.rfq-card h3,
.followup-card h3 {
  margin: 0.2rem 0;
  font-size: 1.05rem;
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

.rfq-foot {
  align-items: center;
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

.layout {
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
  border-color: #1c1917;
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
  background: #1c1917;
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
  background: #1c1917;
  color: #fff;
  border-color: #1c1917;
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

@media (max-width: 720px) {
  .layout,
  .phase-track {
    grid-template-columns: 1fr;
  }

  .section-head,
  .bar {
    flex-direction: column;
    align-items: stretch;
  }

  .bar-right {
    justify-content: space-between;
  }
}
</style>

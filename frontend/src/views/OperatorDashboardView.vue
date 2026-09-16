<template>
  <div class="operator-page">
    <!-- Top Header -->
    <header class="operator-header animate-fade-in">
      <div class="header-brand">
        <router-link to="/" class="brand-link">
          <div class="brand-icon">
            <OperatorIcon name="bolt" :size="18" />
          </div>
          <div>
            <span class="brand-title">ENERGY AGENCY</span>
            <span class="brand-sub">{{ t('operator.console') || 'Operator Field Console' }}</span>
          </div>
        </router-link>
      </div>

      <!-- Right Meta: Duty status toggle, Operator name, Sign Out -->
      <div class="header-meta">
        <!-- Duty Status Switcher -->
        <div class="duty-pill" :class="dutyStatus">
          <span class="duty-dot"></span>
          <select
            :value="dutyStatus"
            @change="setDutyStatus($event.target.value)"
            class="duty-select"
          >
            <option value="on_duty">{{ t('operator.duty.onDuty') || 'On Duty (Active)' }}</option>
            <option value="on_break">{{ t('operator.duty.onBreak') || 'On Break' }}</option>
            <option value="off_duty">{{ t('operator.duty.offDuty') || 'Off Duty' }}</option>
          </select>
        </div>

        <div class="operator-profile">
          <span class="operator-avatar">
            <OperatorIcon name="user" :size="15" />
          </span>
          <span class="operator-name">{{ user?.name || 'Operator (Field)' }}</span>
        </div>

        <button @click="handleLogout" class="logout-btn">
          {{ t('common.signOut') || 'Sign out' }}
        </button>
      </div>
    </header>

    <!-- Sub-Navbar Navigation Tabs -->
    <nav class="sub-nav animate-fade-in">
      <div class="sub-nav-container">
        <button
          v-for="tab in mainTabs"
          :key="tab.id"
          class="sub-tab-btn"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          <OperatorIcon :name="tab.icon" :size="17" />
          <span>{{ tab.label }}</span>
          <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
        </button>

        <div class="sub-nav-actions">
          <button @click="resetToDemoTasks" class="reset-demo-btn" :title="t('operator.resetDemo') || 'Reset initial task samples'">
            <OperatorIcon name="refresh" :size="14" />
            <span>{{ t('operator.resetDemo') || 'Reset Demo' }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Container Layout -->
    <main class="operator-main container animate-fade-in">
      <!-- Off-duty Warning Banner if applicable -->
      <div v-if="dutyStatus === 'off_duty'" class="status-warning-banner">
        <OperatorIcon name="alert" :size="18" />
        <span>{{ t('operator.duty.offDutyNotice') || 'You are currently marked as Off Duty. Set status to "On Duty" when ready to receive new dispatch updates.' }}</span>
      </div>

      <!-- KPI Summary Grid -->
      <OperatorKpiGrid :stats="stats" />

      <!-- TAB 1: TASKS HUB -->
      <section v-if="currentTab === 'tasks'" class="panel">
        <header class="panel-header">
          <div>
            <h1>{{ t('operator.tabs.tasksTitle') || 'Assigned Field Tasks' }}</h1>
            <p>{{ t('operator.tabs.tasksSub') || 'Installation, maintenance, delivery, and energy feasibility studies dispatched by Admin.' }}</p>
          </div>
        </header>

        <!-- Filter & Search Controls -->
        <TaskFilterBar
          v-model:activeType="activeType"
          v-model:activeStatus="activeStatus"
          v-model:searchQuery="searchQuery"
          v-model:viewMode="viewMode"
          :typeCounts="stats.byType"
        />

        <!-- Empty State -->
        <div v-if="filteredTasks.length === 0" class="empty-state">
          <div class="empty-icon-wrap">
            <OperatorIcon name="search" :size="32" />
          </div>
          <h3>{{ t('operator.empty.title') || 'No tasks match your filter' }}</h3>
          <p>{{ t('operator.empty.sub') || 'Try selecting a different task type or status, or clear the search keyword.' }}</p>
          <button @click="clearFilters" class="clear-filters-btn">
            {{ t('operator.empty.clearFilters') || 'Clear All Filters' }}
          </button>
        </div>

        <!-- Tasks Cards Grid / List -->
        <div
          v-else
          class="tasks-container"
          :class="{ 'is-list-view': viewMode === 'list' }"
        >
          <TaskCard
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            :viewMode="viewMode"
            @openDetails="openTaskDrawer"
            @updateStatus="updateTaskStatus"
            @reportIncident="openIncidentModal"
          />
        </div>
      </section>

      <!-- TAB 2: TODAY'S FIELD AGENDA -->
      <section v-else-if="currentTab === 'agenda'" class="panel">
        <header class="panel-header">
          <div>
            <h1>{{ t('operator.agenda.title') || "Today's Field Route & Schedule" }}</h1>
            <p>{{ t('operator.agenda.sub') || 'Step-by-step route planning for today’s active assignments.' }}</p>
          </div>
        </header>

        <div class="agenda-timeline">
          <div
            v-for="(task, index) in todayTasks"
            :key="task.id"
            class="agenda-card"
            :class="[task.type, task.status]"
          >
            <div class="agenda-time-col">
              <span class="agenda-step">Stop {{ index + 1 }}</span>
              <strong class="agenda-hour">{{ task.timeSlot }}</strong>
              <span class="agenda-status-pill" :class="task.status">{{ task.status.replace('_', ' ') }}</span>
            </div>

            <div class="agenda-main-col">
              <div class="agenda-head">
                <span class="task-id">{{ task.id }}</span>
                <span class="type-tag" :class="task.type">{{ task.type.toUpperCase() }}</span>
                <h3 class="agenda-title">{{ task.title }}</h3>
              </div>

              <div class="agenda-details">
                <div class="det-item">
                  <OperatorIcon name="user" :size="14" />
                  <strong>{{ task.client.name }}</strong>
                </div>
                <div class="det-item">
                  <OperatorIcon name="map-pin" :size="14" />
                  <span>{{ task.client.address }}, {{ task.client.city }}</span>
                </div>
                <div class="det-item" v-if="task.client.phone">
                  <OperatorIcon name="phone" :size="14" />
                  <a :href="`tel:${task.client.phone}`" class="agenda-phone">{{ task.client.phone }}</a>
                </div>
              </div>

              <p v-if="task.adminNotes" class="agenda-note">
                <strong>Scope:</strong> {{ task.adminNotes }}
              </p>

              <div class="agenda-actions">
                <button
                  v-if="task.status === 'assigned'"
                  class="btn-agenda-action start"
                  @click="updateTaskStatus(task.id, 'in_progress')"
                >
                  <OperatorIcon name="bolt" :size="15" />
                  <span>Start Assignment</span>
                </button>
                <button
                  class="btn-agenda-action inspect"
                  @click="openTaskDrawer(task)"
                >
                  <OperatorIcon name="arrow-right" :size="15" />
                  <span>Open Task Workspace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 2: SERVICES REALIZATION PROGRESS -->
      <section v-else-if="currentTab === 'services'" class="panel">
        <header class="panel-header">
          <div>
            <h1>Assigned Service Realization Requests</h1>
            <p>Update realization progress phases (Step 1 to 5) for active client service installations and audits.</p>
          </div>
        </header>

        <div v-if="operatorServiceRequests.length === 0" class="empty-state">
          <p>No active service requests assigned.</p>
        </div>

        <div v-else class="services-op-list">
          <div v-for="req in operatorServiceRequests" :key="req.id" class="op-service-card">
            <div class="card-head">
              <div>
                <span class="req-id"><code>{{ req.id }}</code></span>
                <h3>{{ req.serviceTitle }}</h3>
                <p class="req-client">📍 {{ req.clientName }} — {{ req.city }} ({{ req.address }}) · 📞 {{ req.clientPhone }}</p>
              </div>

              <div class="phase-current-badge">
                Realization Phase: <strong>Step {{ req.currentPhase }} / 5</strong>
              </div>
            </div>

            <!-- Realization Progress Step buttons -->
            <div class="phase-update-box">
              <span>Advance Realization Progress Step:</span>
              <div class="phase-buttons">
                <button
                  v-for="st in 5"
                  :key="st"
                  :class="['phase-btn', { active: req.currentPhase === st }]"
                  @click="updateRequestPhase(req.id, st, `Operator (${user?.name || 'Field'})`, `Updated on-site realization step to ${st}`)"
                >
                  Step {{ st }}
                </button>
              </div>
            </div>

            <div class="req-notes">
              <strong>Client Notes:</strong> {{ req.notes || 'None provided' }}
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 3: COMPLETED ARCHIVE -->
      <section v-else-if="currentTab === 'archive'" class="panel">
        <header class="panel-header">
          <div>
            <h1>{{ t('operator.archive.title') || 'Completed Field Work Archive' }}</h1>
            <p>{{ t('operator.archive.sub') || 'Historical archive of signed deliveries, installed solar setups, and audits.' }}</p>
          </div>
        </header>

        <div v-if="completedTasks.length === 0" class="empty-state">
          <div class="empty-icon-wrap">
            <OperatorIcon name="check-circle" :size="32" />
          </div>
          <h3>{{ t('operator.archive.emptyTitle') || 'No completed tasks yet' }}</h3>
          <p>{{ t('operator.archive.emptySub') || 'Tasks marked as completed will be recorded here.' }}</p>
        </div>

        <div v-else class="tasks-container">
          <TaskCard
            v-for="task in completedTasks"
            :key="task.id"
            :task="task"
            viewMode="grid"
            @openDetails="openTaskDrawer"
            @updateStatus="updateTaskStatus"
          />
        </div>
      </section>
    </main>

    <!-- Task Detail Drawer -->
    <TaskDetailDrawer
      v-if="selectedTask"
      :task="selectedTask"
      @close="closeTaskDrawer"
      @updateStatus="handleDrawerStatusUpdate"
      @updateNotes="updateTaskNotes"
      @toggleChecklist="toggleChecklistItem"
      @updateStudyData="updateStudyData"
      @confirmDelivery="handleDeliveryConfirm"
      @reportIncident="openIncidentModal"
    />

    <!-- Incident Report Modal -->
    <IncidentReportModal
      v-if="incidentTask"
      :task="incidentTask"
      @close="closeIncidentModal"
      @submit="handleIncidentSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composables/useAuth'
import { useOperator } from '../composables/useOperator'
import { useServices } from '../composables/useServices'
import OperatorIcon from '../components/operatorDashboard/OperatorIcon.vue'

const {
  serviceRequests,
  updateRequestPhase
} = useServices()

const operatorServiceRequests = computed(() => {
  return serviceRequests.value
})
import OperatorKpiGrid from '../components/operatorDashboard/OperatorKpiGrid.vue'
import TaskFilterBar from '../components/operatorDashboard/TaskFilterBar.vue'
import TaskCard from '../components/operatorDashboard/TaskCard.vue'
import TaskDetailDrawer from '../components/operatorDashboard/TaskDetailDrawer.vue'
import IncidentReportModal from '../components/operatorDashboard/IncidentReportModal.vue'

const router = useRouter()
const { t } = useI18n()
const { user, logoutUser } = useAuth()

const {
  tasks,
  dutyStatus,
  stats,
  setDutyStatus,
  updateTaskStatus,
  updateTaskNotes,
  toggleChecklistItem,
  updateStudyData,
  updateDeliveryProof,
  reportIncident,
  resetToDemoTasks
} = useOperator()

// Navigation & Filters
const currentTab = ref('tasks') // tasks | agenda | archive
const activeType = ref('all')
const activeStatus = ref('all')
const searchQuery = ref('')
const viewMode = ref('grid')

// Modals / Drawers
const selectedTask = ref(null)
const incidentTask = ref(null)

const mainTabs = computed(() => [
  { id: 'tasks', label: t('operator.tabs.tasks') || 'Tasks Hub', icon: 'bolt', badge: stats.value.assigned + stats.value.inProgress },
  { id: 'services', label: 'Service Realization', icon: 'refresh', badge: operatorServiceRequests.value.length },
  { id: 'agenda', label: t('operator.tabs.agenda') || "Today's Agenda", icon: 'calendar', badge: stats.value.todayPending || null },
  { id: 'archive', label: t('operator.tabs.archive') || 'Completed Archive', icon: 'check-circle' }
])

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    // Type filter
    if (activeType.value !== 'all' && task.type !== activeType.value) {
      return false
    }

    // Status filter
    if (activeStatus.value !== 'all' && task.status !== activeStatus.value) {
      return false
    }

    // Search query filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchId = task.id.toLowerCase().includes(q)
      const matchTitle = task.title.toLowerCase().includes(q)
      const matchClient = task.client.name.toLowerCase().includes(q)
      const matchCity = task.client.city.toLowerCase().includes(q)
      const matchAddress = task.client.address.toLowerCase().includes(q)
      if (!matchId && !matchTitle && !matchClient && !matchCity && !matchAddress) {
        return false
      }
    }

    return true
  })
})

const todayTasks = computed(() => {
  return tasks.value.filter(task => {
    return task.scheduledDate === '2026-09-15' || task.status === 'in_progress'
  })
})

const completedTasks = computed(() => {
  return tasks.value.filter(task => task.status === 'completed')
})

const clearFilters = () => {
  activeType.value = 'all'
  activeStatus.value = 'all'
  searchQuery.value = ''
}

const openTaskDrawer = (task) => {
  selectedTask.value = task
}

const closeTaskDrawer = () => {
  selectedTask.value = null
}

const handleDrawerStatusUpdate = (taskId, status) => {
  const updated = updateTaskStatus(taskId, status)
  if (updated && selectedTask.value?.id === taskId) {
    selectedTask.value = { ...updated }
  }
}

const handleDeliveryConfirm = (taskId, recipientName, notes) => {
  const updated = updateDeliveryProof(taskId, recipientName, notes)
  if (updated && selectedTask.value?.id === taskId) {
    selectedTask.value = { ...updated }
  }
}

const openIncidentModal = (task) => {
  incidentTask.value = task
}

const closeIncidentModal = () => {
  incidentTask.value = null
}

const handleIncidentSubmit = (taskId, data) => {
  const updated = reportIncident(taskId, data)
  if (updated && selectedTask.value?.id === taskId) {
    selectedTask.value = { ...updated }
  }
}

const handleLogout = async () => {
  await logoutUser()
  router.push('/login')
}
</script>

<style scoped>
.operator-page {
  min-height: 100vh;
  background-color: #f8faf9;
  color: #111827;
  font-family: 'Outfit', sans-serif;
}

/* Header matching Admin Dashboard design */
.operator-header {
  background: #020d07;
  color: #f0fdf4;
  padding: 0.95rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(74, 222, 128, 0.15);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
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
  border: 1px solid rgba(74, 222, 128, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
}

.brand-title {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  letter-spacing: 1.5px;
  font-size: 0.95rem;
}

.brand-sub {
  display: block;
  font-size: 0.72rem;
  color: #4ade80;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

/* Duty Switcher */
.duty-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.duty-pill.on_duty {
  border-color: rgba(74, 222, 128, 0.4);
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.duty-pill.on_duty .duty-dot {
  background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
}

.duty-pill.on_break {
  border-color: rgba(234, 179, 8, 0.4);
  background: rgba(234, 179, 8, 0.1);
  color: #facc15;
}

.duty-pill.on_break .duty-dot {
  background: #facc15;
}

.duty-pill.off_duty {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

.duty-pill.off_duty .duty-dot {
  background: #f87171;
}

.duty-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.duty-select {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  outline: none;
  cursor: pointer;
}

.duty-select option {
  background: #020d07;
  color: #f0fdf4;
}

.operator-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.operator-avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
}

.operator-name {
  font-size: 0.88rem;
  font-weight: 600;
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(240, 253, 244, 0.25);
  color: #f0fdf4;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(240, 253, 244, 0.08);
  border-color: rgba(74, 222, 128, 0.5);
}

/* Sub-nav Tabs */
.sub-nav {
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.sub-nav-container {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
}

.sub-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.95rem 1.15rem;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.sub-tab-btn:hover {
  color: #052e16;
}

.sub-tab-btn.active {
  color: #15803d;
  border-bottom-color: #16a34a;
  font-weight: 700;
}

.tab-badge {
  background: #16a34a;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
}

.sub-nav-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.reset-demo-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
}

.reset-demo-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

/* Operator Main */
.operator-main {
  padding: 2rem 2.5rem;
}

.status-warning-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.panel-header h1 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #052e16;
  margin-bottom: 0.25rem;
}

.panel-header p {
  color: #6b7280;
  font-size: 0.92rem;
}

/* Tasks Container */
.tasks-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.25rem;
}

.tasks-container.is-list-view {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
  background: #ffffff;
  border-radius: 18px;
  border: 1px dashed rgba(5, 46, 22, 0.15);
}

.empty-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: #ecfdf5;
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.15rem;
  color: #052e16;
  margin-bottom: 0.35rem;
}

.empty-state p {
  font-size: 0.88rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
  max-width: 400px;
}

.clear-filters-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  background: #052e16;
  color: #4ade80;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

/* Agenda Timeline */
.agenda-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.agenda-card {
  display: grid;
  grid-template-columns: 180px 1fr;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid rgba(5, 46, 22, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.agenda-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(5, 46, 22, 0.06);
}

.agenda-time-col {
  background: #f8fbf9;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  text-align: center;
}

.agenda-step {
  font-size: 0.72rem;
  font-weight: 800;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.agenda-hour {
  font-size: 1.1rem;
  color: #052e16;
  font-family: 'Space Grotesk', sans-serif;
}

.agenda-status-pill {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.agenda-status-pill.assigned { background: #dbeafe; color: #1d4ed8; }
.agenda-status-pill.in_progress { background: #fef08a; color: #854d0e; }
.agenda-status-pill.on_hold { background: #fed7aa; color: #9a3412; }
.agenda-status-pill.completed { background: #dcfce7; color: #15803d; }

.agenda-main-col {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.agenda-head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  margin-bottom: 0.65rem;
}

.type-tag {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

.type-tag.installation { background: #ecfdf5; color: #15803d; }
.type-tag.maintenance { background: #fffbeb; color: #b45309; }
.type-tag.delivery { background: #f5f3ff; color: #6d28d9; }
.type-tag.study { background: #ecfeff; color: #0e7490; }

.agenda-title {
  width: 100%;
  font-size: 1.1rem;
  font-weight: 800;
  color: #052e16;
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
}

.agenda-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  font-size: 0.85rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
}

.det-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.agenda-phone {
  color: #16a34a;
  font-weight: 700;
}

.agenda-note {
  font-size: 0.82rem;
  color: #6b7280;
  background: #f9fafb;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.95rem;
}

.agenda-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-agenda-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.95rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-agenda-action.start {
  background: #052e16;
  color: #4ade80;
}

.btn-agenda-action.inspect {
  background: #f3f4f6;
  color: #374151;
}

.btn-agenda-action:hover {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .agenda-card {
    grid-template-columns: 1fr;
  }
  .agenda-time-col {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    flex-direction: row;
    justify-content: space-between;
  }
}

/* Service Realization Styles for Operator */
.services-op-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.op-service-card {
  background: #ffffff;
  border: 1px solid rgba(5, 46, 22, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.op-service-card .card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.req-id {
  font-size: 0.78rem;
  color: #16a34a;
  font-weight: 800;
}

.op-service-card h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #052e16;
  margin: 0.25rem 0;
}

.req-client {
  font-size: 0.85rem;
  color: #64748b;
}

.phase-current-badge {
  background: #dcfce7;
  color: #15803d;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.phase-update-box {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.phase-update-box span {
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
}

.phase-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.phase-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.phase-btn.active {
  background: #052e16;
  color: #4ade80;
  border-color: #052e16;
}

.req-notes {
  font-size: 0.85rem;
  color: #475569;
}
</style>

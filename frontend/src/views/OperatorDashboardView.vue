<template>
  <div class="operator-page">
    <div class="operator-layout">
      <aside class="operator-sidebar">
        <div class="sidebar-brand">
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

        <nav class="sidebar-nav">
          <button
            v-for="tab in mainTabs"
            :key="tab.id"
            type="button"
            class="nav-btn"
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id"
          >
            <span class="nav-icon"><OperatorIcon :name="tab.icon" :size="18" /></span>
            <span>{{ tab.label }}</span>
            <span v-if="tab.badge" class="nav-badge">{{ tab.badge }}</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="duty-pill" :class="dutyStatus">
            <span class="duty-dot"></span>
            <select
              :value="dutyStatus"
              @change="handleSetDutyStatus($event.target.value)"
              class="duty-select"
            >
              <option value="on_duty">{{ t('operator.duty.onDuty') || 'On Duty (Active)' }}</option>
              <option value="on_break">{{ t('operator.duty.onBreak') || 'On Break' }}</option>
              <option value="off_duty">{{ t('operator.duty.offDuty') || 'Off Duty' }}</option>
            </select>
          </div>

          <div class="sidebar-profile">
            <div class="profile-avatar" aria-hidden="true">{{ userInitials }}</div>
            <div class="profile-meta">
              <span class="operator-name">{{ displayName }}</span>
              <span class="operator-role">{{ user?.email || t('operator.console') }}</span>
            </div>
          </div>

          <button type="button" @click="handleLogout" class="logout-btn">
            {{ t('common.signOut') || 'Sign out' }}
          </button>
        </div>
      </aside>

      <main class="operator-main">
      <!-- Off-duty Warning Banner if applicable -->
      <div v-if="dutyStatus === 'off_duty'" class="status-warning-banner">
        <OperatorIcon name="alert" :size="18" />
        <span>{{ t('operator.duty.offDutyNotice') || 'You are currently marked as Off Duty. Set status to "On Duty" when ready to receive new dispatch updates.' }}</span>
      </div>

      <div v-if="missionsError" class="status-warning-banner error">
        <OperatorIcon name="alert" :size="18" />
        <span>{{ missionsError }}</span>
        <button type="button" class="clear-filters-btn" @click="handleRefreshMissions">
          {{ t('operator.refresh') || 'Retry' }}
        </button>
      </div>

      <!-- TAB 1: TASKS HUB -->
      <section v-if="currentTab === 'tasks'" class="panel">
        <header class="panel-header">
          <div>
            <h1>{{ t('operator.tabs.tasksTitle') || 'Assigned Field Tasks' }}</h1>
            <p>{{ t('operator.tabs.tasksSub') || 'Installation, maintenance, delivery, and energy feasibility studies dispatched by Admin.' }}</p>
          </div>
          <button
            type="button"
            class="refresh-btn"
            :disabled="missionsLoading"
            @click="handleRefreshMissions"
          >
            {{ missionsLoading ? (t('common.loading') || 'Loading…') : (t('operator.refresh') || 'Refresh') }}
          </button>
        </header>

        <OperatorKpiGrid :stats="stats" />

        <!-- Filter & Search Controls -->
        <TaskFilterBar
          v-model:activeType="activeType"
          v-model:activeStatus="activeStatus"
          v-model:searchQuery="searchQuery"
          v-model:viewMode="viewMode"
          :typeCounts="stats.byType"
        />

        <div v-if="missionsLoading && !tasks.length" class="empty-state">
          <p>{{ t('common.loading') || 'Loading missions…' }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTasks.length === 0" class="empty-state">
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
            @updateStatus="handleCardStatusUpdate"
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
                <span class="task-id">{{ task.code || task.id }}</span>
                <span class="type-tag" :class="task.type">{{ task.type.toUpperCase() }}</span>
                <h3 class="agenda-title">{{ task.title }}</h3>
              </div>

              <div class="agenda-details">
                <div class="det-item">
                  <OperatorIcon name="user" :size="14" />
                  <strong>{{ task.client?.name || '—' }}</strong>
                </div>
                <div class="det-item">
                  <OperatorIcon name="map-pin" :size="14" />
                  <span>{{ task.client?.address || '—' }}, {{ task.client?.city || '—' }}</span>
                </div>
                <div class="det-item" v-if="task.client?.phone">
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
                  @click="handleCardStatusUpdate(task.id, 'in_progress')"
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

      <!-- ARCHIVE -->
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
            @updateStatus="handleCardStatusUpdate"
          />
        </div>
      </section>
    </main>
    </div>

    <!-- Task Detail Drawer -->
    <TaskDetailDrawer
      v-if="selectedTask"
      :task="selectedTask"
      @close="closeTaskDrawer"
      @updateStatus="handleDrawerStatusUpdate"
      @updateNotes="handleNotesUpdate"
      @toggleChecklist="handleChecklistToggle"
      @updateStudyData="handleStudyUpdate"
      @updateInstallationMeta="handleInstallationMeta"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composables/useAuth'
import { useOperator } from '../composables/useOperator'
import { useToast } from '../composables/useToast'
import OperatorIcon from '../components/operatorDashboard/OperatorIcon.vue'
import OperatorKpiGrid from '../components/operatorDashboard/OperatorKpiGrid.vue'
import TaskFilterBar from '../components/operatorDashboard/TaskFilterBar.vue'
import TaskCard from '../components/operatorDashboard/TaskCard.vue'
import TaskDetailDrawer from '../components/operatorDashboard/TaskDetailDrawer.vue'
import IncidentReportModal from '../components/operatorDashboard/IncidentReportModal.vue'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const { user, logoutUser, refreshUser } = useAuth()

const {
  tasks,
  dutyStatus,
  operatorProfile,
  isLoading: missionsLoading,
  error: missionsError,
  stats,
  loadMissions,
  setDutyStatus,
  updateTaskStatus,
  updateTaskNotes,
  toggleChecklistItem,
  updateStudyData,
  updateDeliveryProof,
  updateInstallationMeta,
  reportIncident,
  refreshMissions
} = useOperator()

const displayName = computed(
  () => operatorProfile.value?.name || user.value?.name || 'Operator'
)

const userInitials = computed(() => {
  const name = displayName.value || ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'OP'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
})

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
  { id: 'tasks', label: t('operator.tabs.tasks') || 'Tasks Hub', icon: 'bolt', badge: (stats.value.assigned + stats.value.inProgress) || null },
  { id: 'agenda', label: t('operator.tabs.agenda') || "Today's Agenda", icon: 'calendar', badge: stats.value.todayPending || null },
  { id: 'archive', label: t('operator.tabs.archive') || 'Completed Archive', icon: 'check-circle', badge: stats.value.completed || null }
])

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    // Completed work lives only in Archive
    if (task.status === 'completed') return false

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
      const matchId = String(task.code || task.id).toLowerCase().includes(q)
      const matchTitle = (task.title || '').toLowerCase().includes(q)
      const matchClient = (task.client?.name || '').toLowerCase().includes(q)
      const matchCity = (task.client?.city || '').toLowerCase().includes(q)
      const matchAddress = (task.client?.address || '').toLowerCase().includes(q)
      if (!matchId && !matchTitle && !matchClient && !matchCity && !matchAddress) {
        return false
      }
    }

    return true
  })
})

const todayTasks = computed(() => {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  const todayDate = `${y}-${m}-${d}`
  return tasks.value
    .filter((task) =>
      task.status !== 'completed' &&
      (task.scheduledDate === todayDate || task.status === 'in_progress')
    )
    .sort((a, b) => String(a.timeSlot).localeCompare(String(b.timeSlot)))
})

const completedTasks = computed(() => {
  return tasks.value.filter(task => task.status === 'completed')
})

function moveCompletedToArchive(taskId) {
  if (selectedTask.value?.id === taskId) {
    selectedTask.value = null
  }
  currentTab.value = 'archive'
}

const clearFilters = () => {
  activeType.value = 'all'
  activeStatus.value = 'all'
  searchQuery.value = ''
}

const openTaskDrawer = (task) => {
  const fresh = tasks.value.find((t) => t.id === task.id) || task
  selectedTask.value = { ...fresh }
}

const closeTaskDrawer = () => {
  selectedTask.value = null
}

// Keep the open drawer in sync when API responses replace a task in the list
watch(tasks, (list) => {
  if (!selectedTask.value) return
  const fresh = list.find((t) => t.id === selectedTask.value.id)
  if (fresh) selectedTask.value = { ...fresh }
})

const handleDrawerStatusUpdate = async (taskId, status) => {
  try {
    const updated = await updateTaskStatus(taskId, status)
    if (status === 'completed') {
      moveCompletedToArchive(taskId)
    } else if (updated && selectedTask.value?.id === taskId) {
      selectedTask.value = { ...updated }
    }
    toast.success(t('operator.toast.statusUpdated') || 'Status updated')
  } catch (_) {
    toast.error(missionsError.value || 'Could not update status.')
  }
}

const handleDeliveryConfirm = async (taskId, recipientName, notes) => {
  try {
    await updateDeliveryProof(taskId, recipientName, notes)
    moveCompletedToArchive(taskId)
    toast.success(t('operator.toast.deliverySigned') || 'Delivery signed off')
  } catch (_) {
    toast.error(missionsError.value || 'Could not confirm delivery.')
  }
}

const handleNotesUpdate = async (taskId, notes) => {
  try {
    const updated = await updateTaskNotes(taskId, notes)
    if (updated && selectedTask.value?.id === taskId) {
      selectedTask.value = { ...updated }
    }
  } catch (_) {
    toast.error(missionsError.value || 'Could not save notes.')
  }
}

const handleChecklistToggle = async (taskId, listKey, itemIndex) => {
  try {
    const updated = await toggleChecklistItem(taskId, listKey, itemIndex)
    if (updated && selectedTask.value?.id === taskId) {
      selectedTask.value = { ...updated }
    }
  } catch (_) {
    toast.error(missionsError.value || 'Could not update checklist.')
  }
}

const handleStudyUpdate = async (taskId, data) => {
  try {
    const updated = await updateStudyData(taskId, data)
    if (updated && selectedTask.value?.id === taskId) {
      selectedTask.value = { ...updated }
    }
  } catch (_) {
    toast.error(missionsError.value || 'Could not save study data.')
  }
}

const handleInstallationMeta = async (taskId, meta) => {
  try {
    const updated = await updateInstallationMeta(taskId, meta)
    if (updated && selectedTask.value?.id === taskId) {
      selectedTask.value = { ...updated }
    }
  } catch (_) {
    toast.error(missionsError.value || 'Could not save commissioning data.')
  }
}

const handleCardStatusUpdate = async (taskId, status) => {
  try {
    await updateTaskStatus(taskId, status)
    if (status === 'completed') {
      moveCompletedToArchive(taskId)
    }
    toast.success(t('operator.toast.statusUpdated') || 'Status updated')
  } catch (_) {
    toast.error(missionsError.value || 'Could not update status.')
  }
}

const openIncidentModal = (task) => {
  incidentTask.value = task
}

const closeIncidentModal = () => {
  incidentTask.value = null
}

const handleIncidentSubmit = async (taskId, data) => {
  try {
    const updated = await reportIncident(taskId, data)
    if (updated && selectedTask.value?.id === taskId) {
      selectedTask.value = { ...updated }
    }
    toast.success(t('operator.toast.incidentReported') || 'Incident reported')
  } catch (_) {
    toast.error(missionsError.value || 'Could not report incident.')
  }
  closeIncidentModal()
}

const handleLogout = async () => {
  await logoutUser()
  router.push('/login')
}

async function handleSetDutyStatus(status) {
  try {
    await setDutyStatus(status)
  } catch (_) {
    toast.error(missionsError.value || 'Could not update duty status.')
  }
}

async function handleRefreshMissions() {
  try {
    await loadMissions()
    toast.success(t('operator.toast.refreshed') || 'Missions refreshed')
  } catch (_) {
    toast.error(missionsError.value || 'Could not load missions.')
  }
}

onMounted(async () => {
  await refreshUser()
  try {
    await loadMissions()
  } catch (_) {
    toast.error(missionsError.value || 'Could not load missions.')
  }
})
</script>

<style scoped>
.operator-page {
  height: 100vh;
  overflow: hidden;
  background-color: #f8faf9;
  color: #111827;
  font-family: 'Outfit', sans-serif;
}

.operator-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  height: 100%;
}

.operator-sidebar {
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
  border: 1px solid rgba(74, 222, 128, 0.35);
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
}

.nav-btn:hover {
  background: rgba(74, 222, 128, 0.08);
  color: #f0fdf4;
}

.nav-btn.active {
  background: rgba(74, 222, 128, 0.14);
  color: #4ade80;
}

.nav-icon {
  display: flex;
  align-items: center;
  color: inherit;
  flex-shrink: 0;
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

.operator-name {
  font-size: 0.88rem;
  font-weight: 600;
  opacity: 0.95;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.operator-role {
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
}

.logout-btn:hover {
  background: rgba(240, 253, 244, 0.08);
  border-color: rgba(74, 222, 128, 0.35);
}

.duty-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
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
  flex-shrink: 0;
}

.duty-select {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  width: 100%;
  min-width: 0;
}

.duty-select option {
  background: #020d07;
  color: #f0fdf4;
}

.operator-main {
  min-width: 0;
  height: 100%;
  padding: 1.15rem 1.5rem 1.5rem;
  overflow: auto;
}

.operator-main > .panel {
  padding: 0;
}

.refresh-btn {
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.5rem 0.95rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 650;
  cursor: pointer;
  white-space: nowrap;
}

.refresh-btn:hover:not(:disabled) {
  border-color: #16a34a;
  color: #15803d;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.status-warning-banner.error {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #9a3412;
  flex-wrap: wrap;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
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

@media (max-width: 900px) {
  .operator-page {
    height: auto;
    overflow: visible;
  }

  .operator-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .operator-sidebar {
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

  .sidebar-footer {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 0;
  }

  .logout-btn {
    width: auto;
    flex-shrink: 0;
  }

  .operator-main {
    height: auto;
    overflow: visible;
    padding: 1rem;
  }
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

</style>

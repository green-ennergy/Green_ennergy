<template>
  <div
    class="task-card"
    :class="[
      `type-${task.type}`,
      `status-${task.status}`,
      `priority-${task.priority}`,
      { 'is-list': viewMode === 'list' }
    ]"
  >
    <!-- Card Top: ID, Type Badge, Priority -->
    <div class="card-head">
      <div class="head-left">
        <span class="task-id">{{ task.id }}</span>
        <span class="type-badge" :class="task.type">
          <OperatorIcon :name="task.type" :size="13" />
          <span>{{ typeLabel }}</span>
        </span>
      </div>

      <div class="head-right">
        <span class="priority-badge" :class="task.priority">
          {{ priorityLabel }}
        </span>
      </div>
    </div>

    <!-- Main Title & Client -->
    <div class="card-body">
      <h3 class="task-title">{{ task.title }}</h3>

      <div class="client-info">
        <div class="info-row client-name">
          <span class="info-icon"><OperatorIcon name="user" :size="14" /></span>
          <strong>{{ task.client.name }}</strong>
        </div>

        <div class="info-row location">
          <span class="info-icon"><OperatorIcon name="map-pin" :size="14" /></span>
          <span>{{ task.client.address }}, <strong>{{ task.client.city }}</strong></span>
        </div>

        <div class="info-row time">
          <span class="info-icon"><OperatorIcon name="calendar" :size="14" /></span>
          <span>{{ task.scheduledDate }} · <strong>{{ task.timeSlot }}</strong></span>
        </div>
      </div>

      <!-- Type-Specific Highlight Snippet -->
      <div class="type-highlight" :class="task.type">
        <!-- Installation snippet -->
        <template v-if="task.type === 'installation'">
          <span class="hl-tag">Equipment</span>
          <span class="hl-text">{{ task.typeData.equipmentList?.length || 0 }} items loaded · {{ task.typeData.inverterSN || 'Inverter Prep' }}</span>
        </template>

        <!-- Maintenance snippet -->
        <template v-else-if="task.type === 'maintenance'">
          <span class="hl-tag">Issue</span>
          <span class="hl-text">{{ task.typeData.reportedFault || 'Diagnostic check required' }}</span>
        </template>

        <!-- Delivery snippet -->
        <template v-else-if="task.type === 'delivery'">
          <span class="hl-tag">Order {{ task.typeData.orderNumber }}</span>
          <span class="hl-text">{{ task.typeData.items?.length || 0 }} products · {{ task.typeData.stagingBay }}</span>
        </template>

        <!-- Study snippet -->
        <template v-else-if="task.type === 'study'">
          <span class="hl-tag">Audit</span>
          <span class="hl-text">{{ task.typeData.monthlyBillMAD }} MAD/mo · Roof: {{ task.typeData.roofAreaM2 }}m² ({{ task.typeData.recommendedKWp }} kWp est.)</span>
        </template>
      </div>
    </div>

    <!-- Footer: Status indicator & Quick Actions -->
    <div class="card-footer">
      <div class="status-indicator" :class="task.status">
        <span class="status-dot"></span>
        <span class="status-text">{{ statusLabel }}</span>
      </div>

      <div class="card-actions">
        <!-- Quick Start button if assigned -->
        <button
          v-if="task.status === 'assigned'"
          class="action-btn start-btn"
          @click.stop="$emit('updateStatus', task.id, 'in_progress')"
          :title="t('operator.actions.start') || 'Start Task'"
        >
          <OperatorIcon name="bolt" :size="14" />
          <span>{{ t('operator.actions.start') || 'Start' }}</span>
        </button>

        <!-- Quick Complete button if in_progress -->
        <button
          v-else-if="task.status === 'in_progress'"
          class="action-btn complete-btn"
          @click.stop="$emit('openDetails', task)"
          :title="t('operator.actions.finish') || 'Review & Complete'"
        >
          <OperatorIcon name="check" :size="14" />
          <span>{{ t('operator.actions.finish') || 'Review & Finish' }}</span>
        </button>

        <!-- Details drawer opener -->
        <button
          class="action-btn details-btn"
          @click="$emit('openDetails', task)"
        >
          <span>{{ t('operator.actions.view') || 'Details' }}</span>
          <OperatorIcon name="arrow-right" :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import OperatorIcon from './OperatorIcon.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  }
})

defineEmits(['openDetails', 'updateStatus', 'reportIncident'])

const { t } = useI18n()

const typeLabel = computed(() => {
  switch (props.task.type) {
    case 'installation':
      return t('operator.types.installationShort') || 'Installation'
    case 'maintenance':
      return t('operator.types.maintenanceShort') || 'Maintenance'
    case 'delivery':
      return t('operator.types.deliveryShort') || 'Delivery'
    case 'study':
      return t('operator.types.studyShort') || 'Energy Study'
    default:
      return props.task.type
  }
})

const priorityLabel = computed(() => {
  switch (props.task.priority) {
    case 'urgent':
      return t('operator.priority.urgent') || 'Urgent'
    case 'high':
      return t('operator.priority.high') || 'High'
    case 'medium':
      return t('operator.priority.medium') || 'Normal'
    case 'low':
      return t('operator.priority.low') || 'Low'
    default:
      return props.task.priority
  }
})

const statusLabel = computed(() => {
  switch (props.task.status) {
    case 'assigned':
      return t('operator.statuses.assigned') || 'Assigned'
    case 'in_progress':
      return t('operator.statuses.inProgress') || 'In Progress'
    case 'on_hold':
      return t('operator.statuses.onHold') || 'On Hold'
    case 'completed':
      return t('operator.statuses.completed') || 'Completed'
    default:
      return props.task.status
  }
})
</script>

<style scoped>
.task-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid rgba(5, 46, 22, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.22s ease;
  position: relative;
  overflow: hidden;
}

.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
}

.task-card.type-installation::before { background: #16a34a; }
.task-card.type-maintenance::before { background: #d97706; }
.task-card.type-delivery::before { background: #7c3aed; }
.task-card.type-study::before { background: #0284c7; }

.task-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(5, 46, 22, 0.07);
  border-color: rgba(34, 197, 94, 0.25);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.task-id {
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.type-badge.installation {
  background: #ecfdf5;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.type-badge.maintenance {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}

.type-badge.delivery {
  background: #f5f3ff;
  color: #6d28d9;
  border: 1px solid #ddd6fe;
}

.type-badge.study {
  background: #ecfeff;
  color: #0e7490;
  border: 1px solid #a5f3fc;
}

.priority-badge {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.18rem 0.5rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.priority-badge.urgent {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.priority-badge.high {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.priority-badge.medium {
  background: #f3f4f6;
  color: #4b5563;
}

.priority-badge.low {
  background: #f9fafb;
  color: #9ca3af;
}

.task-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #052e16;
  line-height: 1.35;
  margin-bottom: 0.75rem;
  font-family: 'Space Grotesk', sans-serif;
}

.client-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.84rem;
  color: #4b5563;
}

.info-icon {
  color: #9ca3af;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.type-highlight {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.type-highlight.installation {
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  color: #166534;
}

.type-highlight.maintenance {
  background: #fffbeb;
  border: 1px solid #fef3c7;
  color: #92400e;
}

.type-highlight.delivery {
  background: #f5f3ff;
  border: 1px solid #ede9fe;
  color: #5b21b6;
}

.type-highlight.study {
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  color: #0369a1;
}

.hl-tag {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.12rem 0.35rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.hl-text {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #9ca3af;
}

.status-indicator.assigned .status-dot { background: #3b82f6; }
.status-indicator.assigned .status-text { color: #1d4ed8; }

.status-indicator.in_progress .status-dot {
  background: #eab308;
  box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.2);
  animation: pulse 1.8s infinite;
}
.status-indicator.in_progress .status-text { color: #a16207; }

.status-indicator.on_hold .status-dot { background: #f97316; }
.status-indicator.on_hold .status-text { color: #c2410c; }

.status-indicator.completed .status-dot { background: #16a34a; }
.status-indicator.completed .status-text { color: #15803d; }

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.start-btn {
  background: #052e16;
  color: #4ade80;
}

.start-btn:hover {
  background: #0a4020;
  transform: translateY(-1px);
}

.complete-btn {
  background: #ecfdf5;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.complete-btn:hover {
  background: #dcfce7;
}

.details-btn {
  background: #f9fafb;
  color: #374151;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.details-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

/* List view mode overrides */
.task-card.is-list {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  align-items: center;
  gap: 1.25rem;
}

.task-card.is-list .client-info {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.4rem;
}

.task-card.is-list .card-footer {
  border-top: none;
  padding-top: 0;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .task-card.is-list {
    display: flex;
    flex-direction: column;
  }
}
</style>

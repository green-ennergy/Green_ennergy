<template>
  <div class="filter-bar-container">
    <!-- Top Row: Type Tabs with counts -->
    <div class="type-tabs">
      <button
        v-for="type in typeOptions"
        :key="type.id"
        class="type-tab"
        :class="{ active: activeType === type.id, [type.id]: true }"
        @click="$emit('update:activeType', type.id)"
      >
        <span class="type-icon"><OperatorIcon :name="type.icon" :size="16" /></span>
        <span class="type-title">{{ type.label }}</span>
        <span class="type-count" v-if="type.count !== undefined">{{ type.count }}</span>
      </button>
    </div>

    <!-- Bottom Row: Search, Status filter pills, and View Mode -->
    <div class="controls-row">
      <!-- Search Input -->
      <div class="search-box">
        <span class="search-icon"><OperatorIcon name="search" :size="16" /></span>
        <input
          type="text"
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          :placeholder="t('operator.filters.searchPlaceholder') || 'Search tasks by client, ID, city, equipment...'"
          class="search-input"
        />
        <button
          v-if="searchQuery"
          @click="$emit('update:searchQuery', '')"
          class="clear-btn"
          aria-label="Clear search"
        >
          <OperatorIcon name="x" :size="14" />
        </button>
      </div>

      <!-- Status Pills -->
      <div class="status-pills">
        <button
          v-for="status in statusOptions"
          :key="status.id"
          class="status-pill-btn"
          :class="{ active: activeStatus === status.id, [status.id]: true }"
          @click="$emit('update:activeStatus', status.id)"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- View Switcher -->
      <div class="view-switch">
        <button
          class="view-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="$emit('update:viewMode', 'grid')"
          :title="t('operator.views.grid') || 'Cards View'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </button>
        <button
          class="view-btn"
          :class="{ active: viewMode === 'list' }"
          @click="$emit('update:viewMode', 'list')"
          :title="t('operator.views.list') || 'Compact List'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
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
  activeType: { type: String, default: 'all' },
  activeStatus: { type: String, default: 'all' },
  searchQuery: { type: String, default: '' },
  viewMode: { type: String, default: 'grid' },
  typeCounts: { type: Object, default: () => ({}) }
})

defineEmits([
  'update:activeType',
  'update:activeStatus',
  'update:searchQuery',
  'update:viewMode'
])

const { t } = useI18n()

const typeOptions = computed(() => [
  {
    id: 'all',
    label: t('operator.types.all') || 'All Tasks',
    icon: 'bolt',
    count: (props.typeCounts.installation || 0) +
           (props.typeCounts.maintenance || 0) +
           (props.typeCounts.delivery || 0) +
           (props.typeCounts.study || 0)
  },
  {
    id: 'installation',
    label: t('operator.types.installation') || 'Installation (New Equipments)',
    icon: 'installation',
    count: props.typeCounts.installation || 0
  },
  {
    id: 'maintenance',
    label: t('operator.types.maintenance') || 'Maintenance (Old Installations)',
    icon: 'maintenance',
    count: props.typeCounts.maintenance || 0
  },
  {
    id: 'delivery',
    label: t('operator.types.delivery') || 'Delivery (New Orders)',
    icon: 'delivery',
    count: props.typeCounts.delivery || 0
  },
  {
    id: 'study',
    label: t('operator.types.study') || 'Make a Study (Electricity Audit)',
    icon: 'study',
    count: props.typeCounts.study || 0
  }
])

const statusOptions = computed(() => [
  { id: 'all', label: t('operator.statuses.all') || 'All Statuses' },
  { id: 'assigned', label: t('operator.statuses.assigned') || 'Assigned' },
  { id: 'in_progress', label: t('operator.statuses.inProgress') || 'In Progress' },
  { id: 'on_hold', label: t('operator.statuses.onHold') || 'On Hold' }
])
</script>

<style scoped>
.filter-bar-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.type-tabs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.type-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.65rem 1rem;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid rgba(5, 46, 22, 0.08);
  color: #4b5563;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.type-tab:hover {
  background: #f8faf9;
  border-color: rgba(34, 197, 94, 0.3);
  color: #052e16;
}

.type-tab.active {
  background: #052e16;
  color: #ffffff;
  border-color: #052e16;
  box-shadow: 0 4px 12px rgba(5, 46, 22, 0.15);
}

.type-tab.active .type-icon {
  color: #4ade80;
}

.type-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: #f3f4f6;
  color: #374151;
}

.type-tab.active .type-count {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 260px;
}

.search-icon {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  display: flex;
}

.search-input {
  width: 100%;
  padding: 0.65rem 2.2rem 0.65rem 2.4rem;
  border-radius: 12px;
  border: 1px solid rgba(5, 46, 22, 0.1);
  background: #ffffff;
  font-size: 0.88rem;
  color: #111827;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.2rem;
}

.status-pills {
  display: flex;
  gap: 0.35rem;
  background: #ffffff;
  padding: 0.25rem;
  border-radius: 12px;
  border: 1px solid rgba(5, 46, 22, 0.08);
  overflow-x: auto;
}

.status-pill-btn {
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.status-pill-btn:hover {
  color: #111827;
}

.status-pill-btn.active {
  background: #f0fdf4;
  color: #15803d;
  font-weight: 700;
}

.view-switch {
  display: flex;
  background: #ffffff;
  padding: 0.25rem;
  border-radius: 10px;
  border: 1px solid rgba(5, 46, 22, 0.08);
}

.view-btn {
  padding: 0.4rem 0.55rem;
  border-radius: 8px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.view-btn.active {
  background: #ecfdf5;
  color: #15803d;
}
</style>

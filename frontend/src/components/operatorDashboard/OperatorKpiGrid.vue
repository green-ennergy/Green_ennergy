<template>
  <div class="kpi-grid">
    <div class="kpi-card" :class="{ 'highlight': item.highlight }" v-for="item in cards" :key="item.label">
      <div class="kpi-top">
        <span class="kpi-value">{{ item.value }}</span>
        <div class="kpi-icon-wrap" :class="item.type">
          <OperatorIcon :name="item.icon" :size="20" />
        </div>
      </div>
      <span class="kpi-label">{{ item.label }}</span>
      <span v-if="item.sub" class="kpi-sub">{{ item.sub }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import OperatorIcon from './OperatorIcon.vue'

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()

const cards = computed(() => [
  {
    label: t('operator.kpi.todayTasks') || "Today's Agenda",
    value: props.stats.todayPending,
    sub: `${props.stats.todayTotal} ${t('operator.kpi.scheduled') || 'scheduled today'}`,
    icon: 'calendar',
    type: 'today',
    highlight: props.stats.todayPending > 0
  },
  {
    label: t('operator.kpi.inProgress') || 'In Progress (Active)',
    value: props.stats.inProgress,
    sub: t('operator.kpi.fieldActive') || 'On-site execution',
    icon: 'clock',
    type: 'progress'
  },
  {
    label: t('operator.kpi.urgent') || 'Urgent / High Priority',
    value: props.stats.urgent,
    sub: t('operator.kpi.requiresAttention') || 'Immediate action',
    icon: 'alert',
    type: 'urgent',
    highlight: props.stats.urgent > 0
  },
  {
    label: t('operator.kpi.completed') || 'Completed Tasks',
    value: props.stats.completed,
    sub: `${props.stats.total} ${t('operator.kpi.total') || 'total assigned'}`,
    icon: 'check-circle',
    type: 'completed'
  }
])
</script>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.kpi-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.25rem 1.4rem;
  border: 1px solid rgba(5, 46, 22, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  display: flex;
  flex-direction: column;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(5, 46, 22, 0.06);
  border-color: rgba(34, 197, 94, 0.25);
}

.kpi-card.highlight {
  border-color: rgba(34, 197, 94, 0.35);
  background: linear-gradient(180deg, #ffffff 0%, #f7fdf9 100%);
}

.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.kpi-value {
  font-size: 2.1rem;
  font-weight: 800;
  color: #052e16;
  line-height: 1;
  font-family: 'Space Grotesk', sans-serif;
}

.kpi-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon-wrap.today {
  background: #ecfdf5;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.kpi-icon-wrap.progress {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.kpi-icon-wrap.urgent {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.kpi-icon-wrap.completed {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.kpi-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 0.25rem;
}

.kpi-sub {
  font-size: 0.76rem;
  color: #6b7280;
  margin-top: 0.2rem;
  font-weight: 500;
}
</style>

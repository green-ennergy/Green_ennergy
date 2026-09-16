<template>
  <div v-if="task" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card animate-fade-in" role="dialog" aria-modal="true">
      <header class="modal-header">
        <div class="modal-title-wrap">
          <span class="warning-icon"><OperatorIcon name="alert" :size="20" /></span>
          <div>
            <h3 class="modal-title">{{ t('operator.incident.title') || 'Report Field Incident / Block' }}</h3>
            <span class="modal-sub">{{ task.id }} · {{ task.title }}</span>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <OperatorIcon name="x" :size="18" />
        </button>
      </header>

      <div class="modal-body">
        <div class="form-group">
          <label>{{ t('operator.incident.typeLabel') || 'Incident / Block Category' }}</label>
          <select v-model="issueType" class="form-select">
            <option value="Customer Absent">{{ t('operator.incident.absent') || 'Customer Absent / Unreachable' }}</option>
            <option value="Damaged Equipment">{{ t('operator.incident.damaged') || 'Defective / Damaged Hardware' }}</option>
            <option value="Site Access Blocked">{{ t('operator.incident.access') || 'Site Access Denied / Key Missing' }}</option>
            <option value="Structural / Roof Hazard">{{ t('operator.incident.hazard') || 'Structural Hazard / Unsafe Roof' }}</option>
            <option value="Severe Weather">{{ t('operator.incident.weather') || 'Adverse Weather (High Wind / Rain)' }}</option>
            <option value="Wrong Specifications">{{ t('operator.incident.specs') || 'Site Mismatch / Need Admin Approval' }}</option>
            <option value="Other">{{ t('operator.incident.other') || 'Other Blocker' }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ t('operator.incident.detailsLabel') || 'Incident Description & On-Site Actions Taken' }}</label>
          <textarea
            v-model="notes"
            rows="4"
            class="form-textarea"
            :placeholder="t('operator.incident.placeholder') || 'Detail what occurred, who was contacted, and what resolution is required from Admin...'"
          ></textarea>
        </div>

        <label class="urgent-toggle">
          <input type="checkbox" v-model="markOnHold" />
          <span>{{ t('operator.incident.holdToggle') || 'Put Task On Hold (Requires Admin or Dispatch intervention)' }}</span>
        </label>
      </div>

      <footer class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">
          {{ t('common.cancel') || 'Cancel' }}
        </button>
        <button
          class="btn-submit"
          :disabled="!notes.trim()"
          @click="handleSubmit"
        >
          <OperatorIcon name="alert" :size="16" />
          <span>{{ t('operator.incident.submit') || 'Submit Incident Report' }}</span>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import OperatorIcon from './OperatorIcon.vue'

const props = defineProps({
  task: { type: Object, default: null }
})

const emit = defineEmits(['close', 'submit'])

const { t } = useI18n()

const issueType = ref('Customer Absent')
const notes = ref('')
const markOnHold = ref(true)

const handleSubmit = () => {
  if (!notes.value.trim()) return
  emit('submit', props.task.id, {
    issueType: issueType.value,
    notes: notes.value.trim(),
    urgent: markOnHold.value
  })
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 13, 7, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  width: min(540px, 100%);
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.modal-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: #fef2f2;
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.warning-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #fee2e2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #991b1b;
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
}

.modal-sub {
  font-size: 0.78rem;
  color: #7f1d1d;
}

.close-btn {
  background: transparent;
  border: none;
  color: #7f1d1d;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
}

.form-select,
.form-textarea {
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 0.88rem;
  outline: none;
  font-family: inherit;
  background: #ffffff;
}

.form-select:focus,
.form-textarea:focus {
  border-color: #dc2626;
}

.urgent-toggle {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.84rem;
  font-weight: 600;
  color: #991b1b;
  cursor: pointer;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
}

.urgent-toggle input[type="checkbox"] {
  accent-color: #dc2626;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.86rem;
  color: #4b5563;
  cursor: pointer;
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  background: #dc2626;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.86rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-submit:hover {
  background: #b91c1c;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<template>
  <div v-if="task" class="drawer-backdrop" @click.self="$emit('close')">
    <div class="drawer-panel animate-fade-in" role="dialog" aria-modal="true">
      <!-- Drawer Header -->
      <header class="drawer-header">
        <div class="drawer-title-group">
          <div class="header-badges">
            <span class="task-id">{{ task.id }}</span>
            <span class="type-badge" :class="task.type">
              <OperatorIcon :name="task.type" :size="14" />
              <span>{{ typeLabel }}</span>
            </span>
            <span class="priority-badge" :class="task.priority">{{ priorityLabel }}</span>
          </div>
          <h2 class="drawer-title">{{ task.title }}</h2>
        </div>

        <button @click="$emit('close')" class="close-btn" aria-label="Close drawer">
          <OperatorIcon name="x" :size="20" />
        </button>
      </header>

      <!-- Status Control Bar -->
      <div class="status-bar">
        <div class="status-left">
          <span class="status-label">{{ t('operator.drawer.statusLabel') || 'Current Status:' }}</span>
          <select
            :value="task.status"
            @change="handleStatusChange($event.target.value)"
            class="status-select"
            :class="task.status"
          >
            <option value="assigned">{{ t('operator.statuses.assigned') || 'Assigned' }}</option>
            <option value="in_progress">{{ t('operator.statuses.inProgress') || 'In Progress (Active)' }}</option>
            <option value="on_hold">{{ t('operator.statuses.onHold') || 'On Hold / Blocked' }}</option>
            <option value="completed">{{ t('operator.statuses.completed') || 'Completed ✓' }}</option>
          </select>
        </div>

        <div class="status-right">
          <button
            class="btn-incident"
            @click="$emit('reportIncident', task)"
          >
            <OperatorIcon name="alert" :size="15" />
            <span>{{ t('operator.drawer.reportIssue') || 'Report Incident' }}</span>
          </button>
        </div>
      </div>

      <!-- Drawer Scrollable Content -->
      <div class="drawer-body">
        <!-- Client & Site Card -->
        <section class="info-section">
          <h3 class="section-title">
            <OperatorIcon name="user" :size="16" />
            <span>{{ t('operator.drawer.clientSite') || 'Client & Site Details' }}</span>
          </h3>

          <div class="info-grid">
            <div class="info-cell">
              <span class="cell-label">{{ t('operator.drawer.clientName') || 'Client / Contact' }}</span>
              <span class="cell-val"><strong>{{ task.client.name }}</strong></span>
            </div>

            <div class="info-cell">
              <span class="cell-label">{{ t('operator.drawer.phone') || 'Phone' }}</span>
              <a :href="`tel:${task.client.phone}`" class="cell-link">
                <OperatorIcon name="phone" :size="14" />
                <span>{{ task.client.phone }}</span>
              </a>
            </div>

            <div class="info-cell full">
              <span class="cell-label">{{ t('operator.drawer.location') || 'Installation / Delivery Address' }}</span>
              <span class="cell-val">
                <OperatorIcon name="map-pin" :size="14" />
                <span>{{ task.client.address }}, <strong>{{ task.client.city }}</strong></span>
              </span>
            </div>

            <div class="info-cell">
              <span class="cell-label">{{ t('operator.drawer.schedule') || 'Scheduled Time Slot' }}</span>
              <span class="cell-val">
                <OperatorIcon name="calendar" :size="14" />
                <span>{{ task.scheduledDate }} ({{ task.timeSlot }})</span>
              </span>
            </div>

            <div class="info-cell" v-if="task.client.email">
              <span class="cell-label">Email</span>
              <span class="cell-val">{{ task.client.email }}</span>
            </div>
          </div>

          <!-- Admin Instructions Alert -->
          <div v-if="task.adminNotes" class="admin-instructions">
            <div class="instr-head">
              <OperatorIcon name="file-text" :size="14" />
              <strong>{{ t('operator.drawer.adminInstructions') || 'Admin Instructions & Scope' }}</strong>
            </div>
            <p>{{ task.adminNotes }}</p>
          </div>
        </section>

        <!-- Dynamic Workflow Section Based On Task Type -->

        <!-- WORKFLOW 1: INSTALLATION (New equipments) -->
        <section v-if="task.type === 'installation'" class="workflow-card installation">
          <div class="card-section-header">
            <div class="section-badge installation">
              <OperatorIcon name="installation" :size="16" />
              <span>{{ t('operator.types.installation') || 'Installation (New Equipments)' }}</span>
            </div>
            <span class="badge-sub">Field Commissioning & Hardware Checklist</span>
          </div>

          <!-- Equipment Inventory List -->
          <div class="sub-block">
            <h4 class="sub-title">1. Equipment Verified On-Site</h4>
            <div class="checklist">
              <label
                v-for="(item, idx) in task.typeData.equipmentList"
                :key="idx"
                class="check-row"
                :class="{ done: item.checked }"
              >
                <input
                  type="checkbox"
                  :checked="item.checked"
                  @change="$emit('toggleChecklist', task.id, 'equipmentList', idx)"
                />
                <span class="check-text">
                  <strong>{{ item.name }}</strong>
                  <span class="check-tag">Qty: {{ item.qty }}</span>
                </span>
              </label>
            </div>
          </div>

          <!-- Installation & Safety Checklist -->
          <div class="sub-block">
            <h4 class="sub-title">2. Installation Safety & Electrical Steps</h4>
            <div class="checklist">
              <label
                v-for="(step, idx) in task.typeData.checklist"
                :key="idx"
                class="check-row"
                :class="{ done: step.done }"
              >
                <input
                  type="checkbox"
                  :checked="step.done"
                  @change="$emit('toggleChecklist', task.id, 'checklist', idx)"
                />
                <span class="check-text">{{ step.label }}</span>
              </label>
            </div>
          </div>

          <!-- Commissioning Parameters -->
          <div class="sub-block commissioning-box">
            <h4 class="sub-title">3. Live Commissioning & System Verification</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Inverter Serial Number (S/N)</label>
                <input
                  type="text"
                  v-model="localInverterSN"
                  @blur="saveInstallationMeta"
                  placeholder="e.g. DY-12K-2026-XXXX"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label>Peak Generation Recorded (kW)</label>
                <div class="input-with-unit">
                  <input
                    type="number"
                    step="0.1"
                    v-model="localCommissioningKW"
                    @blur="saveInstallationMeta"
                    placeholder="e.g. 10.8"
                    class="form-input"
                  />
                  <span class="unit-tag">kW</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- WORKFLOW 2: MAINTENANCE (Old installations) -->
        <section v-else-if="task.type === 'maintenance'" class="workflow-card maintenance">
          <div class="card-section-header">
            <div class="section-badge maintenance">
              <OperatorIcon name="maintenance" :size="16" />
              <span>{{ t('operator.types.maintenance') || 'Maintenance (Old Installations)' }}</span>
            </div>
            <span class="badge-sub">System Troubleshooting & Servicing</span>
          </div>

          <!-- System Background -->
          <div class="system-meta-grid">
            <div class="meta-item">
              <span class="meta-label">System Age</span>
              <span class="meta-val">{{ task.typeData.systemAge }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Inverter Model</span>
              <span class="meta-val">{{ task.typeData.inverterModel }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Capacity</span>
              <span class="meta-val">{{ task.typeData.systemCapacity }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Last Serviced</span>
              <span class="meta-val">{{ task.typeData.lastServiceDate }}</span>
            </div>
          </div>

          <!-- Reported Symptom Box -->
          <div class="fault-alert-box">
            <strong>Reported Issue:</strong>
            <p>{{ task.typeData.reportedFault }}</p>
          </div>

          <!-- Diagnostic Steps -->
          <div class="sub-block">
            <h4 class="sub-title">Diagnostics & Service Checklist</h4>
            <div class="checklist">
              <label
                v-for="(step, idx) in task.typeData.diagnosticsChecklist"
                :key="idx"
                class="check-row"
                :class="{ done: step.done }"
              >
                <input
                  type="checkbox"
                  :checked="step.done"
                  @change="$emit('toggleChecklist', task.id, 'diagnosticsChecklist', idx)"
                />
                <span class="check-text">{{ step.label }}</span>
              </label>
            </div>
          </div>

          <!-- Spare Parts Replacement -->
          <div class="sub-block" v-if="task.typeData.replacedParts?.length">
            <h4 class="sub-title">Replacement Parts Log</h4>
            <div class="parts-list">
              <label
                v-for="(part, idx) in task.typeData.replacedParts"
                :key="idx"
                class="part-item"
              >
                <input
                  type="checkbox"
                  :checked="part.used"
                  @change="$emit('toggleChecklist', task.id, 'replacedParts', idx)"
                />
                <span>{{ part.name }} (Qty: {{ part.qty }})</span>
                <span class="part-badge" :class="{ used: part.used }">{{ part.used ? 'Installed' : 'In Van' }}</span>
              </label>
            </div>
          </div>
        </section>

        <!-- WORKFLOW 3: DELIVERY (New Order) -->
        <section v-else-if="task.type === 'delivery'" class="workflow-card delivery">
          <div class="card-section-header">
            <div class="section-badge delivery">
              <OperatorIcon name="delivery" :size="16" />
              <span>{{ t('operator.types.delivery') || 'Delivery (New Orders)' }}</span>
            </div>
            <span class="badge-sub">Dispatch Manifest & Customer Hand-off</span>
          </div>

          <!-- Order Summary banner -->
          <div class="order-banner">
            <div>
              <span class="order-num">Order #{{ task.typeData.orderNumber }}</span>
              <p class="order-bay">Pickup: <strong>{{ task.typeData.stagingBay }}</strong></p>
            </div>
            <span class="order-status-badge">Pre-checked at Depot</span>
          </div>

          <!-- Manifest Table -->
          <div class="sub-block">
            <h4 class="sub-title">Itemized Delivery Manifest</h4>
            <div class="manifest-table-wrap">
              <table class="manifest-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product Description</th>
                    <th>Qty</th>
                    <th>Packed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in task.typeData.items" :key="item.sku">
                    <td><code>{{ item.sku }}</code></td>
                    <td>{{ item.name }}</td>
                    <td><strong>{{ item.qty }}</strong></td>
                    <td><span class="packed-tag">✓ Verified</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Delivery Milestones Checklist -->
          <div class="sub-block">
            <h4 class="sub-title">Delivery Route Milestones</h4>
            <div class="checklist">
              <label
                v-for="(step, idx) in task.typeData.deliverySteps"
                :key="idx"
                class="check-row"
                :class="{ done: step.done }"
              >
                <input
                  type="checkbox"
                  :checked="step.done"
                  @change="$emit('toggleChecklist', task.id, 'deliverySteps', idx)"
                />
                <span class="check-text">{{ step.label }}</span>
              </label>
            </div>
          </div>

          <!-- Recipient Sign-off Box -->
          <div class="sub-block delivery-sign-box">
            <h4 class="sub-title">Proof of Delivery (Hand-off Signature)</h4>
            <div v-if="task.typeData.recipientSignatureId" class="signed-confirmation">
              <OperatorIcon name="check-circle" :size="20" />
              <div>
                <strong>Signed & Accepted by: {{ task.typeData.recipientName }}</strong>
                <small>Digital Receipt Ref: {{ task.typeData.recipientSignatureId }}</small>
              </div>
            </div>

            <div v-else class="sign-form">
              <div class="form-group">
                <label>Recipient Name (Person Receiving Equipment)</label>
                <input
                  type="text"
                  v-model="deliveryRecipientName"
                  placeholder="e.g. M. Hicham Berrada"
                  class="form-input"
                />
              </div>

              <button
                class="btn-confirm-delivery"
                :disabled="!deliveryRecipientName.trim()"
                @click="confirmDeliveryHandOff"
              >
                <OperatorIcon name="check" :size="16" />
                <span>Confirm Delivery & Sign Off</span>
              </button>
            </div>
          </div>
        </section>

        <!-- WORKFLOW 4: MAKE A STUDY (Household Electricity Consumption) -->
        <section v-else-if="task.type === 'study'" class="workflow-card study">
          <div class="card-section-header">
            <div class="section-badge study">
              <OperatorIcon name="study" :size="16" />
              <span>{{ t('operator.types.study') || 'Make a Study (Electricity Audit)' }}</span>
            </div>
            <span class="badge-sub">On-Site Household Consumption & Solar Sizing Calculator</span>
          </div>

          <!-- Interactive Calculator Inputs -->
          <div class="audit-calc-card">
            <h4 class="calc-title">
              <OperatorIcon name="calculator" :size="18" />
              <span>Solar Feasibility & Consumption Estimator</span>
            </h4>

            <div class="calc-inputs-grid">
              <div class="form-group">
                <label>Average Monthly Bill (MAD)</label>
                <div class="input-with-unit">
                  <input
                    type="number"
                    v-model.number="studyForm.monthlyBillMAD"
                    @input="recalculateStudy"
                    class="form-input"
                  />
                  <span class="unit-tag">MAD</span>
                </div>
              </div>

              <div class="form-group">
                <label>Est. Monthly Consumption (kWh)</label>
                <div class="input-with-unit">
                  <input
                    type="number"
                    v-model.number="studyForm.estimatedKWhMonthly"
                    @input="recalculateStudy"
                    class="form-input"
                  />
                  <span class="unit-tag">kWh</span>
                </div>
              </div>

              <div class="form-group">
                <label>Usable Roof Surface Area (m²)</label>
                <div class="input-with-unit">
                  <input
                    type="number"
                    v-model.number="studyForm.roofAreaM2"
                    @input="recalculateStudy"
                    class="form-input"
                  />
                  <span class="unit-tag">m²</span>
                </div>
              </div>

              <div class="form-group">
                <label>Roof Orientation</label>
                <select
                  v-model="studyForm.roofOrientation"
                  @change="recalculateStudy"
                  class="form-input"
                >
                  <option value="South (180°)">South (180°) — Optimal</option>
                  <option value="South-East (135°)">South-East (135°)</option>
                  <option value="South-West (225°)">South-West (225°)</option>
                  <option value="East (90°)">East (90°)</option>
                  <option value="West (270°)">West (270°)</option>
                  <option value="Flat Roof (0°)">Flat Roof (Adjustable Racks)</option>
                </select>
              </div>

              <div class="form-group">
                <label>Roof Tilt Angle</label>
                <div class="input-with-unit">
                  <input
                    type="number"
                    v-model.number="studyForm.roofTiltDeg"
                    @input="recalculateStudy"
                    class="form-input"
                  />
                  <span class="unit-tag">deg</span>
                </div>
              </div>

              <div class="form-group">
                <label>Shading Profile</label>
                <select
                  v-model="studyForm.shadingCondition"
                  @change="recalculateStudy"
                  class="form-input"
                >
                  <option value="none">None (Zero shading)</option>
                  <option value="low">Low (Light morning/evening shadows)</option>
                  <option value="medium">Moderate (Nearby trees/parapet)</option>
                  <option value="heavy">Heavy (High obstructions)</option>
                </select>
              </div>
            </div>

            <!-- Calculated Recommendations Result Banner -->
            <div class="calc-results-panel">
              <div class="res-item primary">
                <span class="res-lbl">Recommended System</span>
                <span class="res-val">{{ studyForm.recommendedKWp }} kWp</span>
                <small>~{{ Math.ceil((studyForm.recommendedKWp * 1000) / 550) }} Panels (550W)</small>
              </div>

              <div class="res-item">
                <span class="res-lbl">Est. Yearly Yield</span>
                <span class="res-val">{{ studyForm.estimatedYearlyKWh.toLocaleString() }}</span>
                <small>kWh / year</small>
              </div>

              <div class="res-item">
                <span class="res-lbl">Est. Monthly Savings</span>
                <span class="res-val highlight">{{ studyForm.estimatedMonthlySavingsMAD.toLocaleString() }}</span>
                <small>MAD / month saved</small>
              </div>

              <div class="res-item">
                <span class="res-lbl">Battery Storage</span>
                <span class="res-val">{{ studyForm.batteryNeeded ? `${studyForm.recommendedBatteryKWh} kWh` : 'Grid-Tied' }}</span>
                <small>{{ studyForm.batteryNeeded ? 'Night Autonomy' : 'Day Use Only' }}</small>
              </div>

              <div class="res-item">
                <span class="res-lbl">Est. Payback</span>
                <span class="res-val">{{ studyForm.paybackYears }} yrs</span>
                <small>ROI Period</small>
              </div>
            </div>
          </div>

          <!-- Audit Checklist -->
          <div class="sub-block">
            <h4 class="sub-title">Audit Site Survey Checklist</h4>
            <div class="checklist">
              <label
                v-for="(step, idx) in task.typeData.auditChecklist"
                :key="idx"
                class="check-row"
                :class="{ done: step.done }"
              >
                <input
                  type="checkbox"
                  :checked="step.done"
                  @change="$emit('toggleChecklist', task.id, 'auditChecklist', idx)"
                />
                <span class="check-text">{{ step.label }}</span>
              </label>
            </div>
          </div>
        </section>

        <!-- Operator Field Notes Editor -->
        <section class="notes-section">
          <div class="section-head-row">
            <h3 class="section-title">
              <OperatorIcon name="file-text" :size="16" />
              <span>{{ t('operator.drawer.operatorNotes') || 'Field Notes & Observations' }}</span>
            </h3>
            <button
              class="save-notes-btn"
              @click="saveOperatorNotes"
              :class="{ saved: notesSaved }"
            >
              {{ notesSaved ? 'Saved ✓' : 'Save Notes' }}
            </button>
          </div>

          <textarea
            v-model="localNotes"
            rows="4"
            class="notes-textarea"
            :placeholder="t('operator.drawer.notesPlaceholder') || 'Enter on-site notes, measurements, equipment condition, or next action recommendations...'"
          ></textarea>
        </section>

        <!-- Audit Trail / Traces -->
        <section class="traces-section">
          <h3 class="section-title">
            <OperatorIcon name="clock" :size="16" />
            <span>{{ t('operator.drawer.activityLog') || 'Task Timeline & Activity Log' }}</span>
          </h3>

          <div class="timeline-list">
            <div
              v-for="(trace, i) in task.traces"
              :key="i"
              class="timeline-item"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-meta">
                  <span class="timeline-user">{{ trace.user }}</span>
                  <span class="timeline-date">{{ trace.date }}</span>
                </div>
                <p class="timeline-action">{{ trace.action }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Drawer Footer Actions -->
      <footer class="drawer-footer">
        <button
          v-if="task.status !== 'completed'"
          class="btn-complete-task"
          @click="completeCurrentTask"
        >
          <OperatorIcon name="check-circle" :size="18" />
          <span>{{ t('operator.drawer.markCompleted') || 'Mark Task as Completed' }}</span>
        </button>

        <button
          v-else
          class="btn-completed-badge"
          disabled
        >
          <OperatorIcon name="check-circle" :size="18" />
          <span>Task Successfully Completed ✓</span>
        </button>

        <button
          class="btn-close-drawer"
          @click="$emit('close')"
        >
          {{ t('common.close') || 'Close' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import OperatorIcon from './OperatorIcon.vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'close',
  'updateStatus',
  'updateNotes',
  'toggleChecklist',
  'updateStudyData',
  'confirmDelivery',
  'reportIncident'
])

const { t } = useI18n()

// Local models
const localNotes = ref('')
const notesSaved = ref(false)
const localInverterSN = ref('')
const localCommissioningKW = ref(0)
const deliveryRecipientName = ref('')

// Study calculator model
const studyForm = ref({
  monthlyBillMAD: 2500,
  estimatedKWhMonthly: 1500,
  roofAreaM2: 120,
  roofOrientation: 'South (180°)',
  roofTiltDeg: 28,
  shadingCondition: 'none',
  recommendedKWp: 8.0,
  estimatedYearlyKWh: 13600,
  estimatedMonthlySavingsMAD: 2100,
  batteryNeeded: true,
  recommendedBatteryKWh: 10,
  paybackYears: 4.1
})

watch(() => props.task, (newTask) => {
  if (!newTask) return
  localNotes.value = newTask.operatorNotes || ''
  notesSaved.value = false

  if (newTask.type === 'installation' && newTask.typeData) {
    localInverterSN.value = newTask.typeData.inverterSN || ''
    localCommissioningKW.value = newTask.typeData.commissioningKW || 0
  }

  if (newTask.type === 'study' && newTask.typeData) {
    studyForm.value = { ...studyForm.value, ...newTask.typeData }
  }

  if (newTask.type === 'delivery' && newTask.typeData) {
    deliveryRecipientName.value = newTask.typeData.recipientName || ''
  }
}, { immediate: true })

const typeLabel = computed(() => {
  if (!props.task) return ''
  switch (props.task.type) {
    case 'installation': return t('operator.types.installation') || 'Installation (New Equipments)'
    case 'maintenance': return t('operator.types.maintenance') || 'Maintenance (Old Installations)'
    case 'delivery': return t('operator.types.delivery') || 'Delivery (New Orders)'
    case 'study': return t('operator.types.study') || 'Make a Study (Electricity Audit)'
    default: return props.task.type
  }
})

const priorityLabel = computed(() => {
  if (!props.task) return ''
  return props.task.priority.toUpperCase()
})

const handleStatusChange = (status) => {
  emit('updateStatus', props.task.id, status)
}

const saveOperatorNotes = () => {
  emit('updateNotes', props.task.id, localNotes.value)
  notesSaved.value = true
  setTimeout(() => {
    notesSaved.value = false
  }, 2500)
}

const saveInstallationMeta = () => {
  // Can be pushed via note or emit
  emit('updateNotes', props.task.id, `${localNotes.value}\n[Commissioning: ${localCommissioningKW.value} kW | Inverter S/N: ${localInverterSN.value}]`.trim())
}

const recalculateStudy = () => {
  const bill = Number(studyForm.value.monthlyBillMAD) || 1000
  const area = Number(studyForm.value.roofAreaM2) || 50

  // Standard Morocco solar yield factor ~1700 kWh/kWp/year
  let yieldFactor = 1700
  if (studyForm.value.roofOrientation.includes('East') || studyForm.value.roofOrientation.includes('West')) {
    yieldFactor *= 0.85
  }
  if (studyForm.value.shadingCondition === 'medium') yieldFactor *= 0.88
  if (studyForm.value.shadingCondition === 'heavy') yieldFactor *= 0.72

  // Tariff approx 1.6 MAD per kWh
  const monthlyKWh = Math.round(bill / 1.6)
  const annualKWhNeeded = monthlyKWh * 12

  // Required kWp sizing
  let calculatedKWp = Number((annualKWhNeeded / yieldFactor).toFixed(1))
  // Cap at available roof space (approx 6 m2 per kWp)
  const maxRoofKWp = Number((area / 6.5).toFixed(1))
  calculatedKWp = Math.min(calculatedKWp, maxRoofKWp)
  calculatedKWp = Math.max(calculatedKWp, 1.5)

  const estimatedYearlyKWh = Math.round(calculatedKWp * yieldFactor)
  const estimatedMonthlySavingsMAD = Math.min(bill, Math.round((estimatedYearlyKWh / 12) * 1.55))

  // Payback estimate approx 12,000 MAD / kWp
  const systemCostMAD = calculatedKWp * 11500
  const paybackYears = Number((systemCostMAD / (estimatedMonthlySavingsMAD * 12)).toFixed(1))

  studyForm.value.estimatedKWhMonthly = monthlyKWh
  studyForm.value.recommendedKWp = calculatedKWp
  studyForm.value.estimatedYearlyKWh = estimatedYearlyKWh
  studyForm.value.estimatedMonthlySavingsMAD = estimatedMonthlySavingsMAD
  studyForm.value.paybackYears = paybackYears
  studyForm.value.batteryNeeded = bill > 1800
  studyForm.value.recommendedBatteryKWh = calculatedKWp > 7 ? 10 : 5

  emit('updateStudyData', props.task.id, studyForm.value)
}

const confirmDeliveryHandOff = () => {
  if (!deliveryRecipientName.value.trim()) return
  emit('confirmDelivery', props.task.id, deliveryRecipientName.value.trim(), 'Signed at customer premises.')
}

const completeCurrentTask = () => {
  emit('updateStatus', props.task.id, 'completed')
}
</script>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 13, 7, 0.55);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: min(780px, 100vw);
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.drawer-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  background: #ffffff;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
  flex-wrap: wrap;
}

.task-id {
  font-size: 0.76rem;
  font-weight: 800;
  color: #374151;
  background: #f3f4f6;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.type-badge.installation { background: #ecfdf5; color: #15803d; border: 1px solid #bbf7d0; }
.type-badge.maintenance { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.type-badge.delivery { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }
.type-badge.study { background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; }

.priority-badge {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.18rem 0.5rem;
  border-radius: 6px;
  letter-spacing: 0.04em;
}
.priority-badge.urgent { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.priority-badge.high { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
.priority-badge.medium { background: #f3f4f6; color: #4b5563; }
.priority-badge.low { background: #f9fafb; color: #9ca3af; }

.drawer-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #052e16;
  line-height: 1.3;
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
}

.close-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: #f8fbf9;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
  gap: 0.75rem;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.status-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
}

.status-select {
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #ffffff;
  cursor: pointer;
}

.status-select.assigned { color: #1d4ed8; background: #eff6ff; border-color: #bfdbfe; }
.status-select.in_progress { color: #a16207; background: #fefce8; border-color: #fef08a; }
.status-select.on_hold { color: #c2410c; background: #fff7ed; border-color: #fed7aa; }
.status-select.completed { color: #15803d; background: #f0fdf4; border-color: #bbf7d0; }

.btn-incident {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-incident:hover {
  background: #fef2f2;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 1.25rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.96rem;
  font-weight: 700;
  color: #052e16;
  margin-bottom: 0.95rem;
  font-family: 'Space Grotesk', sans-serif;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
}

.info-cell {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.info-cell.full {
  grid-column: span 2;
}

.cell-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.cell-val {
  font-size: 0.88rem;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.cell-link {
  font-size: 0.88rem;
  font-weight: 700;
  color: #16a34a;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.admin-instructions {
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  color: #166534;
  font-size: 0.84rem;
}

.instr-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.25rem;
  font-weight: 700;
}

/* Workflow Cards */
.workflow-card {
  border-radius: 16px;
  padding: 1.35rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.workflow-card.installation { background: #fdfefe; border-color: rgba(34, 197, 94, 0.25); }
.workflow-card.maintenance { background: #fffdf9; border-color: rgba(217, 119, 6, 0.25); }
.workflow-card.delivery { background: #faf9fe; border-color: rgba(124, 58, 237, 0.25); }
.workflow-card.study { background: #f9fcfe; border-color: rgba(2, 132, 199, 0.25); }

.card-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  font-weight: 800;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
}

.section-badge.installation { background: #ecfdf5; color: #15803d; border: 1px solid #bbf7d0; }
.section-badge.maintenance { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.section-badge.delivery { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }
.section-badge.study { background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; }

.badge-sub {
  font-size: 0.78rem;
  color: #6b7280;
  font-weight: 600;
}

.sub-block {
  margin-bottom: 1.25rem;
}

.sub-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #052e16;
  margin-bottom: 0.65rem;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.check-row {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  font-size: 0.84rem;
  color: #374151;
  transition: all 0.15s ease;
}

.check-row:hover {
  background: #f9fafb;
  border-color: rgba(34, 197, 94, 0.3);
}

.check-row.done {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.check-row input[type="checkbox"] {
  margin-top: 0.18rem;
  accent-color: #16a34a;
}

.check-text {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
}

.check-tag {
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

/* Commissioning box */
.commissioning-box {
  background: #ffffff;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.76rem;
  font-weight: 700;
  color: #374151;
}

.form-input {
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 0.86rem;
  outline: none;
  background: #ffffff;
}

.form-input:focus {
  border-color: #16a34a;
}

.input-with-unit {
  display: flex;
  position: relative;
  align-items: center;
}

.input-with-unit .form-input {
  width: 100%;
  padding-right: 3rem;
}

.unit-tag {
  position: absolute;
  right: 0.65rem;
  font-size: 0.74rem;
  font-weight: 700;
  color: #9ca3af;
}

/* Maintenance specifics */
.system-meta-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.meta-item {
  background: #ffffff;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.meta-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
}

.meta-val {
  font-size: 0.82rem;
  font-weight: 700;
  color: #111827;
}

.fault-alert-box {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  color: #991b1b;
  font-size: 0.84rem;
  margin-bottom: 1rem;
}

.parts-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.part-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 0.82rem;
}

.part-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: #f3f4f6;
  color: #6b7280;
}

.part-badge.used {
  background: #ecfdf5;
  color: #15803d;
}

/* Delivery specifics */
.order-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
}

.order-num {
  font-size: 1rem;
  font-weight: 800;
  color: #052e16;
}

.order-bay {
  font-size: 0.82rem;
  color: #6b7280;
  margin: 0;
}

.order-status-badge {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
}

.manifest-table-wrap {
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.manifest-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.manifest-table th,
.manifest-table td {
  padding: 0.65rem 0.85rem;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.manifest-table th {
  background: #f9fafb;
  color: #6b7280;
  font-weight: 700;
  font-size: 0.72rem;
  text-transform: uppercase;
}

.packed-tag {
  color: #15803d;
  font-weight: 700;
}

.delivery-sign-box {
  background: #ffffff;
  padding: 1.15rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.signed-confirmation {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  color: #15803d;
}

.signed-confirmation small {
  display: block;
  font-size: 0.74rem;
  color: #166534;
}

.sign-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.btn-confirm-delivery {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  background: #052e16;
  color: #4ade80;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm-delivery:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Study Calculator */
.audit-calc-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid rgba(2, 132, 199, 0.2);
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

.calc-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: #0369a1;
  margin-bottom: 1rem;
}

.calc-inputs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  margin-bottom: 1.25rem;
}

.calc-results-panel {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.65rem;
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 12px;
  padding: 0.85rem;
}

.res-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: center;
}

.res-lbl {
  font-size: 0.68rem;
  font-weight: 700;
  color: #0369a1;
  text-transform: uppercase;
}

.res-val {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0c4a6e;
  font-family: 'Space Grotesk', sans-serif;
}

.res-val.highlight {
  color: #16a34a;
}

.res-item.primary {
  border-right: 1px solid rgba(2, 132, 199, 0.15);
}

.res-item small {
  font-size: 0.68rem;
  color: #64748b;
}

/* Notes section */
.notes-section {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 1.25rem;
}

.section-head-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.save-notes-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  background: #052e16;
  color: #4ade80;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
}

.save-notes-btn.saved {
  background: #16a34a;
  color: #ffffff;
}

.notes-textarea {
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0.75rem;
  font-size: 0.86rem;
  font-family: inherit;
  color: #111827;
  outline: none;
  resize: vertical;
}

.notes-textarea:focus {
  border-color: #16a34a;
}

/* Timeline */
.traces-section {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 1.25rem;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 0.5rem;
}

.timeline-item {
  display: flex;
  gap: 0.75rem;
  position: relative;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #16a34a;
  margin-top: 0.35rem;
  flex-shrink: 0;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.timeline-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.74rem;
}

.timeline-user {
  font-weight: 700;
  color: #052e16;
}

.timeline-date {
  color: #9ca3af;
}

.timeline-action {
  font-size: 0.82rem;
  color: #4b5563;
  margin: 0;
}

/* Drawer Footer */
.drawer-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-complete-task {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  background: #16a34a;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-complete-task:hover {
  background: #15803d;
  transform: translateY(-1px);
}

.btn-completed-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  background: #ecfdf5;
  color: #15803d;
  border: 1px solid #bbf7d0;
  font-weight: 700;
  font-size: 0.88rem;
}

.btn-close-drawer {
  padding: 0.65rem 1.1rem;
  border-radius: 10px;
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
}

.btn-close-drawer:hover {
  background: #e5e7eb;
}

@media (max-width: 640px) {
  .info-grid,
  .form-row,
  .system-meta-grid,
  .calc-inputs-grid,
  .calc-results-panel {
    grid-template-columns: 1fr;
  }
}
</style>

<template>

  <article class="followup-card" :class="[variant, statusTone]">

    <header class="card-top">

      <div class="card-intro">

        <div class="badge-row">

          <span v-if="project.rfq_ticket" class="pill pill-quote">{{ project.rfq_ticket.ticket_number }}</span>

          <span v-if="variant === 'admin' && project.user" class="pill pill-client">

            {{ project.user.company || project.user.name }}

          </span>

          <span class="pill pill-status" :class="project.status">{{ statusLabel }}</span>

        </div>

        <h3>{{ project.name }}</h3>

        <p v-if="project.location" class="card-location">{{ project.location }}</p>

      </div>

      <div class="step-badge" aria-label="Workflow progress">

        <span class="step-badge-num">{{ stepNumber }}</span>

        <span class="step-badge-of">/ {{ totalSteps }}</span>

      </div>

    </header>



    <div class="progress-block">

      <div class="progress-labels">

        <span>{{ currentStep?.label || t('followup.workflow') }}</span>

        <strong>{{ project.progress || 0 }}%</strong>

      </div>

      <div class="progress-track" role="progressbar" :aria-valuenow="project.progress || 0" aria-valuemin="0" aria-valuemax="100">

        <div class="progress-fill" :style="{ width: `${project.progress || 0}%` }"></div>

      </div>

    </div>



    <div class="step-pipeline" aria-label="SAK workflow steps">

      <span

        v-for="(step, index) in workflowSteps"

        :key="step.key"

        class="pipeline-step"

        :class="pipelineClass(step.key, index)"

      >

        {{ getStepShortLabel(step.key) }}

      </span>

    </div>



    <div v-if="project.status === 'on_hold'" class="callout callout-hold">

      <strong>{{ t('followup.onHoldTitle') }}</strong>

      <p>{{ t('followup.onHoldClient') }}</p>

    </div>

    <div v-else class="callout callout-active">

      <div class="callout-head">
        <span class="callout-label">{{ t('followup.currentStep') }}</span>
      </div>

      <p>{{ stepHint }}</p>

    </div>



    <p v-if="clientMessage" class="client-update">
      <span class="update-label">{{ variant === 'admin' ? t('followup.clientMessage') : t('followup.latestFromSak') }}</span>
      {{ clientMessage }}
    </p>



    <footer class="card-footer">

      <slot name="action">

        <router-link

          v-if="variant === 'client'"

          :to="`/dashboard/projects/${project.id}`"

          class="card-action"

        >

          {{ t('followup.viewDetails') }}

        </router-link>

      </slot>

    </footer>

  </article>

</template>



<script setup>

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from '../composables/useLocale'
import {
  getWorkflowSteps,
  getStepShortLabel,
  getCurrentPhase,
  getFollowupHint,
  getFollowupStepNumber,
  getStepMeta,
  isStepDone,
  projectClientMessage,
  projectStatusLabel
} from '../utils/projectSteps'

const { t } = useI18n()
const { locale } = useLocale()



const props = defineProps({

  project: { type: Object, required: true },

  variant: {

    type: String,

    default: 'client',

    validator: (value) => ['client', 'admin'].includes(value)

  }

})



const workflowSteps = computed(() => {
  locale.value
  return getWorkflowSteps()
})

const totalSteps = computed(() => workflowSteps.value.length)

const stepNumber = computed(() => getFollowupStepNumber(props.project))

const currentPhase = computed(() => getCurrentPhase(props.project))

const currentStep = computed(() => getStepMeta(currentPhase.value))

const stepHint = computed(() => getFollowupHint(props.project, props.variant))

const clientMessage = computed(() => projectClientMessage(props.project))

const statusLabel = computed(() => projectStatusLabel(props.project?.status))

const statusTone = computed(() => `tone-${props.project?.status || 'premier_contact'}`)



function pipelineClass(stepKey, index) {

  const done = isStepDone(props.project, stepKey)

  const active = currentPhase.value === stepKey && props.project?.status !== 'on_hold'

  const hold = props.project?.status === 'on_hold' && currentPhase.value === stepKey



  return {

    done,

    active,

    hold,

    upcoming: !done && !active && !hold

  }

}

</script>



<style scoped>

.followup-card {

  display: flex;

  flex-direction: column;

  gap: 1rem;

  padding: 1.25rem 1.3rem 1.15rem;

  background: #fff;

  border: 1px solid rgba(5, 46, 22, 0.08);

  border-radius: 18px;

  box-shadow: 0 14px 36px rgba(5, 46, 22, 0.06);

}



.card-top {

  display: flex;

  justify-content: space-between;

  gap: 1rem;

  align-items: flex-start;

}



.badge-row {

  display: flex;

  flex-wrap: wrap;

  gap: 0.4rem;

  margin-bottom: 0.55rem;

}



.pill {

  font-size: 0.64rem;

  font-weight: 800;

  letter-spacing: 0.04em;

  text-transform: uppercase;

  border-radius: 999px;

  padding: 0.22rem 0.55rem;

}



.pill-quote {

  color: #166534;

  background: #ecfdf5;

  border: 1px solid #bbf7d0;

}



.pill-client {

  color: #1e3a8a;

  background: #eff6ff;

  border: 1px solid #bfdbfe;

}



.pill-status {

  color: #374151;

  background: #f3f4f6;

  border: 1px solid #e5e7eb;

}



.pill-status.on_hold {

  color: #92400e;

  background: #fef3c7;

  border-color: #fde68a;

}



.pill-status.completed {

  color: #166534;

  background: #dcfce7;

  border-color: #bbf7d0;

}



.pill-status.premier_contact,

.pill-status.data_collection,

.pill-status.energy_data {

  color: #14532d;

  background: #f0fdf4;

  border-color: #bbf7d0;

}



.card-intro h3 {

  margin: 0;

  font-size: 1.05rem;

  font-weight: 800;

  color: #052e16;

  line-height: 1.3;

}



.card-location {

  margin: 0.35rem 0 0;

  font-size: 0.84rem;

  color: #6b7280;

}



.step-badge {

  flex-shrink: 0;

  min-width: 3.4rem;

  padding: 0.45rem 0.55rem;

  border-radius: 14px;

  background: linear-gradient(145deg, #f0fdf4, #ecfdf5);

  border: 1px solid #bbf7d0;

  text-align: center;

  line-height: 1;

}



.tone-on_hold .step-badge {

  background: linear-gradient(145deg, #fffbeb, #fef3c7);

  border-color: #fde68a;

}



.tone-completed .step-badge {

  background: linear-gradient(145deg, #ecfdf5, #dcfce7);

  border-color: #86efac;

}



.step-badge-num {

  display: block;

  font-size: 1.35rem;

  font-weight: 800;

  color: #052e16;

}



.step-badge-of {

  display: block;

  margin-top: 0.15rem;

  font-size: 0.62rem;

  font-weight: 700;

  color: #16a34a;

}



.tone-on_hold .step-badge-of {

  color: #b45309;

}



.progress-block {

  display: flex;

  flex-direction: column;

  gap: 0.45rem;

}



.progress-labels {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 0.75rem;

  font-size: 0.78rem;

  color: #6b7280;

}



.progress-labels strong {

  font-size: 0.88rem;

  color: #15803d;

}



.tone-on_hold .progress-labels strong {

  color: #b45309;

}



.progress-track {

  height: 7px;

  border-radius: 999px;

  background: #edf2ef;

  overflow: hidden;

}



.progress-fill {

  height: 100%;

  border-radius: inherit;

  background: linear-gradient(90deg, #4ade80, #16a34a);

  transition: width 0.35s ease;

}



.tone-on_hold .progress-fill {

  background: linear-gradient(90deg, #fcd34d, #f59e0b);

}



.tone-completed .progress-fill {

  background: linear-gradient(90deg, #34d399, #059669);

}



.step-pipeline {

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 0.35rem;

}



.pipeline-step {

  text-align: center;

  font-size: 0.64rem;

  font-weight: 700;

  padding: 0.35rem 0.25rem;

  border-radius: 10px;

  background: #f3f4f6;

  color: #9ca3af;

  line-height: 1.2;

}



.pipeline-step.done {

  background: #ecfdf5;

  color: #15803d;

}



.pipeline-step.active {

  background: #052e16;

  color: #fff;

  box-shadow: 0 6px 16px rgba(5, 46, 22, 0.14);

}



.pipeline-step.hold {

  background: #b45309;

  color: #fff;

}



.callout {

  border-radius: 14px;

  padding: 0.85rem 0.95rem;

}



.callout-active {

  background: linear-gradient(180deg, #f8fcf9 0%, #f3faf6 100%);

  border: 1px solid rgba(34, 197, 94, 0.16);

}



.callout-hold {

  background: #fffbeb;

  border: 1px solid #fde68a;

}



.callout-head {

  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 0.45rem;

  margin-bottom: 0.35rem;

}



.callout-label {

  font-size: 0.64rem;

  font-weight: 800;

  letter-spacing: 0.05em;

  text-transform: uppercase;

  color: #15803d;

}



.callout-rule {

  font-size: 0.6rem;

  font-weight: 800;

  letter-spacing: 0.04em;

  color: #166534;

  background: #ecfdf5;

  border: 1px solid #bbf7d0;

  border-radius: 999px;

  padding: 0.12rem 0.4rem;

}



.callout p {

  margin: 0;

  font-size: 0.84rem;

  line-height: 1.55;

  color: #374151;

}



.callout-hold strong {

  display: block;

  margin-bottom: 0.25rem;

  font-size: 0.78rem;

  color: #92400e;

}



.client-update {

  margin: 0;

  padding-top: 0.15rem;

  font-size: 0.84rem;

  line-height: 1.55;

  color: #4b5563;

  display: -webkit-box;

  -webkit-line-clamp: 3;

  -webkit-box-orient: vertical;

  overflow: hidden;

}



.update-label {

  display: block;

  margin-bottom: 0.2rem;

  font-size: 0.64rem;

  font-weight: 800;

  letter-spacing: 0.05em;

  text-transform: uppercase;

  color: #9ca3af;

}



.card-footer {

  display: flex;

  padding-top: 0.1rem;

}



.card-action {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 100%;

  min-height: 2.5rem;

  border-radius: 12px;

  background: #052e16;

  color: #fff;

  font-size: 0.84rem;

  font-weight: 700;

  text-decoration: none;

  transition: background 0.2s ease, transform 0.2s ease;

}



.card-action:hover {

  background: #14532d;

}



:deep(.card-footer .primary-btn),

:deep(.card-footer .followup-btn) {

  width: 100%;

  min-height: 2.5rem;

  border-radius: 12px;

}



@media (max-width: 420px) {

  .step-pipeline {

    grid-template-columns: repeat(2, minmax(0, 1fr));

  }

}

</style>


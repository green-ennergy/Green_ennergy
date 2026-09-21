<template>

  <div class="timeline-shell" :class="[variant, { 'is-hold': project?.status === 'on_hold' }]">

    <div v-if="variant === 'track'" class="track-shell">

      <div class="track-progress">

        <div class="track-bar">

          <div class="track-bar-fill" :style="{ width: `${project?.progress || 0}%` }"></div>

        </div>

        <span class="track-percent">{{ project?.progress || 0 }}%</span>

      </div>



      <div class="track-steps">

        <div

          v-for="(step, index) in workflowSteps"

          :key="step.key"

          class="track-step"

          :class="stepClass(step.key)"

        >

          <div class="track-connector" v-if="index > 0" aria-hidden="true"></div>

          <div class="track-node">

            <span v-if="isStepDone(project, step.key)" class="node-check">✓</span>

            <span v-else>{{ index + 1 }}</span>

          </div>

          <div class="track-copy">

            <span class="track-label">{{ step.label }}</span>

          </div>

        </div>

      </div>

    </div>



    <ol v-else class="project-timeline">

      <li

        v-for="(step, index) in workflowSteps"

        :key="step.key"

        class="timeline-item"

        :class="stepClass(step.key)"

      >

        <div class="timeline-rail">

          <div class="timeline-marker">

            <span v-if="isStepDone(project, step.key)" class="marker-check">✓</span>

            <span v-else>{{ index + 1 }}</span>

          </div>

          <span v-if="index < workflowSteps.length - 1" class="timeline-line" aria-hidden="true"></span>

        </div>



        <div class="timeline-body">

          <div class="timeline-head">

            <strong>{{ step.label }}</strong>

            <span v-if="stepClass(step.key).active" class="now-tag">{{ t('followup.timeline.current') }}</span>

            <span v-if="stepClass(step.key).hold" class="now-tag hold">{{ t('followup.timeline.onHold') }}</span>

            <span v-else-if="stepClass(step.key).done" class="done-tag">{{ t('followup.timeline.done') }}</span>

          </div>

          <p>{{ audience === 'admin' ? step.adminHint : step.clientHint }}</p>

        </div>

      </li>

    </ol>

  </div>

</template>



<script setup>

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from '../../composables/useLocale'
import {
  getWorkflowSteps,
  getCurrentPhase,
  isStepDone
} from '../../utils/projectSteps'

const { t } = useI18n()
const { locale } = useLocale()



const props = defineProps({

  project: { type: Object, required: true },

  variant: {

    type: String,

    default: 'vertical',

    validator: (value) => ['vertical', 'track'].includes(value)

  },

  audience: {
    type: String,
    default: 'client',
    validator: (value) => ['client', 'admin'].includes(value)
  }
})



const workflowSteps = computed(() => {
  locale.value
  return getWorkflowSteps()
})

const currentPhase = computed(() => getCurrentPhase(props.project))



const stepClass = (stepKey) => ({

  done: isStepDone(props.project, stepKey),

  active: currentPhase.value === stepKey && props.project?.status !== 'on_hold',

  hold: props.project?.status === 'on_hold' && currentPhase.value === stepKey

})

</script>



<style scoped>

.timeline-shell {

  width: 100%;

}



.track-shell {

  display: flex;

  flex-direction: column;

  gap: 1rem;

  padding: 0.85rem 0.95rem;

  border-radius: 14px;

  background: #f8fbf9;

  border: 1px solid rgba(5, 46, 22, 0.06);

}



.track-progress {

  display: flex;

  align-items: center;

  gap: 0.75rem;

}



.track-bar {

  flex: 1;

  height: 8px;

  border-radius: 999px;

  background: #e8eee9;

  overflow: hidden;

}



.track-bar-fill {

  height: 100%;

  border-radius: inherit;

  background: #1c1917;

  transition: width 0.35s ease;

}



.is-hold .track-bar-fill {

  background: #a8a29e;

}



.track-percent {

  flex-shrink: 0;

  font-size: 0.82rem;

  font-weight: 800;

  color: #44403c;

  min-width: 2.5rem;

  text-align: right;

}



.is-hold .track-percent {

  color: #78716c;

}



.track-steps {

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 0.5rem;

}



.track-step {

  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  gap: 0.45rem;

  min-width: 0;

}



.track-connector {

  position: absolute;

  top: 1rem;

  right: calc(50% + 1rem);

  width: calc(100% - 2rem);

  height: 2px;

  background: #dbe3dc;

  transform: translateY(-50%);

  z-index: 0;

}



.track-step.done .track-connector {

  background: #86efac;

}



.track-node {

  position: relative;

  z-index: 1;

  width: 2rem;

  height: 2rem;

  border-radius: 999px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  font-size: 0.78rem;

  font-weight: 800;

  color: #9ca3af;

  background: #fff;

  border: 2px solid #dbe3dc;

}



.node-check {

  font-size: 0.82rem;

  line-height: 1;

}



.track-step.done .track-node {

  background: #f5f5f4;

  border-color: #d6d3d1;

  color: #44403c;

}



.track-step.active .track-node,

.track-step.hold .track-node {

  background: #1c1917;

  border-color: #1c1917;

  color: #fff;

  box-shadow: none;

}



.track-step.hold .track-node {

  box-shadow: none;

}



.track-copy {

  display: flex;

  flex-direction: column;

  gap: 0.2rem;

  min-width: 0;

}



.track-label {

  font-size: 0.72rem;

  font-weight: 700;

  color: #6b7280;

  line-height: 1.25;

}



.track-rule {

  font-size: 0.58rem;

  font-weight: 800;

  letter-spacing: 0.04em;

  color: #166534;

}



.track-step.done .track-label,

.track-step.active .track-label,

.track-step.hold .track-label {

  color: #052e16;

}



.project-timeline {

  list-style: none;

  margin: 0;

  padding: 0;

  display: flex;

  flex-direction: column;

  gap: 0.85rem;

}



.timeline-item {

  display: grid;

  grid-template-columns: 3.25rem 1fr;

  gap: 1rem;

  align-items: stretch;

}



.timeline-rail {

  display: flex;

  flex-direction: column;

  align-items: center;

  min-height: 100%;

}



.timeline-marker {

  width: 3.25rem;

  height: 3.25rem;

  border-radius: 999px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  font-size: 0.92rem;

  font-weight: 800;

  background: #fafafa;

  color: #9ca3af;

  border: 2px solid #e5e7eb;

  flex-shrink: 0;

}



.marker-check {

  font-size: 1rem;

}



.timeline-line {

  flex: 1;

  width: 2px;

  margin: 0.35rem 0;

  min-height: 1rem;

  background: #e5e7eb;

  border-radius: 999px;

}



.timeline-item.done .timeline-line {

  background: #d6d3d1;

}



.timeline-item.done .timeline-marker {

  background: #f5f5f4;

  border-color: #d6d3d1;

  color: #44403c;

}



.timeline-item.active .timeline-marker,

.timeline-item.hold .timeline-marker {

  background: #052e16;

  border-color: #052e16;

  color: #fff;

  box-shadow: 0 10px 24px rgba(5, 46, 22, 0.16);

}



.timeline-body {

  padding: 0.85rem 1rem;

  border-radius: 16px;

  border: 1px solid rgba(5, 46, 22, 0.06);

  background: #fff;

}



.timeline-item.active .timeline-body {

  border-color: #e7e5e4;

  background: #fafaf9;

  box-shadow: 0 10px 24px rgba(5, 46, 22, 0.06);

}



.timeline-item.hold .timeline-body {

  border-color: #e7e5e4;

  background: #fafaf9;

}



.timeline-item.done .timeline-body {

  background: #fafafa;

}



.timeline-head {

  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 0.45rem;

}



.timeline-body strong {

  font-size: 0.98rem;

  color: #052e16;

}



.rule-tag {

  font-size: 0.62rem;

  font-weight: 800;

  letter-spacing: 0.04em;

  text-transform: uppercase;

  color: #44403c;

  background: #f5f5f4;

  border: 1px solid #e7e5e4;

  border-radius: 999px;

  padding: 0.15rem 0.45rem;

}



.now-tag {

  font-size: 0.62rem;

  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.04em;

  color: #fff;

  background: #052e16;

  border-radius: 999px;

  padding: 0.15rem 0.45rem;

}



.now-tag.hold {

  background: #78716c;

}



.done-tag {

  font-size: 0.62rem;

  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.04em;

  color: #44403c;

  background: #f5f5f4;

  border-radius: 999px;

  padding: 0.15rem 0.45rem;

}



.timeline-body p {

  margin: 0.45rem 0 0;

  font-size: 0.86rem;

  color: #6b7280;

  line-height: 1.55;

}



@media (max-width: 720px) {

  .track-steps {

    grid-template-columns: repeat(2, minmax(0, 1fr));

    row-gap: 0.85rem;

  }



  .track-connector {

    display: none;

  }

}

</style>


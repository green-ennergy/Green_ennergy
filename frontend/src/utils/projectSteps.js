import { i18n } from '../i18n'

export const PROJECT_STEP_KEYS = [
  'premier_contact',
  'data_collection',
  'energy_data',
  'completed'
]

export const PROJECT_STATUS_ORDER = [...PROJECT_STEP_KEYS, 'on_hold']

/** @deprecated use getWorkflowSteps() for translated labels */
export const PROJECT_WORKFLOW_STEPS = PROJECT_STEP_KEYS.map(key => ({ key }))

export function getWorkflowSteps() {
  return PROJECT_STEP_KEYS.map(key => ({
    key,
    label: i18n.global.t(`followup.steps.${key}.label`),
    labelFr: i18n.global.t(`followup.steps.${key}.label`),
    clientHint: i18n.global.t(`followup.steps.${key}.clientHint`),
    adminHint: i18n.global.t(`followup.steps.${key}.adminHint`)
  }))
}

export function getStepShortLabel(stepKey) {
  return i18n.global.t(`followup.steps.${stepKey}.short`)
}

export function phaseToCompletedSteps(phase) {
  const index = PROJECT_STEP_KEYS.indexOf(phase)
  if (index === -1) return []
  return PROJECT_STEP_KEYS.slice(0, index + 1)
}

export function getCompletedSteps(project) {
  if (project?.completed_steps?.length) {
    return PROJECT_STEP_KEYS.filter(key => project.completed_steps.includes(key))
  }

  const status = project?.status
  if (!status || status === 'on_hold') return []

  const index = PROJECT_STEP_KEYS.indexOf(status)
  if (index === -1) return []
  return PROJECT_STEP_KEYS.slice(0, index + 1)
}

export function getCurrentPhase(project) {
  if (!project) return 'premier_contact'

  const steps = getCompletedSteps(project)
  if (steps.length) {
    return steps[steps.length - 1]
  }

  if (project.status && project.status !== 'on_hold') {
    return project.status
  }

  return 'premier_contact'
}

export function isStepDone(project, stepKey) {
  return getCompletedSteps(project).includes(stepKey)
}

export function getStepMeta(stepKey) {
  if (!PROJECT_STEP_KEYS.includes(stepKey)) return null
  return {
    key: stepKey,
    label: i18n.global.t(`followup.steps.${stepKey}.label`),
    labelFr: i18n.global.t(`followup.steps.${stepKey}.label`),
    clientHint: i18n.global.t(`followup.steps.${stepKey}.clientHint`),
    adminHint: i18n.global.t(`followup.steps.${stepKey}.adminHint`)
  }
}

export function getStepIndex(stepKey) {
  return PROJECT_STEP_KEYS.indexOf(stepKey)
}

export function projectStatusLabel(status) {
  const key = `followup.status.${status}`
  if (i18n.global.te(key)) return i18n.global.t(key)
  return status
}

export function projectTypeLabel(type) {
  return {
    solar_design: 'Solar system design',
    installation: 'Installation',
    study: 'Study & sizing',
    maintenance: 'Maintenance',
    support: 'Technical support'
  }[type] || type
}

export function studyLevelLabel(level) {
  return {
    ht: 'HT — High voltage',
    mt: 'MT — Medium voltage',
    bt: 'BT — Low voltage'
  }[level] || '—'
}

export function getFollowupStepNumber(project) {
  const phase = getCurrentPhase(project)
  const index = getStepIndex(phase)
  return index >= 0 ? index + 1 : 1
}

export function getFollowupHint(project, audience = 'client') {
  const phase = getCurrentPhase(project)
  const hintKey = audience === 'admin' ? 'adminHint' : 'clientHint'
  return i18n.global.t(`followup.steps.${phase}.${hintKey}`)
}

const CONFIRMED_ORDER_PREFIX = /^Confirmed order:\s*/i

export function extractClientMessage(description) {
  if (!description?.trim()) return ''
  if (CONFIRMED_ORDER_PREFIX.test(description.trim())) return ''
  return description.trim()
}

export function parseLegacyOrderSummary(description) {
  if (!description?.trim()) return null
  const match = description.trim().match(/^Confirmed order:\s*(.+)$/is)
  return match?.[1]?.trim() || null
}

export function projectClientMessage(project) {
  return extractClientMessage(project?.description)
}

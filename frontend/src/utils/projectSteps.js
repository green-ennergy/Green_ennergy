import { i18n } from '../i18n'

export const PROJECT_STEP_KEYS = [
  'quote_confirmed',
  'order_prep',
  'installation',
  'completed'
]

/** Map legacy study-funnel statuses to the commercial delivery pipeline. */
const LEGACY_STEP_MAP = {
  premier_contact: 'quote_confirmed',
  data_collection: 'order_prep',
  energy_data: 'installation',
  completed: 'completed'
}

export const PROJECT_STATUS_ORDER = [...PROJECT_STEP_KEYS, 'on_hold']

/** @deprecated use getWorkflowSteps() for translated labels */
export const PROJECT_WORKFLOW_STEPS = PROJECT_STEP_KEYS.map(key => ({ key }))

export function normalizePhaseKey(key) {
  if (!key || key === 'on_hold') return key
  if (PROJECT_STEP_KEYS.includes(key)) return key
  return LEGACY_STEP_MAP[key] || key
}

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
  const key = normalizePhaseKey(stepKey)
  return i18n.global.t(`followup.steps.${key}.short`)
}

export function phaseToCompletedSteps(phase) {
  const key = normalizePhaseKey(phase)
  const index = PROJECT_STEP_KEYS.indexOf(key)
  if (index === -1) return []
  return PROJECT_STEP_KEYS.slice(0, index + 1)
}

export function getCompletedSteps(project) {
  if (project?.completed_steps?.length) {
    const normalized = project.completed_steps.map(normalizePhaseKey)
    return PROJECT_STEP_KEYS.filter(key => normalized.includes(key))
  }

  const status = normalizePhaseKey(project?.status)
  if (!status || status === 'on_hold') return []

  const index = PROJECT_STEP_KEYS.indexOf(status)
  if (index === -1) return []
  return PROJECT_STEP_KEYS.slice(0, index + 1)
}

export function getCurrentPhase(project) {
  if (!project) return 'quote_confirmed'

  const steps = getCompletedSteps(project)
  if (steps.length) {
    return steps[steps.length - 1]
  }

  if (project.status && project.status !== 'on_hold') {
    return normalizePhaseKey(project.status)
  }

  return 'quote_confirmed'
}

export function isStepDone(project, stepKey) {
  return getCompletedSteps(project).includes(normalizePhaseKey(stepKey))
}

export function getStepMeta(stepKey) {
  const key = normalizePhaseKey(stepKey)
  if (!PROJECT_STEP_KEYS.includes(key)) return null
  return {
    key,
    label: i18n.global.t(`followup.steps.${key}.label`),
    labelFr: i18n.global.t(`followup.steps.${key}.label`),
    clientHint: i18n.global.t(`followup.steps.${key}.clientHint`),
    adminHint: i18n.global.t(`followup.steps.${key}.adminHint`)
  }
}

export function getStepIndex(stepKey) {
  return PROJECT_STEP_KEYS.indexOf(normalizePhaseKey(stepKey))
}

export function projectStatusLabel(status) {
  if (status === 'on_hold') return i18n.global.t('followup.status.on_hold')
  const key = normalizePhaseKey(status)
  const i18nKey = `followup.status.${key}`
  if (i18n.global.te(i18nKey)) return i18n.global.t(i18nKey)
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

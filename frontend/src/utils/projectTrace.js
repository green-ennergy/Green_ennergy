export function formatTraceChange(change) {
  if (!change) return ''

  const label = change.label || change.field || 'Field'

  if (change.action === 'cleared') {
    return `${label} cleared`
  }

  if (change.action === 'added') {
    if (change.to) {
      return `${label} added: “${change.to}”`
    }
    return `${label} added`
  }

  if (change.action === 'updated') {
    if (change.to) {
      return `${label} updated: “${change.to}”`
    }
    return `${label} updated`
  }

  if (change.from || change.to) {
    return `${label}: ${change.from || '—'} → ${change.to || '—'}`
  }

  return `${label} changed`
}

export function formatTraceSummary(trace) {
  if (trace?.summary) return trace.summary
  if (!trace?.changes?.length) return 'Follow-up updated'
  return trace.changes.map(formatTraceChange).join(' · ')
}

export function traceActorLabel(trace) {
  return trace?.user?.name || trace?.user?.email || 'Team member'
}

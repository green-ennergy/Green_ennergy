/** Parse "09:00 - 13:00" / "09:00–13:00" into { startMin, endMin } (minutes from midnight). */
export function parseTimeSlot(slot) {
  if (!slot || typeof slot !== 'string') return null
  const normalized = slot.replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim()
  const match = normalized.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
  if (!match) return null
  const startMin = Number(match[1]) * 60 + Number(match[2])
  const endMin = Number(match[3]) * 60 + Number(match[4])
  if (endMin <= startMin) return null
  return { startMin, endMin }
}

export function slotRangeOnDate(dateStr, slot) {
  const parsed = parseTimeSlot(slot)
  if (!dateStr || !parsed) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) return null
  const start = new Date(y, m - 1, d, 0, 0, 0, 0)
  const end = new Date(y, m - 1, d, 0, 0, 0, 0)
  start.setMinutes(parsed.startMin)
  end.setMinutes(parsed.endMin)
  return { start, end }
}

export function slotsOverlap(slotA, slotB) {
  const a = parseTimeSlot(slotA)
  const b = parseTimeSlot(slotB)
  if (!a || !b) return false
  return a.startMin < b.endMin && b.startMin < a.endMin
}

/** Active missions that clash with operator + date + slot (same day overlap). */
export function findOperatorSlotConflicts(tasks, { operatorId, scheduledDate, timeSlot, excludeId = null }) {
  if (!operatorId || !scheduledDate || !timeSlot) return []
  return (tasks || []).filter((task) => {
    if (excludeId != null && String(task.id) === String(excludeId)) return false
    if (String(task.operatorId) !== String(operatorId)) return false
    if (task.scheduledDate !== scheduledDate) return false
    if (task.status === 'completed') return false
    return slotsOverlap(task.timeSlot, timeSlot)
  })
}

export function missionDeadline(task) {
  return slotRangeOnDate(task?.scheduledDate, task?.timeSlot)?.end || null
}

/**
 * Human countdown until slot end (or overdue).
 * Returns { labelKey, labelParams, tone: 'ok'|'soon'|'overdue'|'done' }
 */
export function missionCountdown(task, now = new Date()) {
  if (!task || task.status === 'completed') {
    return { tone: 'done', minutesLeft: null }
  }
  const end = missionDeadline(task)
  if (!end) return { tone: 'ok', minutesLeft: null }

  const diffMs = end.getTime() - now.getTime()
  const minutesLeft = Math.round(diffMs / 60000)

  if (minutesLeft < 0) {
    const overdueMin = Math.abs(minutesLeft)
    if (overdueMin < 60) {
      return { tone: 'overdue', minutesLeft, overdueMin, overdueDays: 0, overdueHours: 0 }
    }
    const totalHours = Math.floor(overdueMin / 60)
    const overdueDays = Math.floor(totalHours / 24)
    const overdueHours = totalHours % 24
    const overdueRemainMin = overdueMin % 60
    return {
      tone: 'overdue',
      minutesLeft,
      overdueMin,
      overdueDays,
      overdueHours,
      overdueRemainMin
    }
  }
  if (minutesLeft < 60) return { tone: 'soon', minutesLeft, hours: 0, mins: minutesLeft }
  const hours = Math.floor(minutesLeft / 60)
  const mins = minutesLeft % 60
  const days = Math.floor(hours / 24)
  if (days >= 1) {
    return { tone: hours < 48 ? 'soon' : 'ok', minutesLeft, days, hours: hours % 24, mins }
  }
  return { tone: hours < 3 ? 'soon' : 'ok', minutesLeft, days: 0, hours, mins }
}

export const TASK_TIME_SLOTS = [
  '08:30 - 11:30',
  '09:00 - 13:00',
  '10:30 - 12:30',
  '14:00 - 17:00'
]

/** Build calendar cells for a month (Mon-start grid). */
export function buildMonthGrid(year, monthIndex) {
  const first = new Date(year, monthIndex, 1)
  const startOffset = (first.getDay() + 6) % 7 // Mon=0
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push({ day, date })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

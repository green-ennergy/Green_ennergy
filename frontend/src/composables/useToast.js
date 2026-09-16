import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

function dismiss(id) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

function push(message, type = 'error', duration = 4200) {
  if (!message) return null
  const id = nextId++
  toasts.value = [...toasts.value, { id, message: String(message), type }]
  if (duration > 0) {
    window.setTimeout(() => dismiss(id), duration)
  }
  return id
}

export function useToast() {
  return {
    toasts,
    dismiss,
    push,
    error: (message, duration) => push(message, 'error', duration),
    success: (message, duration) => push(message, 'success', duration),
    info: (message, duration) => push(message, 'info', duration)
  }
}

<script setup>
import { useToast } from '../composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toast-host" aria-live="polite" aria-relevant="additions">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
        role="status"
      >
        <p>{{ toast.message }}</p>
        <button type="button" class="toast-close" :aria-label="'Dismiss'" @click="dismiss(toast.id)">
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 4000;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: min(360px, calc(100vw - 2rem));
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  border: 1px solid transparent;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
  backdrop-filter: blur(8px);
}

.toast p {
  margin: 0;
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.4;
  font-weight: 600;
}

.toast-error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #b91c1c;
}

.toast-success {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #047857;
}

.toast-info {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.toast-close {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 1.15rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
  padding: 0;
}

.toast-close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.22s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

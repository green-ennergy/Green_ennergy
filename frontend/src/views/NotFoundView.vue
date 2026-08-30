<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  document.documentElement.style.overscrollBehavior = 'none'
  document.body.style.overflow = 'hidden'
  document.body.style.overscrollBehavior = 'none'
  document.body.style.background = '#eef4f0'
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  document.documentElement.style.overscrollBehavior = ''
  document.body.style.overflow = ''
  document.body.style.overscrollBehavior = ''
  document.body.style.background = ''
})
</script>

<template>
  <main class="not-found-page">
    <div class="not-found-glow not-found-glow-a" aria-hidden="true"></div>
    <div class="not-found-glow not-found-glow-b" aria-hidden="true"></div>

    <div class="not-found-content">
      <p class="card-eyebrow">Page unavailable</p>
      <p class="error-code">404</p>
      <h1>Page not found</h1>
      <p class="description">
        The page you are looking for does not exist, was moved, or is no longer available.
      </p>

      <ul class="reasons">
        <li>Check the address for typos</li>
        <li>The page may have been moved or removed</li>
        <li>Your bookmark might be outdated</li>
      </ul>

      <div class="actions">
        <RouterLink to="/" class="primary-btn">Return home</RouterLink>
        <button type="button" class="ghost-btn" @click="router.back()">Go back</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.not-found-page {
  position: fixed;
  inset: 0;
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  text-align: center;
  background: #eef4f0;
  font-family: 'Outfit', sans-serif;
  overscroll-behavior: none;
}

.not-found-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}

.not-found-glow-a {
  width: 280px;
  height: 280px;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(74, 222, 128, 0.14);
}

.not-found-glow-b {
  width: 220px;
  height: 220px;
  right: 8%;
  bottom: 10%;
  background: rgba(34, 197, 94, 0.1);
}

.not-found-content {
  position: relative;
  z-index: 1;
  width: min(100%, 440px);
}

.card-eyebrow {
  margin-bottom: 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #16a34a;
}

.error-code {
  margin-bottom: 0.4rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(3rem, 11vw, 4.5rem);
  font-weight: 800;
  line-height: 1;
  color: #052e16;
}

h1 {
  margin-bottom: 0.65rem;
  font-size: clamp(1.35rem, 4vw, 1.6rem);
  font-weight: 800;
  color: #052e16;
}

.description {
  max-width: 380px;
  margin: 0 auto 1.1rem;
  color: #6b7280;
  font-size: 0.92rem;
  line-height: 1.55;
}

.reasons {
  list-style: none;
  margin: 0 auto 1.25rem;
  padding: 0;
  max-width: 320px;
  text-align: left;
}

.reasons li {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.35rem;
  font-size: 0.82rem;
  color: #6b7280;
  line-height: 1.45;
}

.reasons li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22c55e;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem;
}

.primary-btn {
  background: #22c55e;
  color: #052e16;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.primary-btn:hover {
  background: #16a34a;
}

.ghost-btn {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0.6rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.ghost-btn:hover {
  border-color: rgba(34, 197, 94, 0.35);
  background: rgba(255, 255, 255, 0.5);
}

@media (max-height: 700px) {
  .error-code {
    font-size: 2.75rem;
  }

  .description,
  .reasons {
    margin-bottom: 0.85rem;
  }

  .reasons li {
    margin-bottom: 0.2rem;
  }
}

@media (max-width: 520px) {
  .not-found-content {
    width: 100%;
  }

  .reasons {
    max-width: 100%;
  }

  .actions {
    flex-direction: column;
    width: 100%;
    max-width: 280px;
    margin-inline: auto;
  }

  .primary-btn,
  .ghost-btn {
    width: 100%;
  }
}
</style>

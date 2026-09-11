import { onMounted, onUnmounted } from 'vue'

/**
 * Global scroll-reveal using IntersectionObserver.
 * Watches all `.reveal` elements and adds `.visible` when they enter the viewport.
 * Supports optional `data-delay="200"` attribute for staggered reveals.
 */
export function useScrollReveal(options = {}) {
  let observer = null

  const init = () => {
    const config = {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
      ...options,
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0
          setTimeout(() => {
            entry.target.classList.add('visible')
          }, Number(delay))
          observer.unobserve(entry.target)
        }
      })
    }, config)

    document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right').forEach((el) => observer.observe(el))
  }

  onMounted(() => init())
  onUnmounted(() => observer?.disconnect())
}

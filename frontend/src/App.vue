<script setup>
import Navbar from './components/LandingPage/Navbar.vue'
import Footer from './components/LandingPage/Footer.vue'
import ToastHost from './components/ToastHost.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const hideChrome = computed(() => {
  const name = String(route.name || '')
  if (['login', 'dashboard', 'admin', 'operator', 'not-found'].includes(name)) return true
  const path = route.path || ''
  return (
    path.startsWith('/admin') ||
    path.startsWith('/operator') ||
    path.startsWith('/dashboard') ||
    path.startsWith('/login')
  )
})
</script>

<template>
  <!-- Single root avoids HMR leaving orphan page copies in #app -->
  <div class="app-shell">
    <Navbar v-if="!hideChrome" />
    <RouterView :key="route.fullPath" />
    <Footer v-if="!hideChrome" />
    <ToastHost />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}
</style>

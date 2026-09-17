<script setup>
import Navbar from './components/LandingPage/Navbar.vue'
import Footer from './components/LandingPage/Footer.vue'
import ToastHost from './components/ToastHost.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const hideChrome = computed(() =>
  ['login', 'dashboard', 'admin', 'operator', 'not-found'].includes(route.name)
)
</script>

<template>
  <Navbar v-if="!hideChrome" />
  <RouterView />
  <Footer v-if="!hideChrome" />
  <ToastHost />
</template>

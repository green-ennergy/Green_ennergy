<script setup>
  import Navbar from './components/LandingPage/Navbar.vue';
  import Footer from './components/LandingPage/Footer.vue';
  import { useRoute } from 'vue-router'
  import { computed } from 'vue'



  const route = useRoute()

  const showLayout = computed(() => {
  return !['login', 'dashboard', 'admin', 'operator'].includes(route.name)
})


</script>


<template>
    <Navbar v-if="showLayout" />
    <RouterView />
    <Footer v-if="showLayout" />
</template>


<style scoped>

</style>
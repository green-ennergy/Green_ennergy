<script setup>
  import Navbar from './components/LandingPage/Navbar.vue';
  import Footer from './components/LandingPage/Footer.vue';
</script>


<template>
    <Navbar v-if="showLayout" />
    <RouterView />
    <Footer v-if="showLayout" />
</template>


<style scoped>

</style>
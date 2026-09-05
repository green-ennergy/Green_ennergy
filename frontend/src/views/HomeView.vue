<script setup>

 import Navbar from '../components/LandingPage/Navbar.vue'
import HeroSection from '../components/LandingPage/HeroSection.vue'
import WhySolarSection from '../components/LandingPage/WhySolarSection.vue'
import AboutSection from '../components/LandingPage/AboutSection.vue'
import HowItWorksSection from '../components/LandingPage/HowItWorksSection.vue';
import PartnersSection from '../components/LandingPage/PartnersSection.vue';
</script>

<template>
    <Navbar />
    <HeroSection />
    <WhySolarSection />
    <AboutSection />
    <HowItWorksSection />
    <ProjectsSection/>
    <TestimonialsSection/>
    <PartnersSection />
</template>

<style scoped >
.home-view {
  width: 100%;
}
</style>
<script setup>

import Navbar from '../components/LandingPage/Navbar.vue'
import HeroSection from '../components/LandingPage/HeroSection.vue'
import WhySolarSection from '../components/LandingPage/WhySolarSection.vue'
import AboutSection from '../components/LandingPage/AboutSection.vue'
import HowItWorksSection from '../components/LandingPage/HowItWorksSection.vue';
import PartnersSection from '../components/LandingPage/PartnersSection.vue';
import TestimonialsSection from '../components/LandingPage/TestimonialsSection.vue';
import ProjectsSection from '../components/LandingPage/ProjectsSection.vue';
import ServicesSection from '../components/LandingPage/ServicesSection.vue';
import FaqSection from '../components/LandingPage/FaqSection.vue';
</script>

<template>
    <Navbar />
    <HeroSection />
    <WhySolarSection />
    <AboutSection />
    <HowItWorksSection />
    <PartnersSection />
    <ServicesSection/>  
    <ProjectsSection/>
    <TestimonialsSection/>
    <FaqSection />
</template>

<style scoped >
.home-view {
  width: 100%;
}
</style>
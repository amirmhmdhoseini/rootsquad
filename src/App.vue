<script setup>
import { onMounted } from 'vue'
import ContactSection from './components/ContactSection.vue'
import DetailModal from './components/DetailModal.vue'
import HeroSection from './components/HeroSection.vue'
import SceneLayer from './components/SceneLayer.vue'
import ServicesSection from './components/ServicesSection.vue'
import SiteChrome from './components/SiteChrome.vue'
import TeamSection from './components/TeamSection.vue'
import WorkSection from './components/WorkSection.vue'
import { initSiteInteractions } from './composables/useSiteInteractions'

onMounted(() => {
  initSiteInteractions()
  // three.js and the 3D scene load as a separate chunk after the page text is already on screen
  requestAnimationFrame(() => import('./composables/useRootScene').then((m) => m.initRootScene()))
})
</script>

<template>
  <SceneLayer />
  <SiteChrome />

  <main>
    <HeroSection />
    <ServicesSection />
    <WorkSection />
    <TeamSection />
    <ContactSection />
  </main>

  <DetailModal />
</template>

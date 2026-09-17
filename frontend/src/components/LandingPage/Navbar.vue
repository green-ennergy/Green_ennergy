<template>
  <nav class="navbar" :class="{ scrolled: isScrolled, 'light-navbar': isLightNavbar }" role="navigation" aria-label="Main navigation">
    <div class="container nav-container">
      <!-- Logo -->
      <router-link to="/" class="logo" :aria-label="t('nav.homeAria')">
        <div class="logo-icon">
          <svg width="18" height="24" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12.986 0L0 17.525H10.158L7.863 32L24 12.019H12.986V0Z" fill="#4ade80"/>
          </svg>
        </div>
        <span class="logo-text">ENERGY</span>
      </router-link>

      <!-- Desktop links -->
      <ul class="nav-links" role="list">
        <li><router-link to="/store" class="nav-link">{{ t('nav.store') }}</router-link></li>
        <li><router-link to="/services" class="nav-link">{{ t('nav.services') }}</router-link></li>
        <li><router-link to="/partners" class="nav-link">Partenaires</router-link></li>
        <li><router-link to="/about" class="nav-link">{{ t('nav.about') }}</router-link></li>
        <li><router-link to="/#faq" class="nav-link">{{ t('nav.faq') }}</router-link></li>
      </ul>

      <div class="nav-actions">
        <template v-if="isLoggedIn">
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="nav-signin"
          >
            {{ t('nav.admin') }}
          </router-link>
          <router-link
            v-else
            to="/dashboard"
            class="nav-signin"
          >
            {{ t('nav.dashboard') }}
          </router-link>
          <button type="button" class="btn nav-login get-consultation" @click="handleLogout">
            {{ t('common.signOut') }}
          </button>
        </template>
        <router-link
          v-else
          to="/login"
          class="btn nav-login get-consultation"
        >
          {{ t('nav.signIn') }}
        </router-link>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="mobile-menu-btn"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        :aria-label="t('nav.toggleMenu')"
        @click="isMenuOpen = !isMenuOpen"
      >
        <svg v-if="!isMenuOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMenuOpen" id="mobile-menu" class="mobile-menu animate-fade-in" role="dialog" aria-label="Mobile navigation">
      <ul role="list">
        <li><router-link to="/store" @click="isMenuOpen = false">{{ t('nav.store') }}</router-link></li>
        <li><router-link to="/#faq" @click="isMenuOpen = false">{{ t('nav.faq') }}</router-link></li>
        <li><router-link to="/#about" @click="isMenuOpen = false">{{ t('nav.about') }}</router-link></li>
        <li v-if="isLoggedIn && isAdmin">
          <router-link to="/admin" @click="isMenuOpen = false">{{ t('nav.admin') }}</router-link>
        </li>
        <li v-else-if="isLoggedIn">
          <router-link to="/dashboard" @click="isMenuOpen = false">{{ t('nav.dashboard') }}</router-link>
        </li>
        <li v-if="isLoggedIn">
          <button type="button" class="mobile-auth-btn" @click="handleLogout">{{ t('common.signOut') }}</button>
        </li>
        <li v-else>
          <router-link to="/login" @click="isMenuOpen = false">{{ t('nav.signIn') }}</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { isLoggedIn, isAdmin, logoutUser } = useAuth()

const isScrolled = ref(false)
const isMenuOpen = ref(false)

const isLightNavbar = computed(() => {
  return route && route.path && route.path.startsWith('/store')
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const handleLogout = async () => {
  isMenuOpen.value = false
  await logoutUser()
  if (route.name !== 'home') {
    router.push('/')
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1.5rem 0;
  color: #f0fdf4;
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  background: rgba(2, 13, 7, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 1rem 0;
  box-shadow: 0 1px 0 rgba(74,222,128,0.12), 0 8px 24px rgba(0,0,0,0.3);
  border-bottom-color: rgba(74,222,128,0.1);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
}

.logo-icon {
  width: 34px;
  height: 34px;
  background: rgba(74,222,128,0.12);
  border: 1px solid rgba(74,222,128,0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 1.5px;
  color: #f0fdf4;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(240,253,244,0.7);
  position: relative;
  transition: color 0.2s;
}

.nav-links a:hover { color: #f0fdf4; }

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #4ade80;
  transition: width 0.25s;
}

.nav-links a:hover::after { width: 100%; }

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-signin {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(240,253,244,0.65);
  transition: color 0.2s;
}

.nav-signin:hover { color: #f0fdf4; }

.nav-login {
  font-size: 0.875rem;
  font-weight: 600;
  color: #052e16;
  background: #4ade80;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-login:hover {
  background: #22c55e;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(34,197,94,0.4);
}

/* Mobile */
.mobile-menu-btn {
  display: none;
  color: rgba(240,253,244,0.9);
  padding: 4px;
}

.mobile-menu {
  display: none;
}

.mobile-auth-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.875rem 0;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  color: rgba(240,253,244,0.75);
  font-family: inherit;
  cursor: pointer;
}

.mobile-auth-btn:hover {
  color: #4ade80;
}

@media (max-width: 900px) {
  .nav-links,
  .nav-actions {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(2,13,7,0.97);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    padding: 1.5rem 2rem 2rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    border-bottom: 1px solid rgba(74,222,128,0.1);
  }

  .mobile-menu ul {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 0;
  }

  .mobile-menu ul li a,
  .mobile-menu ul li .mobile-auth-btn {
    display: block;
    padding: 0.875rem 0;
    border-bottom: 1px solid rgba(240,253,244,0.06);
    font-size: 0.95rem;
    color: rgba(240,253,244,0.75);
    transition: color 0.2s;
  }

  .mobile-menu ul li:last-child a,
  .mobile-menu ul li:last-child .mobile-auth-btn {
    border-bottom: none;
  }

  .mobile-menu ul li a:hover { color: #4ade80; }
}

/* ─── Light Navbar Theme (Store pages) ────────── */
.navbar.light-navbar {
  color: #052e16;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.navbar.light-navbar:not(.scrolled) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.navbar.light-navbar.scrolled {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border-bottom-color: rgba(22, 163, 74, 0.1);
}

.navbar.light-navbar .logo-text {
  color: #052e16;
}

.navbar.light-navbar .logo-icon {
  background: rgba(22, 163, 74, 0.06);
  border-color: rgba(22, 163, 74, 0.15);
}

.navbar.light-navbar .nav-links a {
  color: rgba(5, 46, 22, 0.65);
}

.navbar.light-navbar .nav-links a:hover {
  color: #16a34a;
}

.navbar.light-navbar .nav-links a::after {
  background: #16a34a;
}

.navbar.light-navbar .nav-signin {
  color: rgba(5, 46, 22, 0.65);
}

.navbar.light-navbar .nav-signin:hover {
  color: #16a34a;
}

.navbar.light-navbar .mobile-menu-btn {
  color: #052e16;
}
</style>

import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

const el = document.getElementById('app')
if (el) {
  // Clear any stale DOM left by Vite HMR / previous mounts
  el.replaceChildren()
}

createApp(App).use(router).use(i18n).mount('#app')

import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuth } from './composables/useAuth'

const el = document.getElementById('app')
if (el) {
  // Clear any stale DOM left by Vite HMR / previous mounts
  el.replaceChildren()
}

const app = createApp(App)
app.use(router).use(i18n)

const { token, refreshUser } = useAuth()
const boot = token.value ? refreshUser() : Promise.resolve()

boot.finally(() => {
  app.mount('#app')
})

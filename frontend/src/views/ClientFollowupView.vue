<template>
  <div class="client-followup">
    <header class="bar">
      <router-link to="/" class="brand">Energy Agency</router-link>
      <button type="button" class="ghost" @click="logout">{{ t('common.signOut') }}</button>
    </header>

    <main>
      <h1>{{ t('admin.drawer.messagesTitle') }}</h1>
      <p v-if="loadError" class="error">{{ loadError }}</p>
      <p v-else-if="!projects.length" class="empty">{{ t('admin.projects.emptyTitle') }}</p>

      <div v-else class="layout">
        <aside>
          <button
            v-for="project in projects"
            :key="project.id"
            type="button"
            class="project-pick"
            :class="{ active: selectedId === project.id }"
            @click="openProject(project)"
          >
            <strong>{{ project.name }}</strong>
            <span>{{ project.location || '—' }}</span>
          </button>
        </aside>

        <section v-if="selectedId" class="panel">
          <div class="thread">
            <p v-if="!messages.length" class="empty">{{ t('admin.drawer.emptyThread') }}</p>
            <article
              v-for="message in messages"
              :key="message.id"
              class="thread-item"
              :class="message.author"
            >
              <header>
                <strong>{{ message.author === 'client' ? (message.user?.name || t('admin.drawer.clientLabel')) : t('admin.drawer.teamLabel') }}</strong>
              </header>
              <p>{{ message.body }}</p>
            </article>
          </div>
          <form class="compose" @submit.prevent="send">
            <textarea v-model="draft" rows="3" :placeholder="t('followup.askPlaceholder')"></textarea>
            <button type="submit" :disabled="sending || !draft.trim()">{{ t('followup.send') }}</button>
          </form>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api, { getApiErrorMessage } from '../api/client'
import { useAuth } from '../composables/useAuth'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { logoutUser } = useAuth()

const projects = ref([])
const messages = ref([])
const selectedId = ref(null)
const draft = ref('')
const sending = ref(false)
const loadError = ref('')

async function loadProjects() {
  const response = await api.get('/projects')
  projects.value = response.data.data || response.data || []

  const fromQuery = route.query.project
  const preferred = fromQuery
    ? projects.value.find((project) => String(project.id) === String(fromQuery))
    : null

  const next = preferred || projects.value[0]
  if (next) {
    await openProject(next)
  }
}

async function openProject(project) {
  selectedId.value = project.id
  draft.value = ''
  if (String(route.query.project || '') !== String(project.id)) {
    router.replace({ name: 'dashboard', query: { project: project.id } })
  }
  const response = await api.get(`/projects/${project.id}/messages`)
  messages.value = response.data.messages || []
}

async function send() {
  const body = draft.value.trim()
  if (!selectedId.value || !body) return
  sending.value = true
  try {
    const response = await api.post(`/projects/${selectedId.value}/messages`, { body })
    messages.value = [...messages.value, response.data.message]
    draft.value = ''
  } catch (err) {
    loadError.value = getApiErrorMessage(err, 'Could not send the message.')
  } finally {
    sending.value = false
  }
}

async function logout() {
  await logoutUser()
  router.push('/login')
}

onMounted(async () => {
  try {
    await loadProjects()
  } catch (err) {
    loadError.value = getApiErrorMessage(err, 'Could not load projects.')
  }
})
</script>

<style scoped>
.client-followup {
  min-height: 100vh;
  background: #f5f5f4;
  color: #1c1917;
  font-family: 'Outfit', sans-serif;
}

.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #e7e5e4;
}

.brand {
  color: inherit;
  font-weight: 700;
  text-decoration: none;
}

.ghost,
.compose button,
.project-pick {
  border: 1px solid #e7e5e4;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  font: inherit;
}

.ghost,
.compose button {
  padding: 0.45rem 0.8rem;
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
}

h1 {
  margin: 0 0 1rem;
  font-size: 1.4rem;
}

.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1rem;
}

.project-pick {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  width: 100%;
  text-align: left;
  padding: 1rem 1.1rem;
  margin-bottom: 0.5rem;
}

.project-pick.active {
  border-color: #1c1917;
}

.project-pick span,
.empty,
.error {
  color: #78716c;
  font-size: 0.82rem;
}

.panel {
  background: #fff;
  border: 1px solid #e7e5e4;
  border-radius: 16px;
  padding: 1.35rem 1.4rem;
}

.thread {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-height: 180px;
  margin-bottom: 1rem;
}

.thread-item {
  max-width: 80%;
  padding: 0.7rem 0.85rem;
  border-radius: 14px;
  background: #f5f5f4;
}

.thread-item.client {
  margin-left: auto;
  background: #1c1917;
  color: #fff;
}

.thread-item p {
  margin: 0.25rem 0 0;
  white-space: pre-wrap;
}

.compose {
  display: grid;
  gap: 0.55rem;
}

.compose textarea {
  width: 100%;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  padding: 0.7rem 0.8rem;
  font: inherit;
  resize: vertical;
}

.compose button {
  justify-self: end;
  background: #1c1917;
  color: #fff;
  border-color: #1c1917;
}

.compose button:disabled {
  opacity: 0.5;
}

@media (max-width: 720px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>

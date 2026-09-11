import { createRouter, createWebHistory } from 'vue-router'

const routes = [
{
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
},
{
    path: '/projects/:id',
    name: 'project-detail',
    component: () => import('../views/ProjectDetailView.vue'),
    props: true
},

{
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
},

{
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
},
{
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminDashboardView.vue'),
},



{
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminDashboardView.vue')
}


]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
    if ( savedPosition) {
        return savedPosition
    }
    if (to.hash) {
        return { el: to.hash, top: 80, behavior: 'smooth' }
    }
        return { top: 0, behavior: 'instant' }
    },
})


router.beforeEach((to, from, next) => {
  const { isLoggedIn, isAdmin } = useAuth()

  if (to.name === 'dashboard' || to.name === 'client-project-detail') {
    if (!isLoggedIn.value) {
      next({ name: 'login' })
      return
    }
    if (isAdmin.value) {
      next({ name: 'admin' })
      return
    }
  }

  if (to.name === 'admin') {
    if (!isLoggedIn.value) {
      next({ name: 'login' })
      return
    }
    if (!isAdmin.value) {
      next({ name: 'dashboard' })
      return
    }
  }

  next()
})

export default router

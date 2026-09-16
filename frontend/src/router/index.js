import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

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
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminDashboardView.vue'),
  },
  {
    path: '/operator',
    name: 'operator',
    component: () => import('../views/OperatorDashboardView.vue'),
  },
  {
    path: '/store',
    name: 'store',
    component: () => import('../views/StoreView.vue'),
  },
  {
    path: '/store/:id',
    name: 'product-detail',
    component: () => import('../views/ProductDetailView.vue'),
    props: true,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/ClientFollowupView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, top: 80, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'instant' }
  },
})

router.beforeEach((to, from, next) => {
  const { isLoggedIn, isAdmin, isOperator, homeRoute } = useAuth()

  if (to.name === 'login' && isLoggedIn.value) {
    next({ name: homeRoute.value })
    return
  }

  if (to.name === 'dashboard' || to.name === 'client-project-detail') {
    if (!isLoggedIn.value) {
      next({ name: 'login' })
      return
    }
    if (isAdmin.value) {
      next({ name: 'admin' })
      return
    }
    if (isOperator.value) {
      next({ name: 'operator' })
      return
    }
  }

  if (to.name === 'admin') {
    if (!isLoggedIn.value) {
      next({ name: 'login' })
      return
    }
    if (!isAdmin.value) {
      next({ name: isOperator.value ? 'operator' : 'dashboard' })
      return
    }
  }

  if (to.name === 'operator') {
    if (!isLoggedIn.value) {
      next({ name: 'login' })
      return
    }
    if (!isOperator.value) {
      next({ name: isAdmin.value ? 'admin' : 'dashboard' })
      return
    }
  }

  next()
})

export default router

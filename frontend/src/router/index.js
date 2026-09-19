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
    props: true,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
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
    path: '/services',
    name: 'services',
    component: () => import('../views/ServicesView.vue'),
  },
  {
    path: '/services/:id',
    name: 'service-detail',
    component: () => import('../views/ServiceDetailView.vue'),
    props: true,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/partners',
    name: 'partners',
    component: () => import('../views/PartnersView.vue'),
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('../views/PrivacyPolicyView.vue'),
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('../views/TermsView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/ClientFollowupView.vue'),
  },
  {
    path: '/dashboard/projects/:id',
    redirect: (to) => ({ name: 'dashboard', query: { project: to.params.id } }),
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

  if (to.name === 'dashboard') {
    if (!isLoggedIn.value) {
      next({ name: 'login', query: { redirect: to.fullPath } })
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
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
    if (!isAdmin.value) {
      next({ name: isOperator.value ? 'operator' : 'dashboard' })
      return
    }
  }

  if (to.name === 'operator') {
    if (!isLoggedIn.value) {
      next({ name: 'login', query: { redirect: to.fullPath } })
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

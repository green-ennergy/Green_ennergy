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
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
},
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

export default router

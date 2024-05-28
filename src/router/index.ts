// router.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { RouteMetaAuth } from '@/types/auth'
import { isAuthenticated, getUserRole, logout } from '@/router/auth'
import adminRoutes from '@/rolesRoutes/adminRoutes'
import lecturerRoutes from '@/rolesRoutes/lecturerRoutes'
import studentRoutes from '@/rolesRoutes/studentRoutes'
import authRoutes from '@/rolesRoutes/authRoutes'

const routes: Array<RouteRecordRaw> = [
  ...authRoutes,
  ...adminRoutes,
  ...lecturerRoutes,
  ...studentRoutes,
  {
    name: 'notFound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/404.vue'),
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => (record.meta as RouteMetaAuth).auth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

  if (requiresAuth) {
    if (isAuthenticated()) {
      const userRole = getUserRole()
      const hasRequiredRole = to.matched.some((record) => {
        const routeRoles = (record.meta as RouteMetaAuth).roles
        return routeRoles && routeRoles.includes(userRole)
      })

      if (hasRequiredRole) {
        next()
      } else {
        logout()
      }
    } else {
      logout()
    }
  } else if (requiresGuest) {
    if (isAuthenticated()) {
      const userRole = getUserRole()

      switch (userRole) {
        case 'admin':
          next({ name: 'adminDashboard' })
          break
        case 'lecturer':
          next({ name: 'lecturerDashboard' })
          break
        case 'student':
          next({ name: 'studentDashboard' })
          break
        default:
          logout()
          break
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

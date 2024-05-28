// authRoutes.ts
import { RouteRecordRaw } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'

const authRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AuthLayout,
    redirect: { name: 'adminLogin' },
    children: [
      {
        path: '/admin/login',
        name: 'adminLogin',
        component: () => import('@/pages/auth/Admin/Login.vue'),
        meta: { requiresGuest: true },
      },
      {
        path: '/lecturer/login',
        name: 'lecturerLogin',
        component: () => import('@/pages/auth/Lecturer/Login.vue'),
        meta: { requiresGuest: true },
      },
      {
        path: '/login',
        name: 'studentLogin',
        component: () => import('@/pages/auth/Student/Login.vue'),
        meta: { requiresGuest: true },
      },
      {
        path: '/signup',
        name: 'studentSignup',
        component: () => import('@/pages/auth/Student/Signup.vue'),
        meta: { requiresGuest: true },
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('@/pages/auth/RecoverPassword.vue'),
        meta: { requiresGuest: true },
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('@/pages/auth/CheckTheEmail.vue'),
        meta: { requiresGuest: true },
      },
    ],
  },
]

export default authRoutes

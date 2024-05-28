// adminRoutes.ts
import { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import RouteViewComponent from '@/layouts/RouterBypass.vue'
const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    component: AppLayout,
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('@/pages/admin/dashboard/Dashboard.vue'),
        meta: { auth: true, roles: ['admin'] },
      },
      {
        name: 'faculties',
        path: 'faculties',
        component: () => import('@/pages/admin/dashboard/Faculties.vue'),
        meta: { auth: true, roles: ['admin'] },
      },
      {
        name: 'departments',
        path: 'departments',
        component: () => import('@/pages/admin/dashboard/Departments.vue'),
        meta: { auth: true, roles: ['admin'] },
      },
      {
        name: 'admin-courses',
        path: 'admin-courses',
        component: () => import('@/pages/admin/dashboard/Courses.vue'),
        meta: { auth: true, roles: ['admin'] },
      },
      {
        name: 'my-lecturers',
        path: 'my-lecturers',
        component: () => import('@/pages/admin/dashboard/Lecturers.vue'),
        meta: { auth: true, roles: ['admin'] },
      },
      {
        name: 'students',
        path: 'students',
        component: () => import('@/pages/admin/dashboard/Students.vue'),
        meta: { auth: true, roles: ['admin'] },
      },
      {
        name: 'admin-schedules',
        path: 'schedules',
        component: () => import('@/pages/admin/dashboard/Schedules.vue'),
        meta: { auth: true, roles: ['admin'] },
      },
    ],
  },
]

export default adminRoutes

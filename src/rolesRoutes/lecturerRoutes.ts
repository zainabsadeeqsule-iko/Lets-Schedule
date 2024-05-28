// lecturerRoutes.ts
import { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/LecturerLayout.vue'
import RouteViewComponent from '@/layouts/RouterBypass.vue'

const lecturerRoutes: Array<RouteRecordRaw> = [
  {
    path: '/lecturer',
    component: AppLayout,
    children: [
      {
        name: 'lecturerDashboard',
        path: 'dashboard',
        component: () => import('@/pages/lecturer/dashboard/Dashboard.vue'),
        meta: { auth: true, roles: ['lecturer'] },
      },
      {
        name: 'courses',
        path: 'courses',
        component: () => import('@/pages/lecturer/dashboard/Courses.vue'),
        meta: { auth: true, roles: ['lecturer'] },
      },
      {
        name: 'schedules',
        path: 'schedules',
        component: () => import('@/pages/lecturer/dashboard/Schedules.vue'),
        meta: { auth: true, roles: ['lecturer'] },
      },
    ],
  },
]

export default lecturerRoutes

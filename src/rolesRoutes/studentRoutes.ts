// lecturerRoutes.ts
import { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/StudentLayout.vue'
import RouteViewComponent from '@/layouts/RouterBypass.vue'

const lecturerRoutes: Array<RouteRecordRaw> = [
  {
    path: '/student',
    component: AppLayout,
    children: [
      {
        name: 'studentDashboard',
        path: 'dashboard',
        component: () => import('@/pages/student/dashboard/Dashboard.vue'),
        meta: { auth: true, roles: ['student'] },
      },
    ],
  },
]

export default lecturerRoutes

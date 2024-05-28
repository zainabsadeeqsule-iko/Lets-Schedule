export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

const adminRoutes: INavigationRoute[] = [
  {
    name: 'dashboard',
    displayName: 'Dashboard',
    meta: {
      icon: 'vuestic-iconset-dashboard',
    },
  },
  {
    name: 'faculties',
    displayName: 'Manage Faculties',
    meta: {
      icon: 'group',
    },
  },
  {
    name: 'departments',
    displayName: 'Manage Departments',
    meta: {
      icon: 'group',
    },
  },
  {
    name: 'admin-courses',
    displayName: 'Manage Courses',
    meta: {
      icon: 'group',
    },
  },
  {
    name: 'my-lecturers',
    displayName: 'Manage Lecturers',
    meta: {
      icon: 'group',
    },
  },
  {
    name: 'students',
    displayName: 'Manage Students',
    meta: {
      icon: 'group',
    },
  },
  {
    name: 'admin-schedules',
    displayName: 'Manage Schedules',
    meta: {
      icon: 'group',
    },
  },
]

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: adminRoutes,
}

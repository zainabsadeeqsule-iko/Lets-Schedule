export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

const lecturerRoutes: INavigationRoute[] = [
  {
    name: 'lecturerDashboard',
    displayName: 'menu.dashboard',
    meta: {
      icon: 'vuestic-iconset-dashboard',
    },
  },
  {
    name: 'courses',
    displayName: 'Courses',
    meta: {
      icon: 'folder_shared',
    },
  },
  {
    name: 'schedules',
    displayName: 'Schedule Classes',
    meta: {
      icon: 'manage_accounts',
    },
  },
]

export default {
  root: {
    name: 'lecturerDashboard',
    displayName: 'navigationRoutes.home',
  },
  routes: lecturerRoutes,
}

export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

const studentRoutes: INavigationRoute[] = [
  {
    name: 'studentDashboard',
    displayName: 'menu.dashboard',
    meta: {
      icon: 'vuestic-iconset-dashboard',
    },
  },
]

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: studentRoutes,
}

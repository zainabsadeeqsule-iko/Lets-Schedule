import { type RouteMetaAuth } from '@/types/auth.d'
import { type RouteLocationNormalized } from 'vue-router'

export function authCheck(route: RouteLocationNormalized): boolean | string | void {
  const meta: RouteMetaAuth = route.meta as RouteMetaAuth
  const { checkAuth, authRedirect, auth } = meta
  const isLogged = localStorage.getItem('isLogged') === 'true'

  if (route?.redirectedFrom?.name === 'Logout') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('isLogged')
    localStorage.removeItem('role')
    localStorage.removeItem('user_id')
    localStorage.removeItem('name')
    localStorage.removeItem('school_id')
  }

  if (checkAuth) {
    if (!isLogged) {
      return authRedirect || '/login'
    }
  }

  if (auth) {
    if (!isLogged) {
      return '/login'
    }
  }

  return true
}

export type Role = 'guest' | 'admin' | 'lecturer' | 'student'
export type Roles = role | role[]

export interface RouteMetaAuth {
  checkAuth?: boolean
  authRedirect?: string
  auth?: boolean
  roles?: Roles
}

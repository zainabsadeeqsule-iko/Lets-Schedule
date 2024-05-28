// auth.ts

import { userPost } from '@/plugins/http'
import router from '@/router'

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken')
}

export function getUserRole(): string | null {
  return localStorage.getItem('role')
}

async function logoutUser(role: string): Promise<void> {
  try {
    const logoutEndpoint = `/${role}-logout`
    await userPost(logoutEndpoint)
  } catch (error) {
    console.error(`Logout failed for ${role}:`, error)
    // Handle the error appropriately (e.g., show an error message)
    throw error
  }
}

function removeUserData(role: string): void {
  switch (role) {
    case 'admin':
      localStorage.removeItem('adminData')
      break
    case 'lecturer':
      localStorage.removeItem('lecturerData')
      break
    case 'student':
      localStorage.removeItem('studentData')
      break
    default:
      break
  }
}

export async function logout(): Promise<void> {
  const accessToken = localStorage.getItem('accessToken')
  const userRole = getUserRole()

  if (!accessToken || !userRole) {
    // If no access token or user role is found, redirect to the admin login page
    localStorage.removeItem('accessToken')
    router.push({ name: 'adminLogin' })
    return
  }

  try {
    await logoutUser(userRole)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('role')
    removeUserData(userRole)

    // Redirect the user to their respective login page based on their role
    switch (userRole) {
      case 'admin':
        router.push({ name: 'adminLogin' })
        break
      case 'lecturer':
        router.push({ name: 'lecturerLogin' })
        break
      case 'student':
        router.push({ name: 'studentLogin' })
        break
      default:
        router.push({ name: 'adminLogin' })
        break
    }
  } catch (error) {
    console.error('Logout failed:', error)
    // Handle the error appropriately (e.g., show an error message)
  }
}

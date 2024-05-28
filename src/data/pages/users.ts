import { sleep } from '../../services/utils'
import { User } from './../../pages/users/types'
import projectsDb from './projects-db.json'
import { Project } from '../../pages/projects/types'
import { userGet } from '@/plugins/http'

export let users: User[] = []

const getUserProjects = (userId: number | string) => {
  return projectsDb
    .filter((project) => project.team.includes(Number(userId)))
    .map((project) => ({
      ...project,
      project_owner: users.find((user) => user.id === project.project_owner)!,
      team: project.team.map((userId) => users.find((user) => user.id === userId)!),
      status: project.status as Project['status'],
    }))
}

// Simulate API calls

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof User | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

export const getUsers = async () => {
  await sleep(1000)

  try {
    const responseData = await userGet('/admin-view-lecturers')

    if (responseData.status === 200) {
      users = responseData.data.map((user: any) => ({
        ...user,
        projects: getUserProjects(user.id),
      }))

      return {
        data: users,
        pagination: {
          page: 1,
          perPage: users.length,
          total: users.length,
        },
      }
    } else {
      console.error('Error fetching users:', responseData.message)
      return {
        data: [],
        pagination: {
          page: 1,
          perPage: 0,
          total: 0,
        },
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {
      data: [],
      pagination: {
        page: 1,
        perPage: 0,
        total: 0,
      },
    }
  }
}

export const addUser = async (user: User) => {
  await sleep(1000)

  try {
    const response = await fetch('http://your-backend-url/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    if (response.ok) {
      const newUser = await response.json()
      users.unshift(newUser)
    } else {
      console.error('Error adding user:', response.statusText)
    }
  } catch (error) {
    console.error('Error adding user:', error)
  }
}

export const updateUser = async (user: User) => {
  await sleep(1000)

  try {
    const response = await fetch(`http://your-backend-url/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    if (response.ok) {
      const updatedUser = await response.json()
      const index = users.findIndex((u) => u.id === updatedUser.id)
      users[index] = updatedUser
    } else {
      console.error('Error updating user:', response.statusText)
    }
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

export const removeUser = async (user: User) => {
  await sleep(1000)

  try {
    const response = await fetch(`http://your-backend-url/api/users/${user.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      users = users.filter((u) => u.id !== user.id)
    } else {
      console.error('Error removing user:', response.statusText)
    }
  } catch (error) {
    console.error('Error removing user:', error)
  }
}

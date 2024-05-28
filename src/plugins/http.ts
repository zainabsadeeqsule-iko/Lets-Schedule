import { CapacitorHttp } from '@capacitor/core'
import { useRouter } from 'vue-router'

const router = useRouter()

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  data?: any
}

const baseURL: string = 'https://schedule.use-api-services.com/api'

const makeRequest = async (options: RequestOptions, addToken: boolean = false): Promise<any> => {
  try {
    const token: string | null = localStorage.getItem('accessToken') // Retrieve token from localStorage
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (addToken && token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const finalOptions = {
      ...options,
      url: `${baseURL}${options.endpoint}`,
      headers,
      readTimeout: 10000,
      connectTimeout: 10000,
    }

    const response = await CapacitorHttp.request(finalOptions)

    if (response.status === 405 && token) {
      localStorage.removeItem('accessToken') // Remove token from localStorage
      router.push({ name: 'login' })
    }

    return response
  } catch (error) {
    localStorage.removeItem('accessToken') // Remove token from localStorage
    router.push({ name: 'login' })
    throw error
  }
}

export const get = async (endpoint: string): Promise<any> => {
  return makeRequest({ method: 'GET', endpoint })
}

export const userGet = async (endpoint: string): Promise<any> => {
  return makeRequest({ method: 'GET', endpoint }, true)
}

export const post = async (endpoint: string, data: any = {}): Promise<any> => {
  return makeRequest({ method: 'POST', endpoint, data })
}

export const userPost = async (endpoint: string, data: any = {}): Promise<any> => {
  return makeRequest({ method: 'POST', endpoint, data }, true)
}

export const userPut = async (endpoint: string, data: any = {}): Promise<any> => {
  return makeRequest({ method: 'PUT', endpoint, data }, true)
}

export const userPatch = async (endpoint: string, data: any = {}): Promise<any> => {
  return makeRequest({ method: 'PATCH', endpoint, data }, true)
}

export const userDelete = async (endpoint: string): Promise<any> => {
  return makeRequest({ method: 'DELETE', endpoint }, true)
}

import type { ApiErrorResponse, userDataLoginForm } from '@/types/types'
import { isAxiosError } from 'axios'
import api from '@/axios/axios'
import { setAuthToken } from '../tokenHelpers'

export const loginUser = async (request: userDataLoginForm, isLoaded: Ref<boolean>) => {
  try {
    isLoaded.value = true
    const response = await api.post('/login', request)

    setAuthToken(response.data.token, 2)
    return { text: '', status: 'success' as const }
  } catch (error: unknown) {
    if (isAxiosError(error) // Verifica si `error.response.data` tiene la estructura esperada
      && error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      const errorData = error.response.data as ApiErrorResponse
      return error.response.status === 401
        ? { text: errorData.message, status: 'error' as const }
        : { text: 'An error occurred', status: 'error' as const }
    }
    return { text: 'An unexpected error occurred', status: 'error' as const }
  } finally {
    isLoaded.value = false
  }
}

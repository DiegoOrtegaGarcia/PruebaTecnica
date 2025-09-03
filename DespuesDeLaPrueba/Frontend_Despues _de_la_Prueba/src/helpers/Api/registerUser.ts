import type { userDataRegisterForm } from '@/types/types'
import { isAxiosError } from 'axios'
import api from '@/axios/axios'
import { useAuthStore } from '@/stores/app'

const authStore = useAuthStore()

export const registerUser = async (request: userDataRegisterForm, isLoaded: Ref<boolean>): Promise<{
  text: string
  status: 'success' | 'error' | 'warning' // <- Tipado específico
}> => {
  try {
    isLoaded.value = true
    const response = await api.post('/register', request)
    authStore.setUser({ name: request.name, email: request.email })
    return { text: response.data.data, status: 'success' }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return error.response?.status === 422
        ? { text: 'The User Already exists', status: 'error' }
        : { text: 'An error occurred', status: 'error' }
    }
    return { text: 'An unexpected error occurred', status: 'error' }
  } finally {
    isLoaded.value = false
  }
}

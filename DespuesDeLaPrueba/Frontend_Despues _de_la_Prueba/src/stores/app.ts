import type { userData } from '@/core/types/types'
// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
  }),
})

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Partial<userData>>({})

  function setUser (userData: userData) {
    user.value = userData
  }

  function clearUser () {
    user.value = {}
  }

  function isUser () {
    return Object.keys(user.value).length > 0
  }

  return { user, setUser, clearUser, isUser }
})

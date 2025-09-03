import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../src/stores/app'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('manages user state correctly', () => {
    const store = useAuthStore()
    
    // Initial state
    expect(store.user).toEqual({})
    expect(store.isUser()).toBe(false)

    // Set user
    const userData = { name: 'John', email: 'test@example.com' }
    store.setUser(userData)
    expect(store.user).toEqual(userData)
    expect(store.isUser()).toBe(true)

    // Clear user
    store.clearUser()
    expect(store.user).toEqual({})
    expect(store.isUser()).toBe(false)
  })
})
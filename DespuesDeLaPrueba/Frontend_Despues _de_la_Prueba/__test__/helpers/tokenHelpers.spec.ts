import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setAuthToken, getAuthToken, removeAuthToken, isAuthenticated } from '../../src/helpers/tokenHelpers'

// Mock js-cookie
vi.mock('js-cookie', () => ({
  default: {
    set: vi.fn(),
    get: vi.fn(),
    remove: vi.fn()
  }
}))

describe('tokenHelpers', () => {
  let Cookies: any

  beforeEach(async () => {
    vi.clearAllMocks()
    Cookies = (await import('js-cookie')).default
  })

  describe('setAuthToken', () => {
    it('should set auth token with correct parameters', () => {
      const token = 'test-token-123'
      
      setAuthToken(token, 2)
      
      expect(Cookies.set).toHaveBeenCalledWith('authToken', token, {
        expires: 2,
        path: '/',
        sameSite: 'strict'
      })
    })
  })

  describe('getAuthToken', () => {
    it('should return auth token', () => {
      const mockToken = 'test-token'
      vi.mocked(Cookies.get).mockReturnValue(mockToken)
      
      const result = getAuthToken()
      
      expect(Cookies.get).toHaveBeenCalledWith('authToken')
      expect(result).toBe(mockToken)
    })
  })

  describe('removeAuthToken', () => {
    it('should remove auth token', () => {
      removeAuthToken()
      
      expect(Cookies.remove).toHaveBeenCalledWith('authToken', { path: '/' })
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      vi.mocked(Cookies.get).mockReturnValue('test-token')
      
      const result = isAuthenticated()
      
      expect(result).toBe(true)
    })

    it('should return false when token does not exist', () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined)
      
      const result = isAuthenticated()
      
      expect(result).toBe(false)
    })
  })
})
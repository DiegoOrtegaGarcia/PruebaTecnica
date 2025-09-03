import { describe, it, expect, vi,beforeEach } from 'vitest'
import { loginUser } from '@/helpers/loginUser'
import api from '@/axios/axios'

// Mock axios
vi.mock('@/axios/axios', () => ({
  default: {
    post: vi.fn()
  }
}))

// Mock tokenHelpers
vi.mock('@/helpers/tokenHelpers', () => ({
  setAuthToken: vi.fn()
}))

describe('loginUser', () => {
  const mockIsLoaded = { value: false }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles successful login', async () => {
    const mockResponse = { data: { token: 'test-token' } }
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await loginUser(
      { email: 'test@example.com', password: 'password' },
      mockIsLoaded
    )

    expect(result).toEqual({ text: '', status: 'success' })
    expect(mockIsLoaded.value).toBe(false)
  })

  it('handles 401 error', async () => {
    const mockError = {
      isAxiosError: true,
      response: { status: 401, data: { message: 'Invalid credentials' } }
    }
    vi.mocked(api.post).mockRejectedValue(mockError)

    const result = await loginUser(
      { email: 'test@example.com', password: 'wrong' },
      mockIsLoaded
    )

    expect(result).toEqual({ text: 'Invalid credentials', status: 'error' })
  })
})